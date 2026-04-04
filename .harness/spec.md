# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, approved plan (enchanted-puzzling-noodle.md), features.json, README.md, hooks.json
- Status: accepted

## Overview

Add script automation to the harness core framework. The harness currently requires LLM agents to spend tokens on deterministic, mechanical tasks: updating state.json fields, selecting the next eligible feature, auto-committing after sprints, validating artifact existence, and appending to progress.md. Approximately 60% of per-sprint workflow is mechanical.

This project builds `harness-companion.mjs` -- a zero-dependency Node.js ES module script following the same pattern as `codex-companion.mjs` -- with subcommands that agents call via Bash instead of performing these operations inline. It also fixes a process gap where the evaluator's codex adversarial review was silently skipped for documentation-only changes.

Target users: the harness's own LLM agents (generator, evaluator, coordinator) and human operators running harness sessions.

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Code (Node.js ES modules), configs (hooks.json), role documentation (Markdown)
- Stakeholder lens: Harness agents (primary consumers), human operators (secondary)

Note: visual_design criterion maps to "documentation clarity" for this project since there is no UI. Evaluator should interpret VD scores as quality of inline help text, stderr messages, and updated role documentation.

## Shipped scope

### F-011: Fix evaluator codex scope
Remove the documentation-only exemption from `evaluator.md` that allows skipping codex adversarial review when changes are documentation-only. Codex can catch logical inconsistencies in documentation. The exemption should only apply when there are literally zero changed files.

### F-012: Build harness-companion.mjs entry point and lib modules
Create `plugins/harness/scripts/harness-companion.mjs` as the single entry point with subcommand dispatch, plus five library modules under `plugins/harness/scripts/lib/`:
- `state.mjs` -- read/write/mutate state.json with atomic writes
- `features.mjs` -- feature selection with dependency resolution
- `git.mjs` -- auto-commit with structured messages
- `artifacts.mjs` -- sprint artifact validation and cleanup
- `progress.mjs` -- structured progress.md append

Subcommands: `feature-select`, `state-mutate`, `auto-commit`, `validate-artifacts`, `progress-append`, `check-stop`, `cleanup-sprints`.

All output is structured JSON to stdout; human-readable logs to stderr. Exit codes: 0 success, 1 user error, 2 system error. Approximately 250 lines total. Zero npm dependencies -- only Node.js built-ins (fs, path, child_process, url).

### F-013: Wire scripts into hooks and update role docs
- Update `hooks.json` to call harness-companion.mjs subcommands instead of inline Node one-liners
- Update `session.md` to instruct agents to call scripts for mechanical steps
- Update `coordinator.md` to call scripts for state management, feature selection, and auto-commit

### F-014: End-to-end verification
Run the script subcommands against real harness artifacts to confirm:
- `feature-select` returns valid JSON with correct dependency resolution
- `state-mutate --set-phase contract` updates state.json atomically
- `validate-artifacts --round 1` correctly reports missing/present artifacts
- `progress-append` produces well-formed progress.md entries

This is a verification gate, not a code feature. It confirms the integration works before shipping.

## User stories

- As a **coordinator agent**, I want to run `node scripts/harness-companion.mjs feature-select` and get back JSON telling me which feature to target next, so I do not spend tokens parsing features.json and checking dependency graphs myself.
- As a **coordinator agent**, I want to run `state-mutate --set-phase implementation` and have state.json updated atomically, so I never forget to update a field or corrupt the file mid-write.
- As an **evaluator agent**, I want to run `validate-artifacts --round 3` and get a JSON report of which sprint artifacts exist and which are missing, so I can check completeness mechanically.
- As a **coordinator agent**, I want `auto-commit` to produce correctly-prefixed commit messages using the config.json conventions, so commit history is consistent without me formatting messages inline.
- As a **coordinator agent**, I want `check-stop` to tell me whether all required features pass and whether I am in a failure streak, so stop-condition logic is not duplicated across sessions.
- As a **human operator**, I want progress.md to be updated automatically after every evaluation, so it never goes stale across multi-sprint runs.
- As an **evaluator agent**, I want the codex adversarial review to run on all changes including documentation, so logical inconsistencies in role files and references are caught.

## Definition of done

