# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/spec.md, .harness/features.json, plugins/harness/scripts/harness-companion.mjs, plugins/harness/scripts/lib/state.mjs, plugins/harness/scripts/lib/features.mjs, plugins/harness/scripts/lib/git.mjs, plugins/harness/scripts/lib/artifacts.mjs, plugins/harness/scripts/lib/progress.mjs
- Status: in_review

## Target feature IDs
- F-015
- F-016

## Grouping waiver
F-015 and F-016 are grouped because F-016 depends directly on F-015 (`depends_on: ["F-015"]`) and they share the same file targets. F-016's `updateFeature()` must use the `UserError` pattern established by F-015, and its atomic write pattern mirrors F-015's validation work in `readFeatures()`. Splitting them would force a second pass through the same modules and risk inconsistent error handling between the first-pass hardening and the second-pass new function.

## Goal
Harden all existing lib modules and the entry point with JSDoc annotations, runtime validation, circular dependency detection, and standardized error handling. Then add the `feature-update` subcommand so features.json can be mutated from the CLI without hand-editing.

## Deliverables

### F-015 deliverables

1. **JSDoc annotations on all exports** across 6 files:
   - `state.mjs`: `readState()`, `writeState()`, `setPhase()`, `incrementRound()`, `appendCost()`
   - `features.mjs`: `readFeatures()`, `selectNextFeature()`, `checkStop()`
   - `git.mjs`: `autoCommit()`
   - `artifacts.mjs`: `validateArtifacts()`, `cleanupSprints()`
   - `progress.mjs`: `appendProgress()`, `updateTimestamp()`
   - `harness-companion.mjs`: `parseFlags()`, `printHelp()`, `out()` (internal), `UserError` class

2. **Runtime validation in `readState()`** (state.mjs):
   - After JSON.parse, validate required fields: `mode` (string), `status` (string), `current_round` (number), `current_sprint_phase` (string in VALID_PHASES set), `cost_tracking` (object with `rounds` array).
   - Throw `UserError` with a message naming each missing or wrong-typed field.

3. **Runtime validation in `readFeatures()`** (features.mjs):
   - After JSON.parse, validate: `version` (number), `features` (array).
   - For each feature: `id` (string), `title` (string), `required` (boolean), `passes` (boolean).
   - Throw `UserError` with a message naming the first invalid feature or missing top-level field.

4. **Circular dependency detection in `selectNextFeature()`** (features.mjs):
   - Before filtering candidates, walk the full `depends_on` graph across all features.
   - Detect cycles using a visited/in-stack DFS approach.
   - On cycle detection, throw `UserError` with the cycle path (e.g., "Circular dependency detected: F-001 -> F-002 -> F-001").

5. **Error standardization in `autoCommit()`** (git.mjs line 39):
   - Replace `return { ok: false, error: ... }` with `throw` of a `UserError`.
   - Import or define `UserError` locally in git.mjs (same class shape as in harness-companion.mjs).

6. **Error standardization in `updateTimestamp()`** (progress.mjs line 58):
   - Replace `return { ok: false, reason: 'progress.md does not exist' }` with `throw` of a `UserError`.

7. **Git message escaping fix in `autoCommit()`** (git.mjs line 30):
   - Replace the shell string approach (`git commit -m "${message.replace(...)}"`) with `execSync` using `stdio: 'pipe'` and passing the message through `--` stdin or using `execFileSync` with an argument array to avoid shell interpretation entirely.
   - Alternatively, use `child_process.spawnSync('git', ['commit', '-m', message])` which bypasses shell altogether.

### F-016 deliverables

8. **`updateFeature()` function in features.mjs**:
   - Accepts `{ id, updates }` where `updates` is an object with optional keys: `passes` (boolean), `status` (string), `maturity` (string).
   - Validates the feature ID exists in features.json; throws `UserError` if not found.
   - Applies updates to the matched feature object.
   - Writes features.json atomically (write to `.tmp`, then `renameSync`).
   - Returns the updated feature object.

9. **`feature-update` subcommand in harness-companion.mjs**:
   - Register in `SUBCOMMANDS` map with description.
   - Parse flags: `--id <F-XXX>` (required), `--set-passes <true|false>`, `--set-status <status>`, `--set-maturity <maturity>`.
   - At least one `--set-*` flag is required; multiple may be combined.
   - Call `updateFeature()` and output the result as JSON to stdout.
   - Import `updateFeature` from features.mjs.

10. **Atomic write in features.mjs**:
    - Add `writeFeatures()` helper (write to `.tmp`, `renameSync`) following the same pattern as `writeState()` in state.mjs.
    - `updateFeature()` uses `writeFeatures()` internally.

## Verification

### F-015 verification steps

