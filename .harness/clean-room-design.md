# Harness Core v3.0: Clean-Room Redesign

## Status: FINAL DESIGN — Ready for implementation

---

## 8 Principles (Priority-Ordered)

### Tier 1: Non-Negotiable (Architectural Foundations)

**1. Security by design**
Every decision point includes security consideration. Not a separate phase — embedded in criteria, checklists, anti-patterns, and configuration.
*Evidence: Sales suite postmortem showed security was missing from 4 of 5 SDLC domain skills until we added it. Security must be structural, not optional.*

**2. Single source of truth**
Every piece of knowledge exists in exactly one place. No content duplication across files. Use references and pointers instead of copying.
*Evidence: 13 stale references found after v3.0.0 simplification because content was duplicated between agent wrappers, commands, and role files.*

**3. Domain-blind core**
Core provides orchestration, state management, and evaluation framework. Domain knowledge lives in pluggable suites. Zero domain-specific references in core.
*Evidence: Evaluator.md had a stale SDLC skill path (Codex adversarial review finding). Core must not reference any domain skill.*

**4. Separation of concerns**
Generator produces artifacts. Evaluator grades them. Neither can cross. Coordinator orchestrates but does not produce or grade. Each role has explicit ownership boundaries.
*Evidence: GAN pattern from March 2026 article. Prevents the failure mode where a model is too lenient grading its own work.*

### Tier 2: Quality & Methodology

**5. Maintain integrity, prevent drifting**
Every change must be verified for consistency across the entire project. Stale references, orphaned fields, broken cross-references, and naming convention violations must be caught by automated checks after every cycle.
*Evidence: Every postmortem in this project found integrity issues — 13 stale references, 55% missing artifacts, install scripts referencing deleted files, YAML frontmatter parse errors. The integrity grep checklist exists because drift is the #1 recurring problem.*

**6. Simplification**
Remove what doesn't add measured value. Fewer files, fewer abstractions, fewer enums. Only add complexity when evidence shows it's needed.
*Evidence: v3.0.0 simplification removed events system, codex detection, 6 subcommands — all were unused in practice. The harness is now leaner and more reliable.*

**7. Learn from failure**
Track what was tried and why it failed. Evolve instructions based on evidence. Never revisit a dead end without explaining what changed.
*Evidence: April 2026 article — "Tried using Tsit5 for the perturbation ODE, system is too stiff. Switched to Kvaerno5." Failed approach tracking prevents wasted rounds.*

**8. Verify before trusting**
Every claim of completion must be backed by substantive evidence. Empty evaluations are not evaluations. The authenticity gate catches generic output.
*Evidence: Sales suite broken run — rounds 4-8 had eval.json with "PASS" but no proposal, no review, no report, no eval.md. The coordinator trusted check-stop without verifying evidence existed.*

---

## Architecture: 5 Layers

### Layer 1: Scripts (Deterministic Foundation)

13 subcommands in `harness-companion.mjs`. Zero npm dependencies. Node.js built-ins only. Atomic writes (writeFileSync to .tmp then renameSync).

**State Management:**
| Subcommand | Purpose | Behavior |
|------------|---------|----------|
| `init-state` | Create .harness/ scaffold | Writes default state.json, config.json |
| `set-phase` | Transition sprint phase | Validates enum: idle, contract, implementation, evaluation |
| `increment-round` | Advance round counter | Increments round + rounds_since_reset |
| `append-cost` | Add timing entry | Appends to history.rounds[] |

**Feature Management:**
| Subcommand | Purpose | Behavior |
|------------|---------|----------|
| `feature-select` | Pick next eligible feature | Priority + dependency-aware. Returns JSON. |

**Quality Gates (ordered — each must pass before next):**
| Subcommand | Purpose | Behavior |
|------------|---------|----------|
| `validate-artifacts` | Check 5 sprint artifacts exist | Returns complete/missing list. **BLOCKING.** |
| `check-status` | All features passing? Streak? | **Read-only.** Returns should_stop. Does NOT write state. |
| `verify-completion` | Evidence fields populated? | Reads last eval.json. Checks justifications, reasons, check results. |
| `finalize-run` | Write status=complete | ONLY after validate + check-status + verify pass. Terminal state write. |

*Why `check-status` instead of `check-stop`: The old `check-stop` both read status AND wrote `status=complete`. This violated separation of concerns — a read operation should not have write side-effects. Splitting into `check-status` (read) + `finalize-run` (write) allows the completion verification gate to run between them.*

**Progress & Audit:**
| Subcommand | Purpose | Behavior |
|------------|---------|----------|
| `progress-append` | Append round summary | Structured entry with scores |
| `log-failure` | Record failed approach | Appends to Failed Approaches section in progress.md |
| `postmortem-data` | Gather all audit data | Returns JSON with state, features, history, evaluations, git timeline |

