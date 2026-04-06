# Coordinator Reference

Use this file only for the coordinator role.

## Read

- `.harness/spec.md`
- `.harness/decomposition.md` if it exists
- `.harness/features.json`
- `.harness/progress.md`
- latest evaluation artifacts

## Write

- `.harness/state.json`
- `.harness/summary.md`
- `.harness/decomposition.md` when sprint rationale needs its own record

## Ownership

Owns: .harness/state.json, .harness/summary.md, .harness/decomposition.md

## Script Calls for Mechanical Steps

All mechanical state management uses `harness-companion.mjs` subcommands. Run from the project root:

```bash
SCRIPT="node plugins/harness/scripts/harness-companion.mjs"

# Select next eligible feature
$SCRIPT feature-select

# Increment round counter
$SCRIPT state-mutate --increment-round

# Set sprint phase
$SCRIPT state-mutate --set-phase <phase>
# <phase>: idle | contract | implementation | evaluation

# Auto-commit after evaluation
$SCRIPT auto-commit --feature F-XXX --title "feature title" --round N --status pass

# Validate sprint artifacts
$SCRIPT validate-artifacts --round N

# Append round summary to progress.md (hook-automated after evaluation commits; manual call only needed for non-standard flows)
$SCRIPT progress-append --round N --feature F-XXX --status pass --scores '{"product_depth":4}'

# Check stop conditions (all required pass? failure streak?)
$SCRIPT check-stop

# Clean up old sprint files
$SCRIPT cleanup-sprints --before-round N

# Finalize round -- fill empty cost_tracking timestamps and set outcome
$SCRIPT finalize-round --round N
```

All subcommands emit JSON to stdout. Parse the JSON output to get structured results. Errors go to stderr with exit code 1 (user error) or 2 (system error).

## Flow Diagram

```
START
  |
  v
[increment-round] --> [feature-select]
  |                        |
  |                   eligible=false?
  |                        |--> STOP (dependency-blocked)
  |                        |
  v                        v
[set-phase contract] --> spawn generator (contract)
  |                        |
  v                        v
spawn evaluator (review) --> rejected? --> loop back to generator
  |                         |
  |                    accepted
  v                         |
[set-phase implementation] --> spawn generator (implement)
  |                              |
  v                              v
[auto-commit --status fail] --> [set-phase evaluation]
  |                              |
  v                              v
spawn evaluator (grade) --> FAIL? --> increment failure_streak
  |                          |           |
  |                     PASS             v
  v                          |      streak >= max_retry?
[auto-commit --status pass]  |           |--> STOP
  |                          |           |--> next round
  v                          v
[finalize-round --round N]
  |
  v
[check-stop] --> all_required_pass=true? --> STOP (success)
  |                                    |
  |                               no   |
  v                                    v
[validate-artifacts] --> missing? --> STOP (incomplete)
  |                         |
  |                    complete
  v                         |
[progress-append (hook)] --> next round
```

## Loop Per Round

1. Read `.harness/config.json` at loop start. Use config values for: commit prefixes (`commit_prefix_pass`, `commit_prefix_fail`), retry limit (`max_retry_on_failure`), retro interval (`retro_interval`), context reset threshold (`context_reset_threshold` -- overrides state.json if present in config), commit tag (`commit_tag`).
2. Increment round:
   ```bash
   node plugins/harness/scripts/harness-companion.mjs state-mutate --increment-round
   ```
3. Append a new entry to `state.json` `cost_tracking.rounds[]`: `{ "round": N, "started_at": "<ISO timestamp>", "completed_at": "", "feature_id": "<target feature>", "outcome": "", "phases": { "contract": { "started_at": "", "completed_at": "" }, "implementation": { "started_at": "", "completed_at": "" }, "evaluation": { "started_at": "", "completed_at": "" } } }`
4. Select the next target feature:
   ```bash
   node plugins/harness/scripts/harness-companion.mjs feature-select
   ```
   Pick highest-priority `passes: false` required feature whose `depends_on` features all have `passes: true`. If the result has `"eligible": false`, pause with `stop_reason`: `"All remaining features are dependency-blocked."`
5. Set contract phase and record timestamp:
   ```bash
   node plugins/harness/scripts/harness-companion.mjs state-mutate --set-phase contract
   ```
6. Spawn `generator` agent (propose contract)
7. Spawn `evaluator` agent (review contract)
8. If rejected: request contract revision; re-spawn evaluator
9. Set implementation phase:
   ```bash
   node plugins/harness/scripts/harness-companion.mjs state-mutate --set-phase implementation
   ```
10. Spawn `generator` agent (implement)
11. Auto-commit implementation work:
    ```bash
    node plugins/harness/scripts/harness-companion.mjs auto-commit --feature F-XXX --title "implement <title>" --round N --status fail
    ```
12. Set evaluation phase:
    ```bash
    node plugins/harness/scripts/harness-companion.mjs state-mutate --set-phase evaluation
    ```
13. Spawn `evaluator` agent (test + review + grade -- all-in-one)
14. Finalize round -- fill empty cost_tracking timestamps and set outcome from evaluation:
    ```bash
    node plugins/harness/scripts/harness-companion.mjs finalize-round --round N
    ```
    This reads NN-evaluation.json for the decision field and populates all empty timestamps in cost_tracking.rounds[N]. Falls back to `--outcome pass|fail` flag if evaluation.json is missing.
15. Auto-commit with final status:
    ```bash
    node plugins/harness/scripts/harness-companion.mjs auto-commit --feature F-XXX --title "<title>" --round N --status pass
    ```
