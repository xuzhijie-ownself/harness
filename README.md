# Harness

Multi-agent sprint orchestration middleware for long-running application
development. Two-plugin architecture: a **domain-blind core** handles all
orchestration, and **domain skill suites** provide profile-specific knowledge.

**6 agents:** initializer, planner, generator, evaluator, coordinator, releaser.
**Dual-runtime:** Works with both Claude Code and OpenAI Codex CLI.
**Two plugins:** `harness` (core) + `harness-sdlc-suite` (software delivery domain skills).

**Methodology:** PDCA (Plan-Do-Check-Act) + two innovations:
1. **Evaluator-never-edits-code** -- tool-access-level role purity
2. **Authenticity gate** -- binary overlay catching generic/template AI output

The core harness can be used **standalone** with a `custom` profile -- no domain skill suite required. Domain suites add pre-built profiles with evaluation criteria, artifact taxonomies, and verification procedures.

**References:**
- https://www.anthropic.com/engineering/harness-design-long-running-apps
- https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents

---

## Install

### Option 1: Claude Code Marketplace (Recommended)

```bash
# Installs both core harness and SDLC suite
claude plugin install harness@harness
```

Then reload:
```bash
/reload-plugins
```

### Option 2: Git Clone + Local Install

```bash
# Clone into your project
git clone https://github.com/xuzhijie-ownself/harness.git plugins/harness-repo

# Install (Mac / Linux / Git Bash)
bash plugins/harness-repo/install.sh

# Install (Windows CMD)
plugins\harness-repo\install.bat
```

The install script copies:
- Core skill from `plugins/harness/skills/harness/`
- Domain skills from `plugins/harness-sdlc-suite/skills/` (6 skills)
- Agents, commands, and hooks from the core plugin

### Option 3: Codex CLI