**Maintenance:**
| Subcommand | Purpose | Behavior |
|------------|---------|----------|
| `auto-commit` | Scoped git commit | Only stages harness-owned paths. Never `git add -A`. |
| `cleanup-sprints` | Archive old sprint files | Moves to .harness/archive/round-NN/. Never deletes. |

*Why archive instead of delete: Postmortem and audit need historical evidence. Deleting sprint artifacts on new cycle start destroyed this evidence (found in sales suite postmortem).*

### Layer 2: Reference Skills (Knowledge Base)

5 reference files, each with a single responsibility:

| File | Responsibility | ~Lines | Who reads it |
|------|---------------|--------|-------------|
| `schemas.md` | JSON schemas only (features.json, state.json, config.json, eval.json) | 200 | Evaluator, initializer |
| `templates.md` | Artifact templates (spec.md, progress.md, proposal, report, eval, handoff) | 400 | Generator, initializer |
| `orchestration.md` | Session + Reset + Start procedures | 250 | Coordinator (via commands) |
| `audit.md` | Postmortem procedures + integrity grep + audit criteria | 230 | Coordinator (via postmortem) |
| `advanced.md` | Variants B/C, harness decay, simplification guidance | 100 | Coordinator |

*Why split patterns.md: At 690 lines, patterns.md was the largest file and served 2 purposes (schemas + templates). Agents that only need schemas (evaluator checking eval.json format) loaded 400 lines of irrelevant templates. The split follows single-source-of-truth: schemas.md owns the contract, templates.md owns the examples.*

### Layer 3: Role Files (Agent Instructions)

6 roles, each with explicit ownership and the new concepts integrated:

| Role | Owns | Reads | New responsibilities |
|------|------|-------|---------------------|
| **initializer** | features.json, progress.md, state.json, init.sh/bat | spec.md, templates.md | — |
| **planner** | spec.md | templates.md | Ask about reference oracle; document Security Context |
| **generator** | NN-proposal.md, NN-report.md, product code | spec.md, templates.md, **progress.md Failed Approaches** | Must read failed approaches before proposing |
| **evaluator** | NN-eval.md, NN-eval.json, feature acceptance | schemas.md, spec.md, **reference oracle if present** | Document failed approaches on FAIL; consult oracle |
| **coordinator** | state.json | orchestration.md, audit.md, advanced.md | **Completion verification gate; instruction evolution on FAIL** |
| **releaser** | release.json, CHANGELOG.md | features.json, state.json | Glob-discover all plugin.json manifests |

### Layer 4: Commands (Claude Code Only) + Agents

6 commands — thin wrappers (~10-15 lines each) pointing to orchestration.md or role files.
6 agents — thin YAML wrappers (~10 lines each) pointing to role files.

*Why keep commands AND agents: Commands are entry points (/harness:start). Agents are spawnable units (harness:coordinator). They serve different purposes even though both delegate to role files.*

### Layer 5: Domain Suites (Pluggable)

Each suite is a separate plugin with its own `.claude-plugin/plugin.json`. The core discovers suites via the marketplace (Claude Code) or install script (Codex/Copilot).

Current suites: `harness-sdlc-suite` (5 profiles), `harness-sales-suite` (5 profiles).
Each suite has an index skill for routing + N domain skills with 6 core sections each.

---

## Terminology (22 Renames)

All renames follow the principle: **correct phrase, fewer words, meaningful**.

### features.json

| Current | New | Reason |
|---------|-----|--------|
| `depends_on` | `dependencies` | Standard term, noun not verb phrase |
| `passes` | `passing` | Present participle — "is this feature passing?" |
| `steps` | `checks` | These are verification checks, not generic steps |
| `source_requirement` | `source` | Shorter, same meaning |

### state.json

| Current | New | Reason |
|---------|-----|--------|
| `current_round` | `round` | `current_` is redundant in state.json |
| `last_completed_round` | `completed_round` | Shorter |
| `active_feature_ids` | `targets` | What we're targeting |
| `expected_sprint_count` | `expected_sprints` | Shorter |
| `current_failure_streak` | `failure_streak` | `current_` redundant |
| `last_feature_pass_delta` | `passed_count` | Clearer — how many passed last round |
| `context_reset_threshold` | `reset_threshold` | "context" is implementation detail |
| `current_sprint_phase` | `phase` | `current_sprint_` redundant |
| `cost_tracking` | `history` | It's round history, not cost |

### config.json

| Current | New | Reason |
|---------|-----|--------|
| `max_retry_on_failure` | `max_retries` | Shorter |
| `auto_retro` | `auto_retrospective` | Don't abbreviate — clarity |
| `retro_interval` | `retrospective_interval` | Same |
| `commit_prefix_pass` | `pass_prefix` | Object (commit) is implied |
| `commit_prefix_fail` | `fail_prefix` | Same |
| `commit_tag` | `commit_suffix` | It's appended, not a git tag |
| `evaluator_strictness` | `strictness` | "evaluator" is the only consumer |

