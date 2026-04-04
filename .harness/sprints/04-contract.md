# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/features.json, .harness/plan-core-fixes.md, plugins/harness-sdlc-suite/skills/harness-sdlc-suite/SKILL.md, all 5 domain skill SKILL.md files
- Status: in_review

## Target feature IDs
- F-004
- F-005
- F-006

## Grouping waiver

These 3 features are grouped in a single sprint because:

1. **Single target file**: All three features add new sections to the same file (`plugins/harness-sdlc-suite/skills/harness-sdlc-suite/SKILL.md`). Splitting them into 3 sprints would require re-reading and re-editing the same file three times for purely additive, non-overlapping sections.
2. **No overlap risk**: F-004 adds a Phase Handoff Protocol section, F-005 adds a criteria key mapping table, F-006 adds a verification method table. Each is a self-contained section with no shared content. They do not modify existing text -- they only append new sections.
3. **Approved plan**: The plan (`plan-core-fixes.md`) explicitly groups these three features as Sprint 2.
4. **Markdown-only, additive**: Every change is a new Markdown section appended to an existing file. No existing content is modified. Risk of regression is near zero.

## Goal

Complete the harness-sdlc-suite index skill with three missing reference sections: cross-phase handoff protocol, evaluation JSON criteria key mapping per domain profile, and runtime verification method guidance per domain profile. All changes are additive Markdown sections appended to `SKILL.md`.

## Deliverables

### F-004: Cross-phase handoff protocol

Add a "Phase Handoff Protocol" section to `plugins/harness-sdlc-suite/skills/harness-sdlc-suite/SKILL.md` after the "Business Analysis Foundation" section. Contents:

1. **Required outputs per phase table** -- one row per pipeline phase (all 8 phases from the existing End-to-End Delivery Pipeline), listing: phase name, owning skill, required output artifacts, and output format.
2. **Phase dependency table** -- showing which phases are sequential (output of one is input to next) and which can run in parallel. Based on the existing pipeline diagram but adding explicit dependency annotations.
3. **Artifact handoff format** -- specifying that handoff between phases uses the existing `.harness/` artifact layout (features.json carries forward, spec.md is the cross-phase contract, each phase run produces its own sprints/ directory).
4. **Scope change escalation** -- procedure for when a downstream phase discovers that an upstream phase's outputs are insufficient. Defines: who escalates (current phase's evaluator), where (progress.md blocker entry), and what happens (upstream phase re-entered with a targeted sprint).

### F-005: Evaluation JSON schema guidance

Add a "Criteria Key Mapping" section after the new Phase Handoff Protocol section. Contents:

A table mapping each domain profile to its 4 `primary_scores` JSON keys for `NN-evaluation.json`. The keys come directly from the installed domain skills:

| Profile | `criterion_1` | `criterion_2` | `criterion_3` | `criterion_4` |
|---------|--------------|--------------|--------------|--------------|
| `software` | `product_depth` | `functionality` | `visual_design` | `code_quality` |
| `enterprise_architecture` | `coherence` | `standards_compliance` | `stakeholder_coverage` | `feasibility` |
| `business_analysis` | `completeness` | `traceability` | `stakeholder_alignment` | `feasibility` |
| `solution_architecture` | `design_coherence` | `technical_depth` | `integration_clarity` | `implementability` |
| `ops` | `operational_readiness` | `automation_coverage` | `reliability_design` | `security_posture` |

Plus a brief note explaining that `custom` profiles define their own 4 keys inline in `spec.md`, and that the `primary_scores` object in `NN-evaluation.json` uses these exact keys (replacing the `<criterion_N>` placeholders from `patterns.md`).

### F-006: Runtime verification fallbacks

Add a "Domain Verification Methods" section after the Criteria Key Mapping section. Contents:

A table mapping each domain profile to its verification method, what constitutes "runtime verification" for that domain, and what the evaluator checks:

| Profile | Verification Method | What to Check | Tooling |
|---------|-------------------|---------------|---------|
| `software` | Build + runtime + browser | App compiles, starts, responds to HTTP, UI renders | Build tools, curl/HTTP, Playwright/browser |
| `enterprise_architecture` | Deliverable completeness + cross-reference integrity | Required docs exist per phase, internal references resolve, no dangling IDs | Grep, file existence checks |
| `business_analysis` | Deliverable completeness + scenario walkthrough | Required sections present, requirement IDs trace end-to-end, no orphaned requirements | Grep, traceability matrix validation |
| `solution_architecture` | Deliverable completeness + contract validation | Design docs exist, API specs parse, cross-references resolve, ADRs cover key decisions | Grep, schema validation (OpenAPI/AsyncAPI) |
| `ops` | Config validation + dry-run + completeness | IaC configs lint-clean, pipeline definitions parse, runbooks have required sections | Linters (terraform validate, kubeval), file checks |

Plus a note that the `custom` profile defines its own verification method in `spec.md`, and that the evaluator falls back to deliverable completeness checks (file existence + section presence) when no domain-specific tooling is available.

