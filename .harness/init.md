# Initialization Guide

## Metadata
- Role: initializer
- Agent: initializer-1
- Inputs: spec.md, project file structure
- Status: accepted

## Project Overview

The Workflow Integrity project adds pre-flight/post-flight integrity guards to every entry point in the Harness plugin. All changes are to Markdown instruction files and JSON schema examples -- there is no runtime code, no build step, and no dev server.

## Project Location

```
C:\Users\zhijie\Desktop\ai\frontend\plugins\long-running-harness\
```

## Prerequisites

- A text editor or Claude Code session
- Git (for verification steps that check clean working tree)
- grep or ripgrep (for verification steps that search for stale references)

## Target Files

The project modifies 12 Markdown files inside `plugins/harness/`:

| File | Feature(s) |
|------|------------|
| `plugins/harness/commands/init.md` | F-002, F-007 |
| `plugins/harness/commands/session.md` | F-003, F-007 |
| `plugins/harness/commands/run.md` | F-004, F-007 |
| `plugins/harness/commands/reset.md` | F-005, F-007 |
| `plugins/harness/commands/release.md` | F-006, F-007 |
| `plugins/harness/agents/releaser.md` | F-001, F-008 |
| `plugins/harness/agents/coordinator.md` | F-001 |
| `plugins/harness/skills/harness/roles/releaser.md` | F-001 |
| `plugins/harness/skills/harness/references/patterns.md` | F-001 |
| `plugins/harness/skills/harness/SKILL.md` | F-001, F-009 |
| `plugins/harness/skills/harness-sdlc/SKILL.md` | F-010 |
| `plugins/harness/skills/harness-ea/SKILL.md` | F-011 |

## Startup

This project has no dev server or build step. "Startup" means opening the project directory and verifying the file structure is intact.

To verify the project is ready:

```bash
ls plugins/harness/commands/ plugins/harness/agents/ plugins/harness/skills/
```

All target files should be listed.

## Verification

After each feature is implemented, verify with:

1. Read the modified file(s) and confirm the expected sections are present
2. For F-001 specifically: `grep -r '.harness/release.json' plugins/harness/` should return zero matches
3. For F-007: all 5 command files should contain a pre-flight validation block

## Sprint Ordering

The dependency-aware ordering from the spec is:

```
F-001 -> F-007 -> F-002 -> F-003 -> F-004 -> F-005 -> F-006 -> F-008 -> F-009 -> F-010 -> F-011
```

## Notes

- No runtime code is involved; quality is measured by completeness, consistency, and clarity of Markdown instructions
- "visual_design" criterion maps to "documentation clarity" for this project
- The evaluator should score documentation clarity, structural consistency, and readability under visual_design
