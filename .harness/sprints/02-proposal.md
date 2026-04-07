# Sprint Proposal

## Metadata
- Role: generator
- Agent: coordinator-inline-1
- Inputs: .harness/spec.md, .harness/features.json, 01-eval.json
- Status: accepted

## Target feature IDs
- F-002

## Goal
Create the core sales domain skill (harness-sales) with all 6 core sections following the SDLC suite domain skill pattern. This skill covers MEDDPICC/Challenger/SPIN/Sandler/BANT methodologies for revenue execution, with evaluation criteria for qualification depth, pipeline coverage, deal documentation, and close readiness.

## Deliverables
1. `plugins/harness-sales-suite/skills/harness-sales/SKILL.md` with:
   - YAML frontmatter (name: harness-sales, quoted description)
   - Section 1: Sales Methodology (MEDDPICC, Challenger, SPIN, Sandler, BANT with selection table)
   - Section 2: Development Methodology (generator first-action table for sales deliverables)
   - Section 3: Verification Strategy (qualification scorecard, pipeline hygiene, deal documentation)
   - Section 4: Deliverable Verification (opportunity plans, proposals, close plans, mutual action plans)
   - Section 5: Evaluation Criteria (qualification_depth, pipeline_coverage, deal_documentation, close_readiness with 0-5 anchors)
   - Section 6: Sprint Contract Checklists + Anti-patterns (happy ears, single-threading, premature discounting, ghosted pipeline, demo before discovery, no mutual action plan)

## Verification
1. File exists at correct path
2. YAML frontmatter parses with name + quoted description
3. All 6 sections present with correct headings
4. Section 5 has 4 criteria with 0-5 anchor tables (6 rows each)
5. Section 1 has MEDDPICC, Challenger, SPIN, Sandler, BANT in methodology table
6. Section 6 has at least 6 anti-patterns with penalties
7. Security considerations embedded in checklists (pricing confidentiality, customer PII)

## Acceptance criteria
- Product depth: Complete 6-section structure with domain-specific content, not generic
- Functionality: Criteria names match index skill exactly, methodology table grounded in real frameworks
- Visual design: Consistent section formatting matching SDLC domain skill pattern
- Code quality: Valid YAML, no broken references, consistent naming

## Contract checks
- `PD-01` (required): All 6 sections present with domain-specific content
- `FN-01` (required): 4 evaluation criteria with complete 0-5 anchor tables
- `FN-02` (required): 5 methodologies (MEDDPICC, Challenger, SPIN, Sandler, BANT) in selection table
- `VD-01` (advisory): Section formatting matches harness-sdlc/SKILL.md pattern
- `CQ-01` (required): YAML frontmatter valid, security anti-patterns present

## Risks
- Methodology descriptions must be practitioner-accurate, not generic summaries
- Anti-pattern penalties must reference correct criteria names
