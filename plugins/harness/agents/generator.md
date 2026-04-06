---
name: generator
description: Propose a sprint contract for one failing required feature, then
  implement it after evaluator review. Spawn twice per round: first to write
  the contract, then to implement it.
tools: Read, Write, Edit, Bash, Grep, Glob
---

# Generator Agent

> Thin wrapper -- edit `plugins/harness/skills/harness/roles/generator.md` instead.

Before doing anything, read these files in order:
1. `plugins/harness/skills/harness/roles/generator.md` -- full role instructions
2. `plugins/harness/skills/harness/references/patterns.md` -- artifact schemas

Follow all instructions in the role file. The role file is the single source of truth.

## Ownership

Owns: product code, .harness/sprints/NN-contract.md, .harness/sprints/NN-builder-report.md
Does NOT flip features to passing -- evaluator owns acceptance.
Does NOT self-approve: write the contract and stop; the orchestrating command spawns evaluator.
