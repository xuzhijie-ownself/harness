# Contract Review

## Metadata
- Role: evaluator
- Reviewed by: evaluator-1
- Inputs: 01-proposal.md, spec.md, features.json, state.json, coordinator.md, features.mjs, run.md
- Status: accepted
- Decision: accept

## Target feature IDs
- F-045, F-046, F-047, F-048, F-049

## Decision: ACCEPT

## Grouping waiver assessment
Five independent fixes to three separate files (coordinator.md, features.mjs, run.md). No cross-dependencies between changes. Three of the five features modify coordinator.md but at different, non-overlapping sections (step 19, Context Freshness, Loop Per Round step 4). Grouping is justified and reduces round overhead without hiding risk.

## Per-feature feasibility

### F-045: Hard gate on artifact validation
- Target: coordinator.md step 19 (line 141-144) and Evaluator Enforcement section (lines 194-201)
- Current text already says "If any are missing, set stop_reason ... and STOP" but was ignored in practice. Adding explicit BLOCKING/MUST/Do NOT language is a reasonable reinforcement.
- Insertion points verified and exist in the file.
- Verdict: feasible, no concerns.

### F-046: Auto-set status to complete
- Target: features.mjs checkStop() (lines 212-240)
- Current behavior returns allPass flag but does not write state.json. The file imports readFileSync but not writeFileSync -- builder must add the import.
- The proposal's code snippet references a writeState() that does not exist; the spec's technical design correctly identifies that writeFileSync must be imported and state written inline. Builder should implement the write directly rather than assume a writeState helper exists.
- CQ-01 contract check ensures the subcommand still works after the change.
- Verdict: feasible with the noted implementation detail.

### F-047: Handoff cleanup after resume
- Target: coordinator.md Context Freshness section (lines 179-190)
- No current instruction to delete handoff.md after successful resume. session.md has this but coordinator.md does not.
- Insertion point is clear and the change is additive.
- Verdict: feasible, no concerns.

### F-048: Mode mismatch warning
- Target: run.md Preconditions section (lines 15-21)
- Currently redirects supervised mode to /session but does not check for spec vs state divergence.
- The proposal adds a warning for the mismatch case, which is a new precondition check.
- Verdict: feasible, no concerns.

### F-049: Coordinator respects sprint grouping
- Target: coordinator.md Loop Per Round step 4 (lines 93-96)
- Currently selects a single feature by priority. The proposal adds a pre-step to read spec.md execution strategy for sprint grouping.
- Insertion point is valid and the change is additive.
- Verdict: feasible, no concerns.

## Contract checks review
All 6 checks are required and verifiable:
- FN-01 through FN-05: each maps to a specific textual or code change that can be verified by reading the modified file.
- CQ-01: ensures checkStop() still works after the script change -- critical for preventing regressions.

## Risks acknowledged
- F-046 requires a code change to a JavaScript module. The contract check CQ-01 mitigates regression risk by requiring the subcommand to still function.
- F-045, F-047, F-049 all modify coordinator.md at different sections. Merge conflicts are unlikely given they target distinct areas, but the builder should apply all three changes in a single pass.

## Conclusion
The proposal is well-scoped, all insertion points exist in the target files, and the contract checks are sufficient. No changes requested.
