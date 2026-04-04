# Builder Report

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: accepted 02-contract.md, spec.md, features.json, all 5 lib modules, harness-companion.mjs
- Status: completed

## Target feature IDs
- F-015 (Script hardening)
- F-016 (Feature-update subcommand)

## Implemented

### F-015 changes
1. **lib/state.mjs**: Added JSDoc @typedef for StateShape, PhaseTimestamps, CostRound, CostTracking, StateError. Added @param/@returns on all 6 exports. readState() now validates 5 required fields (mode, status, variant, current_round, current_sprint_phase) exist with correct types. Throws UserError with descriptive message on schema failure.

2. **lib/features.mjs**: Added JSDoc @typedef for Feature and FeaturesFile. readFeatures() validates: version is number, features is array, each feature has id (string), required (boolean), passes (boolean). Added detectCircularDeps() using DFS with visited-set and recursion-stack -- called at the start of selectNextFeature(). Throws UserError naming the cycle path (e.g. "F-015 -> F-016 -> F-015").

3. **lib/git.mjs**: Added JSDoc @typedef for CommitConfig, AutoCommitInput, AutoCommitResult. Replaced execSync with spawnSync for both git-add and git-commit. Message passed as separate arg to spawnSync (no shell string, no escaping). Throws UserError on any git failure -- no more return {ok:false}. UserError class defined locally.

4. **lib/progress.mjs**: Added JSDoc @typedef for AppendProgressInput, AppendProgressResult, UpdateTimestampResult. updateTimestamp() now throws UserError when progress.md is missing (was returning {ok:false}).

5. **lib/artifacts.mjs**: Added JSDoc @typedef for ValidateResult and CleanupResult. Added @param/@returns on validateArtifacts() and cleanupSprints().

### F-016 changes
6. **lib/features.mjs**: Added writeFeatures() with atomic write (.tmp then rename). Added updateFeature(id, updates) that reads, validates, mutates a single feature by ID, writes back. Validates: unknown ID throws UserError, invalid maturity throws UserError, empty updates throws UserError.

7. **harness-companion.mjs**: Registered feature-update in SUBCOMMANDS. Added case in switch with --id, --set-passes (true/false parsing), --set-status, --set-maturity flag handling. Imported updateFeature from features.mjs.

## Commands run
- `node harness-companion.mjs feature-select` -- pass (existing subcommand, no regression)
- `node harness-companion.mjs check-stop` -- pass (no regression)
- `node harness-companion.mjs state-mutate --set-phase idle` -- pass (no regression)
- `node harness-companion.mjs validate-artifacts --round 2` -- pass (no regression)
- `node harness-companion.mjs feature-update --id F-015 --set-passes true` -- pass (new subcommand)
- `node harness-companion.mjs feature-update --id F-015 --set-status done --set-maturity reviewed` -- pass (multi-flag)
- `node harness-companion.mjs feature-update --id INVALID-ID --set-passes true` -- exit 1, correct UserError
- `node harness-companion.mjs feature-update --id F-015 --set-maturity bogus` -- exit 1, correct UserError
- Circular dep test: created A->B->A cycle, feature-select threw "Circular dependency detected: F-015 -> F-016 -> F-015"
- Schema validation test: deleted "mode" from state.json, state-mutate threw "state.json is missing required field \"mode\""

## Self-check
- All 5 lib modules have JSDoc annotations on every exported function: COMPLETE
- readState() validates 5 required fields: COMPLETE
- readFeatures() validates 3 per-feature fields: COMPLETE
- Circular dep detection: COMPLETE and tested
- autoCommit() uses spawnSync args array: COMPLETE (no execSync import remains)
- autoCommit() throws UserError: COMPLETE (no return {ok:false})
- updateTimestamp() throws UserError: COMPLETE
- writeFeatures() atomic write: COMPLETE
- updateFeature() with validation: COMPLETE
- feature-update subcommand registered: COMPLETE
- Zero npm dependencies: MAINTAINED
- All existing subcommands work: VERIFIED

## Authenticity self-check
- **Internal consistency**: JSDoc style is consistent across all 5 modules -- @typedef for complex shapes, @param/@returns on all exports. UserError class follows the same pattern in each module (local class, throw on failure). Atomic write uses the same .tmp-then-rename pattern in state.mjs and features.mjs.
- **Intentionality**: Each module's JSDoc types are specific to its data shapes (StateShape vs Feature vs CommitConfig). The circular dep detection uses project-specific feature graph structure, not a generic graph library. Validation fields in readState() match the actual state.json schema from patterns.md.
- **Craft**: Consistent file headers describing purpose and zero-dependency constraint. @typedef blocks at the top of each module. Function documentation before each export. Error messages include the actual invalid value for debugging.
- **Fitness for purpose**: Every error message is actionable (tells you what field is missing, what type was expected, which features form a cycle). JSON stdout output structure is consistent with existing subcommands. An AI agent consuming these errors can parse and act on them.

## Suggested feature updates
- F-015: All 8 verification steps from features.json should now pass. JSDoc on all 5 modules, readState() validation, readFeatures() validation, circular dep detection, spawnSync in git.mjs, UserError in autoCommit(), UserError in updateTimestamp(), no regressions.
- F-016: All 7 verification steps from features.json should now pass. feature-update with --set-passes, --set-status, --set-maturity works. Invalid ID and invalid maturity throw UserError. writeFeatures() uses atomic write. updateFeature() reads/validates/mutates/writes. Subcommand registered.
