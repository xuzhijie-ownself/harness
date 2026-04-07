# Contract Review

## Metadata
- Role: evaluator
- Agent: evaluator-1
- Inputs: 01-proposal.md, features.json, spec.md, start.md, session.md, CLAUDE.md
- Status: accepted
- Reviewed by: evaluator-1
- Decision: accept

## Target feature IDs
- F-037, F-038, F-039

## Grouping Waiver Assessment

**Accept.** All three features modify three files total (start.md, session.md, CLAUDE.md). F-037 and F-038 are the same interaction pattern applied to two command files. F-039 documents the other two and has `depends_on: ["F-037", "F-038"]`. Splitting into separate sprints would force redundant context loading for no risk reduction.

## Proposal Alignment with features.json

Each feature's `steps[]` in features.json is covered by the proposal:

**F-037** (6 steps defined):
- "start.md has a review loop between planner output and initializer spawn" -- covered by proposal's start.md deliverable (insert between step 4 and step 5)
- "Review loop shows spec content" -- covered (proposal specifies overview, shipped scope, execution strategy, security context)
- "Review loop presents approve/modify/start-over options" -- covered (three options explicitly listed)
- "Modify re-invokes planner with user feedback" -- covered
- "Only after approval does initializer spawn" -- covered (approve proceeds to step 7 which is initializer)
- "Step numbering is consistent after insertion" -- covered (proposal renumbers steps 5-8)

**F-038** (7 steps defined):
- "session.md has a review loop between generator proposal and evaluator review" -- covered (insert between step 6 and step 7)
- "Review loop shows proposal content" -- covered (goal, deliverables, verification, contract checks)
- "Review loop presents approve/modify/re-propose options" -- covered
- "Modify re-invokes generator with user feedback" -- covered
- "Only after approval does evaluator review proceed" -- covered
- "Sprint Resume table step numbers updated" -- covered (explicitly listed in contract checks FN-04)
- "Existing evaluator contract review step preserved" -- covered (evaluator review becomes step 9)

**F-039** (2 steps defined):
- "CLAUDE.md has Interactive Review Points section" -- covered (proposal says add section, ~10 lines)
- "Section documents both review loops with rationale" -- covered (two review points, options, rationale)

## Contract Checks Review

| Check | Required | Verifiable | Assessment |
|-------|----------|------------|------------|
| FN-01 | yes | yes | Clear: read start.md, confirm review loop shows spec content and 3 options |
| FN-02 | yes | yes | Clear: read session.md, confirm review loop shows proposal content and 3 options |
| FN-03 | yes | yes | Clear: both loops must specify repeat-until-approve semantics |
| FN-04 | yes | yes | Clear: read Sprint Resume table, check step numbers match new flow |
| FN-05 | yes | yes | Clear: read CLAUDE.md, check section exists with both loops documented |
| CQ-01 | yes | yes | Clear: verify no changes to scripts/, schemas, role files, or agent definitions |

All six checks are required, verifiable by file inspection, and have unambiguous pass/fail criteria.

## Risks Assessment

The two risks identified (step renumbering errors and Sprint Resume table drift) are real but manageable for markdown-only changes. The proposal explicitly calls out both as risks and includes verification steps (V3, V4) to catch them.

One additional risk not mentioned: the proposal removes step 7 from start.md ("Show the Execution strategy from spec.md for user confirmation") and folds it into the review loop. The builder must ensure no downstream references depend on that step existing as a separate numbered item.

## Scope Boundary Check

The proposal explicitly lists non-changes: no scripts, no schemas, no role files, no agent definitions. CQ-01 enforces this boundary. The deliverables are confined to three markdown files. This is appropriately scoped.

## Decision: ACCEPT

The proposal is well-structured, covers all feature steps from features.json, has verifiable contract checks, and is appropriately scoped. No changes requested.
