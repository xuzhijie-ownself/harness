# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, README.md, CLAUDE.md, harness-companion.mjs, features.json, prior spec.md
- Status: accepted

## Overview

Refactoring, alignment, and cleanup cycle for the harness project at v2.2.8. Three work areas: (1) adversarial Codex review with fix pass, (2) README and CLAUDE.md drift correction, and (3) dead code and script cleanup. This is a maintenance cycle -- no new user-facing features, only correctness and hygiene improvements.

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Markdown docs, Node.js scripts, JSON configs
- Stakeholder lens: Harness maintainers, contributors

Note: "product_depth" maps to thoroughness of cleanup. "visual_design" maps to documentation clarity and formatting consistency for this maintenance cycle.

## Design direction

Conservative. Every change must preserve existing behavior. No new abstractions, no new subcommands, no new files unless Codex findings demand them. Prefer deletion over addition.

## Shipped scope

### Sprint 1 -- README/CLAUDE.md alignment + script cleanup (deterministic)

**F-043: README + CLAUDE.md alignment**
- Audit README.md against current codebase state: commands table, install instructions, architecture tree, artifact layout, domain profiles table, variant descriptions
- Audit CLAUDE.md against current codebase state: design principles, naming conventions table, scripts architecture section, "What Was Removed" list, tri-runtime table, interactive review points
- Fix any drift found: stale references, missing entries, incorrect paths, outdated version numbers, descriptions that no longer match implementation
- Verify no removed features are still referenced; verify no current features are missing

**F-044: Script cleanup**
- Review harness-companion.mjs entry point: unused imports, unreachable branches, stale comments
- Review all lib modules (state.mjs, features.mjs, git.mjs, artifacts.mjs, progress.mjs): dead exports, unused functions, unreachable code paths, stale TODO comments
- Verify all 9 subcommands execute without error (feature-select, state-mutate, auto-commit, validate-artifacts, progress-append, check-stop, cleanup-sprints, postmortem-data, finalize-round)
- Remove any dead code found; do not refactor working code for style

### Sprint 2 (if needed) -- Codex adversarial review + fix findings

**F-042: Codex adversarial review + fix findings**
- Run `/codex:adversarial-review --wait` on the entire codebase
- Triage findings by severity: BLOCKING, HIGH, MEDIUM, LOW
- Fix all BLOCKING and HIGH findings
- Document MEDIUM/LOW findings as non-blocking issues in the evaluation
- This is a meta-feature: scope depends on what Codex discovers. If Codex finds nothing blocking, this sprint is a pass-through verification

## User stories

- As a harness maintainer, I want README.md and CLAUDE.md to accurately describe the current system, so new contributors are not misled by stale documentation.
- As a harness maintainer, I want dead code removed from scripts, so the codebase stays minimal and comprehensible.
- As a harness maintainer, I want an adversarial review pass to surface hidden issues, so I have confidence in codebase quality before the next feature cycle.

## Execution strategy
- Variant: Variant A (sprinted, single generate-evaluate loop per round)
- Mode: supervised (because F-042 depends on Codex output which is unknown scope; user reviews between sprints)
- Expected sprint count: 1-2 (Sprint 1 covers F-043 + F-044 which are deterministic. Sprint 2 covers F-042 only if Codex produces actionable findings.)
- Default target ordering: F-043 first (doc alignment), then F-044 (script cleanup), then F-042 (adversarial review)
- Multi-feature sprint policy: F-043 and F-044 are grouped in Sprint 1. Grouping waiver: both are read-audit-fix patterns with no overlap in files touched (F-043 touches .md docs, F-044 touches .mjs scripts). Grouping reduces round overhead without hiding risk. F-042 is isolated in Sprint 2 because its scope is unknown until Codex runs.
- Simplification policy: If Sprint 1 fails evaluation, fix in a second round before moving to F-042. If Codex finds no BLOCKING/HIGH issues, F-042 passes with verification-only evidence.
- Methodology: agile

## High-level technical design

- **F-043 (docs)**: Diff README.md and CLAUDE.md against actual file tree, command definitions, script subcommands, and artifact schemas. Fix text in place. No structural changes to either file.
- **F-044 (scripts)**: Static analysis of all .mjs files under `plugins/harness/scripts/`. Run each subcommand with `--help` or minimal valid args to confirm no crash. Remove dead code. No new code.
- **F-042 (adversarial)**: Invoke Codex adversarial review tool. Parse output. Apply fixes for BLOCKING/HIGH. This may touch any file in the repo depending on findings.

## Non-goals

- Adding new features, commands, or subcommands
- Refactoring working code for style or taste
- Changing artifact schemas (features.json, state.json, config.json)
- Version bump or release (this cycle is pre-release cleanup)
- Addressing MEDIUM/LOW Codex findings (documented but deferred)
- Changing the two-plugin architecture or role separation

## Definition of done

1. README.md accurately describes all current commands, install paths, architecture, artifact layout, domain profiles, and variants
2. CLAUDE.md accurately describes all current design principles, naming conventions, scripts architecture, removed features, and tri-runtime support
3. No stale references to removed features exist in README.md or CLAUDE.md
4. All dead code removed from harness-companion.mjs and lib/*.mjs
5. All 9 subcommands execute without error on valid input
6. Codex adversarial review has been run (Sprint 2) and all BLOCKING/HIGH findings fixed
7. No regressions: existing harness behavior unchanged

## Security Context
- data_sensitivity: none
- external_exposure: none
- auth_model: none
- compliance: none

## Risks

- **F-042 scope uncertainty**: Codex may find zero issues or dozens. Supervised mode mitigates this -- the user reviews Codex output before committing to fixes.
- **False positives from Codex**: Adversarial review may flag intentional design decisions (e.g., the "What Was Removed" list in CLAUDE.md). The generator must triage carefully, not blindly fix everything.
- **Accidental behavior change**: Script cleanup could break a subcommand if dead code removal is too aggressive. Mitigation: run all subcommands after cleanup to verify.
