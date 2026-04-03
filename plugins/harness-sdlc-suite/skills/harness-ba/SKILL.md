---
name: harness-ba
description: Business Analysis domain skill for the harness plugin. Provides BA methodology selection (Waterfall BA, Agile BA, Lean BA, Design Thinking BA, Six Sigma BA), development methodology (Requirements-First, User-Story-First, Process-First, Data-First, Stakeholder-First), verification strategy, deliverable verification, evaluation criteria (completeness, traceability, stakeholder_alignment, feasibility), and sprint contract checklist templates. Activated when domain_profile is "business_analysis".
---

# Business Analysis Domain Skill

> **Domain-specific.** This skill provides the HOW for business analysis projects. The harness provides the WHEN (orchestration, sprint contracts, feature ledger). This skill provides the HOW (methodology selection, development methodology, deliverable verification, evaluation criteria anchors, and BA-specific patterns).

Activated when `domain_profile: business_analysis` is declared in `.harness/spec.md`.

## Scope of This Skill

This skill covers the full Business Analysis lifecycle:
- **Elicitation**: Stakeholder interviews, workshops, document analysis, observation
- **Analysis**: Requirements modeling, gap analysis, impact assessment, feasibility studies
- **Specification**: BRDs, use cases, user stories, process models, data dictionaries
- **Validation**: Requirements traceability, stakeholder sign-off, completeness audits
- **Management**: Change control, version management, requirements baseline

It is methodology-agnostic at its core — any of the supported approaches can be selected. Agile BA is the default because it provides the most natural mapping to harness sprint boundaries.


## Activation Check

This skill activates when `domain_profile: business_analysis` is set in `.harness/spec.md` or `.harness/state.json`.

Before using this skill's procedures:
1. Verify the project produces BA deliverables (BRDs, use cases, process maps, data dictionaries — not primarily code)
2. Read spec.md -> identify the selected BA methodology (Waterfall, Agile, Lean, etc.)
3. If no methodology specified -> default to Agile BA
4. Check if `business-analysis/` directory exists -> if yes, verify against the Repository Structure (Section 9)
5. Identify the industry context -> select appropriate reference frameworks from Section 7

---

## Section 1: BA Methodology

Select based on project characteristics during `/harness:start`:

| Methodology | When to Use | Phase Structure | Harness Mapping |
|-------------|-------------|-----------------|-----------------|
| Waterfall BA | Regulated industries, fixed-scope contracts | Inception, Elaboration, Construction, Transition | 1 sprint = 1 phase deliverable set |
| Agile BA | Iterative delivery, evolving requirements | Discovery, Elaboration, Delivery, Validation | 1 sprint = 1 user story cluster |
| Lean BA | Startup/MVP, hypothesis-driven | Problem, Solution, Validate, Pivot/Persevere | 1 sprint = 1 hypothesis + validation |
| Design Thinking BA | User-centric projects, innovation | Empathize, Define, Ideate, Prototype, Test | 1 sprint = 1 design thinking phase |
| Six Sigma BA | Process improvement, quality focus | Define, Measure, Analyze, Improve, Control (DMAIC) | 1 sprint = 1 DMAIC phase |

**Default:** Agile BA (if not specified by user).

The planner writes the selected methodology into `spec.md` during initialization. The coordinator uses the mapping to structure sprint boundaries accordingly.

---

## Section 2: Business Analysis Development Methodology

Select based on project type and stakeholder needs:

| Methodology | When to Use | How It Drives the Generator |
|-------------|-------------|----------------------------|
| Requirements-First | Compliance, regulated, audit-heavy | Generator documents formal requirements FIRST (BRD sections, acceptance criteria), then derives use cases and process models |
| User-Story-First | Agile teams, user-facing products | Generator writes user stories FIRST (persona, goal, acceptance criteria), then derives process flows and data needs |
| Process-First | Business process reengineering | Generator maps current-state processes FIRST (BPMN), then identifies improvement opportunities and requirements |
| Data-First | Data migration, analytics, master data | Generator defines data entities and relationships FIRST (ERD, data dictionary), then derives business rules and processes |
| Stakeholder-First | Political/complex organizations | Generator maps stakeholder concerns and influence FIRST, then derives requirements aligned to stakeholder priorities |