### New Fields

| Field | File | Type | Purpose |
|-------|------|------|---------|
| `archived_rounds` | state.json | number[] | Tracks archived sprint rounds |
| `completion_verified` | state.json | boolean | Set by verify-completion |
| `enable_instruction_evolution` | config.json | boolean | Opt-in for CLAUDE.md writes on failure |
| `completion_verification_mode` | config.json | `blocking\|warning\|off` | User controls verification strictness |
| `failed_approaches` | eval.json | string[] | What was tried and failed |

---

## New Concepts (from April 2026 Article)

### 1. Failed Approach Tracking

**What**: When a round fails, record what was tried and why it failed.
**Where**: `log-failure` subcommand writes to progress.md Failed Approaches section. Evaluator documents in eval.json `failed_approaches` array.
**Who reads**: Generator reads before proposing. Must not re-propose a previously failed approach without explaining what changed.
**Risk**: LOW — additive, no breaking changes.

### 2. Completion Verification (Ralph Loop Lite)

**What**: After check-status says "all pass," verify the last eval.json has substantive evidence:
- Contract checks have explicit pass/fail results (not empty)
- Primary scores have justifications (not just numbers)
- Feature evidence has reasons (not just "passing: true")
**Where**: `verify-completion` subcommand. `finalize-run` only writes status=complete AFTER verification.
**Risk**: MEDIUM — can block completion if eval.json format varies.
**Mitigation**: `completion_verification_mode` in config.json lets user set to `warning` or `off`.

### 3. Instruction Evolution

**What**: Coordinator appends lessons learned to CLAUDE.md on failed rounds.
**Rules**: Coordinator-only, FAIL-only, append-only, max 1 bullet per failure.
**Where**: `## Lessons Learned` section at bottom of CLAUDE.md.
**Risk**: HIGH — agents modifying own instructions can drift.
**Mitigation**: `enable_instruction_evolution` in config.json (default: false). User must opt in. Postmortem reviews accumulated lessons.

### 4. Reference Oracle

**What**: If a reference implementation exists, document it in spec.md so the evaluator can use it for validation.
**Where**: `## Reference Oracle` section in spec.md template. Evaluator reads it as supplementary evidence (advisory, not mandatory).
**Risk**: LOW — purely additive guidance.

### 5. Authenticity Gate (Preserved)

**What**: Post-grading binary overlay. 4 dimensions (internal_consistency, intentionality, craft, fitness_for_purpose), each pass/fail.
**Where**: evaluator.md Section 5. eval.json `authenticity_gate` object.
**Rule**: Any dimension fail → round FAILS regardless of domain scores.
**This is a core innovation. It stays.**

---

## Integrity & Drift Prevention (Principle #5)

This is the most operationally critical principle. Based on evidence:

| Incident | What drifted | How it was caught |
|----------|-------------|-------------------|
| v3.0.0 simplification | 13 stale references across 10 files | Manual grep sweep |
| Sales suite broken run | 55% artifacts missing | Postmortem audit |
| Install scripts | Referenced deleted files (metrics.mjs, events.mjs) | User testing on Windows |
| Evaluator.md | Stale SDLC skill path | Codex adversarial review |
| YAML frontmatter | Unquoted descriptions | Copilot CLI parse error |

**Built-in integrity measures in the redesign:**

1. **Canonical integrity grep** in `audit.md` Section 6 — catches stale references
2. **validate-artifacts** subcommand (BLOCKING gate) — catches missing sprint files
3. **verify-completion** subcommand — catches empty evaluations
4. **Archive instead of delete** — preserves evidence for postmortem
5. **check-status is read-only** — prevents accidental state mutation
6. **auto-commit scopes to harness paths** — prevents staging unrelated files
7. **finalize-run requires 3 prior gates** — ordered gate chain prevents premature completion

---

## Implementation: 3 Sprints

### Sprint 1: Foundation (Script + Reference restructuring)
- Split patterns.md → schemas.md + templates.md
- Add 4 new subcommands: check-status (rename), verify-completion, finalize-run, log-failure
- Modify check-stop → check-status (remove state write side-effect)
- Add archive to cleanup-sprints
- Update all role file references from patterns.md → schemas.md/templates.md

### Sprint 2: Concepts + Terminology
- Apply 22 field renames across schemas, scripts, and templates
- Add Failed Approaches section to templates.md progress template
- Add completion verification gate to coordinator.md
- Add reference oracle to planner.md, templates.md, evaluator.md
- Add 5 new fields to schemas.md
- Update features.mjs, state.mjs for renamed fields

### Sprint 3: Polish + Verify
- Add instruction evolution to coordinator.md + CLAUDE.md Lessons Learned section
- Update CLAUDE.md with 8 principles + naming conventions
- Update README with 3 reference articles
- Codex adversarial review
- Integrity audit (canonical grep from audit.md)
- Release v3.0.0 (major — breaking field renames)
