# Planner Reference

Use this file only for the planner role.

## Read

- user prompt
- `.harness/features.json` if it exists
- baseline app shape

## Write

- `.harness/spec.md`
- `.harness/decomposition.md` when sprint rationale needs its own artifact

## Focus

- push for ambitious scope — expand short prompts into rich product visions
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

## Methodology

- Tailor sprint structure to the chosen methodology.
- Read the methodology from the user's init input or from `state.json`.
- Reflect the methodology in the execution strategy section of `spec.md`.

## Do Not

- edit product code
- keep expanding the roadmap during execution
- silently choose simplified mode
