# Sprint Proposal

## Metadata
- Role: generator
- Agent: coordinator-as-generator
- Inputs: .harness/spec.md, .harness/features.json, prior evaluation artifacts
- Status: in_review

## Target feature IDs
- F-057
- F-058
- F-060

## Grouping waiver
F-057 and F-058 are tightly coupled: F-058 (slim postmortem command) requires F-057 (audit.md) to exist as its replacement target. F-060 (register sales suite) is independent but grouped per the spec execution strategy to minimize round count for markdown-only changes. All three features are non-overlapping file changes with zero conflict risk.

## Goal
Create the audit reference skill, slim the postmortem command to a thin wrapper pointing at it, and register the sales suite across all three runtimes (Claude Code, Codex, Copilot).

## Deliverables

### F-057: Create references/audit.md
- New file: `plugins/harness/skills/harness/references/audit.md`
- 6 sections following domain skill pattern:
  1. Audit Methodology (process, artifact, drift, full audit types)
  2. Audit Approach (integrity-first, compliance-first, trend-first)
  3. Verification Strategy (grep checks, artifact counts, score trends)
  4. Deliverable Verification (what makes a good postmortem report)
  5. Evaluation Criteria (process_compliance, artifact_completeness, drift_detection, recommendation_quality -- each with 0-5 anchors)
  6. Audit Checklists + Anti-Patterns (canonical integrity grep, anti-pattern catalog)

### F-058: Slim postmortem.md
- Modified file: `plugins/harness/commands/postmortem.md`
- Target: under 60 lines
- Keep: YAML frontmatter, preconditions, postmortem-data subcommand call
- Remove: manual data gathering path, full grep checklist, detailed template body
- Add: pointer to references/audit.md
- Modified file: `.github/copilot-instructions.md` -- add audit.md reference

### F-060: Register sales suite across runtimes
- Modified file: `.claude-plugin/marketplace.json` -- add 3rd plugin entry for harness-sales-suite
- Modified file: `.codex-plugin/plugin.json` -- add sales suite skills path
- Modified file: `.github/copilot-instructions.md` -- add Sales Suite section with all 5 skill paths

## Verification

### F-057 checks
- File exists at expected path
- Has exactly 6 sections with correct headings
- Section 5 has 4 criteria with score 0-5 anchor tables
- Section 6 has the integrity grep pattern from current postmortem.md line 131
- File is self-contained (no external dependencies to understand it)

### F-058 checks
- `wc -l` on postmortem.md reports under 60 lines
- File still has YAML frontmatter with name/description/allowed_tools
- File contains "postmortem-data" subcommand reference
- File contains "references/audit.md" pointer
- File does NOT contain the grep checklist pattern
- copilot-instructions.md includes audit.md path

### F-060 checks
- marketplace.json has 3 entries in plugins array
- codex plugin.json skills array has 3 entries including sales suite path
- copilot-instructions.md has Sales Suite section with all 5 domain skill paths

## Acceptance criteria
- Product depth: audit.md has comparable depth to existing domain skills (6 sections, tables, concrete examples)
- Functionality: all three features work -- files exist, references resolve, registrations complete
- Visual design: consistent markdown formatting matching existing reference files
- Code quality: no stale references introduced, clean JSON syntax, under-60-line target met

## Contract checks
- `PD-01` (required): audit.md has 6 sections with tables in each
- `FN-01` (required): postmortem.md under 60 lines and references audit.md
- `FN-02` (required): marketplace.json, codex plugin.json, copilot-instructions.md all updated for sales suite
- `VD-01` (required): markdown formatting consistent with existing references/patterns.md
- `CQ-01` (required): no broken JSON, no stale references, grep checklist moved cleanly

## Risks
- The integrity grep pattern in postmortem.md may have been updated since spec was written -- need to capture the current version
- copilot-instructions.md edits for F-058 and F-060 overlap (same file) -- merge carefully