16. Update `.harness/features.json` from evaluator feature_evidence
17. Append round summary to progress (hook-automated):
    The `post:bash:harness-progress-update` hook in hooks.json fires automatically after auto-commit calls (step 11 and step 15), appending a timestamp to progress.md. For full round summaries with scores, the coordinator may still call progress-append explicitly:
    ```bash
    node plugins/harness/scripts/harness-companion.mjs progress-append --round N --feature F-XXX --status pass --scores '{"product_depth":4,"functionality":4,"visual_design":4,"code_quality":4}'
    ```
18. Check stop conditions:
    ```bash
    node plugins/harness/scripts/harness-companion.mjs check-stop
    ```
    If `"all_required_pass": true`: note this in summary and suggest the user run `/harness:release`.
19. Validate all required artifacts exist for this round:
    ```bash
    node plugins/harness/scripts/harness-companion.mjs validate-artifacts --round N
    ```
    If any are missing, set `stop_reason` to `"missing required sprint artifacts for round NN"` and STOP.

### Release (User-Triggered)

When all required features have `passes: true`:

1. Print: "All required features pass. Run `/harness:release` when you are ready to cut a version."
2. Do NOT auto-spawn the releaser. The user decides when to release -- multiple runs may land before a version bump is warranted.
3. Proceed to writing summary with a note that the run is release-ready.

### Auto-Commit Protocol

After each completed evaluation round, use the auto-commit subcommand:
```bash
# PASS:
node plugins/harness/scripts/harness-companion.mjs auto-commit --feature F-XXX --title "<feature title>" --round N --status pass

# FAIL:
node plugins/harness/scripts/harness-companion.mjs auto-commit --feature F-XXX --title "<feature title>" --round N --status fail
```
Never leave work uncommitted between sprints.

Note: The `post:bash:harness-progress-update` hook fires automatically after these auto-commit calls, updating progress.md with a timestamp. This replaces manual `progress-append --timestamp-only` calls after evaluation commits.

## Error Recovery

If an agent spawn fails (timeout, API error, crash, connection refused):
1. Log the error in `.harness/state.json` `errors` array with `{ "round": N, "agent": "<name>", "error": "<message>", "timestamp": "<ISO>" }`.
2. Write `.harness/handoff.md` with current progress so the next session can resume cleanly.
3. Auto-commit any uncommitted work: `node plugins/harness/scripts/harness-companion.mjs auto-commit --feature <id> --title "error recovery checkpoint" --round N --status fail`
4. Wait 30 seconds, then retry the same spawn once.
5. If the retry also fails, set `stop_reason` to `"agent spawn failed after retry: <agent> -- <error>"` and STOP.
6. Never silently swallow spawn failures or continue as if the agent succeeded.

## Context Freshness

Track `rounds_since_reset` in `.harness/state.json` (starts at 0, increments each round).
Read `context_reset_threshold` from `state.json` (default 3). After that many rounds (`rounds_since_reset >= context_reset_threshold`):
1. Write `.harness/handoff.md` with current progress summary.
2. Set `rounds_since_reset` to 0.
3. Pause with `stop_reason`: `"context refresh -- resume with /session or /run"`.
4. The next session picks up from the handoff automatically.

### Context Freshness Trace
At the START of each round, append to `.harness/progress.md`:
`rounds_since_reset: N / context_reset_threshold`
This makes it visible whether the counter is advancing.

## Evaluator Enforcement

The coordinator MUST NOT update `.harness/features.json` directly.
Only evaluator-backed evidence in `NN-evaluation.json` `feature_evidence` may flip pass/fail.

Before advancing to the next round, validate artifacts:
```bash
node plugins/harness/scripts/harness-companion.mjs validate-artifacts --round NN
```
If the result shows any missing artifacts, set `stop_reason` to `"missing required sprint artifacts for round NN"` and STOP.

## Calibration Enforcement

Calibration file (`.harness/evaluator-calibration.md`) is required only when `expected_sprint_count > 3` in state.json. For runs with 3 or fewer sprints, calibration is optional -- the evaluator still scores with anchors conceptually but does not need to persist them to a separate file.

When `expected_sprint_count > 3`: after round 1 evaluation, verify that `.harness/evaluator-calibration.md` exists. If missing, instruct the evaluator to create it before proceeding.

Score drift detection applies regardless: check for score jumps >1 from the prior round on any criterion. If a jump >1 exists without a `drift_check` justification in `NN-evaluation.json`, flag it and request the evaluator to re-justify the score.

## Sprint Retrospective

After every `retro_interval` rounds (read from config.json, default 3) or after any FAIL evaluation:
1. Append a `## Retrospective -- Rounds X-Y` section to `.harness/progress.md` (do not create separate retro-RX-RY.md files).
2. Include: what worked, what didn't, adjustments for next rounds, patterns detected.

Before starting each new round, read the latest retrospective section in progress.md (if any) and incorporate its adjustments into generator/evaluator dispatch instructions.

## Pause Rules

Write reason to `.harness/state.json` `stop_reason` field and halt if:
- Same feature fails twice without reducing failing surface
- No feature reaches `passes: true` after two consecutive rounds
- Generator and evaluator disagree on a blocking bug
- Run needs a variant change not declared in `.harness/spec.md`

Do NOT keep looping just because budget remains.

## Do Not

- silently collapse sprinted mode into simplified mode
- keep advancing just because budget remains
- let multi-feature grouping happen without a written waiver
