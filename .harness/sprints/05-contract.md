# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-1-round5
- Inputs: .harness/spec.md, .harness/features.json, .harness/plan-core-fixes.md, plugins/harness-sdlc-suite/skills/harness-ea/SKILL.md, plugins/harness-sdlc-suite/skills/harness-ba/SKILL.md
- Status: in_review

## Target feature IDs
- F-007
- F-008

## Grouping waiver

Two features are grouped in this sprint. Justification:

1. **Zero overlap**: F-007 modifies `harness-ea/SKILL.md` exclusively; F-008 modifies `harness-ba/SKILL.md` exclusively. No shared files.
2. **Identical change shape**: Both features add new depth sections to an existing domain skill file. The work is additive Markdown authoring with no structural refactoring.
3. **Approved plan**: `plan-core-fixes.md` explicitly schedules Sprint 3 as "F-007 + F-008 (EA + BA depth)".
4. **Risk reduction**: Grouping saves a full round. Splitting would produce two near-identical contract/evaluate cycles with no additional safety benefit.

## Goal

Add practical depth sections to the EA and BA domain skills so that generators and evaluators working in those domains have actionable templates, framework guidance, and workflow definitions -- not just methodology selection tables.

## Deliverables

### F-007: EA skill depth (harness-ea/SKILL.md)

Five new sections appended after the existing Section 10:

| Section | Title | Content |
|---------|-------|---------|
| 11 | Zachman Framework Detail | 6x6 matrix template with cell descriptions, sprint mapping guidance (column-per-sprint vs row-per-sprint), decision criteria for when to use Zachman vs TOGAF |
| 12 | FEAF Detail | Phase mapping to harness sprints for all 5 FEAF reference models (Performance, Business, Data, Application, Infrastructure), federal-specific guidance (FedRAMP, FISMA, A-130 compliance integration) |
| 13 | Architecture Decision Record Template | ADR template with fields: ID, Title, Date, Status, Context, Decision, Options Considered, Consequences, Related ADRs. Includes lifecycle states (proposed, accepted, deprecated, superseded) |
| 14 | Tool Guidance | Recommended ArchiMate modeling tools (Archi, Sparx EA, LeanIX, Ardoq), diagram validation checklist for Mermaid/PlantUML output, tool selection criteria table |
| 15 | Stakeholder Workshop Template | Workshop agenda template (purpose, attendees, duration, activities), attendee role matrix, expected outputs per workshop type (vision, review, sign-off) |

### F-008: BA skill depth (harness-ba/SKILL.md)

Four new sections appended after the existing Section 10:

| Section | Title | Content |
|---------|-------|---------|
| 11 | Elicitation Interview Template | Stakeholder interview guide with preparation checklist, question categories (open, probing, clarifying, confirming), interview script template, post-interview documentation format |
| 12 | Prioritization Templates | Three sub-sections: MoSCoW matrix template with classification criteria, Kano model survey template with feature classification rules, Weighted scoring model with criteria/weight/score table |
| 13 | Requirements Sign-Off Workflow | Approval stages (draft, internal review, stakeholder review, approved, baselined), change control procedure (change request form, impact assessment, approval authority matrix), version management rules |
| 14 | Traceability Matrix Template | Four-column matrix template (Requirement ID, Feature/Capability, Test Case, Acceptance Criteria), usage instructions, completeness validation rules, orphan detection guidance |

## Verification

### F-007 checks

1. **Zachman present**: Grep `harness-ea/SKILL.md` for "Zachman Framework Detail" heading -- exists
2. **Zachman matrix**: The section contains a 6x6 matrix or table referencing the six interrogatives (What/How/Where/Who/When/Why) and at least 3 audience levels
3. **FEAF present**: Grep for "FEAF Detail" heading -- exists
4. **FEAF phases**: The section maps all 5 FEAF reference models to harness sprint phases
5. **ADR template present**: Grep for "Architecture Decision Record Template" heading -- exists
6. **ADR fields**: Template contains at minimum: Status, Context, Decision, Consequences
7. **Tool guidance present**: Grep for "Tool Guidance" heading -- exists
8. **Tool list**: Section names at least 3 ArchiMate-capable tools
9. **Workshop template present**: Grep for "Stakeholder Workshop Template" heading -- exists
10. **Workshop agenda**: Template includes agenda, attendees, and outputs

### F-008 checks

11. **Elicitation present**: Grep `harness-ba/SKILL.md` for "Elicitation Interview Template" heading -- exists
12. **Interview guide**: Section contains question categories and a script or guide structure
13. **Prioritization present**: Grep for "Prioritization Templates" heading -- exists
14. **Three methods**: Section covers MoSCoW, Kano, and weighted scoring (all three named)
15. **Sign-off present**: Grep for "Requirements Sign-Off Workflow" heading -- exists
16. **Approval stages**: Section defines at least 3 approval stages and a change control procedure
17. **Traceability present**: Grep for "Traceability Matrix Template" heading -- exists
18. **Matrix columns**: Template traces from Requirement through Feature through Test to Acceptance

## Acceptance criteria

Domain profile is `software` per spec.md. Criteria:

- **Product depth**: New sections provide actionable templates and guidance, not just placeholder headings. Each section contains enough detail that a generator or evaluator could use it without external references. Score 3+ required.
- **Functionality**: All 18 verification checks pass. No existing content in either SKILL.md is broken or removed. Score 3+ required.
- **Visual design**: Consistent Markdown formatting with existing sections (table style, heading hierarchy, horizontal rules between sections). Score 3+ required.
- **Code quality**: Clean Markdown -- no broken links, no orphan references, no inconsistent heading levels. Content is factually accurate for the named frameworks and methodologies. Score 3+ required.

## Contract checks

| ID | Required | Check | Verification |
|----|----------|-------|--------------|
| PD-01 | required | EA sections contain actionable templates, not just descriptions | Read each new section; verify at least one usable template per section (matrix, form, checklist, or table) |
| PD-02 | required | BA sections contain actionable templates, not just descriptions | Read each new section; verify at least one usable template per section |
| FN-01 | required | All 10 F-007 verification checks pass | Grep + read verification per checks 1-10 |
| FN-02 | required | All 8 F-008 verification checks pass | Grep + read verification per checks 11-18 |
| FN-03 | required | Existing content in both SKILL.md files is preserved | Diff shows only additions, no deletions of prior content |
| VD-01 | required | Formatting consistent with existing sections | Heading hierarchy (##, ###), horizontal rules between sections, table pipe alignment follow the same pattern as Sections 1-10 |
| CQ-01 | required | Framework references are factually accurate | Zachman interrogatives correct, FEAF models correct, TOGAF comparison fair, MoSCoW/Kano/weighted scoring described accurately |
| CQ-02 | advisory | No Markdown lint warnings | Heading levels sequential, no trailing whitespace, blank lines around headings |

## Risks

- **Length**: Adding 5+4 sections to already-long files may push them past comfortable reading length. Mitigation: keep each section focused and concise -- templates over prose.
- **Framework accuracy**: Zachman and FEAF details must be factually correct. Mitigation: CQ-01 check requires evaluator to verify framework references.
- **Consistency with existing style**: New sections must match the tone and structure of Sections 1-10. Mitigation: VD-01 check enforces formatting parity.
