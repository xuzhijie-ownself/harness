# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/spec.md, .harness/features.json, progress.md
- Status: in_review

## Target feature IDs
- F-001
- F-002

## Grouping waiver
F-001 and F-002 are grouped per the execution strategy. Both create new files without modifying existing ones. F-002 depends on the directory structure created by F-001. Grouping reduces risk because neither feature modifies existing files -- they only add new ones. There is no verification overlap or conflict.

## Goal
Create the harness-sdlc-suite plugin directory structure, move 5 domain skills from core plugin to the new plugin, and create the index skill SKILL.md that serves as the domain registry.

## Deliverables

### F-001: Create harness-sdlc-suite plugin structure
1. `plugins/harness-sdlc-suite/.claude-plugin/plugin.json` -- skills-only manifest
2. `plugins/harness-sdlc-suite/skills/` directory containing 5 moved domain skills:
   - `harness-sdlc/SKILL.md`
   - `harness-ea/SKILL.md`
   - `harness-ba/SKILL.md`
   - `harness-sa/SKILL.md`
   - `harness-ops/SKILL.md`
3. `plugins/harness/skills/` must contain ONLY `harness/` after the move

### F-002: Create harness-sdlc-suite index skill
1. `plugins/harness-sdlc-suite/skills/harness-sdlc-suite/SKILL.md` containing:
   - YAML frontmatter with skill name and description
   - Domain Profiles table (software, architecture, business_analysis, solution_architecture, ops)
   - Domain Skill Routing table
   - End-to-End Delivery Pipeline diagram (8 phases)
   - Phase routing table
   - Domain Skills summary table
   - Cross-Domain Composability note
   - Business Analysis Foundation note

## Verification
- `ls plugins/harness/skills/` shows only `harness/`
- `ls plugins/harness-sdlc-suite/skills/` shows 6 directories (5 domain + 1 index)
- Each domain skill SKILL.md exists and has content
- `plugins/harness-sdlc-suite/.claude-plugin/plugin.json` is valid JSON
- Index SKILL.md contains all required sections

## Acceptance criteria
- Product depth: Plugin structure mirrors the architecture diagram from spec.md
- Functionality: All 5 domain skills accessible at new paths; index skill provides complete routing
- Visual design: N/A (no UI) -- replaced by: Artifact structure follows established plugin conventions
- Code quality: JSON manifests are valid; SKILL.md follows YAML frontmatter + markdown conventions

## Contract checks
- `PD-01` (required): plugin.json exists at plugins/harness-sdlc-suite/.claude-plugin/plugin.json with correct fields
- `FN-01` (required): All 5 domain skills exist under plugins/harness-sdlc-suite/skills/ with SKILL.md files
- `FN-02` (required): plugins/harness/skills/ contains ONLY harness/ directory
- `FN-03` (required): Index SKILL.md exists with all 7 required content sections
- `VD-01` (advisory): Directory tree matches spec.md architecture diagram
- `CQ-01` (required): plugin.json is valid JSON; SKILL.md has valid YAML frontmatter

## Risks
- File move on Windows may need special handling (use git mv or cp+rm)
- Index SKILL.md content extraction from core SKILL.md must be accurate
