# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, features.json, plugins/harness-sdlc-suite (structural reference)
- Status: accepted

## Overview

Build **harness-sales-suite**, a new plugin for the harness framework that provides domain-specific evaluation criteria, methodology selection, verification strategies, and sprint contract checklists for sales-oriented workflows. It follows the same structural pattern as `harness-sdlc-suite` (index skill + N domain skills) but targets revenue execution, technical pre-sales, procurement, enablement, and sales operations domains.

The plugin serves sales professionals, pre-sales engineers, proposal managers, enablement teams, and revenue operations analysts who use the harness framework to plan, execute, and evaluate sales-related deliverables.

## Design Direction

- Mirror the proven index-skill-plus-domain-skills architecture of `harness-sdlc-suite`
- Each domain skill follows the 6-core-section pattern: methodology selection, generator first-action table, verification strategy, deliverable verification, evaluation criteria (4 criteria with 0-5 anchors), sprint contract checklists + anti-patterns
- Optional extended sections (7-10) added where they provide genuine value: reference materials, notation guide, repository structure, anti-patterns
- Consistent voice: authoritative, practitioner-oriented, no filler
- Every methodology table, criteria anchor, and checklist must be grounded in real sales frameworks (MEDDPICC, APMP/Shipley, Challenger, etc.) -- no generic placeholders

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: SKILL.md files, plugin.json, markdown documentation
- Stakeholder lens: Harness users (sales professionals using the framework), plugin developers

Note: The project itself is software development (building a plugin). The plugin's contents define sales domain profiles, but the harness evaluates the build using the software profile.

## Shipped Scope

### F-001: Plugin scaffold + index skill (harness-sales-suite)
Create `plugins/harness-sales-suite/.claude-plugin/plugin.json` and `plugins/harness-sales-suite/skills/harness-sales-suite/SKILL.md`. The index skill provides:
- Domain profile table (5 profiles with criteria, artifact types, stakeholder lens)
- Domain skill routing table (profile -> skill name -> relative path)
- End-to-end sales pipeline diagram (discovery -> qualification -> validation -> proposal -> negotiation -> close -> onboard)
- Phase routing table (deal types mapped to phases and security levels)
- Cross-domain composability rules
- Domain skills summary table

### F-002: Core sales domain skill (harness-sales)
Create `plugins/harness-sales-suite/skills/harness-sales/SKILL.md` with all 6 core sections:
- Methodology: MEDDPICC, Challenger, SPIN, Sandler, BANT with selection guidance
- Generator first-action table for sales deliverables
- Verification: qualification scorecard validation, pipeline hygiene, deal documentation
- Deliverable verification: opportunity plans, proposals, close plans
- Evaluation criteria: qualification_depth, pipeline_coverage, deal_documentation, close_readiness (0-5 anchors)
- Sprint contract checklists + anti-patterns

### F-003: Tender management domain skill (harness-tm)
Create `plugins/harness-sales-suite/skills/harness-tm/SKILL.md` with all 6 core sections:
- Methodology: APMP/Shipley capture management, color team reviews
- Generator first-action table for tender deliverables
- Verification: compliance matrix validation, response completeness, win theme consistency
- Deliverable verification: RFP responses, compliance matrices, executive summaries
- Evaluation criteria: compliance_coverage, response_completeness, win_theme_clarity, submission_readiness (0-5 anchors)
- Sprint contract checklists + anti-patterns

### F-004: Sales engineering domain skill (harness-se)
Create `plugins/harness-sales-suite/skills/harness-se/SKILL.md` with all 6 core sections:
- Methodology: Demo-led, POC-driven, solution design
- Generator first-action table for SE deliverables
- Verification: demo script validation, POC acceptance criteria, technical fit assessment
- Deliverable verification: demo scripts, POC plans, solution architectures, integration guides
- Evaluation criteria: demo_completeness, technical_validation, solution_documentation, integration_clarity (0-5 anchors)
- Sprint contract checklists + anti-patterns

