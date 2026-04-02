# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/spec.md, .harness/features.json, plugins/harness/skills/harness-ea/SKILL.md
- Status: in_review

## Target feature IDs
- F-001

## Goal
Create `plugins/harness/skills/harness-ba/SKILL.md` (~350-400 lines) following the 10-section pattern established by `harness-ea/SKILL.md`. This is the Business Analysis domain skill, activated when `domain_profile: business_analysis` is set.

## Deliverables
- `plugins/harness/skills/harness-ba/SKILL.md` — complete SKILL.md file with:
  - YAML frontmatter (name, description)
  - Title + scope paragraph (HOW vs WHEN separation)
  - Activation Check section
  - Section 1: BA Methodology table (Waterfall BA, Agile BA, Lean BA, Design Thinking BA, Six Sigma BA)
  - Section 2: Development Methodology with first-action table (Requirements-First, User-Story-First, Process-First, Data-First, Stakeholder-First)
  - Section 3: Verification Strategy (BA equivalent of testing)
  - Section 4: Deliverable Verification (document structure checks)
  - Section 5: Evaluation Criteria — 4 criteria with complete 0-5 anchor tables:
    - completeness (6 rows: 0-5)
    - traceability (6 rows: 0-5)
    - stakeholder_alignment (6 rows: 0-5)
    - feasibility (6 rows: 0-5)
  - Section 6: Sprint Contract Checklist Templates (5 checklists)
  - Section 7: Reference Materials
  - Section 8: Notation Guide
  - Section 9: Repository Structure
  - Section 10: Anti-patterns

## Verification
- File exists at `plugins/harness/skills/harness-ba/SKILL.md`
- YAML frontmatter present with `name: harness-ba`
- All 10 sections present with correct heading structure
- All 4 evaluation criteria have 6-row (0-5) anchor tables
- Activation Check references `domain_profile: business_analysis`
- BA Methodology table has 5+ methodologies
- Sprint Contract Checklists have 5 templates with checkbox items

## Acceptance criteria
- Product depth: BA-specific content is domain-accurate, not generic filler
- Functionality: All 10 sections present and correctly structured per harness-ea pattern
- Visual design: Tables render correctly, consistent formatting, readable headings
- Code quality: No orphan references, correct cross-references, consistent naming

## Contract checks
- `PD-01`: (required) All 4 evaluation criteria have meaningful, distinct anchor descriptions at each level 0-5
- `FN-01`: (required) File follows exact 10-section structure matching harness-ea pattern
- `VD-01`: (required) All tables have correct Markdown syntax with header separators
- `CQ-01`: (required) YAML frontmatter valid, no broken cross-references

## Risks
- BA domain content accuracy — mitigated by referencing BABOK, IIBA standards
- Structural drift from harness-ea pattern — mitigated by using it as direct template
