---
name: harness-sdlc
description: Software Development Lifecycle domain skill for the harness plugin. Provides methodology selection, testing strategy, build/runtime verification, and evaluation criteria for software projects. Activated when domain_profile is "software".
---

# SDLC Domain Skill

> **Domain-specific.** This skill provides the HOW for software development projects. The harness provides the WHEN (orchestration, sprint contracts, feature ledger). This skill provides the HOW (methodology selection, testing strategy, build verification, runtime verification, evaluation criteria anchors).

Activated when `domain_profile: software` is declared in `.harness/spec.md`.


## Activation Check

This skill activates when `domain_profile: software` is set in `.harness/spec.md` or `.harness/state.json`.

Before using this skill's procedures:
1. Verify the project has a recognizable tech stack (package.json, go.mod, Cargo.toml, pyproject.toml, pom.xml, etc.)
2. If no tech stack detected -> framework detection tables won't apply; fall back to generic evaluation criteria from the main harness skill
3. Read the project's test configuration -> determine which testing methodology applies (Section 3)
4. Read the project's ORM/database configuration -> determine which migration commands apply (Section 4)
---

## Section 1: Project Management Methodology

Select based on project characteristics during `/harness:start`:

| Methodology | When to Use | Sprint Structure | Harness Mapping |
|-------------|-------------|-----------------|-----------------|
| Agile/Scrum | Iterative delivery, changing requirements | Time-boxed sprints with planning/review/retro | 1 harness sprint = 1 scrum sprint |
| Waterfall | Fixed scope, regulatory, compliance | Sequential phases (requirements, design, implementation, testing, deployment) | 1 harness sprint = 1 phase gate |
| Kanban | Continuous flow, maintenance, ops | WIP-limited, no fixed sprints | 1 harness round = 1 kanban card |
| Lean | MVP-focused, startup, rapid validation | Build-measure-learn cycles | 1 harness sprint = 1 experiment |

**Default:** Agile (if not specified by user).

The planner writes the selected methodology into `spec.md` during initialization. The coordinator uses the mapping to structure sprint boundaries accordingly.

---

## Section 2: Development Methodology

Select based on project type and team maturity:

| Methodology | When to Use | How It Drives the Generator |
|-------------|-------------|----------------------------|
| TDD (Test-Driven Development) | API-heavy, business logic, data processing | Generator writes tests FIRST, then implementation to make tests pass |
| BDD (Behavior-Driven Development) | User-facing features, acceptance criteria | Generator writes Gherkin/behavior scenarios first, then implements to satisfy them |
| DDD (Domain-Driven Design) | Complex business domains, enterprise apps | Generator defines domain models, aggregates, bounded contexts first, then builds services around them |
| Clean Architecture | Long-lived codebases, team scaling | Generator enforces layer separation (domain -> use case -> adapter -> framework) before writing features |
| Prototype-First | UI/UX exploration, PoC, hackathon | Generator builds working UI first, iterates on UX, refactors internals later |

**Default:** TDD for backend projects, Prototype-First for frontend projects (if not specified).

### How Methodology Drives the Harness

The chosen methodology affects every phase:

1. **Generator behavior**: What to write first (tests? domain models? UI scaffold?)
2. **Evaluator criteria**: What to prioritize (test coverage? domain model correctness? UI responsiveness?)
3. **Sprint contract**: What acceptance criteria to define (test pass rates? behavior scenarios? layer violations?)
4. **Artifact types**: What deliverables per sprint (test files? model definitions? UI components?)

### Generator First-Action Table

| Methodology | Generator writes first | Then |
|-------------|----------------------|------|
| TDD | Test files with failing assertions | Implementation code to make tests green |
| BDD | Feature files with Given/When/Then | Step definitions and application code |
| DDD | Domain entity and value object definitions | Repository interfaces, then adapters |
| Clean Architecture | Use case interfaces and domain types | Concrete implementations per layer |
| Prototype-First | UI components with mock data | Backend integration, then refactor |