### F-005: Sales enablement domain skill (harness-sen)
Create `plugins/harness-sales-suite/skills/harness-sen/SKILL.md` with all 6 core sections:
- Methodology: Content-first, coaching-first, certification-based
- Generator first-action table for enablement deliverables
- Verification: content coverage audit, audience alignment, adoption metrics
- Deliverable verification: playbooks, battle cards, training curricula, certification programs
- Evaluation criteria: content_coverage, audience_relevance, adoption_measurability, maintenance_sustainability (0-5 anchors)
- Sprint contract checklists + anti-patterns

### F-006: Sales operations domain skill (harness-so)
Create `plugins/harness-sales-suite/skills/harness-so/SKILL.md` with all 6 core sections:
- Methodology: RevOps, data-driven, process-first
- Generator first-action table for sales ops deliverables
- Verification: data model validation, process documentation completeness, reporting accuracy
- Deliverable verification: forecast models, pipeline reports, process maps, territory plans
- Evaluation criteria: data_completeness, process_documentation, reporting_accuracy, scalability_design (0-5 anchors)
- Sprint contract checklists + anti-patterns

### F-007: Integration testing + cross-skill consistency
- All 5 domain skills follow identical section structure
- Index skill routing table correctly resolves all 5 domain skills
- Criteria names in domain skills match index profile table exactly
- Methodology tables have consistent column structure across all skills
- Anti-pattern lists are domain-specific (not copy-pasted generics)
- No broken relative paths in routing table

### F-008: Security review + README
- plugin.json contains no secrets or sensitive defaults
- SKILL.md files contain no hardcoded customer data, pricing, or competitive intel
- Sales-specific security guidance: data classification for deal data, customer PII handling notes, competitive intel protection
- README.md for the plugin (if requested by user -- otherwise skip)

## User Stories

- As a sales professional using harness, I want domain-specific evaluation criteria so my deal documentation is graded on qualification depth and close readiness, not code quality.
- As a proposal manager, I want APMP/Shipley methodology guidance built into my sprint contracts so I follow industry-standard capture management processes.
- As a sales engineer, I want POC-driven verification checklists so my demo scripts and solution architectures are evaluated against technical validation standards.
- As an enablement lead, I want content coverage and adoption measurability criteria so my playbooks and training materials are evaluated for real-world effectiveness.
- As a RevOps analyst, I want data completeness and reporting accuracy criteria so my forecast models and pipeline reports meet operational rigor standards.
- As a harness plugin developer, I want the sales suite to follow the exact same structural pattern as the SDLC suite so I can maintain both consistently.

## Execution Strategy
- Variant: Variant A (sprinted)
- Mode: supervised
- Expected sprint count: 4
- Default target ordering: F-001 -> F-002 -> F-003 -> F-004 -> F-005 -> F-006 -> F-007 -> F-008
- Multi-feature sprint policy: Sprints 1 and 2 each target 2-3 features that share structural dependencies. Grouping waiver required in each proposal explaining why co-implementation reduces risk (e.g., index skill must exist before domain skills can be verified against its routing table).
- Simplification policy: If a domain skill blocks for 2+ rounds, reduce optional extended sections (7-10) to stubs and ship core sections (1-6) only. Do not remove evaluation criteria anchors or contract checklists -- those are the primary value.
- Methodology: agile

### Sprint Plan

**Sprint 1: Foundation + user priorities (F-001, F-002, F-003)**
- plugin.json + index skill scaffold
- Core sales skill (harness-sales) -- user's primary domain
- Tender management skill (harness-tm) -- user's secondary priority
- Rationale: Index must exist first; sales + tender are user's stated priorities

**Sprint 2: Technical validation + enablement (F-004, F-005)**
- Sales engineering skill (harness-se)
- Sales enablement skill (harness-sen)
- Rationale: Both are internally focused skills with lighter cross-dependencies

**Sprint 3: Operations + integration (F-006, F-007)**
- Sales operations skill (harness-so)
- Cross-skill consistency validation across all 5 domain skills + index
- Rationale: Operations is the last domain skill; integration testing validates the complete suite

**Sprint 4: Security + polish (F-008)**
- Security review of all files
- README update if user requests
- Final consistency pass
- Rationale: Security review requires all content to exist first

## High-Level Technical Design

