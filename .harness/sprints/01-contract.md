# Sprint Contract

## Metadata
- Role: generator
- Agent: coordinator-as-generator
- Inputs: .harness/spec.md, .harness/features.json, all 6 agent files, all 6 role files, all 5 command files, SKILL.md
- Status: in_review

## Target feature IDs
- F-001
- F-002

## Grouping waiver
F-001 (agent dedup) and F-002 (command pre-flight extraction) are independent file-level refactors. F-001 touches 6 agent files + 6 role files. F-002 touches 5 command files + SKILL.md. No file overlap. Grouping reduces risk by shipping both thin-wrapper patterns in one sprint.

## Goal
Convert 6 agent files into thin YAML-frontmatter wrappers pointing to role files. Extract the shared 4-step State Validation block from 5 command files into a "Command Pre-Flight Validation" section in SKILL.md.

## Deliverables

### F-001: Agent file deduplication
- Modify 6 agent files: coordinator.md, evaluator.md, generator.md, initializer.md, planner.md, releaser.md
- Each becomes: YAML frontmatter + "read role file" instruction + ownership declaration
- Before simplifying each agent file, merge any content UNIQUE to the agent file into its role file
- Role files remain canonical; no content loss

### F-002: Command pre-flight extraction
- Add "Command Pre-Flight Validation" section to SKILL.md (after "Workflow Entry" section)
- Modify 5 command files: init.md, run.md, session.md, reset.md, release.md
- Replace inline State Validation block with pointer to shared section
- Keep command-specific pre-flight steps inline

## Verification

### F-001 checks
- PD-01 (required): Each agent file has YAML frontmatter (name, description, tools) + body referencing role file + ownership declaration. No duplicated procedural prose.
- FN-01 (required): Role files contain all canonical procedural content. No content lost from agent files.
- CQ-01 (required): Total line count across 6 agent files reduced by approximately 280 lines from baseline 435.

### F-002 checks
- PD-02 (required): SKILL.md contains "Command Pre-Flight Validation" section with the 4-step block.
- FN-02 (required): Each command file references the shared pre-flight instead of inline duplication.
- CQ-02 (required): Total line count across 5 command files reduced by approximately 100 lines from baseline 305.

## Acceptance criteria
- Product depth: Agent files are thin wrappers; command files reference shared pre-flight
- Functionality: No behavioral change; all procedural content preserved in role files and SKILL.md
- Visual design: N/A for this refactoring sprint (Markdown formatting consistency)
- Code quality: Measurable line reduction; single source of truth for duplicated content

## Contract checks
- `PD-01`: required -- verify each agent file is thin wrapper format
- `PD-02`: required -- verify SKILL.md contains shared pre-flight section
- `FN-01`: required -- verify no content lost from agent-to-role merge
- `FN-02`: required -- verify command files reference shared pre-flight
- `CQ-01`: required -- verify agent file line reduction (~280 lines)
- `CQ-02`: required -- verify command file line reduction (~100 lines)

## Risks
- Agent files may contain unique content not in role files (mitigated by diff-before-simplify)
- plugin.json agents[] and commands[] arrays must remain unchanged (verified by not renaming or deleting files)