If using [OpenAI Codex CLI](https://github.com/openai/codex), the plugin auto-loads from the `.codex-plugin/plugin.json` manifest:

```bash
# Clone the repo into your project
git clone https://github.com/xuzhijie-ownself/harness.git plugins/harness-repo

# Codex detects .codex-plugin/plugin.json automatically
# Skills from both plugins are loaded via dual skill paths
codex  # start codex in the project directory
```

### Uninstall

```bash
# Claude Code marketplace
claude plugin uninstall harness

# Local install (removes core + all domain skills)
bash plugins/harness-repo/install.sh --uninstall
```

### Update

```bash
# Marketplace
claude plugin update harness

# Local
cd plugins/harness-repo && git pull && bash install.sh
```

---

## Commands

| Command | Purpose |
|---------|---------|
| `/harness:init` | Scaffold harness for a new project (run once) |
| `/harness:session` | Run one supervised sprint round |
| `/harness:run` | Continuous coordinator-driven loop (unattended) |
| `/harness:reset` | Checkpoint + handoff when context fills (Variant B) |
| `/harness:release` | Version bump, changelog, and git tag |

---

## Roles

| Agent | Spawned by | Reference |
|-------|-----------|-----------|
| initializer | `/harness:init` | `plugins/harness/skills/harness/roles/initializer.md` |
| planner | `/harness:init` | `plugins/harness/skills/harness/roles/planner.md` |
| generator | `/harness:session`, coordinator | `plugins/harness/skills/harness/roles/generator.md` |
| evaluator | `/harness:session`, coordinator | `plugins/harness/skills/harness/roles/evaluator.md` |
| coordinator | `/harness:run` | `plugins/harness/skills/harness/roles/coordinator.md` |
| releaser | `/harness:release`, coordinator | `plugins/harness/skills/harness/roles/releaser.md` |

The harness follows an **adversarial PDCA pattern**: the generator produces artifacts (Do) and the evaluator grades them (Check). The generator cannot self-approve; the evaluator cannot edit product artifacts. This separation prevents the common failure mode where a model is too lenient grading its own work. Agent files are thin YAML wrappers -- all instructions live in role files as the single source of truth.

---

## Authenticity Gate

Every evaluation round applies a binary pass/fail Authenticity Gate after domain criteria scoring. This catches technically-competent-but-generic output -- artifacts that score adequately on domain criteria yet show no evidence of project-specific decision-making.

| Dimension | What it checks |
|-----------|---------------|
| `internal_consistency` | Artifacts share consistent conventions -- structure, terminology, style form a unified whole |
| `intentionality` | Evidence of project-specific decisions, not unmodified defaults or template output |
| `craft` | Technical fundamentals correct -- hierarchy, structure, naming, formatting |
| `fitness_for_purpose` | Deliverables usable by target audience without additional explanation |

The gate is **dual-side**: generators apply a pre-implementation checklist (prevention), evaluators apply a post-grading gate (detection). Any dimension failure fails the round regardless of domain scores.

---

## Architecture

The harness uses a two-plugin architecture:

- **`plugins/harness/`** -- Domain-blind core. Contains all orchestration machinery (agents, commands, hooks, core skill) but zero references to specific domain skills.
- **`plugins/harness-sdlc-suite/`** -- Software delivery domain skill suite. Contains 5 domain skills and an index skill that serves as the domain registry.

```
plugins/
  harness/                              # Plugin 1: Core (domain-blind)
    .claude-plugin/plugin.json          # Claude Code manifest (agents, commands, skills)
    agents/*.md                         # Thin YAML wrappers (-> role files)
    commands/*.md                       # Entry points (-> shared pre-flight)
    hooks/hooks.json                    # Git hooks
    skills/
      harness/                          # Core skill ONLY
        SKILL.md                        # Master spec (orchestration, profiles, gates)
        roles/*.md                      # Single source of truth per agent
        references/
          patterns.md                   # Schemas, templates, contracts
          advanced.md                   # Variant B/C, decay, audit

  harness-sdlc-suite/                   # Plugin 2: SDLC Suite (skills-only)
    .claude-plugin/plugin.json          # Skills-only manifest (no agents/commands)
    skills/
      harness-sdlc-suite/SKILL.md      # Index skill (domain registry + routing)
      harness-sdlc/SKILL.md            # Software Development domain
      harness-ea/SKILL.md              # Enterprise Architecture domain
      harness-ba/SKILL.md              # Business Analysis domain
      harness-sa/SKILL.md              # Solution Architecture domain
      harness-ops/SKILL.md             # Deployment & Ops domain
```

The core harness can be used **standalone** with a `custom` profile defined in `spec.md`. No domain skill suite is required -- the profile system, authenticity gate, and all orchestration work without any suite installed.

---

## Shared Contract

Both Claude Code and Codex share:

| Element | Location |
|---------|----------|
| Role instructions (single source of truth) | `plugins/harness/skills/harness/roles/` |
| Agent wrappers (YAML stubs) | `plugins/harness/agents/` |
| Artifact schemas + templates | `plugins/harness/skills/harness/references/patterns.md` |
| Advanced variants + decay guidance | `plugins/harness/skills/harness/references/advanced.md` |
| Harness spec (eval, stop conditions) | `plugins/harness/skills/harness/SKILL.md` |
| Domain registry + profile routing | `plugins/harness-sdlc-suite/skills/harness-sdlc-suite/SKILL.md` |
| Domain skill definitions | `plugins/harness-sdlc-suite/skills/harness-*/SKILL.md` |
| Artifact layout | `.harness/` in project root |

---

## Artifact Layout

```
.harness/
  features.json        # feature list with pass/fail status
  state.json           # run state, current round, active features
  config.json          # persistent preferences (codex, retro, commits)
  progress.md          # progress log across sprints
  spec.md              # product spec with execution strategy
  init.md              # human-readable setup docs
  init.sh              # dev server startup + smoke test
  handoff.md           # context handoff (Variant B)
  sprints/
    NN-contract.md       # sprint contract per round
    NN-contract-review.md # evaluator contract review
    NN-builder-report.md  # generator implementation report
    NN-evaluation.md     # evaluation (tests + review + grade)
    NN-evaluation.json   # machine-readable evaluation
```

---

## Domain Profiles

The harness supports multiple domains through a profile system. Each profile defines 4 primary evaluation criteria, artifact taxonomy, and stakeholder lens. Domain profiles are provided by **domain skill suites** -- the SDLC suite provides the following:

| Profile | Criteria | Stakeholder Lens |
|---------|----------|-----------------|
| `software` (default) | product_depth, functionality, visual_design, code_quality | End users, developers |
| `enterprise_architecture` | coherence, standards_compliance, stakeholder_coverage, feasibility | Enterprise architects, CTO |
| `business_analysis` | completeness, traceability, stakeholder_alignment, feasibility | Business owners, PMs |
| `solution_architecture` | design_coherence, technical_depth, integration_clarity, implementability | Solution architects, dev leads |
| `ops` | operational_readiness, automation_coverage, reliability_design, security_posture | SREs, platform engineers |
| `custom` | User-defined (4 criteria in spec) | User-defined |

The `custom` profile is built into the core harness and requires no domain skill suite. Projects can declare a primary + optional secondary profile for cross-domain work.

---

## Domain Skills (SDLC Suite)

The SDLC suite delegates domain-specific knowledge to companion skills:

| Skill | Domain | Profile | What it provides |
|-------|--------|---------|-----------------|
| `harness-sdlc` | Software Development | `software` | Methodology selection, testing strategy, build/runtime verification, evaluation criteria anchors |
| `harness-ea` | Enterprise Architecture | `enterprise_architecture` | Architecture methodology (TOGAF/Zachman/FEAF), deliverable verification, TOGAF phase gates, evaluation criteria anchors |
| `harness-ba` | Business Analysis | `business_analysis` | BA methodology (Waterfall/Agile/Lean/Design Thinking/Six Sigma), requirements traceability, BRD verification, evaluation criteria anchors |
| `harness-sa` | Solution Architecture | `solution_architecture` | SA methodology (C4/Arc42/4+1/DDD/Microservices), API design verification, NFR compliance, evaluation criteria anchors |
| `harness-ops` | Deployment & Ops | `ops` | Ops methodology (GitOps/Platform Engineering/SRE/DevOps/IaC), deployment readiness, runbook verification, evaluation criteria anchors |

Domain skills are loaded automatically when the matching domain profile is selected during `/harness:init`. The index skill at `plugins/harness-sdlc-suite/skills/harness-sdlc-suite/SKILL.md` provides the routing table.

---

## End-to-End Delivery Pipeline

Domain skills from the SDLC suite map to phases in a delivery workflow. Not every project needs every phase -- the planner routes based on project type.

```
Customer Request
    |
    +- Phase 1: Discovery & Intake        (harness core -- /init + planner)
    +- Phase 2: Business Analysis          (harness-ba)
    +- Phase 3: Enterprise Architecture    (harness-ea)
    +- Phase 4: Solution Architecture      (harness-sa)
    +- Phase 5: Project Planning           (harness core -- planner + coordinator)
    +- Phase 6: Software Development       (harness-sdlc)
    +- Phase 7: Testing & QA               (harness-sdlc evaluator)
    +- Phase 8: Deployment & Handover      (harness-ops)
    |
    v
Delivered Product
```

| Project Type | Phases | Example |
|-------------|--------|---------|
| Quick prototype | 1 -> 6 | "Build me a CLI tool" |
| Internal tool | 1 -> 2 -> 4 -> 6 | "Automate our docket submissions" |
| Enterprise system | 1 -> 2 -> 3 -> 4 -> 6 -> 8 | "Modernize our claims platform" |
| Architecture only | 1 -> 2 -> 3 | "Design our target-state EA" |

Each phase is a separate harness run (`/init` -> `/run` -> `/release`). Each run's output becomes the next run's input context.

---

## Harness Variants

**Variant A (default)**: Full-Stack Sprinted -- coordinator loop with continuous compaction.

Variants B (reset-based) and C (simplified) are documented in `references/advanced.md` for specialized use cases.

---

## Re-install after updates

Re-run the install script. It merges hooks without duplicating and overwrites
commands, agents, and skills with the latest version from both plugins.
