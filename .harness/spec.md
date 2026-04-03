# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, SKILL.md, generator.md, evaluator.md, roles/generator.md, roles/evaluator.md, references/patterns.md
- Status: accepted

## Overview

Add an Authenticity Gate to the harness base framework as a cross-cutting middleware layer. The gate prevents AI-generated generic/template output by enforcing four dimensions -- coherence, intentionality, craft, and fitness for purpose -- as a binary pass/fail check that runs after the existing domain criteria scoring. Both the generator (pre-implementation) and evaluator (post-grading) receive instructions, creating dual-side control that reduces retry loops caused by the evaluator catching problems the generator was never told to avoid.

The gate is domain-agnostic. It uses generic middleware language with no domain-specific terminology. Domain skills may optionally add "Authenticity Anchors" sections in a future iteration (not in this run).

## Problem Statement

The harness currently scores artifacts on 4 domain criteria (0-5 scale) but has no mechanism to detect when output is technically competent yet generically templated. A generator can produce artifacts that score 3+ on all criteria while still being obvious AI-generated boilerplate -- correct structure, correct naming, but no evidence of project-specific decision-making. The Authenticity Gate closes this gap by adding a binary quality gate after scoring that checks whether the artifacts demonstrate coherence, intentionality, craft, and fitness for purpose.

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Code, tests, configs, plugin framework files (Markdown)
- Stakeholder lens: Harness users (developers running the harness), harness contributors

## Shipped Scope

### F-001: SKILL.md Authenticity Gate Section
**Priority: high | Required: yes**

Add an "Authenticity Gate" section to `plugins/harness/skills/harness/SKILL.md` after the "Quantified Evaluation" section. The section defines the 4 dimensions (coherence, intentionality, craft, fitness for purpose), declares the gate as binary pass/fail, specifies it runs after domain criteria scoring, and states that any dimension failure fails the round regardless of domain scores. Uses generic middleware language only -- no domain-specific terms.

Steps:
- Read current SKILL.md, locate "Quantified Evaluation" section
- Add "Authenticity Gate" section immediately after it
- Define all 4 dimensions with generic definitions
- Specify binary pass/fail semantics
- Specify ordering: runs AFTER domain criteria scoring
- Specify failure rule: any dimension fail = round fail
- Verify no domain-specific terminology is present

### F-002: Evaluation Schema and Builder Report Template Updates
**Priority: high | Required: yes | Depends on: F-001**

Add `authenticity_gate` to the `NN-evaluation.json` schema in `plugins/harness/skills/harness/references/patterns.md`. Add an authenticity self-check section to the builder report template so the generator self-reports on authenticity dimensions before evaluation.

Steps:
- Read current patterns.md
- Add `authenticity_gate` object to `NN-evaluation.json` schema (4 dimensions, each with pass/fail + justification)
- Add authenticity self-check section to `NN-builder-report.md` template
- Verify JSON schema is valid
- Verify builder report template section uses generic language

### F-003: Generator Pre-Implementation Checklist
**Priority: high | Required: yes | Depends on: F-001**

Add an authenticity pre-implementation checklist to `plugins/harness/agents/generator.md`. The checklist instructs the generator to: define conventions before building, customize defaults to project context, verify technical fundamentals, and ensure target-audience usability. This is the "prevention" side of dual-side control.

Steps:
- Read current generator.md agent file
- Add "Authenticity Pre-Implementation Checklist" section
- Include 4 checklist items mapping to the 4 dimensions
- Verify checklist uses generic middleware language
- Verify it integrates naturally with the existing sprint round sequence

### F-004: Generator Role Reference Update
**Priority: medium | Required: yes | Depends on: F-003**

Add authenticity instructions to `plugins/harness/skills/harness/roles/generator.md` so the role-scoped reference includes the pre-implementation checklist guidance.

Steps:
- Read current roles/generator.md
- Add "Authenticity" section with focus-level guidance
- Ensure it references the pre-implementation checklist without duplicating full details
- Verify generic language

### F-005: Evaluator Post-Grading Gate
**Priority: high | Required: yes | Depends on: F-001**

Add the authenticity post-grading gate to `plugins/harness/agents/evaluator.md`. After the existing grading step (step 3), the evaluator checks: coherence across artifacts, intentionality via the builder report, craft fundamentals, and fitness for purpose. Binary pass/fail -- any dimension failure fails the round.

Steps:
- Read current evaluator.md agent file
- Add step "5. Authenticity Gate" after existing step 4 (Calibration)
- Include 4 dimension checks with verification methods
- Specify binary pass/fail semantics
- Specify that authenticity failure overrides domain criteria pass
- Verify generic language throughout

### F-006: Evaluator Role Reference Update
**Priority: medium | Required: yes | Depends on: F-005**

Add the authenticity gate to `plugins/harness/skills/harness/roles/evaluator.md` so the role-scoped reference includes the post-grading gate instructions.

