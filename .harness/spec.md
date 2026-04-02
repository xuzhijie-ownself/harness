# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, harness-ea/SKILL.md, harness-sdlc/SKILL.md, harness/SKILL.md, plugin.json, release.json
- Status: accepted

## Overview

The long-running-harness plugin (v0.7.0) provides multi-agent sprint orchestration for Claude Code. It currently supports two domain profiles through dedicated domain skills: `software` via `harness-sdlc` and `architecture` via `harness-ea`. Three additional domain profiles listed in the harness's Domain Profiles table -- `business_analysis`, `tender`, and others -- lack dedicated domain skills. Users selecting these profiles fall back to generic evaluation criteria, losing the structured methodology, verification strategy, evaluation anchors, and sprint contract templates that make `harness-sdlc` and `harness-ea` effective.

This project adds three new domain skills and updates the harness framework to route to them, completing the end-to-end delivery workflow pipeline from business analysis through solution design to deployment.

## Problem Statement

The harness declares six built-in domain profiles in its Domain Profiles table but only two have dedicated SKILL.md files providing concrete methodology, evaluation anchors, and verification procedures. When a user selects `business_analysis` as their domain profile, the evaluator has no BA-specific scoring anchors, no requirements traceability verification, and no sprint contract templates for BRD or use-case deliverables. The same gap exists for solution architecture (a distinct concern from enterprise architecture) and deployment/ops workflows.

Without domain skills, the harness falls back to the generic `software` criteria (product_depth, functionality, visual_design, code_quality) which are meaningless for a BA writing a Business Requirements Document or an ops engineer defining a deployment runbook.

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Markdown SKILL.md files, JSON plugin config, Markdown framework docs
- Stakeholder lens: Plugin users (Claude Code operators), harness contributors

## Shipped Scope

### F-001: Business Analysis Domain Skill (harness-ba)
**Priority: high | Required: yes**

Create `plugins/harness/skills/harness-ba/SKILL.md` (~350-400 lines) following the 10-section pattern established by `harness-ea`. The skill activates when `domain_profile: business_analysis` is set.

Sections:
1. **Activation Check** -- verify project produces BA deliverables (BRDs, use cases, process maps), detect methodology
2. **BA Methodology** -- methodology selection table (Waterfall BA, Agile BA, Lean BA, Design Thinking BA, Six Sigma BA) with harness sprint mapping
3. **Development Methodology** -- first-action table (Requirements-First, User-Story-First, Process-First, Data-First, Stakeholder-First) driving generator behavior
4. **Verification Strategy** -- BA equivalent of testing (requirements validation, traceability checks, stakeholder sign-off simulation, completeness audits)
5. **Deliverable Verification** -- document structure checks, cross-reference validation, traceability matrix completeness, glossary consistency
6. **Evaluation Criteria** -- 4 primary criteria with 0-5 anchor descriptions:
   - `completeness` (requirements coverage, no gaps)
   - `traceability` (requirements linked to business needs, features, and test cases)
   - `stakeholder_alignment` (concerns addressed, sign-off readiness)
   - `feasibility` (implementable, resource-aware, risk-identified)
7. **Sprint Contract Checklists** -- templates for: Requirements Elicitation, Use Case Development, Process Modeling, Gap Analysis, Stakeholder Review
8. **Reference Materials** -- industry BA standards (BABOK, IIBA, PMI-PBA) and common frameworks
9. **Notation Guide** -- BPMN basics, use case diagram conventions, data flow notation
10. **Repository Structure** -- `business-analysis/` directory layout for BA deliverables

Steps:
- Create the SKILL.md file at the correct path
- Verify it follows the structural pattern of harness-ea
- Verify all 4 evaluation criteria have complete 0-5 anchor tables
- Verify the frontmatter metadata block is present and correct

### F-002: Solution Architecture Domain Skill (harness-sa)
**Priority: high | Required: yes**

Create `plugins/harness/skills/harness-sa/SKILL.md` (~350-400 lines) following the 10-section pattern. The skill activates when `domain_profile: solution_architecture` is set. This is distinct from `harness-ea` (enterprise architecture): SA focuses on a single solution's technical design, not enterprise-wide capability mapping.

Sections:
1. **Activation Check** -- verify project produces solution design deliverables (HLDs, LLDs, API specs, data models)
2. **SA Methodology** -- methodology selection table (C4 Model, Arc42, 4+1 View, Domain-Driven Design, Microservices Patterns) with harness sprint mapping
3. **Development Methodology** -- first-action table (API-First, Component-First, Data-First, Event-First, Contract-First) driving generator behavior
4. **Verification Strategy** -- SA equivalent of testing (design review, API contract validation, capacity modeling, failure mode analysis)
5. **Deliverable Verification** -- document structure checks, diagram notation validation, API spec linting, data model consistency
6. **Evaluation Criteria** -- 4 primary criteria with 0-5 anchor descriptions:
   - `design_coherence` (components fit together, clear boundaries, consistent patterns)
   - `technical_depth` (non-trivial design decisions, edge cases addressed, scalability considered)
   - `integration_clarity` (APIs well-defined, data flows documented, dependencies explicit)
   - `implementability` (design is buildable, technology choices justified, constraints realistic)
