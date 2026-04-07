# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, install.sh, install.bat, .codex-plugin/plugin.json, .github/copilot-instructions.md, .claude-plugin/marketplace.json, CLAUDE.md, README.md, release.json
- Status: accepted

## Overview

Harness v2.2.8 is a targeted fix release for the install path problem that affects Codex CLI and Copilot CLI users. When a user clones the harness repo into a project via the documented command (`git clone ... plugins/harness`), the repo lands at `project_root/plugins/harness/`. Inside that repo, skills live under `plugins/harness/skills/` and `plugins/harness-sdlc-suite/skills/`. The install scripts (`install.sh` and `install.bat`) currently do a raw file copy of `.codex-plugin/plugin.json` and `.github/copilot-instructions.md` to the project root -- but the paths inside those files are relative to the repo root, not the project root. This means Codex CLI cannot find skills and Copilot CLI gets broken file references.

The fix: instead of copying static files, the install scripts must generate the output files with path-corrected content. Additionally, this release adds a YAML quoting rule to CLAUDE.md for strict parser compatibility.

This is a non-breaking patch release. No behavioral changes to the harness core, no schema changes, no new subcommands.

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Shell scripts, batch scripts, JSON config, Markdown
- Stakeholder lens: Codex CLI users, Copilot CLI users, harness maintainers

Note: "visual_design" maps to script readability and output clarity for this infrastructure cycle.

## Design direction

Surgical. Each install script gains path-calculation logic and generates output files with corrected paths instead of blindly copying them. The source files inside the repo remain unchanged (they still work correctly when the repo IS the project root, as with Claude Code marketplace install). The install scripts become the translation layer.

## Shipped scope

### Sprint 1 -- Install path fixes and YAML rule

**F-033: Fix install.sh to generate .codex-plugin/plugin.json with correct paths**
- Calculate the relative path from PROJECT_ROOT to PLUGIN_DIR (the cloned repo root)
- Instead of `cp`, generate `plugin.json` at `$PROJECT_ROOT/.codex-plugin/plugin.json` with skills paths rewritten
- Source `plugin.json` has `"./plugins/harness/skills/"` and `"./plugins/harness-sdlc-suite/skills/"`
- Generated output must prepend the relative path: if repo is at `plugins/harness/`, skills become `"./plugins/harness/plugins/harness/skills/"` and `"./plugins/harness/plugins/harness-sdlc-suite/skills/"`
- Use POSIX-portable path math (no `realpath --relative-to` which is GNU-only)
- Preserve all other fields from the source plugin.json (name, version, description, interface, etc.)
- Verify the generated file is valid JSON

**F-034: Fix install.bat to generate .codex-plugin/plugin.json with correct paths (Windows)**
- Same logic as F-033 but in Windows batch
- Calculate relative path from PROJECT_ROOT to PLUGIN_DIR using batch string operations
- Generate plugin.json with rewritten skills paths
- Use forward slashes in JSON output (JSON standard, works on Windows too)

**F-035: Fix install.sh/bat to generate .github/copilot-instructions.md with correct file references**
- Source `copilot-instructions.md` references paths like `plugins/harness/skills/harness/SKILL.md`
- These paths assume repo root = project root
- Install scripts must rewrite these paths by prepending the relative path from project root to repo root
- For install.sh: use `sed` to replace `plugins/harness/` with `${REL_PATH}/plugins/harness/` and `plugins/harness-sdlc-suite/` with `${REL_PATH}/plugins/harness-sdlc-suite/`
- For install.bat: use equivalent string replacement
- Also rewrite the `node plugins/harness/scripts/` command reference

**F-036: Add YAML frontmatter quoting rule to CLAUDE.md**
- Add a rule to the "Naming Conventions" or "Design Principles" section of CLAUDE.md
- Rule: all YAML `description` values MUST be quoted strings (single or double) for strict parser compatibility
- This prevents breakage when descriptions contain colons, brackets, or other YAML-special characters

## User stories

- As a Codex CLI user, I want `bash plugins/harness/install.sh` to produce a working `.codex-plugin/plugin.json` so that Codex discovers harness skills without manual path editing.
- As a Copilot CLI user, I want `.github/copilot-instructions.md` to reference correct file paths so that Copilot can read the harness documentation.
- As a Windows user, I want `install.bat` to produce the same correct output as `install.sh`.
- As a harness maintainer, I want YAML descriptions to always be quoted so that strict parsers do not choke on special characters.

