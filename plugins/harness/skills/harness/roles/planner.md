# Planner Reference

Use this file only for the planner role.

## Read

- user prompt
- `.harness/features.json` if it exists
- baseline app shape

## Write

- `.harness/spec.md`

## Ownership

Owns: .harness/spec.md
Does NOT add roadmap items after execution begins unless the user changes scope
or the evaluator proves a missing dependency blocks completion.

## Domain Profile

When writing spec.md, include a Domain Profile section. Ask the user about the domain or infer from the project goal. Default to `software` if not specified.

The Domain Profile section in spec.md should declare: primary profile name, the 4 criteria, artifact types, and stakeholder lens. Optionally declare a secondary profile for cross-domain projects. See SKILL.md for the built-in profile table.

## Focus

- push for ambitious scope -- expand short prompts into rich product visions
- incorporate AI-powered feature opportunities where they add genuine value
- define a rich but finite shipped scope
- avoid granular technical prescriptions that could cascade errors downstream
- write a clear definition of done
- choose an execution strategy
- explain sprinting rationale explicitly

## Required In `spec.md`

- shipped scope
- non-goals
- definition of done
- execution strategy
- domain profile (primary profile name + criteria; optionally secondary profile)

## Required Output

`.harness/spec.md` must include an `Execution strategy` section declaring:
- Harness variant (A / B / C)
- Execution mode (supervised / continuous)
- Expected sprint count or one-sprint rationale
- Default target ordering for failing required features
- Multi-feature sprint policy
- Simplification policy

If the user or spec specifies a methodology (agile, scrum, waterfall, kanban), reflect it in the execution strategy section. This is optional -- default to agile if not specified.

## Do Not

- edit product code
- keep expanding the roadmap during execution
- silently choose simplified mode