7. **Sprint Contract Checklists** -- templates for: Context & Constraints, Component Design, API Design, Data Design, NFR & Capacity
8. **Reference Materials** -- architecture patterns (microservices, event-driven, CQRS, hexagonal), cloud reference architectures
9. **Notation Guide** -- C4 diagram conventions, sequence diagram guidelines, component diagram standards
10. **Repository Structure** -- `solution-architecture/` directory layout for SA deliverables

Steps:
- Create the SKILL.md file at the correct path
- Verify it follows the structural pattern of harness-ea
- Verify all 4 evaluation criteria have complete 0-5 anchor tables
- Verify the frontmatter metadata block is present and correct

### F-003: Deployment & Ops Domain Skill (harness-ops)
**Priority: medium | Required: yes**

Create `plugins/harness/skills/harness-ops/SKILL.md` (~350-400 lines) following the 10-section pattern. The skill activates when `domain_profile: ops` is set. This covers deployment planning, infrastructure-as-code, CI/CD pipelines, runbooks, and operational readiness.

Sections:
1. **Activation Check** -- verify project produces ops deliverables (runbooks, IaC configs, pipeline definitions, monitoring dashboards)
2. **Ops Methodology** -- methodology selection table (GitOps, Platform Engineering, SRE, DevOps, Infrastructure-as-Code) with harness sprint mapping
3. **Development Methodology** -- first-action table (Pipeline-First, Infrastructure-First, Monitoring-First, Runbook-First, Security-First) driving generator behavior
4. **Verification Strategy** -- ops equivalent of testing (dry-run deployments, config validation, rollback verification, chaos engineering checks)
5. **Deliverable Verification** -- IaC linting, pipeline syntax validation, secret scanning, config drift detection
6. **Evaluation Criteria** -- 4 primary criteria with 0-5 anchor descriptions:
   - `operational_readiness` (runbooks complete, monitoring configured, alerts defined)
   - `automation_coverage` (manual steps minimized, pipelines defined, repeatable)
   - `reliability_design` (rollback plans, health checks, failure recovery documented)
   - `security_posture` (secrets managed, access controlled, compliance addressed)
7. **Sprint Contract Checklists** -- templates for: CI/CD Pipeline, Infrastructure Provisioning, Monitoring & Alerting, Runbook Development, Security Hardening
8. **Reference Materials** -- ops frameworks (DORA metrics, SRE book, Well-Architected Framework, NIST CSF)
9. **Notation Guide** -- infrastructure diagram conventions, pipeline flow notation, network topology standards
10. **Repository Structure** -- `ops/` or `infrastructure/` directory layout for ops deliverables

Steps:
- Create the SKILL.md file at the correct path
- Verify it follows the structural pattern of harness-ea
- Verify all 4 evaluation criteria have complete 0-5 anchor tables
- Verify the frontmatter metadata block is present and correct

### F-004: Phase Routing Table in SKILL.md
**Priority: high | Required: yes | Depends on: F-001, F-002, F-003**

Update `plugins/harness/skills/harness/SKILL.md` to add routing entries for the three new domain skills in the Domain Skill Routing subsection and the Domain Skill References subsection. Also add `solution_architecture` and `ops` to the Domain Profiles table.

Changes:
- Add to Domain Skill Routing: `business_analysis` -> read `harness-ba` skill, `solution_architecture` -> read `harness-sa` skill, `ops` -> read `harness-ops` skill
- Add to Domain Profiles table: rows for `solution_architecture` and `ops` with their criteria, artifact types, and stakeholder lens
- Add to Domain Skill References: paragraphs describing when to read each new skill, following the pattern of the existing `harness-sdlc` and `harness-ea` reference paragraphs

Steps:
- Read current SKILL.md
- Add routing entries in Domain Skill Routing section
- Add rows to Domain Profiles table
- Add reference paragraphs in Domain Skill References section
- Verify no domain-specific logic is added to the planner or coordinator sections (the planner is domain-agnostic)

### F-005: Plugin Registration
**Priority: high | Required: yes | Depends on: F-001, F-002, F-003**

Update `plugins/harness/.claude-plugin/plugin.json` to register the new skill paths so the plugin loader discovers them.

Changes:
- Verify the `skills` array includes the paths for the new domain skills (the current `"./skills/"` glob may already cover them, but verify and add explicit entries if needed)

Steps:
- Read current plugin.json
- Verify skill discovery mechanism
- Add explicit skill paths if the glob pattern does not cover new subdirectories
- Verify JSON is valid after changes

## User Stories