**Default:** Requirements-First for all BA projects (if not specified).

### How Methodology Drives the Harness

The chosen methodology affects every phase:

1. **Generator behavior**: What to produce first (requirements? user stories? process maps?)
2. **Evaluator criteria**: What to prioritize (requirements completeness? story quality? process accuracy?)
3. **Sprint contract**: What acceptance criteria to define (BRD coverage? story acceptance? process validation?)
4. **Artifact types**: What deliverables per sprint (BRDs? user story maps? BPMN diagrams?)

### Generator First-Action Table

| Methodology | Generator produces first | Then |
|-------------|------------------------|------|
| Requirements-First | Business Requirements Document with numbered requirements | Use cases, process models, traceability matrix |
| User-Story-First | User story map with personas and acceptance criteria | Process flows, data requirements, non-functional requirements |
| Process-First | Current-state BPMN process models | Gap analysis, future-state processes, derived requirements |
| Data-First | Conceptual data model and data dictionary | Business rules, data flow diagrams, integration requirements |
| Stakeholder-First | Stakeholder register with concerns and influence matrix | Prioritized requirements aligned to stakeholder needs |

---

## Section 3: Verification Strategy (BA Equivalent of Testing)

| Verification Type | BA Equivalent | Method |
|-------------------|--------------|--------|
| Unit test | Requirement validation | Each requirement has a unique ID, is testable, unambiguous, and traced to a business need |
| Integration test | Cross-document consistency | References between BRD, use cases, and process models resolve correctly |
| E2E test | Scenario walkthrough | Business scenario traces through all deliverables without gaps (stakeholder need -> requirement -> use case -> process -> acceptance criteria) |
| Smoke test | Deliverable completeness | Required documents exist and contain all mandatory sections |
| Regression | Standards compliance | BABOK knowledge areas covered, naming conventions followed, template structure maintained |

### Deliverable Completeness Checks

- Does the Business Requirements Document exist with all mandatory sections?
- Are all stakeholder concerns mapped to requirements?
- Does each requirement have a unique ID and acceptance criteria?
- Are all business processes modeled with correct BPMN notation?
- Does the traceability matrix link business needs to requirements to test cases?
- Is the glossary consistent across all documents?

---

## Section 4: Deliverable Verification (Equivalent of Build/Runtime)

Since BA produces documents, not running software, "build verification" means:

| Check | What to Verify | How |
|-------|---------------|-----|
| Document structure | Required sections present per template | Check headings/sections against BA document template |
| Cross-references | References between documents resolve | Grep for requirement IDs, verify targets exist in traceability matrix |
| Requirement quality | Each requirement is SMART (Specific, Measurable, Achievable, Relevant, Time-bound) | Pattern-check requirement text for ambiguous words ("should", "may", "etc.") |
| Naming conventions | Consistent naming across artifacts | Pattern matching on requirement IDs (REQ-xxx), use case IDs (UC-xxx), process IDs (BP-xxx) |
| Traceability | Business needs to requirements to use cases to test cases | Traceability matrix completeness check — no orphan requirements |
| Stakeholder coverage | All identified stakeholders have requirements addressed | Cross-reference stakeholder register with requirements ownership |
| Glossary consistency | Terms defined once and used consistently | Check glossary entries against document usage |

### BRD Section Gate Checks

