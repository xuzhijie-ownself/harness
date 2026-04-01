# Initialization Documentation

## Metadata
- Role: initializer
- Agent: initializer-1
- Inputs: artifacts/spec.md, existing plugin file structure
- Status: accepted

## Project type

This is a Markdown/JSON/shell plugin with no compiled code, no package manager dependencies, and no dev server. The plugin consists of approximately 18 files (Markdown, JSON, YAML, and shell scripts) that are copied into a user's `.claude/` directory by `install.sh`.

## Build verification strategy

Since there is no compilation step, "build" verification for this project means:

1. **File existence check**: All expected files exist at their designated paths after changes. This includes new agent files (tester.md, reviewer.md, releaser.md, architect.md), new command files (harness:migrate.md, harness:release.md), and renamed command files.

2. **JSON validation**: All JSON files parse without errors. This covers plugin.json, features.json (was feature-list.json), state.json (was run-state.json), release.json (new), and any sprint evaluation JSON artifacts.

3. **Install script verification**: `install.sh` runs without bash syntax errors. Can be tested with `bash -n install.sh` for syntax checking. The script should reference all new files and updated paths.

4. **Stale reference check**: No files in the renamed plugin should reference old paths or names:
   - `artifacts/` (should be `.harness/`)
   - `feature-list.json` (should be `features.json`)
   - `run-state.json` (should be `state.json`)
   - `long-running-harness` in internal path references (should be `harness`)
   - `feature-NNN` ID format (should be `F-NNN`)

5. **Cross-reference validation**: Internal Markdown links between files should resolve to files that actually exist.

## How to run verification

Execute `artifacts/init.sh` from the plugin root directory:

```bash
cd plugins/long-running-harness
bash artifacts/init.sh
```

The script will report PASS or FAIL for each check category.

## Expected file inventory (after all features complete)

### Modified files (existing)
- plugin.json (name=harness, version=0.2.0)
- install.sh, install.bat (new paths, new files, --uninstall flag)
- openai.yaml (new agents)
- README.md (full rewrite)
- All 5 existing agent files (new paths)
- All 5 existing role files (new paths)
- All 4 existing command files (renamed with harness: prefix)
- patterns.md (new schemas, templates, paths)
- SKILL.md (methodology, new sprint flow)

### New files
- agents/tester.md, reviewer.md, releaser.md, architect.md
- skills/harness/roles/tester.md, reviewer.md, releaser.md, architect.md
- commands/harness:migrate.md, harness:release.md

## Notes

- No npm install, no database setup, no environment variables required.
- The plugin is purely declarative: it provides instructions and templates for Claude Code and Codex agents.
- Verification is structural (files exist, JSON parses, references resolve) rather than behavioral (no HTTP endpoints, no UI rendering).