## Execution strategy
- Variant: Variant A (sprinted, single generate-evaluate loop per round)
- Mode: continuous
- Expected sprint count: 1 (all four features share the same edit surfaces -- install.sh, install.bat, CLAUDE.md -- and are logically coupled)
- Default target ordering: F-033 -> F-034 -> F-035 -> F-036 (path fix logic builds on itself; YAML rule is independent but trivial)
- Multi-feature sprint policy: All four features are grouped in one sprint because F-033 and F-034 are the same logic in two languages, F-035 extends the same path calculation, and F-036 is a one-line documentation addition. Grouping waiver justified by shared edit surface and low individual complexity.
- Simplification policy: If the sprint fails evaluation, fix in a second round rather than splitting features. Do not add a second sprint unless the evaluator identifies a fundamental design flaw.
- Methodology: agile

## High-level technical design

- **Path calculation (bash)**: Compute `REL_PATH` as the relative path from `$PROJECT_ROOT` to `$PLUGIN_DIR`. Use a POSIX-compatible approach: strip the common prefix and count `..` segments, or since install.sh already computes both absolute paths, derive the relative path by removing the PROJECT_ROOT prefix from PLUGIN_DIR. Since the documented install is always `plugins/harness/`, this will typically be `plugins/harness` -- but the script should not hardcode this.
- **Path calculation (batch)**: Same logic using `%PLUGIN_DIR%` and `%PROJECT_ROOT%`. Use batch substring operations to strip the common prefix.
- **JSON generation (bash)**: Read the source `plugin.json`, use `sed` to rewrite skills paths, write to destination. Alternatively, generate the JSON inline since the structure is known. Prefer reading from source so that future field additions propagate automatically.
- **JSON generation (batch)**: Same approach using `findstr` / string replacement or inline generation.
- **Copilot instructions rewrite**: Use `sed` (bash) or inline generation (batch) to replace path prefixes in the markdown file.
- **CLAUDE.md update**: Add a bullet under an appropriate existing section.

## Non-goals

- Changing the Claude Code marketplace install flow (it does not use install.sh/bat)
- Modifying the source `.codex-plugin/plugin.json` or `.github/copilot-instructions.md` inside the repo
- Adding new skills, commands, or agents
- Changing the harness core sprint loop
- Supporting install locations other than subdirectories of project root (e.g., sibling directories or absolute paths outside the project tree)
- Restructuring the repo's internal `plugins/` directory layout

## Definition of done

1. Running `bash plugins/harness/install.sh` from project root produces a `.codex-plugin/plugin.json` whose skills paths resolve to actual directories on disk
2. The generated `plugin.json` contains paths like `./plugins/harness/plugins/harness/skills/` (not `./plugins/harness/skills/`)
3. Running `plugins\harness\install.bat` on Windows produces the same correct paths
4. The generated `.github/copilot-instructions.md` references files at their correct project-root-relative locations
5. All generated paths work regardless of the clone directory name (not hardcoded to `plugins/harness`)
6. CLAUDE.md contains a YAML quoting rule for description fields
7. The uninstall flag (`--uninstall`) still works correctly
8. Source files inside the repo are unchanged (install scripts only modify output at project root)

## Security Context
- data_sensitivity: none
- external_exposure: none
- auth_model: none
- compliance: none

## Risks

- **POSIX portability of path calculation**: macOS `realpath` differs from GNU `realpath`. Mitigation: use pure bash string manipulation instead of external commands.
- **Batch string manipulation fragility**: Windows batch has limited string processing. Mitigation: since the documented clone target is always a subdirectory of project root, the relative path is simply the PLUGIN_DIR with PROJECT_ROOT prefix stripped.
- **JSON generation without jq**: The install scripts must not introduce dependencies. Mitigation: use sed on the source file or generate JSON inline with echo statements.
- **Future plugin.json field additions**: If install.sh generates JSON inline, new fields added to the source file will not propagate. Mitigation: prefer sed-based rewrite of the source file over inline generation.
