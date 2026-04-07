# Sprint Proposal

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: spec.md, start.md, session.md
- Status: in_review

## Target feature IDs
- F-040, F-041

## Grouping waiver
F-041 (release) depends on F-040 (abandon guidance). Both trivially small. One sprint avoids overhead.

## Goal
Add abandon/resume guidance to both interactive review loops, then release v2.2.8.

## Deliverables

### F-040: Abandon guidance (2 line insertions)

**start.md** — after "This loop repeats until the user approves. Do NOT proceed to the initializer without explicit approval." add:
> If you stop mid-review, resume with `/harness:start` — the planner will re-generate spec.md.

**session.md** — after "This loop repeats until the user approves. Do NOT send to the evaluator without explicit user approval." add:
> If you stop mid-review, the phase stays at `contract`. Resume with `/harness:session` to continue from step 6.

### F-041: Release v2.2.8
- release.json: new entry for v2.2.8
- CHANGELOG.md: new section
- All 4 manifests synced (marketplace, core plugin, sdlc-suite plugin, codex)
- Git tag v2.2.8

## Contract checks
- FN-01 (required): start.md has abandon note after approval enforcement line
- FN-02 (required): session.md has abandon note after approval enforcement line
- FN-03 (required): release.json has v2.2.8 entry
- FN-04 (required): All 4 manifests at v2.2.8
- FN-05 (required): Git tag v2.2.8 exists