Steps:
- Read current roles/evaluator.md
- Add "Authenticity Gate" section under grading responsibilities
- Ensure it references the post-grading gate without duplicating full details
- Verify generic language

## User Stories

- As a harness user, I want the generator to proactively avoid template output so that I spend fewer rounds in retry loops caused by generic artifacts.
- As a harness user, I want a binary authenticity check after scoring so that technically-competent-but-generic output is caught before it is accepted.
- As a harness contributor, I want the authenticity gate defined in domain-agnostic middleware language so that it works across all domain profiles without modification.

## Execution Strategy

- **Variant**: Variant A (Full-Stack Sprinted Harness)
- **Mode**: continuous
- **Expected sprint count**: 2 sprints
  - Sprint 1: F-001 + F-002 (foundation -- SKILL.md gate definition + schema/template updates). Grouped because F-002's schema additions directly reference the gate defined in F-001; splitting them would create an inconsistent intermediate state where the gate is defined but the evaluation schema cannot capture its results.
  - Sprint 2: F-003 + F-004 + F-005 + F-006 (dual-side agent instructions). Grouped because these 4 features are tightly coupled halves of dual-side control -- the generator checklist and evaluator gate must be consistent with each other, and each agent file pairs with its role reference file. Shipping one side without the other creates an asymmetric control surface.
- **Default target ordering**: F-001, F-002, F-003, F-004, F-005, F-006 (foundation first, then dual-side control)
- **Multi-feature sprint policy**: Allowed for this run. These are additive Markdown edits to framework files, not product code. Grouping tightly-coupled documentation changes reduces the risk of inconsistency between related files.
- **Simplification policy**: Not justified. Two sprints for 6 additive Markdown edits is already compact. Simplification to Variant C would remove the contract review step, which is valuable even for documentation changes to catch terminology leaks (domain-specific language in what should be generic middleware).
- **Methodology**: agile (default)

## High-Level Technical Design

### Files Modified (all additive edits)

| File | Change Type | Feature |
|------|-------------|---------|
| `plugins/harness/skills/harness/SKILL.md` | Add section after "Quantified Evaluation" | F-001 |
| `plugins/harness/skills/harness/references/patterns.md` | Add to JSON schema + builder report template | F-002 |
| `plugins/harness/agents/generator.md` | Add pre-implementation checklist section | F-003 |
| `plugins/harness/skills/harness/roles/generator.md` | Add authenticity guidance section | F-004 |
| `plugins/harness/agents/evaluator.md` | Add post-grading gate step | F-005 |
| `plugins/harness/skills/harness/roles/evaluator.md` | Add authenticity gate section | F-006 |

### Integration Points

The gate integrates into the existing evaluation flow:
1. Domain criteria scoring (0-5) happens first (existing behavior, unchanged)
2. Authenticity gate runs as binary pass/fail overlay (new)
3. If any authenticity dimension fails, the round fails regardless of domain scores

### The 4 Dimensions (generic middleware language)

| Dimension | Definition |
|-----------|------------|
| Coherence | All artifacts share consistent conventions -- structure, terminology, style form a unified whole |
| Intentionality | Evidence of project-specific decisions tailored to THIS project's context, not generic defaults/template output |
| Craft | Technical fundamentals correct for the artifact type -- hierarchy, structure, naming, formatting follow established standards |
| Fitness for purpose | Artifacts usable by target audience without requiring additional explanation |

### Dual-Side Control

- **Generator side** (prevention): Pre-implementation checklist -- define conventions, customize defaults, verify fundamentals, ensure usability
- **Evaluator side** (detection): Post-grading gate -- check coherence, verify intentionality via builder report, check craft, verify fitness

### Version
- Current: 0.8.0
- Target: 0.9.0 (new feature = minor bump)

## Non-Goals

- Domain-specific "Authenticity Anchors" sections in individual domain skills (harness-sdlc, harness-ea, harness-ba, harness-sa, harness-ops) -- future work
- Scored (0-5) authenticity dimensions -- the gate is binary pass/fail only, not a 5th criterion
- Modifications to the planner, coordinator, or releaser agents
- Modifications to any domain skill
- Adding runtime code, TypeScript, or executable components -- all changes are Markdown edits
- Changing the harness's core evaluation loop, feature ledger, or sprint machinery beyond the additive gate

## Definition of Done

All 6 features pass evaluator review:
- SKILL.md contains a self-contained "Authenticity Gate" section after "Quantified Evaluation" using no domain-specific terminology
- patterns.md evaluation JSON schema includes `authenticity_gate` with 4 dimensions (pass/fail + justification each)
- patterns.md builder report template includes authenticity self-check section
- generator.md agent file includes pre-implementation authenticity checklist
- roles/generator.md includes authenticity guidance
- evaluator.md agent file includes post-grading authenticity gate step
- roles/evaluator.md includes authenticity gate section
- All edits are additive -- no existing harness behavior is altered or removed
- All new text uses generic middleware language -- zero domain-specific terms
