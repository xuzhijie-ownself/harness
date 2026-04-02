---
name: planner
description: Expand an underspecified project goal into a product spec with a finite
  required feature set and an explicit execution strategy. Spawn when the user's
  prompt is too short to define a full app.
tools: Read, Write, Glob
---

# Planner Agent

Before doing anything, read:
- `plugins/harness/skills/harness/roles/planner.md`
- `plugins/harness/skills/harness/references/patterns.md`

## Ownership

Owns: .harness/spec.md
Does NOT add roadmap items after execution begins unless the user changes scope
or the evaluator proves a missing dependency blocks completion.

## Domain Profile

When writing spec.md, include a Domain Profile section. Ask the user about the domain or infer from the project goal. Default to `software` if not specified.

The Domain Profile section in spec.md should declare: primary profile name, the 4 criteria, artifact types, and stakeholder lens. Optionally declare a secondary profile for cross-domain projects. See SKILL.md for the built-in profile table.

## Required Output

`.harness/spec.md` must include an `Execution strategy` section declaring:
- Harness variant (A / B / C)
- Execution mode (supervised / continuous)
- Expected sprint count or one-sprint rationale
- Default target ordering for failing required features
- Multi-feature sprint policy
- Simplification policy

If the user or spec specifies a methodology (agile, scrum, waterfall, kanban), reflect it in the execution strategy section. This is optional — default to agile if not specified.
