# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt (audit reference skill + release), postmortem.md command, references/ directory, SKILL.md (core), features.json (prior cycle F-050..F-056 complete), release.json (v2.2.9)
- Status: accepted

## Overview

Extract the postmortem/audit logic from its current home as a Claude Code-only command (`plugins/harness/commands/postmortem.md`) into a core reference skill (`plugins/harness/skills/harness/references/audit.md`) that follows the domain skill section pattern. The command becomes a thin wrapper that points to the reference skill. This makes audit procedures available to all three runtimes (Claude Code, Codex, Copilot) and to any agent role, not just the slash command path.

The audit reference skill covers process auditing, artifact auditing, and drift detection for harness runs. It is scoped to the harness's own process -- it is not a domain skill for external projects. The integrity grep checklist currently embedded in `CLAUDE.md` and duplicated in `postmortem.md` moves into `audit.md` as the single canonical source.

The release bundles three prior feature groups into v2.3.0: core fixes (F-045 through F-049), sales suite (F-050 through F-056), and this audit skill work (F-057 through F-058).

## Design direction

Not applicable -- these are framework reference files, not user-facing UI. Quality direction: `audit.md` should be a self-contained reference that any harness agent can read without needing the postmortem command. It follows the 6-section pattern established by the sales suite domain skills, adapted for process auditing instead of domain execution.

## Shipped scope

- **F-057**: Create `plugins/harness/skills/harness/references/audit.md` -- harness process audit reference skill with 6 sections: audit methodology, audit approach, verification strategy, deliverable verification, evaluation criteria (4 criteria with 0-5 anchors), and audit checklists (including the canonical integrity grep checklist)
- **F-058**: Slim `plugins/harness/commands/postmortem.md` to a thin wrapper -- remove duplicated data-gathering instructions and template body, replace with a pointer to `references/audit.md` for procedures, keep command frontmatter for slash command support
- **F-059**: Release v2.3.0 -- bundle core fixes (F-045..F-049), sales suite (F-050..F-056), audit skill (F-057..F-058), bump minor version, update CHANGELOG.md and release.json

## User stories

- As a harness operator on Codex or Copilot, I want audit procedures available as a reference skill so that I can run a postmortem without needing Claude Code slash commands.
- As a harness evaluator, I want a single canonical source for the integrity grep checklist so that stale reference detection is consistent across all audit paths.
- As a harness operator, I want the postmortem command to be a thin wrapper so that audit logic is maintained in one place, not duplicated between the command and inline instructions.
- As a harness consumer, I want v2.3.0 released with the sales suite and audit skill bundled so that I can install a coherent feature set.

## Execution strategy
- Variant: Variant A
- Mode: continuous
- Expected sprint count: 2
- Default target ordering: F-057, F-058, F-059
- Multi-feature sprint policy: Sprint 1 groups F-057 and F-058 because F-058 is a direct consequence of F-057 (the command slimming requires the reference skill to exist). Grouping waiver required in the proposal.
- Simplification policy: If the postmortem command is already thin enough after F-058, do not pad it with extra content. The goal is reduction, not rewriting.
- Methodology: agile

### Sprint plan

**Sprint 1: Audit skill + command slim (F-057, F-058)**
- F-057: Create `references/audit.md` with 6 sections following the domain skill pattern
- F-058: Slim `postmortem.md` to thin wrapper pointing to `audit.md`
- Rationale: F-058 depends on F-057 existing. Both are markdown-only changes in the same plugin. Grouping avoids an unnecessary round-trip for a file that can only be slimmed after its replacement exists.

**Sprint 2: Release v2.3.0 (F-059)**
- F-059: Version bump, CHANGELOG.md, release.json, plugin.json manifests, README sync
- Rationale: Release must run after all content features are finalized and passing. Single feature sprint -- release touches cross-cutting files and follows the releaser role protocol.

### 6-Section Structure for audit.md

The reference skill adapts the domain skill section pattern for harness process auditing:

