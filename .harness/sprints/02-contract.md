# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/spec.md, .harness/features.json, lib/state.mjs, lib/features.mjs, lib/git.mjs, lib/progress.mjs, lib/artifacts.mjs, harness-companion.mjs
- Status: in_review

## Target feature IDs
- F-015 (Script hardening)
- F-016 (Feature-update subcommand)

## Grouping waiver
These two features are grouped because F-016 depends directly on the hardened features.mjs from F-015. Specifically, F-016 needs writeFeatures() and updateFeature() to use the schema validation from F-015. Implementing them in the same sprint avoids a round where features.mjs has validation but no write path, or a write path with no validation. The coupling is structural, not just convenient -- splitting would require stubbing validation that gets immediately replaced.

## Goal
Harden all 5 lib modules with JSDoc annotations, runtime schema validation, circular dependency detection, standardized error handling (UserError throws), and safe git command construction. Then add the feature-update subcommand with writeFeatures(), updateFeature(), and atomic write support.

## Deliverables

### F-015 deliverables
1. **lib/state.mjs** -- JSDoc @typedef for StateShape, @param/@returns on all exports; readState() validates required fields (mode, status, variant, current_round, current_sprint_phase) exist with correct types, throws UserError on schema failure
2. **lib/features.mjs** -- JSDoc @typedef for FeatureShape and FeaturesFile; readFeatures() validates version is number, features is array, each feature has id (string), required (boolean), passes (boolean), throws UserError; selectNextFeature() detects circular depends_on cycles via graph traversal and throws UserError naming the cycle
3. **lib/git.mjs** -- JSDoc on autoCommit(); replace execSync shell string with spawnSync args array for both git-add and git-commit; throw UserError on git failure (not return {ok:false})
4. **lib/progress.mjs** -- JSDoc on exports; updateTimestamp() throws UserError when progress.md missing (not return {ok:false})
5. **lib/artifacts.mjs** -- JSDoc @param/@returns on validateArtifacts() and cleanupSprints()

### F-016 deliverables
6. **lib/features.mjs** -- writeFeatures() with atomic write (write .tmp then rename); updateFeature(id, updates) that reads, validates, mutates single feature by ID, writes back
7. **harness-companion.mjs** -- register `feature-update` subcommand with --id, --set-passes, --set-status, --set-maturity flags; dispatch to updateFeature()

## Verification

### F-015 checks
- PD-01 (required): All 5 lib modules have JSDoc @typedef or @param/@returns on every exported function. Verify by reading each module.
- FN-01 (required): readState() throws UserError when state.json is missing required fields. Test: create a state.json missing "mode" and run feature-select (which calls readState internally).
- FN-02 (required): readFeatures() throws UserError when features.json has missing id on a feature. Test: corrupt features.json, run feature-select, verify exit code 1 and error message.
- FN-03 (required): selectNextFeature() detects circular dependency (A depends on B, B depends on A) and throws UserError. Test: create features.json with circular deps, run feature-select.
- FN-04 (required): autoCommit() uses spawnSync (not execSync with shell string). Verify by reading git.mjs source -- no execSync calls remain.
- FN-05 (required): autoCommit() throws UserError on git failure. Verify by inspecting the catch block -- no return {ok:false}.
- CQ-01 (required): Zero npm dependencies maintained. Verify: no package.json or only devDependencies.
- CQ-02 (required): All existing subcommands still work (no regressions). Run: feature-select, state-mutate --set-phase idle, check-stop.

### F-016 checks
- FN-06 (required): feature-update --id F-015 --set-passes true updates features.json. Run the command and verify F-015 has passes:true.
- FN-07 (required): feature-update --id F-015 --set-status done --set-maturity reviewed updates both fields.
- FN-08 (required): feature-update --id INVALID-ID throws UserError (exit code 1).
- FN-09 (required): feature-update --id F-015 --set-maturity bogus throws UserError for invalid maturity.
- FN-10 (required): writeFeatures() uses atomic write (.tmp then rename). Verify by reading features.mjs source.
- CQ-03 (required): feature-update registered in SUBCOMMANDS object in harness-companion.mjs.

## Acceptance criteria
- Product depth: All exports annotated; validation catches real schema failures; circular dep detection works on realistic graphs
- Functionality: All 8 F-015 verification steps from features.json pass; all 7 F-016 steps pass
- Visual design: N/A for CLI modules (score baseline: clean JSON output, readable error messages)
- Code quality: Consistent JSDoc style; no npm deps; atomic writes; UserError pattern used uniformly; spawnSync args array pattern

## Risks
- Changing error handling in autoCommit() from return-value to throw may break callers in harness-companion.mjs if the catch handler expects {ok:false}. Mitigation: verify the main() catch handler in harness-companion.mjs already handles thrown UserError (it does -- line 147-154).
- Circular dependency detection adds complexity to selectNextFeature(). Mitigation: use simple visited-set DFS, not a library.
- The grouping of F-015+F-016 means a larger change surface. Mitigation: F-015 changes are read-path only (validation, JSDoc, error standardization); F-016 adds write-path. They do not conflict.
