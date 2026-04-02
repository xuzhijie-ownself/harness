---
name: harness-ea
description: Enterprise Architecture domain skill for the harness plugin. Provides architecture methodology selection (TOGAF, Zachman, FEAF, ArchiMate, SAFe, Lean EA), development methodology (ADR-First, Capability-First, Viewpoint-Driven, Gap Analysis, Reference Architecture), verification strategy, deliverable verification, and evaluation criteria for architecture projects. Activated when domain_profile is "architecture".
---

# Enterprise Architecture Domain Skill

> **Domain-specific.** This skill provides the HOW for enterprise architecture projects. The harness provides the WHEN (orchestration, sprint contracts, feature ledger). This skill provides the HOW (framework selection, development methodology, deliverable verification, evaluation criteria anchors).

Activated when `domain_profile: architecture` is declared in `.harness/spec.md`.

---

## Section 1: Architecture Methodology

Select based on project characteristics during `/harness:init`:

| Framework | When to Use | Phase Structure | Harness Mapping |
|-----------|-------------|-----------------|-----------------|
| TOGAF ADM | Enterprise transformation, IT strategy | Preliminary, Vision, Business, IS, Technology, Opportunities, Migration, Governance | 1 sprint = 1 ADM phase |
| Zachman | Classification/taxonomy, documentation | 6x6 matrix (What/How/Where/Who/When/Why x Scope/Business/System/Technology/Detail/Functioning) | 1 sprint = 1 column or viewpoint |
| FEAF (Federal) | Government/public sector | Performance, Business, Data, Application, Infrastructure | 1 sprint = 1 reference model |
| ArchiMate Modeling | Visualization, stakeholder communication | Business, Application, Technology layers + Strategy/Motivation extensions | 1 sprint = 1 layer or viewpoint |
| SAFe Architecture | Agile + EA blend, large organizations | Architectural Runway + Enablers + Solution Intent | 1 sprint = 1 runway enabler |
| Lean EA | Startup/scale-up, minimal governance | Just-enough architecture, decision records, fitness functions | 1 sprint = 1 decision + validation |

**Default:** TOGAF ADM (if not specified by user).

The planner writes the selected framework into `spec.md` during initialization. The coordinator uses the mapping to structure sprint boundaries accordingly.

---

## Section 2: Architecture Development Methodology

Select based on project type and stakeholder needs:

| Methodology | When to Use | How It Drives the Generator |
|-------------|-------------|----------------------------|
| ADR-First (Architecture Decision Records) | Every project | Generator documents decisions FIRST (context, options, rationale), then builds artifacts around decisions |
| Capability-First | Business transformation | Generator maps business capabilities FIRST, then derives technology components |
| Viewpoint-Driven | Stakeholder-heavy projects | Generator identifies stakeholder concerns FIRST, then creates viewpoints addressing each concern |
| Gap Analysis | Migration/modernization | Generator documents current state FIRST, defines target state, then identifies gaps |
| Reference Architecture | Standards-based | Generator selects reference models FIRST (BIAN for banking, HL7 for healthcare, etc.), then customizes |

**Default:** ADR-First for all architecture projects (if not specified).

### How Methodology Drives the Harness

The chosen methodology affects every phase:

1. **Generator behavior**: What to produce first (decisions? capability maps? viewpoints?)
2. **Evaluator criteria**: What to prioritize (decision rationale quality? capability coverage? viewpoint completeness?)
3. **Sprint contract**: What acceptance criteria to define (ADR completeness? stakeholder coverage? gap identification?)
4. **Artifact types**: What deliverables per sprint (ADRs? capability models? architecture diagrams?)

### Generator First-Action Table

| Methodology | Generator produces first | Then |
|-------------|------------------------|------|
| ADR-First | Decision records with context, options, rationale | Architecture artifacts justified by decisions |
| Capability-First | Business capability map (L0-L2) | Application and technology components mapped to capabilities |
| Viewpoint-Driven | Stakeholder concern register | Viewpoints addressing each concern with appropriate notation |
| Gap Analysis | Current state architecture documentation | Target state definition and gap identification |
| Reference Architecture | Reference model selection and justification | Customized architecture based on selected models |

---

## Section 3: Verification Strategy (Architecture Equivalent of Testing)

| Verification Type | Architecture Equivalent | Method |
|-------------------|----------------------|--------|
| Unit test | ADR validation | Each decision has context, options considered, rationale, consequences |
| Integration test | Viewpoint consistency | Cross-viewpoint references resolve correctly (business capability, application component, technology node) |
| E2E test | Scenario walkthrough | Business scenario traces through all architecture layers without gaps |
| Smoke test | Artifact completeness | Required deliverables exist and are non-empty |
| Regression | Standards compliance | ArchiMate notation correct, TOGAF phases complete, naming conventions followed |

### Artifact Completeness Checks

- Does the Architecture Vision document exist?
- Are all stakeholder concerns mapped to viewpoints?
- Does each capability have at least one supporting application?
- Are all gaps between current and target state identified?
- Do ADRs exist for all significant decisions?