| Section | Required Content |
|---------|-----------------|
| Executive Summary | Problem statement, proposed solution, business value |
| Stakeholders | Register with roles, concerns, influence, communication plan |
| Business Context | Current state, pain points, opportunity description |
| Scope | In-scope items, out-of-scope items, assumptions, constraints |
| Requirements | Functional requirements (numbered), non-functional requirements, business rules |
| Use Cases | Primary use cases with actors, preconditions, main flow, alternate flows |
| Process Models | Current-state and future-state BPMN diagrams |
| Data Requirements | Conceptual data model, data dictionary, data quality rules |
| Acceptance Criteria | Measurable criteria for each requirement group |
| Appendices | Glossary, traceability matrix, references |

---

## Section 5: Evaluation Criteria (Business Analysis Profile)

The 4 primary criteria for the `business_analysis` domain profile. The evaluator MUST use these anchors for consistent scoring across sprints.

### completeness (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent — no requirements or BA deliverables produced |
| 1 | Severely incomplete — some requirements listed but no structure, missing major sections |
| 2 | Below acceptable — requirements exist but significant gaps in coverage, missing stakeholder needs or non-functional requirements |
| 3 | Acceptable — all mandatory BRD sections present, functional and non-functional requirements documented, no critical gaps |
| 4 | Strong — comprehensive requirements with edge cases addressed, complete use cases, thorough data requirements |
| 5 | Excellent — exhaustive coverage including business rules, exception flows, data quality rules, and measurable acceptance criteria for every requirement |

### traceability (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent — no traceability between artifacts |
| 1 | Severely incomplete — requirements exist but no IDs, no links to business needs |
| 2 | Below acceptable — requirement IDs assigned but traceability matrix incomplete or inconsistent |
| 3 | Acceptable — traceability matrix links business needs to requirements, each requirement has a unique ID and source reference |
| 4 | Strong — bidirectional traceability from business needs through requirements to use cases and acceptance criteria, no orphan requirements |
| 5 | Excellent — full forward and backward traceability with impact analysis capability, every requirement traced from business driver to test case, change impact paths documented |

### stakeholder_alignment (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent — no stakeholder analysis performed |
| 1 | Severely incomplete — stakeholders mentioned but not systematically identified or analyzed |
| 2 | Below acceptable — stakeholder register exists but concerns not mapped to requirements, no communication plan |
| 3 | Acceptable — all key stakeholders identified with roles and concerns, requirements address stated concerns, sign-off readiness evident |
| 4 | Strong — stakeholder influence matrix complete, conflicting concerns resolved with documented rationale, prioritization reflects stakeholder input |
| 5 | Excellent — stakeholder concerns systematically traced to requirements, conflict resolution documented, communication plan active, feedback incorporated into requirements |

### feasibility (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent — requirements are unrealistic or no feasibility consideration |
| 1 | Severely incomplete — requirements exist but no resource, timeline, or technical feasibility assessment |
| 2 | Below acceptable — some feasibility notes but no systematic analysis, risks not identified |
| 3 | Acceptable — requirements are implementable, key risks identified, resource and timeline estimates reasonable |
| 4 | Strong — detailed feasibility analysis with risk mitigations, phased implementation plan, technology constraints documented |
| 5 | Excellent — proven feasibility with comparable case studies, detailed risk register with quantified impact, contingency plans, and stakeholder agreement on trade-offs |

---

## Section 6: Sprint Contract Checklist Templates

Pre-built checklists for 5 BA phases. The generator includes the relevant checklist(s) in each sprint contract. The evaluator uses them as acceptance criteria.

### For Requirements Elicitation

- [ ] Stakeholder register identifies all key stakeholders with roles and influence
- [ ] Elicitation techniques selected and justified (interviews, workshops, surveys, observation)
- [ ] Business context documented (current state, pain points, opportunities)
- [ ] Scope defined with explicit in-scope, out-of-scope, assumptions, and constraints
- [ ] Initial requirement categories identified (functional, non-functional, business rules)

### For Use Case Development

- [ ] All primary actors identified with descriptions
- [ ] Use cases follow standard template (preconditions, main flow, alternate flows, postconditions)
- [ ] Each use case has a unique ID (UC-xxx) and traced to parent requirement
- [ ] Exception and error flows documented for critical use cases
- [ ] Use case diagram shows actor-use case relationships

