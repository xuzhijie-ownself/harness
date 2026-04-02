# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/spec.md, .harness/features.json, 01-evaluation.json, harness-ea/SKILL.md
- Status: in_review

## Target feature IDs
- F-002

## Goal
Create `plugins/harness/skills/harness-sa/SKILL.md` (~350-400 lines) following the 10-section pattern. This is the Solution Architecture domain skill, activated when `domain_profile: solution_architecture` is set. Distinct from harness-ea (enterprise architecture): SA focuses on a single solution's technical design.

## Deliverables
- `plugins/harness/skills/harness-sa/SKILL.md` — complete SKILL.md file with:
  - YAML frontmatter (name, description)
  - Title + scope paragraph (HOW vs WHEN separation)
  - Activation Check section (domain_profile: solution_architecture)
  - Section 1: SA Methodology table (C4 Model, Arc42, 4+1 View, Domain-Driven Design, Microservices Patterns)
  - Section 2: Development Methodology with first-action table (API-First, Component-First, Data-First, Event-First, Contract-First)
  - Section 3: Verification Strategy (SA equivalent of testing)
  - Section 4: Deliverable Verification (design document checks)
  - Section 5: Evaluation Criteria — 4 criteria with complete 0-5 anchor tables:
    - design_coherence (6 rows: 0-5)
    - technical_depth (6 rows: 0-5)
    - integration_clarity (6 rows: 0-5)
    - implementability (6 rows: 0-5)
  - Section 6: Sprint Contract Checklist Templates (5 checklists)
  - Section 7: Reference Materials
  - Section 8: Notation Guide
  - Section 9: Repository Structure
  - Section 10: Anti-patterns

## Verification
- File exists at `plugins/harness/skills/harness-sa/SKILL.md`
- YAML frontmatter present with `name: harness-sa`
- All 10 sections present with correct heading structure
- All 4 evaluation criteria have 6-row (0-5) anchor tables
- Activation Check references `domain_profile: solution_architecture`
- SA Methodology table has 5 methodologies
- Sprint Contract Checklists have 5 templates

## Acceptance criteria
- Product depth: SA-specific content distinct from EA, covering solution-level design concerns
- Functionality: All 10 sections present per harness-ea pattern
- Visual design: Tables render correctly, consistent formatting
- Code quality: No orphan references, correct cross-references

## Contract checks
- `PD-01`: (required) All 4 criteria have meaningful anchor descriptions distinct from harness-ea criteria
- `FN-01`: (required) File follows exact 10-section structure
- `VD-01`: (required) All tables have correct Markdown syntax
- `CQ-01`: (required) YAML frontmatter valid, no broken references

## Risks
- Confusion with harness-ea scope — mitigated by clear "solution-level, not enterprise-level" scoping
