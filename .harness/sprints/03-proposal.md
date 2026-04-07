# Sprint Proposal

## Metadata
- Role: generator
- Agent: coordinator-inline-1
- Inputs: .harness/spec.md, .harness/features.json, 02-eval.json
- Status: accepted

## Target feature IDs
- F-003

## Goal
Create the tender management domain skill (harness-tm) with all 6 core sections following the established pattern. This skill covers APMP/Shipley capture management, color team reviews, compliance matrix validation, and RFP response evaluation.

## Deliverables
1. `plugins/harness-sales-suite/skills/harness-tm/SKILL.md` with 6 core sections

## Contract checks
- `PD-01` (required): All 6 sections present with tender-management-specific content
- `FN-01` (required): 4 evaluation criteria with complete 0-5 anchor tables
- `FN-02` (required): APMP/Shipley methodology, capture management, color team reviews in methodology table
- `CQ-01` (required): YAML frontmatter valid, security anti-patterns present