### Plugin Structure
```
plugins/harness-sales-suite/
  .claude-plugin/
    plugin.json                          # Plugin metadata (name, version, skills path)
  skills/
    harness-sales-suite/
      SKILL.md                           # Index skill: routing, pipeline, profiles
    harness-sales/
      SKILL.md                           # Core sales domain skill
    harness-se/
      SKILL.md                           # Sales engineering domain skill
    harness-tm/
      SKILL.md                           # Tender management domain skill
    harness-sen/
      SKILL.md                           # Sales enablement domain skill
    harness-so/
      SKILL.md                           # Sales operations domain skill
```

### File Conventions
- Each SKILL.md uses YAML frontmatter (name, description) matching the SDLC pattern
- Index skill SKILL.md: ~200-300 lines (tables + pipeline diagram + routing)
- Domain skill SKILL.md: ~400-600 lines each (6 core sections + optional extensions)
- plugin.json: standard harness plugin format with `"skills": ["./skills/"]`

### Domain Profile Registry (defined in index skill)

| Profile | Criteria | Artifact Types | Stakeholder Lens |
|---------|----------|---------------|-----------------|
| `sales` | qualification_depth, pipeline_coverage, deal_documentation, close_readiness | Opportunity plans, proposals, close plans | AE, Sales Manager |
| `sales_engineering` | demo_completeness, technical_validation, solution_documentation, integration_clarity | Demo scripts, POC plans, solution architectures | Sales Engineer, Pre-sales |
| `tender_management` | compliance_coverage, response_completeness, win_theme_clarity, submission_readiness | RFP responses, compliance matrices, executive summaries | Proposal Manager, Bid Manager |
| `sales_enablement` | content_coverage, audience_relevance, adoption_measurability, maintenance_sustainability | Playbooks, battle cards, training curricula | Enablement, Product Marketing |
| `sales_operations` | data_completeness, process_documentation, reporting_accuracy, scalability_design | Forecast models, pipeline reports, process maps | Sales Ops, RevOps |

### Sales Pipeline (defined in index skill)

```
Lead / Opportunity
    |
    +- Phase 1: Discovery & Qualification    (harness-sales)
    +- Phase 2: Technical Validation         (harness-se)
    +- Phase 3: Formal Procurement           (harness-tm)
    +- Phase 4: Enablement & Readiness       (harness-sen)
    +- Phase 5: Revenue Operations           (harness-so)
    +- Phase 6: Negotiation & Close          (harness-sales)
    |
    v
Closed Deal / Onboarding
```

## Non-Goals

- Runtime code: This plugin contains only SKILL.md files and plugin.json. No executable code, no scripts, no tests of the plugin itself (the harness framework loads SKILL.md as documentation).
- CRM integration: No Salesforce, HubSpot, or Dynamics connectors. The plugin provides evaluation criteria and methodology guidance, not tool integration.
- Customer-specific content: No real customer names, deal data, pricing, or competitive intelligence in any file.
- Automated sales workflows: The plugin guides human evaluation of sales deliverables; it does not automate sales processes.
- Modifying harness core: No changes to the core harness plugin, scripts, or existing SDLC suite.
- Training data or ML models: No predictive analytics, lead scoring models, or AI-generated sales content.

## Definition of Done

All of the following must be true:
1. `plugins/harness-sales-suite/.claude-plugin/plugin.json` exists and follows harness plugin format
2. Index skill (`harness-sales-suite/SKILL.md`) contains domain profile table, routing table, pipeline diagram, and phase routing
3. All 5 domain skills exist with complete 6-core-section structure
4. Every evaluation criterion has 0-5 anchor descriptions (not placeholders)
5. Every methodology table has selection guidance grounded in named real-world frameworks
6. Cross-skill consistency: criteria names in domain skills match index profile table exactly
7. No broken relative paths in routing table
8. No hardcoded customer data, pricing, or competitive intel in any file
9. All features F-001 through F-008 pass evaluation with scores >= 3 on all criteria

## Security Context
- data_sensitivity: confidential (plugin content discusses handling of pricing, customer data, competitive intel)
- external_exposure: none (internal plugin, not a public-facing service)
- auth_model: none (static documentation files, no authentication)
- compliance: none