- V1: Inspect all exported functions in state.mjs, features.mjs, git.mjs, artifacts.mjs, progress.mjs, and harness-companion.mjs for `@param` and `@returns` JSDoc annotations.
- V2: Create a minimal state.json missing `current_round` and run `node harness-companion.mjs feature-select`. Expect exit code 1 and stderr containing "current_round".
- V3: Create a features.json with `version: "bad"` (string instead of number). Run `node harness-companion.mjs feature-select`. Expect exit code 1 and stderr containing "version".
- V4: Create a features.json where F-001 depends_on F-002 and F-002 depends_on F-001, both `passes: false`. Run `node harness-companion.mjs feature-select`. Expect exit code 1 and stderr containing "Circular dependency".
- V5: With no git repo or with a dirty index that fails to commit, run `node harness-companion.mjs auto-commit --feature F-001 --title test --round 1 --status fail`. Expect exit code 1 (UserError thrown), not a JSON `{ok: false}` response.
- V6: Remove `.harness/progress.md` and run `node harness-companion.mjs progress-append --timestamp-only`. Expect exit code 1 and stderr containing "progress.md".
- V7: Create a commit message containing backticks, dollar signs, and single quotes: `node harness-companion.mjs auto-commit --feature F-001 --title 'test \`$HOME\` it'\''s' --round 1 --status pass`. Expect the commit to succeed with the message preserved literally.

### F-016 verification steps

- V8: Run `node harness-companion.mjs feature-update --id F-015 --set-passes true`. Expect JSON output containing `"passes": true` and features.json on disk to reflect the change.
- V9: Run `node harness-companion.mjs feature-update --id F-015 --set-status in_progress`. Expect JSON output containing `"status": "in_progress"`.
- V10: Run `node harness-companion.mjs feature-update --id F-015 --set-maturity functional`. Expect JSON output containing `"maturity": "functional"`.
- V11: Run `node harness-companion.mjs feature-update --id F-015 --set-passes true --set-status complete --set-maturity reviewed`. Expect all three fields updated in one call.
- V12: Run `node harness-companion.mjs feature-update --id F-999`. Expect exit code 1 and stderr containing "F-999" and "not found".
- V13: Run `node harness-companion.mjs --help` and verify `feature-update` appears in the subcommand list.

## Acceptance criteria

- **Product depth**: All 7 existing subcommands continue to work without regressions. The `feature-update` subcommand handles edge cases (missing ID, nonexistent feature, multiple flags). Validation catches field-level schema violations, not just missing-file errors.
- **Functionality**: All 13 verification steps (V1-V13) pass. No `{ ok: false }` return patterns remain in autoCommit or updateTimestamp. Circular dependency detection catches the cycle and names it.
- **Visual design**: (documentation clarity) JSDoc annotations are consistent in style across all modules. Error messages from UserError are actionable -- they name the bad field, the expected type, and the file path. Help text for `feature-update` matches the style of existing subcommand descriptions.
- **Code quality**: Zero npm dependencies maintained. Atomic write pattern used consistently (features.mjs mirrors state.mjs). UserError class is either shared via import or identically defined. No dead code from the old `{ ok: false }` patterns left behind. Shell escaping is eliminated (not patched) by using spawnSync or execFileSync with argument arrays.

## Contract checks

- `PD-01` (required): Run `node harness-companion.mjs --help` and confirm all 8 subcommands are listed (7 existing + feature-update). Run each existing subcommand with valid inputs and verify no regressions.
- `FN-01` (required): Execute verification steps V2, V3, V4 (validation and cycle detection throw UserError with descriptive messages and exit code 1).
- `FN-02` (required): Execute verification steps V5, V6 (autoCommit and updateTimestamp throw UserError instead of returning {ok: false}).
- `FN-03` (required): Execute verification step V7 (git message with shell metacharacters commits cleanly).
- `FN-04` (required): Execute verification steps V8-V12 (feature-update subcommand creates, updates, validates, and rejects as specified).
- `VD-01` (required): Inspect JSDoc annotations on all exported functions (V1). Verify error messages include the problematic field name and expected type.
- `CQ-01` (required): Confirm zero npm dependencies. Confirm atomic write pattern in features.mjs. Confirm autoCommit uses spawnSync/execFileSync (no shell interpolation). Confirm no leftover `{ ok: false }` return patterns in git.mjs or progress.mjs.

## Risks

- **UserError sharing**: The `UserError` class is defined inline in harness-companion.mjs. Lib modules (git.mjs, progress.mjs, features.mjs, state.mjs) need to throw it too. Options: (a) extract to a shared `lib/errors.mjs`, (b) define the same class locally in each module. Option (a) is cleaner; option (b) works because the catch block in main() checks `err.name === 'UserError'`, not `instanceof`. The contract does not mandate one approach but the evaluator will check consistency.
- **spawnSync vs execFileSync**: Switching from `execSync` (shell) to `spawnSync` (no shell) changes the calling convention. The `git add -A` call on line 29 of git.mjs must also be updated to use the array form. Forgetting this would leave one shell-interpreted call.
- **Validation strictness**: Over-strict validation in readState() could break existing harness runs if state.json files in the wild have optional fields missing. The validation should only require the fields listed in the spec (mode, status, current_round, current_sprint_phase, cost_tracking) and tolerate additional/optional fields.
