# Initialization Documentation

## Metadata
- Role: initializer
- Agent: initializer-1
- Inputs: spec.md, source file scan
- Status: accepted

## Project Overview

This harness run performs a v0.9.1 patch: renaming the Authenticity Gate dimension "coherence" to "internal_consistency" across 6 base framework files in the long-running-harness plugin. The rename eliminates naming overlap with harness-ea's "coherence" domain criterion.

## Baseline Verification

All 6 target files must exist and contain "coherence" in their Authenticity Gate sections before any edits begin.

### Target files

1. `plugins/harness/skills/harness/SKILL.md` -- Authenticity Gate dimension table at ~line 372
2. `plugins/harness/skills/harness/references/patterns.md` -- NN-evaluation.json schema at ~line 258 and NN-builder-report template at ~line 441
3. `plugins/harness/agents/generator.md` -- Pre-Implementation Checklist at ~line 33
4. `plugins/harness/skills/harness/roles/generator.md` -- Authenticity bullet list at ~line 45
5. `plugins/harness/agents/evaluator.md` -- Verification table at ~line 94 and disambiguation note at ~line 104
6. `plugins/harness/skills/harness/roles/evaluator.md` -- Dimension list at ~line 83 and disambiguation instruction at ~line 89

### Baseline status

All 6 files confirmed present. Grep confirms "coherence" appears in dimension-name contexts in each file.

## Setup

No dev server or build step required. This is a documentation-only rename across Markdown and JSON files.

### Prerequisites

- Access to the plugin source tree at `plugins/long-running-harness/`
- Text editor or CLI tools capable of find-and-replace in Markdown/JSON

### Verification command

To verify the rename is complete, run:

```bash
grep -rn "coherence" \
  plugins/harness/skills/harness/SKILL.md \
  plugins/harness/skills/harness/references/patterns.md \
  plugins/harness/agents/generator.md \
  plugins/harness/skills/harness/roles/generator.md \
  plugins/harness/agents/evaluator.md \
  plugins/harness/skills/harness/roles/evaluator.md
```

After a successful rename, this grep should return zero hits in dimension-name contexts. Lines referencing "coherence" as prose (e.g., "loses coherence over long runs") or as a domain criterion name (architecture profile) are acceptable and should NOT be changed.

## Scope constraints

- Do NOT edit domain skill files (harness-ea, harness-sdlc, harness-ba, harness-sa, harness-ops)
- Do NOT change the dimension's definition text, only its name
- JSON keys use snake_case: `internal_consistency`
- Display labels use sentence case: `Internal consistency`
