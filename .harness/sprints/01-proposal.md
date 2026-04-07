# Sprint Proposal

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/spec.md, .harness/features.json, .harness/progress.md, install.sh, install.bat, CLAUDE.md
- Status: in_review

## Target feature IDs
- F-033
- F-034
- F-035
- F-036

## Grouping waiver

All four features share the same edit surfaces (install.sh, install.bat, CLAUDE.md) and the same path-correction logic. F-033 and F-034 are the identical fix in two languages. F-035 extends the same REL_PATH calculation to a second output file. F-036 is a single rule addition to CLAUDE.md. Splitting into separate sprints would quadruple the evaluation overhead for work that is logically one change. The spec's execution strategy explicitly groups all four in Sprint 1.

## Goal

Make the install scripts generate output files with project-root-relative paths instead of copying repo-internal files verbatim. This fixes Codex CLI skill discovery and Copilot CLI file references when the repo is cloned as a subdirectory of a project. Additionally, add a YAML frontmatter quoting rule to CLAUDE.md to prevent strict parser failures.

## Deliverables

### install.sh (modified)
- Computes REL_PATH from PROJECT_ROOT to PLUGIN_DIR using `python3 -c "import os; print(os.path.relpath(...))"` with fallback to `plugins/harness`
- Reads VERSION from source `.codex-plugin/plugin.json` via node
- Generates `.codex-plugin/plugin.json` at project root with skills paths prefixed by REL_PATH (heredoc with variable interpolation)
- Generates `.github/copilot-instructions.md` at project root by running sed on the source file to rewrite `plugins/harness/` and `plugins/harness-sdlc-suite/` path prefixes
- Prints REL_PATH during install for user visibility
- Uninstall path unchanged (still removes the generated files)

### install.bat (modified)
- Computes REL_PATH using `node -e "require('path').relative(...)"` with fallback to `plugins/harness`
- Reads VERSION from source plugin.json via node
- Generates `.codex-plugin/plugin.json` using a node one-liner that writes JSON with corrected skills paths
- Generates `.github/copilot-instructions.md` using a node one-liner that reads the source, applies regex replacement on path prefixes, and writes the result
- Forward slashes used throughout JSON output
- Uninstall path unchanged

### CLAUDE.md (modified)
- Added "YAML frontmatter rule" after the Naming Conventions table: all `description` fields in agent and command `.md` files must be quoted strings, with rationale (strict parser compatibility, "nested mappings" parse error prevention)

## Verification

### F-033 checks
1. From a project root where the repo is at `plugins/harness/`, run `bash plugins/harness/install.sh`
2. Confirm `.codex-plugin/plugin.json` exists at project root
3. Confirm skills paths contain `./plugins/harness/plugins/harness/skills/` and `./plugins/harness/plugins/harness-sdlc-suite/skills/`
4. Confirm the generated file is valid JSON (`node -e "JSON.parse(require('fs').readFileSync('.codex-plugin/plugin.json','utf8'))"`)
5. Confirm the skills directories referenced actually exist on disk

### F-034 checks
1. On Windows, from a project root where the repo is at `plugins\harness\`, run `plugins\harness\install.bat`
2. Confirm `.codex-plugin/plugin.json` exists with corrected skills paths using forward slashes
3. Confirm the generated file is valid JSON

### F-035 checks
1. After running install.sh, confirm `.github/copilot-instructions.md` exists at project root
2. Confirm file references contain `plugins/harness/plugins/harness/` (double prefix) instead of bare `plugins/harness/`
3. Confirm referenced files exist on disk (spot-check at least two paths)
4. Same checks after running install.bat on Windows

### F-036 checks
1. Open CLAUDE.md and locate the YAML frontmatter rule
2. Confirm it specifies that `description` fields must be quoted strings
3. Confirm it explains the rationale (strict parser compatibility)

## Acceptance criteria

### Product depth
- Path calculation is dynamic (not hardcoded to `plugins/harness`), supporting arbitrary clone locations within the project tree
- Version is read from the source manifest, not hardcoded
- Fallback values exist for environments without python3 or node

### Functionality
- All four features produce correct output when install scripts are run from a project root with the repo cloned as a subdirectory
- Generated JSON is valid and parseable
- Generated copilot-instructions.md paths resolve to real files
- Uninstall still works (removes generated files)
- CLAUDE.md contains the YAML quoting rule with rationale

### Visual design (script readability and output clarity)
- Install scripts print REL_PATH for user debugging
- Output messages are consistent between bash and batch versions
- CLAUDE.md rule is placed in context near the naming conventions table

### Code quality
- No new external dependencies (python3 and node are existing requirements)
- sed-based rewrite for bash; node-based for batch (each uses the natural tool for its platform)
- Source files inside the repo remain unmodified
- Scripts handle edge cases (missing python3 falls back, empty REL_PATH defaults)

## Contract checks

- `PD-01` (required): Generated plugin.json skills paths resolve to actual directories on disk
- `PD-02` (required): REL_PATH is computed dynamically, not hardcoded
- `FN-01` (required): install.sh produces valid JSON at `.codex-plugin/plugin.json` with corrected paths
- `FN-02` (required): install.bat produces valid JSON at `.codex-plugin/plugin.json` with corrected paths
- `FN-03` (required): install.sh produces `.github/copilot-instructions.md` with corrected file references
- `FN-04` (required): install.bat produces `.github/copilot-instructions.md` with corrected file references
- `FN-05` (required): CLAUDE.md contains YAML frontmatter quoting rule with rationale
- `VD-01` (advisory): Install output messages show REL_PATH and are consistent across bash/batch
- `CQ-01` (required): No new external dependencies introduced
- `CQ-02` (advisory): Source files inside repo are not modified by install process

## Risks

- **python3 availability on minimal systems**: install.sh uses python3 for os.path.relpath. Mitigation: fallback to `plugins/harness` if python3 is not available. This covers the common documented install path.
- **node availability**: Both scripts use node for version reading and batch uses node for JSON/markdown generation. Mitigation: node is already a prerequisite for the harness ecosystem. Fallback version defaults to `0.0.0`.
- **sed portability**: BSD sed (macOS) vs GNU sed. The sed pattern used (`s|old|new|g`) is POSIX-compatible and works on both.
- **Windows path separators**: Batch script must output forward slashes in JSON. Mitigated by using node's path.relative with explicit backslash-to-forward-slash conversion.