---

## Section 4: Deliverable Verification (Equivalent of Build/Runtime)

Since EA produces documents, not running software, "build verification" means:

| Check | What to Verify | How |
|-------|---------------|-----|
| Document structure | Required sections present | Check headings/sections against template |
| Cross-references | References between documents resolve | Grep for referenced IDs, verify targets exist |
| Diagram notation | ArchiMate/UML notation correct | Mermaid/PlantUML renders without errors |
| Naming conventions | Consistent naming across artifacts | Pattern matching on entity names |
| Traceability | Requirements to Capabilities to Components | Traceability matrix completeness check |
| Stakeholder coverage | All identified stakeholders have viewpoints | Cross-reference stakeholder register with viewpoint list |

### TOGAF Phase Gate Checks

| Phase | Required Deliverables |
|-------|----------------------|
| Preliminary | Architecture Principles, Governance Framework, Tailored ADM |
| A: Vision | Architecture Vision, Stakeholder Map, Value Chain |
| B: Business | Business Architecture, Capability Map, Process Models |
| C: Information Systems | Application Architecture, Data Architecture, Integration Map |
| D: Technology | Technology Architecture, Platform Blueprint, Standards Profile |
| E: Opportunities | Gap Analysis, Migration Factors, Consolidation Roadmap |
| F: Migration | Implementation Roadmap, Work Packages, Transition Architectures |
| G: Governance | Architecture Compliance, Change Requests, Dispensations |
| H: Change Management | Architecture Change Impact, Assessment Criteria |

---

## Section 5: Evaluation Criteria (Architecture Profile)

The 4 primary criteria for the `architecture` domain profile. The evaluator MUST use these anchors for consistent scoring across sprints.

### coherence (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no logical structure |
| 1 | Severely incomplete -- artifacts exist but no organizing principle |
| 2 | Below acceptable -- artifacts exist but disconnected, no cross-references |
| 3 | Acceptable -- consistent layer model, viewpoints aligned |
| 4 | Strong -- cross-viewpoint traceability, gap-free decomposition |
| 5 | Excellent -- elegant decomposition, principles consistently applied throughout |

### standards_compliance (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no framework used |
| 1 | Severely incomplete -- framework mentioned but not followed |
| 2 | Below acceptable -- partial framework usage, inconsistent notation |
| 3 | Acceptable -- correct ArchiMate/TOGAF notation and phases |
| 4 | Strong -- full compliance with selected framework |
| 5 | Excellent -- tailored framework with documented rationale for deviations |

### stakeholder_coverage (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no stakeholder analysis |
| 1 | Severely incomplete -- some stakeholders identified, no viewpoints |
| 2 | Below acceptable -- stakeholders listed but not mapped to viewpoints |
| 3 | Acceptable -- all key stakeholders mapped to viewpoints |
| 4 | Strong -- concern-driven viewpoints with explicit traceability |
| 5 | Excellent -- stakeholder feedback incorporated, viewpoints validated |

### feasibility (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- fantasy architecture, no implementation path |
| 1 | Severely incomplete -- technically possible but no resource plan |
| 2 | Below acceptable -- technically possible but impractical |
| 3 | Acceptable -- achievable with identified resources and timeline |
| 4 | Strong -- risk-mitigated with transition architecture |
| 5 | Excellent -- proven patterns, pilot evidence, vendor validation |

---

## Section 6: Sprint Contract Checklist Templates

Pre-built checklists for 5 TOGAF phases. The generator includes the relevant checklist(s) in each sprint contract. The evaluator uses them as acceptance criteria.

### For Architecture Vision (TOGAF Phase A)

- [ ] Stakeholder map identifies all key stakeholders
- [ ] Business drivers and constraints documented
- [ ] High-level capability map created
- [ ] Architecture principles defined (at least 5)
- [ ] Value proposition articulated for the transformation

### For Business Architecture (TOGAF Phase B)

- [ ] Business capability model complete (L0-L2)
- [ ] Key business processes mapped
- [ ] Organization mapping to capabilities
- [ ] Business service catalog drafted
- [ ] Gap analysis against target capabilities

### For Information Systems Architecture (TOGAF Phase C)

- [ ] Application portfolio mapped to capabilities
- [ ] Data entities identified and classified
- [ ] Integration patterns documented
- [ ] Application rationalization candidates identified
- [ ] Data flow diagrams for key scenarios

### For Technology Architecture (TOGAF Phase D)

- [ ] Technology standards profile defined
- [ ] Platform blueprint with selected products/services
- [ ] Infrastructure requirements mapped to applications
- [ ] Security architecture requirements documented
- [ ] Cloud vs on-premises decision rationale

### For Migration Planning (TOGAF Phase E-F)

- [ ] Gap analysis complete (current to target)
- [ ] Work packages defined with dependencies
- [ ] Transition architectures for major milestones
- [ ] Implementation roadmap with timeline
- [ ] Risk register with mitigations
