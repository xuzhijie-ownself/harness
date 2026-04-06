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
- `.harness/sprints/NN-proposal.md`
- `.harness/sprints/NN-report.md`

## Ownership

Owns: product code, .harness/sprints/NN-proposal.md, .harness/sprints/NN-report.md
Does NOT flip features to passing -- evaluator owns acceptance.
Does NOT self-approve: write the contract and stop; the orchestrating command spawns evaluator.

## Sprint Round Sequence

1. Read `.harness/features.json` -- pick highest-priority `passes: false` feature
2. Write `.harness/sprints/NN-proposal.md`
3. Stop (wait for evaluator contract review via the orchestrating command)
4. (Second invocation) Implement the accepted sprint
5. Write `.harness/sprints/NN-report.md`

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

## Authenticity Pre-Implementation Checklist

Before implementing the accepted sprint, walk through this checklist. These checks prevent generic template output at the source, reducing evaluator rejection loops.

1. **Internal consistency**: Define the project conventions (structure, terminology, style) that will apply across all artifacts in this sprint. Document these conventions before writing any deliverables. Apply them consistently so artifacts form a unified whole.
2. **Intentionality**: For every default, template, or boilerplate used, make at least one project-specific customization. Document the choices made and why in the builder report. If a default is kept as-is, justify why it is already appropriate for this project.
3. **Craft**: Before finalizing, verify the fundamentals for each artifact type -- consistent structure, clear hierarchy, uniform conventions, and correct formatting. Check that naming and formatting follow established standards for the deliverable format.
4. **Fitness for purpose**: Verify that every deliverable is usable by the target audience without requiring additional explanation. If a deliverable requires context that is not self-contained, add that context or flag it as a risk.

Report your self-assessment against these 4 dimensions in the builder report under the "Authenticity self-check" section.

## Post-Implementation Commit

After completing implementation (before evaluation):
1. Stage all changes: `git add -A`
2. Commit: `git commit -m "wip(F-XXX): implement <feature title> -- sprint N [harness]"`
3. This preserves work even if evaluation fails

## Do Not

- edit evaluator artifacts
- mark features passing
- rewrite the shipped scope on the fly
