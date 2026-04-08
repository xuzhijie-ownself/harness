# Sprint Proposal

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/spec.md, .harness/features.json, 01-eval.json
- Status: in_review

## Target feature IDs
- F-064
- F-066

## Grouping waiver
Both are documentation restructuring tasks with zero file overlap. F-064 touches session.md, reset.md, and creates orchestration.md. F-066 touches only CLAUDE.md. Independent changes reduce risk. Grouping avoids an unnecessary extra round for two low-risk features.

## Goal
Extract session.md and reset.md procedural content into a centralized orchestration.md reference, and add a runtime capabilities table to CLAUDE.md.

## Deliverables

### F-064: Extract reset and session procedures to orchestration.md
1. **plugins/harness/skills/harness/references/orchestration.md** -- New file with two H2 sections:
   - `## Session Procedure`: All procedural steps from session.md (Session Startup, Contract Phase with interactive review loop, Implementation Phase, Evaluation Phase, Post-flight, Auto-Commit, Artifact Validation, Session End, Handoff Cleanup, Sprint Resume table)
   - `## Reset Procedure`: All procedural steps from reset.md (Steps 1-8, Phase Resume explanation, Post-flight)

2. **plugins/harness/commands/session.md** -- Slim to thin wrapper (~10-15 lines after frontmatter): frontmatter + brief description + pointer to orchestration.md Session Procedure section

3. **plugins/harness/commands/reset.md** -- Slim to thin wrapper (~10-15 lines after frontmatter): frontmatter + brief description + preconditions + pointer to orchestration.md Reset Procedure section

### F-066: Runtime capabilities table
4. **CLAUDE.md** -- Add `## Runtime Capabilities` section after "Design Principles" with a table:
   - Rows: Claude Code, Codex CLI, Copilot CLI
   - Columns: Slash Commands, Agent Spawning, Hooks, Skills/Plugin Reading, Script Execution, Interactive Review

## Verification

### F-064 verification
- `wc -l < plugins/harness/commands/session.md` shows under 20 lines of content (excluding frontmatter)
- `wc -l < plugins/harness/commands/reset.md` shows under 20 lines of content (excluding frontmatter)
- `plugins/harness/skills/harness/references/orchestration.md` exists with `## Session Procedure` and `## Reset Procedure` H2 sections
- All script calls (`harness-companion.mjs` invocations) from original session.md and reset.md are preserved in orchestration.md
- Interactive review loop (steps 7-8 in session.md) is preserved in orchestration.md
- Sprint Resume table is preserved in orchestration.md
- Phase Resume explanation is preserved in orchestration.md

### F-066 verification
- `grep -c "Runtime Capabilities" CLAUDE.md` returns 1
- Table has 3 data rows (Claude Code, Codex CLI, Copilot CLI) and 6+ capability columns
- Values are accurate per current runtime behavior

## Acceptance criteria
- Product depth: orchestration.md contains complete procedural content from both sources; capabilities table covers all 3 runtimes and 6 capability types
- Functionality: thin wrappers point correctly to orchestration.md; no behavioral change; all script calls preserved
- Visual design: clear section structure in orchestration.md; readable table in CLAUDE.md
- Code quality: no content duplication between wrappers and orchestration.md; wrappers are genuinely thin

## Contract checks
- `PD-01` (required): orchestration.md has both Session and Reset procedures with all script calls preserved
- `FN-01` (required): session.md is thin wrapper under 20 lines pointing to orchestration.md
- `FN-02` (required): reset.md is thin wrapper under 20 lines pointing to orchestration.md
- `FN-03` (required): interactive review loop preserved in orchestration.md
- `VD-01` (advisory): clear formatting and section hierarchy in orchestration.md
- `CQ-01` (required): CLAUDE.md has Runtime Capabilities table with 3 rows and 6 columns

## Risks
- Content must be moved precisely -- any missed script call or procedure step would be a behavioral regression
- Line count for thin wrappers depends on how frontmatter lines are counted
