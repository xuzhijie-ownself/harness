# Builder Report

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: accepted contract 02-contract.md, spec.md, features.json, harness-ea/SKILL.md template
- Status: completed

## Target feature IDs
- F-002

## Implemented
- Created `plugins/harness/skills/harness-sa/SKILL.md` (~390 lines)
- YAML frontmatter with name: harness-sa and description
- Title + scope paragraph distinguishing SA from EA (solution-level vs enterprise-level)
- Activation Check section (verifies domain_profile: solution_architecture)
- Section 1: SA Methodology table with 5 frameworks (C4 Model, Arc42, 4+1 View, DDD, Microservices Patterns)
- Section 2: Development Methodology with first-action table (API-First, Component-First, Data-First, Event-First, Contract-First)
- Section 3: Verification Strategy with SA-equivalent testing table
- Section 4: Deliverable Verification with C4 Level Gate Checks and Arc42 Section Gate Checks
- Section 5: Evaluation Criteria — 4 criteria each with complete 0-5 anchor tables
- Section 6: Sprint Contract Checklists — 5 templates (Context & Constraints, Component Design, API Design, Data Design, NFR & Capacity)
- Section 7: Reference Materials with architecture patterns, cloud references, and integration patterns tables
- Section 8: Notation Guide with C4 diagram conventions, sequence diagram guidelines, component diagram standards
- Section 9: Repository Structure with solution-architecture/ directory layout
- Section 10: Anti-patterns table with 8 SA-specific anti-patterns

## Commands run
- mkdir for harness-sa directory
- File creation via Write tool

## Self-check
- All 10 sections present matching harness-ea pattern
- All 4 evaluation criteria have 6-row (0-5) anchor tables
- SA vs EA distinction clearly stated in scope section
- Content is solution-architecture-specific, not reusing EA content

## Suggested feature updates
- F-002 may now pass