---

## Section 3: Testing Strategy

### Test Pyramid

Default for all software projects. The evaluator verifies each level is addressed.

| Level | Target Coverage | Scope | When to Run |
|-------|----------------|-------|-------------|
| Unit | 80% of logic | Individual functions, classes, modules | Every sprint |
| Integration (API) | All endpoints | API request/response, DB queries, service interactions | Every sprint with API changes |
| E2E | Critical user flows | Full browser or client flows (Playwright/Cypress) | Every 3 sprints or on UI features |
| Smoke | Server health | Server starts, health endpoint responds, no crash | Every sprint |
| Security | SAST + dependency audit + secret scan | No known vulnerabilities, no hardcoded secrets | Every sprint (if spec.md data_sensitivity != none) |
| Regression | Full suite | Nothing previously working breaks | Before release |

### Framework Auto-Detection

The evaluator MUST detect the test framework from project files before running tests:

#### JavaScript / TypeScript

| Detection File | Framework | Run Command |
|---------------|-----------|-------------|
| `package.json` contains `"jest"` | Jest | `npx jest` or `npm test` |
| `package.json` contains `"vitest"` | Vitest | `npx vitest run` |
| `package.json` contains `"playwright"` | Playwright | `npx playwright test` |
| `package.json` contains `"cypress"` | Cypress | `npx cypress run` |

#### Python

| Detection File | Framework | Run Command |
|---------------|-----------|-------------|
| `pyproject.toml` or `setup.cfg` contains `pytest` | pytest | `pytest` |
| `manage.py` exists (Django) | Django test runner | `python manage.py test` |

#### Go

| Detection File | Framework | Run Command |
|---------------|-----------|-------------|
| `go.mod` exists | go test (built-in) | `go test ./...` |

#### Rust

| Detection File | Framework | Run Command |
|---------------|-----------|-------------|
| `Cargo.toml` exists | cargo test (built-in) | `cargo test` |

#### Java

| Detection File | Framework | Run Command |
|---------------|-----------|-------------|
| `pom.xml` exists | JUnit (Maven) | `mvn test` |
| `build.gradle` or `build.gradle.kts` exists | JUnit (Gradle) | `gradle test` |

### Test Methodology Selection

Select the testing approach based on project type:

| If Project Type Is... | Primary Test Approach | Secondary |
|----------------------|----------------------|-----------|
| REST API | Integration tests: status codes, response shapes, error handling | Unit tests for business logic |
| GraphQL | Schema validation + resolver unit tests | Integration tests for queries/mutations |
| Database/ORM | Migration verification + CRUD round-trip tests | Relationship/join tests |
| Frontend/UI | Component tests (render, interaction) | E2E for critical user paths |
| CLI Tool | Output assertion tests + exit code checks | Flag/argument parsing tests |
| Library/SDK | Unit tests + API contract tests | Backward compatibility tests |

---

## Section 4: Build & Runtime Verification

### Build Commands

Detect the build system from project files and run the appropriate commands:

| Step | Detection | Command | Required |
|------|-----------|---------|----------|
| Install dependencies | `package.json` | `npm install` | Yes, on first sprint |
| Install dependencies | `pyproject.toml` / `requirements.txt` | `pip install -e .` / `pip install -r requirements.txt` | Yes, on first sprint |
| Install dependencies | `go.mod` | `go mod download` | Yes, on first sprint |
| Install dependencies | `Cargo.toml` | `cargo fetch` | Yes, on first sprint |
| Install dependencies | `pom.xml` | `mvn dependency:resolve` | Yes, on first sprint |
| Install dependencies | `build.gradle` | `gradle dependencies` | Yes, on first sprint |
| Compile/build | `package.json` has `build` script | `npm run build` | Yes, every sprint |
| Compile/build | `go.mod` | `go build ./...` | Yes, every sprint |
| Compile/build | `Cargo.toml` | `cargo build` | Yes, every sprint |
| Compile/build | `pom.xml` | `mvn compile` | Yes, every sprint |
| Compile/build | `build.gradle` | `gradle build` | Yes, every sprint |
| Lint | `package.json` has `lint` script | `npm run lint` | Advisory |
| Type check | `tsconfig.json` | `tsc --noEmit` | Advisory for TypeScript |
| Type check | `mypy.ini` or `pyproject.toml` with mypy | `mypy .` | Advisory for Python |