### For Process Modeling

- [ ] Current-state ("as-is") processes documented in BPMN notation
- [ ] Future-state ("to-be") processes designed with improvement rationale
- [ ] Process participants (lanes/pools) mapped to organizational roles
- [ ] Decision points (gateways) have documented business rules
- [ ] Process metrics identified (cycle time, throughput, error rate)

### For Gap Analysis

- [ ] Current state documented with evidence (metrics, pain points, stakeholder input)
- [ ] Target state defined with measurable success criteria
- [ ] Gaps identified and categorized (process, technology, people, data)
- [ ] Gap closure actions prioritized by business impact and feasibility
- [ ] Dependencies between gap closure actions identified

### For Stakeholder Review

- [ ] Review package assembled with executive summary
- [ ] Requirements prioritized using agreed method (MoSCoW, weighted scoring, Kano)
- [ ] Open issues list with owners and resolution timeline
- [ ] Sign-off criteria defined and communicated
- [ ] Feedback incorporation plan documented

---

## Section 7: Reference Materials

### Industry Standards

| Standard | Scope | Key Concepts |
|----------|-------|-------------|
| BABOK v3 (IIBA) | BA knowledge areas, techniques, competencies | 6 knowledge areas, 50+ techniques, underlying competencies |
| PMI-PBA | Business analysis in project context | Needs assessment, planning, analysis, traceability, evaluation |
| ISO/IEC 29148 | Requirements engineering standard | Requirements processes, documentation templates, quality attributes |
| IEEE 830 | Software requirements specification | SRS template, requirement characteristics (correct, unambiguous, complete, consistent) |
| TOGAF Business Architecture | Business architecture within EA context | Business capability modeling, value streams, organization mapping |

### Common Frameworks

| Framework | When to Use | Key Deliverables |
|-----------|-------------|-----------------|
| Business Model Canvas | Strategy and innovation projects | 9-block canvas covering value proposition, segments, channels |
| Value Stream Mapping | Process improvement, Lean initiatives | Current and future state value stream maps |
| RACI Matrix | Role clarity and governance | Responsibility assignment for processes and decisions |
| Kano Model | Feature prioritization, product management | Feature classification (must-be, one-dimensional, attractive, indifferent) |
| Jobs-to-be-Done | Customer-centric analysis | Job statements, outcome expectations, underserved needs |

---

## Section 8: Notation Guide

### BPMN Basics

| Element | Symbol | Usage |
|---------|--------|-------|
| Start Event | Circle (thin border) | Beginning of a process flow |
| End Event | Circle (thick border) | Termination of a process flow |
| Task | Rounded rectangle | A unit of work performed by a participant |
| Gateway (Exclusive) | Diamond with X | Decision point — one path selected |
| Gateway (Parallel) | Diamond with + | Fork/join — all paths executed |
| Gateway (Inclusive) | Diamond with O | One or more paths selected |
| Sequence Flow | Solid arrow | Order of activities |
| Message Flow | Dashed arrow | Communication between pools |
| Pool/Lane | Horizontal container | Organization/role boundary |
| Data Object | Document icon | Data input/output for activities |

### Use Case Diagram Conventions

| Element | Representation | Usage |
|---------|---------------|-------|
| Actor | Stick figure | External entity interacting with the system |
| Use Case | Oval/ellipse | A goal the actor achieves using the system |
| System Boundary | Rectangle | Scope of the system under analysis |
| Include | Dashed arrow with <<include>> | Mandatory sub-behavior |
| Extend | Dashed arrow with <<extend>> | Optional/conditional behavior |
| Generalization | Solid arrow with open arrowhead | Actor or use case inheritance |

### Data Flow Notation

| Element | Symbol | Usage |
|---------|--------|-------|
| Process | Circle or rounded rectangle | Transforms data inputs into outputs |
| Data Store | Open-ended rectangle (parallel lines) | Persistent data repository |
| External Entity | Rectangle | Source or destination outside system boundary |
| Data Flow | Arrow with label | Movement of data between elements |