- As a harness user running a BA project, I want to set `domain_profile: business_analysis` and get BA-specific evaluation criteria, methodology options, and sprint contract templates so that my requirements documents are evaluated against meaningful quality anchors rather than software-centric criteria.
- As a harness user designing a single solution, I want a `solution_architecture` profile that provides component design, API design, and data modeling methodology distinct from enterprise-wide TOGAF/Zachman so that my solution design is evaluated at the right level of abstraction.
- As a harness user defining deployment workflows, I want an `ops` profile with IaC, CI/CD, and SRE methodology so that my infrastructure and operational deliverables are evaluated against operational readiness criteria rather than code quality metrics.
- As a harness contributor, I want the main SKILL.md routing table updated so that domain skill routing is automatic and discoverable.

## Execution Strategy

- **Variant**: Variant A (Full-Stack Sprinted Harness)
- **Mode**: supervised
- **Expected sprint count**: 3-4 sprints
  - Sprint 1: F-001 (harness-ba) -- highest priority, establishes the pattern for the other two skills
  - Sprint 2: F-002 (harness-sa) -- second high-priority skill, follows the pattern from sprint 1
  - Sprint 3: F-003 (harness-ops) -- medium priority, same structural pattern
  - Sprint 4: F-004 + F-005 grouped (framework updates) -- these are small integration changes that share a grouping waiver: both modify existing files rather than creating new ones, and both depend on F-001/F-002/F-003 being complete
- **Default target ordering**: F-001 -> F-002 -> F-003 -> F-004+F-005
  - Rationale: the three domain skills are independent and can be built in any order. F-001 is first because BA is the upstream phase in a delivery pipeline. F-004 and F-005 are last because they integrate the skills into the framework and require all three to exist.
- **Multi-feature sprint policy**: one feature per sprint by default. F-004 and F-005 may be grouped because they are both small integration updates to existing files.
- **Simplification policy**: not justified. Each domain skill is a distinct deliverable (~350-400 lines) requiring careful evaluation criteria design. Sprint decomposition ensures each skill is complete and internally consistent before moving on.
- **Methodology**: agile

## High-Level Technical Design

### Artifact Structure
Each new domain skill is a single SKILL.md file in its own directory under `plugins/harness/skills/`:
```
plugins/harness/skills/
  harness-ba/SKILL.md       (new -- F-001)
  harness-sa/SKILL.md       (new -- F-002)
  harness-ops/SKILL.md      (new -- F-003)
  harness/SKILL.md           (modified -- F-004)
  harness-sdlc/SKILL.md     (existing, unchanged)
  harness-ea/SKILL.md        (existing, unchanged)
```

### Structural Pattern
All three new SKILL.md files follow the established 10-section pattern from `harness-ea`:
1. YAML frontmatter with name and description
2. Title + scope paragraph explaining HOW vs WHEN separation
3. Activation Check section
4. Section 1: Methodology selection table
5. Section 2: Development methodology with first-action table
6. Section 3: Verification strategy (domain-appropriate testing equivalent)
7. Section 4: Deliverable verification (domain-appropriate build equivalent)
8. Section 5: Evaluation criteria (4 criteria, 0-5 anchors)
9. Section 6: Sprint contract checklist templates
10. Section 7: Reference materials (industry standards, frameworks)
11. Section 8: Notation/modeling guide
12. Section 9: Repository structure
13. Section 10: Anti-patterns (evaluator watch list)

### Integration Points
- `SKILL.md` Domain Skill Routing section gains 3 new routing entries
- `SKILL.md` Domain Profiles table gains 2 new rows (solution_architecture, ops)
- `SKILL.md` Domain Skill References section gains 3 new reference paragraphs
- `plugin.json` skills array verified to cover new paths
- No changes to the planner, coordinator, generator, or evaluator role files (domain-agnostic constraint)

### Version
- Current: 0.7.0
- Target: 0.8.0 (at least one new feature shipped = minor bump)

## Non-Goals

- Adding domain-specific routing logic to planner.md, coordinator.md, or other role files. The planner is domain-agnostic; routing is handled by SKILL.md's Domain Skill Routing section.
- Creating domain skills for `tender`, `research`, or `content` profiles. These remain in the Domain Profiles table with generic criteria until a future release.
- Modifying the existing `harness-sdlc` or `harness-ea` skills. They are stable at v0.7.0.
- Adding runtime code, TypeScript, or executable components. Domain skills are pure Markdown reference documents.
- Changing the harness's core evaluation loop, feature ledger, or sprint machinery.
- Bumping to v0.8.0 in this run. The releaser agent handles versioning after all features pass.

## Definition of Done

All five features pass evaluator review:
- Each new SKILL.md file exists at the correct path, follows the 10-section pattern, and contains complete 0-5 anchor tables for all 4 evaluation criteria
- The main SKILL.md routes to all three new domain skills
- plugin.json discovers all skill directories
- No domain-specific logic has been added to role files (planner.md, coordinator.md, etc.)