1. **Section 1 -- Audit Methodology**: Three audit types (process audit, artifact audit, drift audit) with when-to-use guidance and what each type examines. Analogous to the methodology table in domain skills.
2. **Section 2 -- Audit Approach**: Three approach strategies (integrity-first, compliance-first, trend-first) that determine the order and depth of audit steps. Analogous to the development methodology in domain skills.
3. **Section 3 -- Verification Strategy**: What constitutes "testing" for an audit -- grep checks for stale references, artifact counts against expected counts, score trend analysis for drift detection, feature pass-rate calculations. Analogous to the testing strategy in domain skills.
4. **Section 4 -- Deliverable Verification**: What makes a good postmortem report -- required sections, minimum evidence depth per section, table completeness enforcement. Analogous to the build/runtime verification in domain skills.
5. **Section 5 -- Evaluation Criteria**: Four criteria with 0-5 anchors: `process_compliance` (was the harness process followed?), `artifact_completeness` (are all required artifacts present and well-formed?), `drift_detection` (do score trends and failure patterns reveal drift?), `recommendation_quality` (are recommendations actionable and evidence-based?). Analogous to the primary criteria in domain skills.
6. **Section 6 -- Audit Checklists**: Pre-built checklist for post-run audit (the review checklist from patterns.md, expanded), anti-patterns (missing artifacts, unset status, stale handoff, score inflation), and the canonical integrity grep checklist (moved from CLAUDE.md/postmortem.md). Analogous to the anti-patterns section in domain skills.

### Thin Wrapper Pattern for postmortem.md

After F-058, the command file should contain:
- YAML frontmatter (name, description, allowed_tools) -- unchanged
- Preconditions section -- unchanged (still needs to verify state.json and features.json exist)
- Data Gathering section -- reduced to just the `postmortem-data` subcommand invocation
- A pointer: "Read `references/audit.md` for audit methodology, evaluation criteria, checklists, and report structure"
- Output section -- reduced to just the file path and summary line
- Remove: the full grep checklist (moves to audit.md Section 6), the detailed template body (moves to audit.md Section 4), the manual data gathering path (redundant with the subcommand)

## High-level technical design

### Files changed

| Feature | File | Action |
|---------|------|--------|
| F-057 | `plugins/harness/skills/harness/references/audit.md` | Create (new file) |
| F-058 | `plugins/harness/commands/postmortem.md` | Slim down (remove ~80 lines, add reference pointer) |
| F-059 | `release.json` | Add v2.3.0 entry, bump current_version |
| F-059 | `CHANGELOG.md` | Add v2.3.0 section |
| F-059 | `plugins/harness/plugin.json` | Version bump to 2.3.0 |
| F-059 | `plugins/harness-sales-suite/plugin.json` | Version bump to 2.3.0 |
| F-059 | `plugins/harness-sdlc-suite/plugin.json` | Version bump to 2.3.0 |
| F-059 | `README.md` | Sync version references, add audit skill to feature list |

### Cross-reference cleanup

When creating audit.md, verify:
- The grep pattern in Section 6 matches the current pattern in `postmortem.md` (line 131)
- The review checklist in Section 6 is a superset of the one in `patterns.md` (lines 680-690)
- After F-058, `postmortem.md` contains zero duplicated logic from `audit.md`

## Non-goals

- Changing the harness-companion.mjs `postmortem-data` subcommand (it stays as-is)
- Adding new evaluation criteria to the core harness (audit criteria are reference-only, not wired into state.json)
- Making audit.md a full domain skill with its own plugin entry (it is a reference, not a routable skill)
- Modifying the sales suite or SDLC suite content
- Backporting audit.md patterns to existing domain skills
- Changing the evaluator, generator, or coordinator role files

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Markdown reference files, command files, release artifacts
- Stakeholder lens: Harness operators, plugin consumers, framework maintainers

## Security Context
- data_sensitivity: none
- external_exposure: none
- auth_model: none
- compliance: none

## Definition of done

All 3 features pass evaluation:

1. **F-057**: `audit.md` exists at `plugins/harness/skills/harness/references/audit.md` with all 6 sections populated. Section 5 has 4 criteria with concrete 0-5 anchors. Section 6 has the canonical integrity grep checklist. The file is self-contained (readable without postmortem.md).
2. **F-058**: `postmortem.md` is a thin wrapper under 60 lines. It references `audit.md` for procedures. It retains YAML frontmatter and preconditions. The grep checklist and detailed template body are gone from this file (they live in audit.md).
3. **F-059**: `release.json` shows `current_version: "2.3.0"`. CHANGELOG.md has a v2.3.0 section listing F-045 through F-058. All plugin.json files show version 2.3.0. README.md version references are current.
