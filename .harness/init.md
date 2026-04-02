# Setup Instructions

## Metadata
- Role: initializer
- Agent: initializer-1
- Inputs: spec.md, plugin.json, skills directory listing
- Status: accepted

## Project Context

This harness run adds three new domain skills to the long-running-harness plugin (v0.7.0 -> v0.8.0 target). The deliverables are pure Markdown SKILL.md files plus integration updates to the main SKILL.md and plugin.json. There is no runtime code, no build step, and no dev server.

## Pre-flight Verification

Before starting any sprint, verify the following baseline conditions:

### 1. Plugin structure exists
```
plugins/harness/.claude-plugin/plugin.json    -- valid JSON, version 0.7.0
plugins/harness/skills/harness/SKILL.md       -- main harness skill (routing table lives here)
plugins/harness/skills/harness-sdlc/SKILL.md  -- existing software domain skill
plugins/harness/skills/harness-ea/SKILL.md    -- existing architecture domain skill (template for new skills)
```

### 2. Template skill is readable
The harness-ea/SKILL.md file is the structural template for all new domain skills. It should contain:
- YAML frontmatter with name and description
- 10 numbered sections following the pattern documented in spec.md
- 4 evaluation criteria with 0-5 anchor tables
- Activation Check section

### 3. Harness artifacts are initialized
```
.harness/features.json  -- 5 features, all passes: false
.harness/progress.md    -- baseline state documented
.harness/state.json     -- mode: supervised, status: active
.harness/config.json    -- default configuration
.harness/spec.md        -- accepted product spec
```

### 4. No conflicting skill directories
Verify that harness-ba, harness-sa, and harness-ops directories do NOT yet exist under plugins/harness/skills/. If they do exist from a prior partial run, review their contents before proceeding.

## Sprint Order

| Sprint | Feature(s) | Deliverable |
|--------|-----------|-------------|
| 1 | F-001 | harness-ba/SKILL.md |
| 2 | F-002 | harness-sa/SKILL.md |
| 3 | F-003 | harness-ops/SKILL.md |
| 4 | F-004 + F-005 | SKILL.md routing updates + plugin.json verification |

## Verification Commands

To check the current state of skill directories:
```bash
ls plugins/harness/skills/
```

To validate plugin.json is valid JSON:
```bash
cat plugins/harness/.claude-plugin/plugin.json | python -m json.tool
```

To verify a SKILL.md file has the expected section count:
```bash
grep -c "^## " plugins/harness/skills/harness-ba/SKILL.md
```

To verify evaluation criteria anchors are complete (should show scores 0 through 5):
```bash
grep -c "Score [0-5]" plugins/harness/skills/harness-ba/SKILL.md
```
