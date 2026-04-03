# Setup Instructions

## Metadata
- Role: initializer
- Agent: initializer-1
- Inputs: spec.md, project file structure
- Status: accepted

## Project Context

This harness run adds an Authenticity Gate to the harness base framework as a cross-cutting middleware layer. All changes are additive Markdown edits to existing framework files. There is no dev server, no build step, and no runtime code -- verification consists of confirming that the target files exist, are readable, and contain the expected sections after implementation.

## Target Files

All files are relative to the project root (`plugins/long-running-harness/`):

| File | Feature | Change Type |
|------|---------|-------------|
| `plugins/harness/skills/harness/SKILL.md` | F-001 | Add section after "Quantified Evaluation" |
| `plugins/harness/skills/harness/references/patterns.md` | F-002 | Add to JSON schema + builder report template |
| `plugins/harness/agents/generator.md` | F-003 | Add pre-implementation checklist section |
| `plugins/harness/skills/harness/roles/generator.md` | F-004 | Add authenticity guidance section |
| `plugins/harness/agents/evaluator.md` | F-005 | Add post-grading gate step |
| `plugins/harness/skills/harness/roles/evaluator.md` | F-006 | Add authenticity gate section |

## Baseline Verification

To verify the baseline is ready for implementation:

1. Confirm all 6 target files exist and are readable
2. Confirm SKILL.md contains a "Quantified Evaluation" section (the insertion point for F-001)
3. Confirm patterns.md contains the NN-evaluation.json and NN-builder-report.md templates (insertion points for F-002)
4. Confirm generator.md and evaluator.md agent files exist with their current step sequences
5. Confirm roles/generator.md and roles/evaluator.md exist with their current section structure

Run `init.sh` (Linux/Mac) or `init.bat` (Windows) to perform this verification automatically.

## Sprint Plan

- **Sprint 1**: F-001 + F-002 -- Foundation (SKILL.md gate definition + evaluation schema/template updates). Grouped because F-002's schema additions directly reference the gate defined in F-001.
- **Sprint 2**: F-003 + F-004 + F-005 + F-006 -- Dual-side agent instructions (generator checklist + evaluator gate + role references). Grouped because these are tightly coupled halves of dual-side control.

## Key Constraints

- All edits are additive -- no existing harness behavior is altered or removed
- All new text uses generic middleware language -- zero domain-specific terms
- The gate is binary pass/fail only, not a 5th scored criterion
- No modifications to planner, coordinator, or releaser agents
