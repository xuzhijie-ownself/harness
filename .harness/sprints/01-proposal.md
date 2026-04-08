# Sprint Proposal

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/spec.md, .harness/features.json, install.sh, install.bat, reset.md, commands/*.md, skills/harness/**/*.md
- Status: in_review

## Target feature IDs
- F-061
- F-063

## Grouping waiver
F-063 touches reset.md line 22 which references "Claude Code session". F-061 rewrites install.sh/install.bat which also contain "Claude Code" in comments. Doing them together avoids conflicting edits on the same files and both are bounded refactoring tasks with clear verification.

## Goal
Rewrite install.sh and install.bat to support selective suite installation with `.harness-installed` state tracking, and neutralize runtime-specific terminology across core command/skill files.

## Deliverables

### F-061: Selective install with state tracking
1. **install.sh** -- Complete rewrite:
   - Accepts positional argument: `[core|sdlc|sales|all]` (default: `all`)
   - Accepts `--uninstall [sdlc|sales|all]` flag
   - Reads/writes `.harness-installed` state file (one suite per line)
   - Generates `.codex-plugin/plugin.json` with only installed suite skills paths
   - Generates `.github/copilot-instructions.md` with only installed suite path prefixes
   - `--uninstall core` prints error and exits non-zero
   - Core is always present (not tracked in state file separately)

2. **install.bat** -- Complete rewrite with same logic using node for path math

3. **.harness-installed** -- State file created/updated by install scripts

### F-063: Generic terminology
4. **plugins/harness/commands/reset.md** line 22 -- Change "a new Claude Code session" to "a new session"
5. Audit all files under `plugins/harness/commands/` and `plugins/harness/skills/harness/` for runtime-specific terms where context is generic. (Grep found only the one hit in reset.md.)

## Verification

### F-061 verification
- `bash install.sh core` creates `.harness-installed` with no suite entries (core only), generates plugin.json with only core skills path
- `bash install.sh sdlc` creates `.harness-installed` with `harness-sdlc-suite`, generates plugin.json with core + sdlc paths
- `bash install.sh all` creates `.harness-installed` with both suites, generates plugin.json with all 3 paths
- `bash install.sh --uninstall sales` removes sales from state, regenerates manifests without sales
- `bash install.sh --uninstall core` prints error, exits non-zero
- Running install.sh twice with different arguments accumulates state correctly
- Copilot instructions file has correct path rewrites for all installed suites

### F-063 verification
- `grep -rn "Claude Code" plugins/harness/commands/ plugins/harness/skills/harness/ --include="*.md"` returns zero hits (excluding genuinely runtime-specific contexts like CLAUDE.md itself, which is not under commands/ or skills/)

## Acceptance criteria
- Product depth: install.sh handles all 4 argument variants + uninstall with state accumulation
- Functionality: all verification steps above pass
- Visual design: N/A for scripts (score on clarity of output messages)
- Code quality: clean shell/batch scripts, no unnecessary complexity, atomic state writes

## Contract checks
- `PD-01` (required): install.sh accepts [core|sdlc|sales|all] and generates correct manifests for each
- `FN-01` (required): .harness-installed state file created and updated correctly across multiple invocations
- `FN-02` (required): --uninstall removes suite from state and regenerates manifests; --uninstall core errors
- `FN-03` (required): install.bat mirrors all install.sh behavior
- `VD-01` (advisory): output messages are clear and indicate what was installed/uninstalled
- `CQ-01` (required): no runtime-specific terminology in generic contexts (F-063)

## Risks
- install.bat testing is limited on macOS (can verify syntax but not execution)
- Path calculation with python3 fallback -- need to handle cases where python3 is not available