### Runtime Verification (CRITICAL)

This is the gap that caused the SingPost failure: `npm run build` succeeded but the app crashed on startup because the database was never initialized. The evaluator MUST perform runtime verification, not just build verification.

#### Step 1: Database Initialization

Detect the ORM from project files and run migrations before starting the server:

| ORM | Detection File | Migration Command | Verify Command |
|-----|---------------|-------------------|----------------|
| Prisma | `prisma/schema.prisma` | `npx prisma migrate dev` | `npx prisma db execute --stdin <<< "SELECT 1"` |
| Drizzle | `drizzle.config.ts` | `npx drizzle-kit push` | Check schema sync |
| Django ORM | `manage.py` | `python manage.py migrate` | `python manage.py showmigrations` |
| Flask/SQLAlchemy | `alembic/` directory | `alembic upgrade head` | `alembic current` |
| Rails ActiveRecord | `db/migrate/` directory | `rails db:migrate` | `rails db:migrate:status` |
| TypeORM | `ormconfig.*` or `data-source.ts` | `npx typeorm migration:run` | Query entity metadata |
| Sequelize | `.sequelizerc` | `npx sequelize-cli db:migrate` | `npx sequelize-cli db:migrate:status` |

#### Step 2: Server Startup

Detect the framework and start the dev server:

| Framework | Detection | Start Command | Default Port |
|-----------|-----------|---------------|-------------|
| Next.js | `next.config.*` | `npm run dev` | 3000 |
| Express | `express` in `package.json` dependencies | `npm run dev` or `node server.js` | 3000 |
| Django | `manage.py` + `django` in deps | `python manage.py runserver` | 8000 |
| Flask | `flask` in deps | `flask run` | 5000 |
| FastAPI | `fastapi` in deps | `uvicorn main:app` | 8000 |
| Go (net/http) | `main.go` with `net/http` | `go run .` | 8080 |
| Rails | `Gemfile` with `rails` | `rails server` | 3000 |
| Rust/Actix | `Cargo.toml` with `actix-web` | `cargo run` | 8080 |

#### Step 3: Health Check

After the server starts, verify it responds:

```
curl -sf http://localhost:PORT
```

Wait up to 30 seconds with retries. If the health check fails, the sprint FAILS regardless of other scores.

#### Step 4: API Smoke Test

On features with API changes, hit the first CRUD endpoint:

```
curl -sf http://localhost:PORT/api/<resource> -o /dev/null -w "%{http_code}"
```

Verify the response is 200 (or 201 for creation). If the API returns 500, the sprint FAILS.

#### Step 5: Browser Smoke Test

On features with UI changes, use Playwright to verify:

```
npx playwright test --grep "smoke"
```

Or manually: navigate to `http://localhost:PORT/`, verify the page loads without crash, verify no uncaught exceptions in the console.

---

## Section 5: Evaluation Criteria (Software Profile)

The 4 primary criteria for the `software` domain profile. The evaluator MUST use these anchors for consistent scoring across sprints.

### product_depth (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no meaningful implementation exists |
| 1 | Severely incomplete -- only boilerplate or placeholder content |
| 2 | Display-only -- shows data but no interactivity, no user actions |
| 3 | CRUD works -- core create/read/update/delete operations function, data persists across page reload |
| 4 | Edge cases handled -- error states shown to user, loading states, empty states, validation feedback |
| 5 | Polished -- optimistic updates, real-time sync, offline support, undo/redo where appropriate |

