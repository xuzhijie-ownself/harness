# Initialization Documentation

## Metadata
- Role: initializer
- Agent: initializer-1
- Inputs: spec.md, plugin directory structure
- Status: accepted

## Project Overview

This project creates an SDLC domain skill for the harness plugin. It is a knowledge-layer project -- all deliverables are Markdown files, not executable code. There is no dev server, no build step, and no runtime to verify.

## Verification Steps

Since this is a documentation/knowledge project, verification consists of checking that key plugin files exist and contain the expected content.

### Pre-existing files (should already exist)
- `plugins/long-running-harness/plugins/harness/skills/harness/SKILL.md` -- main harness skill file
- `plugins/long-running-harness/plugins/harness/skills/harness/roles/` -- agent role definitions
- `plugins/long-running-harness/plugins/harness/skills/harness/references/patterns.md` -- shared patterns

### Files to be created (F-001)
- `plugins/long-running-harness/plugins/harness/skills/harness-sdlc/SKILL.md` -- the SDLC domain skill

### Files to be modified (F-002)
- `plugins/long-running-harness/plugins/harness/skills/harness/SKILL.md` -- add SDLC skill reference

### Files to be modified (F-003)
- `plugins/long-running-harness/README.md` -- add SDLC skill documentation

## How to Verify

Run `init.sh` (or `init.bat` on Windows) to check that key plugin structure files exist. The script performs file-existence checks only -- there is no server to start or API to test.

## Environment Requirements

- No runtime dependencies
- No package manager required
- No build tools required
- A text editor and shell access are sufficient
