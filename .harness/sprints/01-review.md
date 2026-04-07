# Contract Review

## Metadata
- Role: evaluator
- Agent: evaluator-1
- Inputs: .harness/sprints/01-proposal.md, .harness/spec.md, .harness/features.json, plugins/harness/commands/start.md, plugins/harness/commands/session.md
- Status: accepted
- Reviewed by: evaluator-1
- Decision: accept

## Target feature IDs
- F-040, F-041

## Grouping Waiver Assessment

Accepted. F-041 (release) explicitly depends on F-040 (abandon guidance) per features.json. Both are trivially small -- F-040 is two single-line insertions and F-041 is a standard release cut. Grouping reduces overhead without hiding risk.

## Scope Verification

### F-040: Abandon guidance

Verified insertion points against the actual files:

- **start.md line 38**: The proposal targets the line "This loop repeats until the user approves. Do NOT proceed to the initializer without explicit approval." -- confirmed present. The proposed note ("If you stop mid-review, resume with `/harness:start` -- the planner will re-generate spec.md.") would follow this line.

- **session.md line 81**: The proposal targets the line "This loop repeats until the user approves. Do NOT send to the evaluator without explicit user approval." -- confirmed present. The proposed note ("If you stop mid-review, the phase stays at `contract`. Resume with `/harness:session` to continue from step 6.") would follow this line.

Step 6 reference in the session.md note is correct: the Sprint Resume table at session.md line 45 maps `contract` phase to "Resume at Contract Phase (step 6)".

### F-041: Release v2.2.8

Standard release checklist. Contract checks FN-03 through FN-05 cover the critical artifacts.

## Contract Checks Review

| Check | Required | Verifiable | Assessment |
|-------|----------|------------|------------|
| FN-01 | yes | yes | Grep start.md for the abandon note after the approval enforcement line. Clear pass/fail. |
| FN-02 | yes | yes | Grep session.md for the abandon note after the approval enforcement line. Clear pass/fail. |
| FN-03 | yes | yes | Read release.json for v2.2.8 entry. Clear pass/fail. |
| FN-04 | yes | yes | Read all 4 manifests and check version field. Clear pass/fail. |
| FN-05 | yes | yes | Run `git tag -l v2.2.8`. Clear pass/fail. |

All checks are required, objectively verifiable, and have unambiguous pass/fail criteria.

## Observations

1. **Wording discrepancy between spec and proposal for start.md**: The spec says "If you stop mid-review, the phase stays at idle. Resume with /harness:start to continue." The proposal says "If you stop mid-review, resume with `/harness:start` -- the planner will re-generate spec.md." The proposal wording is more informative (tells the user what will happen on resume) and the spec wording is slightly misleading (/start does not use sprint phases). The proposal wording is an improvement -- this is acceptable.

2. **No acceptance criteria section in proposal**: The proposal template calls for acceptance criteria mapped to domain profile criteria (product_depth, functionality, visual_design, code_quality). The proposal omits this section. This is non-blocking for a trivial patch but noted for completeness.

3. **No risks section content**: The proposal template includes a Risks section. The proposal omits it. Non-blocking given the trivial scope.

## Decision

**ACCEPT**. The proposal is well-scoped, the insertion points are verified against the actual files, the contract checks are concrete and verifiable, and the grouping waiver is justified. The two non-blocking omissions (acceptance criteria section, risks section) do not affect the ability to evaluate the implementation.