### functionality (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Crashes -- application does not start or crashes immediately |
| 1 | Severely broken -- starts but most features throw errors |
| 2 | Partial -- some features work, others are broken or incomplete |
| 3 | Happy path works -- all sprint features function correctly in the normal flow, input validation on user-facing endpoints |
| 4 | Error handling -- validation on all inputs, meaningful error messages, graceful failure on edge cases |
| 5 | Production-ready -- rate limiting, retry logic, graceful degradation, circuit breakers where appropriate |

### visual_design (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Raw HTML -- no styling applied, browser defaults only |
| 1 | Minimal effort -- some inline styles but no coherent design |
| 2 | Inconsistent -- basic styling exists but spacing, colors, or typography vary across pages |
| 3 | UI kit consistent -- uses a component library or design system consistently, proper spacing, readable typography |
| 4 | Polished -- clear visual hierarchy, responsive across viewports, accessible (WCAG AA), smooth transitions |
| 5 | Professional -- distinctive visual identity, micro-interactions, animation, dark/light mode, design exceeds expectations |

### code_quality (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Won't compile -- syntax errors, missing dependencies, broken imports |
| 1 | Compiles with warnings -- builds but has significant structural issues |
| 2 | Poor structure -- no types or loose types, no clear file organization, code duplication |
| 3 | Strict types + organized -- TypeScript strict mode (or equivalent), logical file/folder structure, no lint errors, no hardcoded secrets, parameterized queries |
| 4 | Clean separation -- reusable utilities, proper error handling, clear module boundaries, single responsibility |
| 5 | Well-documented + testable -- JSDoc/docstrings, dependency injection, testable architecture, follows project conventions |

---

## Section 6: Sprint Contract Checklist Templates

Pre-built checklists for 4 common feature types. The generator includes the relevant checklist(s) in each sprint contract. The evaluator uses them as acceptance criteria.

### For API Features

- [ ] API endpoint responds with correct status codes (200, 201, 400, 404, 500)
- [ ] Request validation rejects invalid input with meaningful error messages
- [ ] Database records persist after API calls (verified with a follow-up GET)
- [ ] Error responses include structured error messages (not stack traces)
- [ ] TypeScript types (or language-equivalent types) match API response shapes
- [ ] Authentication required on non-public endpoints
- [ ] Input validated server-side (not just client-side)

### For UI Features

- [ ] Page renders without console errors or unhandled exceptions
- [ ] Form inputs validate on submit (required fields, format, length)
- [ ] Success and error states are shown to the user after actions
- [ ] Navigation works (links route correctly, back button functions)
- [ ] Layout is responsive on common viewports (mobile 375px, tablet 768px, desktop 1280px)

### For Database Features

- [ ] Migration runs without errors on a clean database
- [ ] All model tables/collections exist after migration
- [ ] CRUD operations work through the API or application layer
- [ ] Relationships resolve correctly (foreign keys, joins, includes, population)
- [ ] Data persists across server restart (not in-memory only)
- [ ] Parameterized queries only (no raw SQL string interpolation)

### For Infrastructure Features

- [ ] Dev server starts without errors within 30 seconds
- [ ] Environment variables are loaded correctly (no undefined references)
- [ ] External dependencies are connectable (database, cache, message queue)
- [ ] Health endpoint responds with 200 at `/health` or `/api/health`

### Security Anti-Patterns

These trigger automatic score penalties when detected by the evaluator:

| Anti-Pattern | Criterion Affected | Penalty |
|-------------|-------------------|---------|
| **Hardcoded Secrets** -- API keys, passwords, or tokens in source code | code_quality | Drop to max 1 |
| **Missing Input Validation** -- user-facing endpoints accept unvalidated input | functionality | Drop to max 2 |
