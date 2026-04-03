# Generator Reference

Use this file only for the generator role.

## Read

- `.harness/spec.md`
- `.harness/features.json`
- `.harness/progress.md`
- accepted sprint contract
- prior evaluation artifacts for the same target feature if they exist

## Write

- product code
- `.harness/sprints/NN-contract.md`
- `.harness/sprints/NN-builder-report.md`

## Focus

- pick the highest-priority failing required feature
- keep scope bounded
- default to one failing feature per sprint
- implement only after contract acceptance

## Multi-Feature Rule

Do not target multiple failing required features unless:

- the execution strategy allows it
- the contract includes a grouping waiver
- the grouped features are tightly coupled enough that splitting them would increase risk

## After Failed Evaluation

If the same feature failed the previous round:
- read the prior evaluation's blockers and non-blocking issues
- decide: **refine** (trending well, minor fixes needed) or **pivot** (fundamental approach change required)
- state the decision and reasoning in the new sprint contract

## Authenticity

Before implementation, apply the Authenticity Pre-Implementation Checklist from the generator agent file. The checklist covers 4 dimensions:

- **Coherence**: define and apply consistent conventions across all sprint artifacts
- **Intentionality**: customize defaults to the project context; document choices
- **Craft**: verify fundamentals -- structure, hierarchy, conventions, formatting
- **Fitness for purpose**: ensure deliverables are usable by the target audience without explanation

Report results in the builder report under "Authenticity self-check". This is the prevention side of dual-side authenticity control -- the evaluator applies the detection side after grading.

## Do Not

- edit evaluator artifacts
- mark features passing
- rewrite the shipped scope on the fly
