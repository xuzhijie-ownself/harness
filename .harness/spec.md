# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt (postmortem discrepancies), coordinator.md, features.mjs, session.md, run.md, features.json, state.json
- Status: accepted

## Overview

Five targeted fixes to harness core files, addressing discrepancies discovered during the sales suite postmortem (v2.2.9). The previous run completed all 8 features but exposed behavioral gaps: the coordinator skipped artifact validation on later rounds, check-stop did not auto-complete state, handoff cleanup was missing from the coordinator flow, mode switching had no warning, and sprint grouping from the spec was ignored. Each fix is small in scope -- four are documentation/prompt changes to existing markdown files, one is a script change to features.mjs.

## Design direction

Not applicable -- these are internal harness framework fixes, not user-facing UI changes.

## Shipped scope

- **F-045**: Hard gate on artifact validation in coordinator.md -- add blocking enforcement language so validate-artifacts failures immediately stop the run rather than being treated as advisory
- **F-046**: Auto-set status to complete in features.mjs checkStop() -- when all_required_pass is true, write state.json with status "complete" and stop_reason
- **F-047**: Handoff.md auto-cleanup in coordinator.md -- add explicit step to delete handoff.md after a successful round following a context reset
- **F-048**: Mode mismatch warning in run.md -- add pre-flight check that warns when spec.md declares supervised but state.json has continuous (or vice versa)
- **F-049**: Sprint grouping respect in coordinator.md -- add instruction to read spec.md execution strategy and target grouped feature sets per round instead of individual features

## User stories

- As a harness operator, I want artifact validation to hard-stop the coordinator so that missing sprint artifacts are never silently skipped.
- As a harness operator, I want check-stop to auto-complete state.json so that downstream tools and post-flight checks see the correct status without manual intervention.
- As a harness operator, I want handoff.md cleaned up after a successful resume so that stale handoff files do not confuse subsequent sessions.
- As a harness operator, I want a warning when the execution mode in state.json diverges from spec.md so that I do not accidentally skip interactive reviews.
- As a harness operator, I want the coordinator to respect sprint grouping from the spec so that multi-feature sprints execute as planned rather than being split into individual rounds.

## Execution strategy
- Variant: Variant A
- Mode: supervised
- Expected sprint count: 1 (all 5 fixes in one sprint -- each is a small, isolated change to a separate file with no cross-dependencies)
- Default target ordering: F-045, F-046, F-047, F-048, F-049
- Multi-feature sprint policy: All 5 features grouped into a single sprint. Grouping waiver: these are independent fixes to 3 separate files (coordinator.md, features.mjs, run.md) with zero overlap. Implementing them together reduces round overhead without hiding risk.
- Simplification policy: No simplification needed -- each fix is already minimal scope.
- Methodology: agile

### Sprint plan

**Sprint 1: All fixes (F-045, F-046, F-047, F-048, F-049)**
- F-045: coordinator.md hard-gate language for validate-artifacts
- F-046: features.mjs checkStop() auto-complete state
- F-047: coordinator.md handoff cleanup after context reset
- F-048: run.md mode mismatch warning
- F-049: coordinator.md sprint grouping instruction
- Rationale: Five independent fixes to three files. No dependencies between them. Single sprint avoids 4 unnecessary round-trips.

## High-level technical design

### Files to modify

| Feature | File | Change type |
|---------|------|-------------|
| F-045 | `plugins/harness/skills/harness/roles/coordinator.md` | Strengthen validate-artifacts step with hard-gate language |
| F-046 | `plugins/harness/scripts/lib/features.mjs` | Add writeState call in checkStop() when allPass is true |
| F-047 | `plugins/harness/skills/harness/roles/coordinator.md` | Add handoff.md deletion step after successful resume |
| F-048 | `plugins/harness/commands/run.md` | Add mode mismatch warning to preconditions |
| F-049 | `plugins/harness/skills/harness/roles/coordinator.md` | Add sprint grouping instruction to loop section |

### F-045: Hard gate on artifact validation

Target: coordinator.md step 19 and Evaluator Enforcement section.

Current text at step 19 says: "If any are missing, set stop_reason ... and STOP." The coordinator ignored this during rounds 4-8 of the sales suite run. Fix by adding EXPLICIT blocking language that cannot be glossed over:

Add before the existing step 19 text: "BLOCKING GATE: This step is mandatory, not advisory. If validate-artifacts reports ANY missing artifacts, the coordinator MUST set stop_reason and STOP immediately. Do NOT continue to the next round. Do NOT skip this step for any reason. A round without complete artifacts is an incomplete round."

Also add to the Evaluator Enforcement section: "Artifact validation is a hard gate. The coordinator MUST NOT advance to the next round if validate-artifacts shows missing artifacts."

### F-046: Auto-set status to complete in checkStop

Target: features.mjs checkStop() function (line 212-240).

Current behavior: Returns `{ all_required_pass: true, should_stop: true }` but does not modify state.json. The coordinator is supposed to read this and act, but it failed to do so.

Fix: When `allPass` is true, checkStop() should also write state.json with `status: "complete"` and `stop_reason: "All required features pass."`. This requires:
1. Import writeFileSync from node:fs (already imported as readFileSync)
2. When allPass is true, mutate the state object: set `state.status = "complete"` and `state.stop_reason = "All required features pass."`
3. Write the mutated state back to .harness/state.json
4. This makes the completion path self-contained -- even if the coordinator fails to act on the return value, state.json reflects reality

### F-047: Handoff cleanup in coordinator

Target: coordinator.md, add new sub-section or step.

session.md already has handoff cleanup ("If handoff.md was read at session start AND session completed successfully -> delete handoff.md") but the coordinator in continuous mode does not follow session.md.

Fix: Add to coordinator.md after the Context Freshness section: "After completing a successful round (PASS evaluation) following a context reset where handoff.md was read at session start, delete .harness/handoff.md. Do not delete it if the round failed -- the handoff remains valid for the next retry."

### F-048: Mode mismatch warning in run.md

Target: run.md Preconditions section.

Fix: Add a new precondition check between the existing checks: "Read spec.md execution strategy mode. Compare with state.json mode field. If they differ (e.g., spec says supervised but state.json says continuous), print WARNING: 'Mode mismatch: spec.md declares [X] but state.json has [Y]. In continuous mode, interactive reviews from supervised mode will be skipped.' Continue execution but ensure the user sees this warning before the coordinator starts."

### F-049: Sprint grouping from spec

Target: coordinator.md Loop Per Round section, after step 4 (feature-select).

The sales suite spec declared 4 sprints with grouped features (e.g., Sprint 1: F-001, F-002, F-003) but the coordinator ran 8 rounds with 1 feature each, ignoring the grouping.

Fix: Add after step 4: "Before defaulting to single-feature targeting, read spec.md execution strategy for sprint grouping. If the spec groups multiple features into a single sprint (e.g., 'Sprint 1: F-001, F-002, F-003'), set active_feature_ids to ALL features in that group that still have passes: false. Only fall back to single-feature targeting when: (a) the spec does not define grouping, or (b) all grouped features in the current sprint already pass. When targeting multiple features, the generator proposal must include a grouping waiver explaining why co-implementation is safe."

## Non-goals

- Rewriting the coordinator loop structure or flow diagram
- Adding new subcommands to harness-companion.mjs
- Changing the evaluation rubric, scoring, or calibration
- Modifying features.json schema
- Adding automated tests for these fixes
- Changing session.md (it already has the correct handoff cleanup -- the gap is in coordinator.md)

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Markdown documentation, JavaScript modules
- Stakeholder lens: Harness operators (developers using the harness framework)

## Security Context
- data_sensitivity: none
- external_exposure: none
- auth_model: none
- compliance: none

## Definition of done

All 5 features pass evaluation:
1. **F-045**: coordinator.md contains explicit hard-gate language for validate-artifacts using mandatory words (MUST, BLOCKING, Do NOT continue) that cannot be misread as advisory
2. **F-046**: features.mjs checkStop() writes state.json with `status: "complete"` and `stop_reason` when all required features pass -- verified by reading the function source
3. **F-047**: coordinator.md contains an explicit instruction to delete .harness/handoff.md after a successful round following a context reset
4. **F-048**: run.md Preconditions section contains a mode mismatch warning that fires when spec.md mode differs from state.json mode
5. **F-049**: coordinator.md Loop Per Round section contains an instruction to read spec.md sprint grouping and target grouped features together, with fallback to single-feature targeting
