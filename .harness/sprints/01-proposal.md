# Sprint Proposal

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: spec.md, start.md, session.md, CLAUDE.md
- Status: in_review

## Target feature IDs
- F-037, F-038, F-039

## Grouping waiver
All three features modify the same command files (start.md, session.md) and CLAUDE.md. F-039 documents what F-037 and F-038 create. Splitting would waste a round.

## Goal
Add interactive review loops so users can shape plans and contracts before downstream agents consume them. Eliminates the need for external /plan commands that cause plan mode contamination.

## Deliverables

### start.md (F-037)
Insert review loop between step 4 (planner) and step 5 (initializer):

**Current flow**: planner → initializer (no user interaction)
**New flow**: planner → **show spec → user approves/modifies/restarts** → initializer

New steps after current step 4:
```
5. Show spec.md to the user (overview, shipped scope, execution strategy, security context).
6. Ask user: "Approve spec / Modify / Start over"
   - Approve → proceed to step 7
   - Modify → user describes changes, re-spawn planner with feedback, return to step 5
   - Start over → re-spawn planner from scratch, return to step 5
7. Spawn the initializer agent (was step 5)
8. Run bash .harness/init.sh (was step 6)
9. Print result (was step 8)
```
Remove old step 7 (show execution strategy) — redundant now.

### session.md (F-038)
Insert review loop between step 6 (generator proposal) and step 7 (evaluator review):

**Current flow**: generator → evaluator review → show to user
**New flow**: generator → **show proposal → user approves/modifies/re-proposes** → evaluator review

New steps:
```
6. Spawn generator agent → NN-proposal.md
7. Show proposal to user (goal, deliverables, verification, contract checks).
8. Ask user: "Approve contract / Modify / Re-propose"
   - Approve → proceed to step 9
   - Modify → user describes changes, re-spawn generator with feedback, return to step 7
   - Re-propose → re-spawn generator from scratch, return to step 7
9. Spawn evaluator agent for contract review (was step 7)
   → NN-review.md
10. Show evaluator review to user.
    - Rejected → return to step 6 with evaluator feedback
    - Accepted → proceed to implementation
```

Update Sprint Resume table step numbers.

### CLAUDE.md (F-039)
Add "Interactive Review Points" section (~10 lines):
- Two review points: spec review in /start, contract review in /session
- User options: approve/modify/restart
- Rationale: avoids plan mode contamination from external plugins

## Verification
- V1: Read start.md, confirm review loop exists between planner and initializer
- V2: Read session.md, confirm review loop exists between generator and evaluator
- V3: Verify step numbering is consistent in both files
- V4: Verify Sprint Resume table in session.md matches new step numbers
- V5: Read CLAUDE.md, confirm Interactive Review Points section exists
- V6: Confirm no changes to scripts, schemas, or role files

## Contract checks
- FN-01 (required): start.md review loop shows spec content and presents 3 options
- FN-02 (required): session.md review loop shows proposal content and presents 3 options
- FN-03 (required): Both loops repeat until user approves
- FN-04 (required): Sprint Resume table updated with correct step numbers
- FN-05 (required): CLAUDE.md documents both review points
- CQ-01 (required): No changes to scripts, schemas, role files, or agent definitions

## Risks
- Step renumbering errors in session.md (has many step references)
- Sprint Resume table drift if steps change again later
