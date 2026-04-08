# Builder Report

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: accepted proposal 01-proposal.md, spec.md, features.json, install.sh, install.bat, reset.md
- Status: completed

## Target feature IDs
- F-061
- F-063

## Implemented

### F-061: Selective install with state tracking
- **install.sh**: Complete rewrite with positional argument `[core|sdlc|sales|all]` (default: all), `--uninstall [sdlc|sales|all]` support, `.harness-installed` state file tracking, dynamic manifest generation. Core is always present. `--uninstall core` prints error and exits 1.
- **install.bat**: Complete rewrite mirroring install.sh logic using batch subroutines (`:add_suite`, `:remove_suite`, `:has_suite`, `:generate_manifests`). Uses `enabledelayedexpansion` for variable expansion in conditionals. Uses node for JSON generation and path manipulation.
- Both scripts use atomic writes (write to .tmp then move) for the state file.
- Generated manifests include only the skills paths for installed suites. Copilot instructions filter out references to non-installed suites.

### F-063: Generic terminology
- **reset.md line 22**: Changed "a new Claude Code session" to "a new session".
- Grep audit of `plugins/harness/commands/` and `plugins/harness/skills/harness/` found zero other hits for "Claude Code" in generic contexts. The only reference was the one in reset.md.

## Commands run
- `bash install.sh core` -- verified core-only install with single skills path
- `bash install.sh sdlc` -- verified state accumulation (core + sdlc)
- `bash install.sh all` -- verified all 3 suites installed
- `bash install.sh --uninstall sales` -- verified removal and manifest regeneration
- `bash install.sh --uninstall core` -- verified error message and exit code 1
- `grep -rn "Claude Code" plugins/harness/commands/ plugins/harness/skills/harness/` -- zero hits

## Self-check
- install.sh: all 7 verification steps from proposal pass
- install.bat: syntax verified, mirrors install.sh structure with equivalent subroutines
- F-063: single hit fixed, grep confirms zero remaining hits
- State file uses atomic writes to prevent corruption

## Authenticity self-check
- **Internal consistency**: Both scripts follow the same flow pattern (parse args -> manage state -> generate manifests). Variable names and output messages are consistent.
- **Intentionality**: State file format is plain text (one suite per line) as specified in spec.md. Chose atomic writes over direct appends for safety.
- **Craft**: Consistent indentation, clear section headers, helpful output messages showing what was installed and where.
- **Fitness for purpose**: A user can run `install.sh sdlc` and immediately have working Codex/Copilot manifests with only core + sdlc paths.

## Suggested feature updates
- F-061: should pass -- all verification steps confirmed working
- F-063: should pass -- grep returns zero hits for runtime-specific terms in generic contexts
