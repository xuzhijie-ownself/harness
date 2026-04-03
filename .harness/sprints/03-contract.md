# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-3
- Inputs: .harness/spec.md, .harness/features.json, 02-evaluation.json
- Status: accepted

## Target feature IDs
- F-004
- F-005
- F-006

## Grouping waiver
Three small manifest/script updates that all depend only on F-001 (already passing), are independent of each other, and each modifies different files. No shared-file conflict risk. Grouped per the execution strategy declared in spec.md.

## Goal
Update the marketplace manifest, Codex manifest, and install scripts to reflect the two-plugin architecture.

## Deliverables

### F-004: `.claude-plugin/marketplace.json`
- Add `harness-sdlc-suite` as second entry in `plugins[]` array
- Update existing harness entry version to 2.0.0
- New entry: name "harness-sdlc-suite", source "./plugins/harness-sdlc-suite", version 2.0.0

### F-005: `.codex-plugin/plugin.json`
- Change `skills` from string to array: `["./plugins/harness/skills/", "./plugins/harness-sdlc-suite/skills/"]`
- Update version to 2.0.0
- Update description to reflect two-plugin architecture

### F-006: `install.sh` and `install.bat`
- Add copy loop for domain skills from `plugins/harness-sdlc-suite/skills/`
- Create target directories for all 6 suite skills under `.claude/skills/`
- Update `--uninstall` to remove domain skill directories
- Preserve existing hooks merge, agents/commands copy behavior

## Verification
- `jq '.plugins | length' .claude-plugin/marketplace.json` returns 2
- `jq '.skills | length' .codex-plugin/plugin.json` returns 2
- `grep "harness-sdlc-suite" install.sh` returns matches
- `grep "harness-sdlc-suite" install.bat` returns matches

## Acceptance criteria
- Product depth: Both manifests correctly declare two-plugin architecture
- Functionality: Install scripts copy skills from both plugins; uninstall removes both
- Visual design: JSON formatting consistent; script output messages clear
- Code quality: Valid JSON in both manifests; scripts handle missing directories gracefully

## Contract checks
- `PD-01` (required): marketplace.json has exactly 2 entries in plugins[]
- `PD-02` (required): codex plugin.json skills is an array with 2 paths
- `FN-01` (required): install.sh copies from plugins/harness-sdlc-suite/skills/
- `FN-02` (required): install.bat copies from plugins/harness-sdlc-suite/skills/
- `FN-03` (required): install.sh --uninstall removes domain skill directories
- `FN-04` (required): install.bat --uninstall removes domain skill directories
- `VD-01` (advisory): JSON formatting with 2-space indent
- `CQ-01` (required): Both JSON files parse without errors

## Risks
- Install script path resolution may differ between bash environments
- JSON formatting inconsistencies between manifests