## Verification

All checks are content-based inspections of the single target file. No build, no runtime, no browser.

1. **F-004 section exists**: The file contains a "Phase Handoff Protocol" heading (level 2)
2. **F-004 phase coverage**: The section contains a table with rows for all 8 pipeline phases (Discovery & Intake through Deployment & Handover)
3. **F-004 dependency info**: The section contains a phase dependency table or list showing sequential vs parallel relationships
4. **F-004 escalation**: The section documents a scope change escalation procedure
5. **F-005 section exists**: The file contains a "Criteria Key Mapping" heading (level 2)
6. **F-005 all profiles**: The criteria table has rows for all 5 profiles (software, enterprise_architecture, business_analysis, solution_architecture, ops)
7. **F-005 key accuracy**: Each profile row lists exactly 4 keys matching the keys defined in its domain skill's evaluation criteria section
8. **F-006 section exists**: The file contains a "Domain Verification Methods" heading (level 2)
9. **F-006 all profiles**: The verification table has rows for all 5 profiles
10. **F-006 method specificity**: Each profile row has a specific verification method and what-to-check guidance (not generic "check deliverables" for every row)

## Acceptance criteria

Since all deliverables are Markdown documentation added to the index skill, criteria are adapted for documentation artifacts:

- **Product depth**: New sections are substantively useful -- they contain real, accurate information derived from the domain skills, not placeholder text. The handoff protocol reflects the actual pipeline structure. The criteria keys match the installed skills exactly. The verification methods match each domain's actual verification strategy.
- **Functionality**: Every verification check (1-10) passes. Tables render correctly. All 5 profiles and all 8 phases are covered with no omissions.
- **Visual design**: Markdown formatting is consistent with the existing file -- same heading levels, same table style, same backtick conventions for code values. New sections integrate naturally with existing content.
- **Code quality**: Changes are purely additive -- no existing content modified. Sections are concise and non-redundant (they reference domain skills for detail rather than duplicating content). Total addition is proportionate (approximately 60-80 lines).

## Contract checks

### F-004 checks
- `PD-01`: (required) Phase Handoff Protocol section exists with level-2 heading -- verify by grep for `## Phase Handoff Protocol`
- `FN-01`: (required) Required outputs table covers all 8 pipeline phases -- verify by counting phase rows in the table
- `FN-02`: (required) Phase dependency information is present showing sequential vs parallel -- verify by reading the dependency content
- `FN-03`: (required) Scope change escalation procedure is documented -- verify by reading the escalation content

### F-005 checks
- `PD-02`: (required) Criteria Key Mapping section exists with level-2 heading -- verify by grep for `## Criteria Key Mapping`
- `FN-04`: (required) Criteria table has rows for all 5 profiles -- verify by counting profile rows
- `FN-05`: (required) software profile keys are `product_depth`, `functionality`, `visual_design`, `code_quality` -- verify by reading the row
- `FN-06`: (required) enterprise_architecture profile keys are `coherence`, `standards_compliance`, `stakeholder_coverage`, `feasibility` -- verify by reading the row
- `FN-07`: (required) business_analysis profile keys are `completeness`, `traceability`, `stakeholder_alignment`, `feasibility` -- verify by reading the row
- `FN-08`: (required) solution_architecture profile keys are `design_coherence`, `technical_depth`, `integration_clarity`, `implementability` -- verify by reading the row
- `FN-09`: (required) ops profile keys are `operational_readiness`, `automation_coverage`, `reliability_design`, `security_posture` -- verify by reading the row

### F-006 checks
- `PD-03`: (required) Domain Verification Methods section exists with level-2 heading -- verify by grep for `## Domain Verification Methods`
- `FN-10`: (required) Verification table has rows for all 5 profiles -- verify by counting profile rows
- `FN-11`: (required) Each profile has distinct, domain-appropriate verification guidance (not identical text across rows) -- verify by reading each row

### Cross-cutting checks
- `VD-01`: (required) All new tables render correctly in Markdown -- pipes aligned, headers present, no broken formatting -- verify by visual inspection
- `VD-02`: (required) New sections use consistent heading levels and backtick conventions matching the existing file -- verify by comparing with existing sections
- `CQ-01`: (required) No existing content is modified -- only new sections appended -- verify by checking that lines 1-86 of the file are unchanged

## Risks

- **Key accuracy**: The criteria keys must exactly match what each domain skill defines. A typo or wrong key would cause evaluators to produce invalid JSON. Mitigation: keys were verified by grepping each domain skill's evaluation criteria headers during contract preparation.
- **Phase coverage**: The 8 pipeline phases in the existing diagram must all appear in the handoff table. Missing a phase would leave a gap in the protocol. Mitigation: enumerate phases directly from the existing pipeline section in the same file.
- **Section ordering**: New sections append after "Business Analysis Foundation". If future features add more sections, ordering may need adjustment. This is low risk since the file is an index/reference document, not a sequential workflow.