---

## Section 9: Business Analysis Repository Structure

The generator should organize BA deliverables following this repository structure:

```
.harness/
  spec.md                              # BA Statement of Work
  features.json                        # BA deliverable tracker

project-root/
  business-analysis/
    1-elicitation/
      stakeholder-register.md          # Stakeholder identification and analysis
      elicitation-plan.md              # Techniques, schedule, participants
      interview-notes/                 # Raw interview/workshop outputs
      business-context.md              # Current state, pain points, opportunities
    2-requirements/
      brd.md                           # Business Requirements Document
      functional-requirements.md       # Detailed functional requirements (REQ-xxx)
      non-functional-requirements.md   # Performance, security, usability requirements
      business-rules.md                # Business rules catalog
    3-use-cases/
      use-case-model.md                # Use case diagram and overview
      UC-001-*.md                      # Individual use case specifications
      UC-002-*.md
    4-process-models/
      current-state/                   # As-is BPMN process models
      future-state/                    # To-be BPMN process models
      gap-analysis.md                  # Process gaps and improvements
    5-data/
      conceptual-data-model.md         # Entity-relationship overview
      data-dictionary.md               # Field-level data definitions
      data-quality-rules.md            # Validation and quality constraints
    6-validation/
      traceability-matrix.md           # Requirements traceability (needs -> requirements -> use cases -> tests)
      acceptance-criteria.md           # Measurable acceptance criteria
      sign-off-tracker.md             # Stakeholder sign-off status
    glossary.md                        # Consistent term definitions
    diagrams/
      *.bpmn                           # BPMN source files
      *.mermaid                        # Mermaid source files
```

### Repository Completeness Check (Evaluator)

The evaluator verifies repository structure completeness per phase:

| After Phase | Required Directories | Required Files (minimum) |
|-------------|---------------------|-------------------------|
| Elicitation | `1-elicitation/` | stakeholder-register.md, business-context.md |
| Requirements | `2-requirements/` | brd.md, functional-requirements.md |
| Use Cases | `3-use-cases/` | use-case-model.md, at least 1 UC spec |
| Process Modeling | `4-process-models/` | at least 1 current-state model, gap-analysis.md |
| Data Analysis | `5-data/` | conceptual-data-model.md, data-dictionary.md |
| Validation | `6-validation/` | traceability-matrix.md, acceptance-criteria.md |
| Any | root | glossary.md |

---

## Section 10: Business Analysis Anti-Patterns (Evaluator Watch List)

The evaluator should flag these common BA anti-patterns when grading:

| Anti-Pattern | What It Looks Like | Impact | Score Penalty |
|-------------|-------------------|--------|---------------|
| **Requirements Amnesia** | Requirements gathered but not documented or traced | traceability: -2 | Drop traceability to max 2 |
| **Stakeholder Blindspot** | Key stakeholders missing from analysis, only IT consulted | stakeholder_alignment: -2 | Drop stakeholder_alignment to max 2 |
| **Gold Plating** | Excessive detail on low-priority requirements while critical ones are vague | completeness: -1 | Flag as scope risk |
| **Solution Jumping** | Requirements describe a specific solution instead of business needs | feasibility: -1 | Require needs-based rewrite |
| **Scope Creep Enablement** | No explicit out-of-scope list, assumptions undocumented | completeness: -1 | Require scope boundary definition |
| **Ambiguity Tolerance** | Requirements use vague language ("should", "may", "appropriate", "etc.") | completeness: -2 | Cannot verify without measurable criteria |
| **Traceability Theater** | Traceability matrix exists but links are incorrect or incomplete | traceability: -1 | Require matrix validation |
| **Analysis Paralysis** | Attempting exhaustive analysis of every edge case before any validation | feasibility: -1 | Flag as delivery risk |
