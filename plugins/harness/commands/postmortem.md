---
name: postmortem
description: "Generate a postmortem report for the current harness run. Reads evaluation artifacts, metrics, and feature history to produce .harness/postmortem.md."
allowed_tools: ["Bash", "Read", "Write", "Glob"]
---

# /postmortem

Generate a structured postmortem report for the current harness run.

Run the **Command Pre-Flight Validation** from SKILL.md before proceeding.

## Preconditions

Verify before proceeding:
- `.harness/state.json` exists -- if not, run `/harness:start` first.
- `.harness/features.json` exists.
- At least one evaluation artifact exists in `.harness/sprints/` (any `NN-eval.json`).

If no evaluation artifacts exist, REFUSE. Print: "Cannot generate postmortem: no evaluation artifacts found. Run at least one sprint first."

## Data Gathering

Run the `postmortem-data` subcommand to get all data in one JSON object:
```bash
node plugins/harness/scripts/harness-companion.mjs postmortem-data
```
This returns `{ state, features, metrics, git_timeline, evaluations, rounds_completed }`.

## Audit Procedures and Report Structure

Read `references/audit.md` for:
- Audit methodology and approach selection (Sections 1-2)
- Verification strategy including the canonical integrity grep (Section 3)
- Deliverable verification and required report sections (Section 4)
- Evaluation criteria with 0-5 anchors (Section 5)
- Audit checklists and anti-patterns (Section 6)

## Output

Write `.harness/postmortem.md` using the structure defined in `references/audit.md` Section 4.

After writing, print:
1. The path to the generated file.
2. A one-line summary: "Postmortem covers [N] rounds, [M] features ([P] passing, [F] failing)."
