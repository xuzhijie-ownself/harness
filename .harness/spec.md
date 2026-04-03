# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, SKILL.md (lines 362-392), evaluator.md (lines 86-105), generator.md, roles/generator.md, roles/evaluator.md, references/patterns.md
- Status: accepted

## Overview

Rename the Authenticity Gate dimension `coherence` to `internal_consistency` across all base framework files. This is a v0.9.1 patch that eliminates naming overlap with harness-ea's `coherence` domain criterion (a scored 0-5 criterion), removing evaluator confusion and the need for disambiguation notes.

The dimension's definition is unchanged: "All artifacts share consistent conventions -- structure, terminology, and style form a unified whole rather than appearing assembled from different sources." Only the name changes.

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Markdown documentation, JSON schemas
- Stakeholder lens: Harness contributors, evaluator/generator agents consuming these files

## Shipped Scope

**F-001: Rename `coherence` to `internal_consistency` across all 6 base framework files**

Priority: high | Required: yes

All edits are text substitutions -- no logic changes, no new sections, no removed sections (except disambiguation notes that become unnecessary).

Files and changes:

1. **`plugins/harness/skills/harness/SKILL.md`** (Authenticity Gate section, ~line 372)
   - Rename `coherence` to `internal_consistency` in the Dimensions table (both the dimension name cell and any references in the definition column)
   - Remove the disambiguation note from the definition ("Note: this is distinct from domain-specific criteria that may also be named 'coherence'..."). The rename eliminates the ambiguity, so the note is no longer needed. Keep only the core definition.

2. **`plugins/harness/skills/harness/references/patterns.md`**
   - In the `NN-evaluation.json` schema (~line 258): rename the `coherence` JSON key to `internal_consistency` inside the `authenticity_gate` object
   - In the `NN-builder-report.md` template (~line 441): rename `**Coherence**` to `**Internal consistency**` in the Authenticity self-check section

3. **`plugins/harness/agents/generator.md`** (Pre-Implementation Checklist, ~line 33)
   - Rename item 1 from `**Coherence**` to `**Internal consistency**`

4. **`plugins/harness/skills/harness/roles/generator.md`** (Authenticity section, ~line 45)
   - Rename `**Coherence**` to `**Internal consistency**` in the bullet list

5. **`plugins/harness/agents/evaluator.md`** (Step 5, ~lines 94 and 104)
   - Rename `**coherence**` to `**internal_consistency**` in the verification table
   - Remove the disambiguation note at ~line 104 ("Note: the 'coherence' dimension here is distinct from any domain-specific criterion named 'coherence'...")

6. **`plugins/harness/skills/harness/roles/evaluator.md`** (Authenticity Gate section, ~lines 83 and 89)
   - Rename `coherence` to `internal_consistency` in the dimension list (~line 83)
   - Remove the disambiguation instruction at ~line 89 ("Distinguish authenticity gate 'coherence' from any domain-specific criterion named 'coherence'")

## User Stories

- As a harness evaluator agent, I want the Authenticity Gate dimension to be named `internal_consistency` so I do not confuse it with the harness-ea `coherence` criterion when scoring.
- As a harness contributor, I want disambiguation notes removed so the documentation is cleaner and the rename speaks for itself.

## Execution Strategy

- **Variant**: Variant A (sprinted)
- **Mode**: continuous
- **Expected sprint count**: 1 sprint. Rationale: this is a single atomic rename across 6 files with no logic changes, no tests to run, no build step, and no dependencies between the edits. All 6 files must be updated together to maintain consistency.
- **Default target ordering**: F-001 (only feature)
- **Multi-feature sprint policy**: N/A (single feature)
- **Simplification policy**: No simplification needed. The scope is already minimal -- a find-and-replace rename plus removing two disambiguation notes across 6 Markdown/JSON files.
- **Methodology**: agile (default)

## High-Level Technical Design

No code logic changes. All edits are text substitutions in Markdown and JSON:

- Replace the string `coherence` with `internal_consistency` where it appears as an Authenticity Gate dimension name (not where it appears as prose or in domain criterion references)
- Replace display text `Coherence` with `Internal consistency` in human-readable labels/headers
- Delete disambiguation notes that existed solely because of the naming overlap (3 locations: SKILL.md, evaluator.md, roles/evaluator.md)

Care points:
- Do NOT touch any domain skill files (harness-ea, harness-sdlc, etc.) -- those use `coherence` as a domain criterion and that is correct
- Do NOT change the dimension's definition text, only its name
- Ensure JSON key names use snake_case (`internal_consistency`), display labels use sentence case (`Internal consistency`)

### Version
- Current: 0.9.0
- Target: 0.9.1 (patch -- rename only, no new functionality)

## Non-Goals

- Changing the definition or behavior of the dimension
- Modifying domain skill files (harness-ea, harness-sdlc, harness-ba, harness-sa, harness-ops)
- Renaming any domain criterion
- Adding new Authenticity Gate dimensions
- Bumping beyond patch version (this is 0.9.1, not 0.10.0)
- Adding runtime code, TypeScript, or executable components

## Definition of Done

- All 6 files listed in shipped scope have been edited
- The string `coherence` no longer appears as an Authenticity Gate dimension name in any of the 6 files
- `internal_consistency` appears in its place with the same definition
- Disambiguation notes removed from SKILL.md (~line 372), evaluator.md (~line 104), and roles/evaluator.md (~line 89)
- No edits made to files outside the 6 listed
- A grep for `coherence` in the 6 files returns zero hits in dimension-name contexts (prose references to the concept are acceptable but none are expected)