1. `evaluator.md` no longer contains a documentation-only exemption for codex review.
2. `plugins/harness/scripts/harness-companion.mjs` exists, is executable, and dispatches all defined subcommands.
3. Each of the five lib modules (`state.mjs`, `features.mjs`, `git.mjs`, `artifacts.mjs`, `progress.mjs`) exists under `plugins/harness/scripts/lib/`.
4. Running `node plugins/harness/scripts/harness-companion.mjs feature-select` from the project root (with a valid `.harness/features.json` and `.harness/state.json`) emits valid JSON to stdout.
5. Running `node plugins/harness/scripts/harness-companion.mjs state-mutate --set-phase contract` atomically updates `.harness/state.json`.
6. `hooks.json` calls harness-companion.mjs instead of inline one-liners.
7. `session.md` and `coordinator.md` reference the script subcommands for mechanical steps.
8. All subcommands use exit code 0 on success, 1 on user error, 2 on system error.
9. Zero npm dependencies -- only Node.js built-ins.

## Execution strategy
- Variant: Variant A (full-stack sprinted)
- Mode: supervised
- Expected sprint count: 2-3 sprints
  - Sprint 1: F-011 (evaluator fix) + F-012 (build all scripts). Grouped because F-011 is a small targeted edit and F-012 is the main deliverable; separating them would waste a sprint on a one-line fix.
  - Sprint 2: F-013 (wiring) -- depends on F-012 being built.
  - Sprint 3 (if needed): F-014 verification or rework from prior sprint failures.
- Default target ordering: F-011 -> F-012 -> F-013 -> F-014
- Multi-feature sprint policy: F-011 and F-012 are grouped in Sprint 1 because F-011 is a single-file edit (low risk) and co-locating it avoids a trivial standalone sprint. All other sprints target one feature each.
- Simplification policy: If F-012 subcommands prove too broad for one sprint, split into core subcommands (feature-select, state-mutate, check-stop) and secondary subcommands (auto-commit, validate-artifacts, progress-append, cleanup-sprints). Do not drop subcommands -- the plan already scopes to approximately 250 lines.
- Methodology: agile (default)

## High-level technical design

### Scripts layer
- Entry point: `plugins/harness/scripts/harness-companion.mjs`
  - Parses `process.argv.slice(2)` for subcommand + flags
  - Dispatches to lib module functions
  - Top-level try/catch with exit code mapping
  - JSON to stdout, human-readable errors to stderr
- Lib modules under `plugins/harness/scripts/lib/`:
  - `state.mjs`: readState(), writeState(), setPhase(), incrementRound(), appendCost()
  - `features.mjs`: selectNextFeature(), checkStop() -- reads features.json + state.json, resolves depends_on
  - `git.mjs`: autoCommit() -- shells out to git via child_process.execSync
  - `artifacts.mjs`: validateArtifacts(), cleanupSprints() -- checks file existence in .harness/sprints/
  - `progress.mjs`: appendProgress() -- structured Markdown append to progress.md

### Atomic writes
All JSON writes use write-to-temp-then-rename pattern: `fs.writeFileSync(tmpPath, data)` then `fs.renameSync(tmpPath, targetPath)`. This prevents corruption if the process is killed mid-write.

### Integration points
- `hooks.json`: Replace inline Node one-liner with harness-companion.mjs progress-append call
- `session.md`: Add "Mechanical steps" section pointing agents to script subcommands
- `coordinator.md`: Replace inline state management instructions with script calls

### Data flow
```
Agent (Bash tool) -> harness-companion.mjs -> lib/*.mjs -> .harness/*.json
                                                        -> .harness/progress.md
                                                        -> git (via child_process)
                  <- JSON stdout (parsed by agent)
```

### Files unchanged
- Core SKILL.md
- Domain skill suite (harness-sdlc-suite)
- Agent YAML wrappers
- patterns.md schemas (scripts conform to existing schemas, they do not change them)

## Non-goals

- **npm package or build step**: This is a local script, not a published package. No package.json, no bundler.
- **Test framework**: No Jest/Vitest/Mocha. Verification is done by running subcommands against real harness artifacts (F-014).
- **GUI or TUI**: Scripts emit JSON. No interactive prompts, no terminal UI.
- **Replacing agent reasoning**: Scripts handle mechanical state management only. Feature planning, contract writing, evaluation grading, and all judgment calls remain with LLM agents.
- **Backward compatibility shims**: Existing inline state management in role docs is replaced, not kept alongside scripts.
- **Windows batch equivalents**: Scripts are Node.js (.mjs), which runs cross-platform. No separate .bat files needed.
- **Changing artifact schemas**: Scripts read and write the existing features.json, state.json, and progress.md formats defined in patterns.md. No schema changes.
