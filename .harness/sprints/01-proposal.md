# Sprint Proposal

## Metadata
- Role: generator
- Status: in_review

## Target feature IDs
- F-045, F-046, F-047, F-048, F-049

## Grouping waiver
All 5 are postmortem discrepancy fixes. 3 modify coordinator.md, 1 modifies features.mjs, 1 modifies run.md. No overlap between script and doc changes.

## Goal
Fix the 5 process violations found in the sales suite postmortem so the harness enforces its own rules.

## Deliverables

### F-045: coordinator.md — hard gate on artifact validation
Add after step 19 (validate-artifacts):
> **BLOCKING**: If validate-artifacts reports ANY missing artifacts, set `stop_reason` to "missing required sprint artifacts for round NN" and STOP immediately. Do NOT continue to the next round. This is not advisory — it is a hard gate.

### F-046: features.mjs — auto-set status to complete
In `checkStop()`, when `allPass` is true:
```javascript
if (allPass) {
  const state = readState();
  state.status = 'complete';
  state.stop_reason = 'All required features pass.';
  writeState(state);
}
```

### F-047: coordinator.md — handoff cleanup after resume
Add to Context Freshness section:
> After a successful round following a context reset (when handoff.md was read), delete `.harness/handoff.md`. Do not leave stale handoff files on disk.

### F-048: run.md — mode mismatch warning
Add to Preconditions section:
> If spec.md declares `supervised` but state.json has `continuous`, WARN: "Spec declares supervised mode. Running in continuous mode will skip interactive contract reviews. Confirm with user before proceeding."

### F-049: coordinator.md — respect sprint grouping
Add to Loop Per Round, before step 4 (feature selection):
> Before selecting features, read `.harness/spec.md` execution strategy. If the spec groups features into sprints (e.g., "Sprint 1: F-001 + F-002 + F-003"), target the grouped set as a batch in one round. Do NOT split grouped features into individual rounds unless the group fails and must be decomposed.

## Contract checks
- FN-01 (required): coordinator.md has BLOCKING language for validate-artifacts
- FN-02 (required): features.mjs checkStop() calls writeState when all pass
- FN-03 (required): coordinator.md has handoff deletion after resume
- FN-04 (required): run.md has mode mismatch warning
- FN-05 (required): coordinator.md has sprint grouping instruction
- CQ-01 (required): check-stop subcommand still works after script change
