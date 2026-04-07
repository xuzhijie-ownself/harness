---
name: harness-se
description: "Sales engineering domain skill for the harness framework. Provides demo-led, POC-driven, and solution design methodologies, technical validation verification, and evaluation criteria for pre-sales engineering projects. Activated when domain_profile is sales_engineering."
---

# Sales Engineering Domain Skill

> **Domain-specific.** This skill provides the HOW for pre-sales engineering and technical validation projects. The harness provides the WHEN (orchestration, sprint contracts, feature ledger). This skill provides the HOW (demo methodology, POC planning, solution design verification, evaluation criteria anchors).

Activated when `domain_profile: sales_engineering` is declared in `.harness/spec.md`.

---

## Section 1: Sales Engineering Methodology

Select based on buyer engagement type and technical complexity during `/harness:start`:

| Methodology | When to Use | Harness Mapping |
|-------------|-------------|-----------------|
| Demo-Led | Buyer needs to see the product in action; standard use cases; evaluation committee presentation | 1 harness sprint = 1 demo preparation cycle (discovery -> script -> rehearsal -> delivery -> follow-up) |
| POC-Driven (Proof of Concept) | Buyer requires hands-on validation in their environment; technical risk is the primary objection | 1 harness sprint = 1 POC phase (scoping -> environment setup -> execution -> evaluation -> decision) |
| Solution Design | Complex integration requirements; buyer needs a custom architecture before committing; multi-system landscape | 1 harness sprint = 1 design iteration (requirements -> architecture -> review -> refinement) |
| Technical Discovery | Early-stage engagement; buyer's technical landscape unknown; requirements gathering before any demo or POC | 1 harness sprint = 1 discovery cycle (stakeholder interviews -> environment audit -> requirements documentation) |
| Competitive Bake-Off | Buyer evaluating multiple vendors side-by-side; structured evaluation criteria; head-to-head comparison | 1 harness sprint = 1 bake-off round (criteria alignment -> preparation -> execution -> scoring -> debrief) |

**Default:** Demo-Led (if not specified by user).

### Methodology Selection Guide

| Engagement Signal | Recommended Methodology | Reason |
|------------------|------------------------|--------|
| "Show us how it works" | Demo-Led | Buyer wants visual confirmation of capabilities before deeper evaluation |
| "We need to test it in our environment" | POC-Driven | Buyer has technical risk concerns that only hands-on validation resolves |
| "How would this integrate with our existing systems?" | Solution Design | Integration complexity requires architectural clarity before commitment |
| "We're evaluating 3 vendors" | Competitive Bake-Off | Structured comparison demands preparation aligned to buyer's scoring criteria |
| "We don't know what we need yet" | Technical Discovery | Requirements undefined; premature to demo or design without understanding landscape |
| "Can you support our scale/compliance/security?" | POC-Driven + Solution Design | Technical requirements exceed what a demo can validate |

---

## Section 2: Development Methodology

Select based on deliverable type and engagement stage:

| Methodology | When to Use | How It Drives the Generator |
|-------------|-------------|----------------------------|
| Use-case-first | Demo preparation where buyer has stated requirements | Generator maps buyer use cases to product capabilities FIRST, then builds demo script around gaps and strengths |
| Environment-first | POC setup where buyer's technical landscape constrains the solution | Generator documents environment requirements and constraints FIRST, then builds POC plan within those boundaries |
| Architecture-first | Solution design where integration is the primary concern | Generator maps integration points and data flows FIRST, then designs solution components around them |
| Comparison-first | Bake-off preparation where evaluation criteria are published | Generator maps evaluation criteria to product strengths FIRST, then builds demo/POC plan to maximize score on each criterion |
| Risk-first | Any engagement where technical objections could derail the deal | Generator identifies top technical risks FIRST, then builds validation plan to address each risk before it becomes a blocker |

**Default:** Use-case-first for demos, Environment-first for POCs.

### Generator First-Action Table

| Methodology | Generator writes first | Then |
|-------------|----------------------|------|
| Use-case-first | Use case mapping (buyer requirement -> product capability -> demo step) | Demo script with transitions, talking points, and fallback scenarios |
| Environment-first | Environment requirements document (infrastructure, access, data, timeline) | POC plan with success criteria and evaluation timeline |
| Architecture-first | Integration architecture diagram (systems, data flows, APIs, protocols) | Solution design document with component specifications |
| Comparison-first | Evaluation criteria matrix (criterion -> product strength -> evidence -> demo/POC step) | Preparation plan optimized for scoring on each criterion |
| Risk-first | Technical risk register (risk -> impact -> likelihood -> mitigation -> validation method) | Validation plan addressing each risk with specific test scenarios |

---

## Section 3: Verification Strategy

### Technical Validation Verification

Default for all sales engineering projects. The evaluator verifies each level is addressed.

| Level | Target Coverage | Scope | When to Verify |
|-------|----------------|-------|----------------|
| Use case coverage | 100% of buyer-stated use cases | Every use case from discovery mapped to demo step or POC scenario | Every sprint targeting demo or POC |
| Environment compatibility | All technical requirements met | Infrastructure, network, security, data requirements validated | Every sprint targeting POC setup |
| Integration validation | All integration points tested | API connectivity, data format compatibility, authentication flows verified | Every sprint targeting solution design |
| Performance baseline | Key metrics documented | Response times, throughput, concurrent user capacity under buyer's expected load | POC execution sprint |
| Security compliance | Buyer's security requirements addressed | Data handling, encryption, access control, audit logging meet stated requirements | Every sprint (if spec.md data_sensitivity != none) |
| Competitive positioning | All evaluation criteria addressed | Product strengths demonstrated against each buyer evaluation criterion | Bake-off preparation sprint |

### Demo Readiness Verification

The evaluator MUST verify demo readiness before delivery:

| Gate | Required Artifacts | Verification Method |
|------|-------------------|-------------------|
| Pre-demo | Demo script, environment validated, data seeded, backup plan | Script walkthrough; environment smoke test; data verification |
| Post-demo | Follow-up action items, technical questions captured, next steps agreed | Action item completeness; question coverage; mutual commitment documented |

---

## Section 4: Deliverable Verification

### Primary Deliverables

| Deliverable | Gate Check | Pass Criteria |
|-------------|-----------|---------------|
| Demo Script | Use case coverage + flow + timing | All buyer use cases mapped; script has transitions between scenarios; timing fits allocated slot; fallback scenarios for common failures documented |
| POC Plan | Success criteria + timeline + environment requirements | Measurable success criteria agreed with buyer; timeline realistic; environment requirements documented; evaluation method defined |
| Solution Design Document | Architecture + components + integration points + NFRs | All integration points mapped; data flows documented; non-functional requirements (performance, security, scalability) addressed; deployment model specified |
| Technical Comparison Matrix | Criteria + evidence + scoring | All buyer evaluation criteria listed; evidence provided for each (demo, documentation, reference); honest assessment including gaps |

### Supporting Deliverables

| Deliverable | Gate Check | Pass Criteria |
|-------------|-----------|---------------|
| Environment Requirements Document | Infrastructure + access + data + timeline | All technical prerequisites listed; access requirements documented; sample data specifications defined; setup timeline estimated |
| Technical Discovery Notes | Stakeholder input + landscape + requirements | Current-state architecture documented; integration requirements captured; technical constraints identified; key stakeholders mapped |
| POC Results Report | Test results + metrics + recommendations | Each success criterion evaluated with evidence; performance metrics captured; gap analysis if criteria not fully met; recommendation (proceed/modify/stop) |

### Governance Deliverables

| Deliverable | Gate Check | Pass Criteria |
|-------------|-----------|---------------|
| Technical Win/Loss Analysis | Root cause + lessons + improvements | Technical factors in win/loss identified; product gaps documented for product team; competitive positioning lessons captured |
| SE Engagement Summary | Effort + outcomes + next steps | Total SE hours invested; outcomes achieved; handoff to implementation team (if won) or lessons learned (if lost) |

---

## Section 5: Evaluation Criteria (Sales Engineering Profile)

The 4 primary criteria for the `sales_engineering` domain profile. The evaluator MUST use these anchors for consistent scoring across sprints.

### demo_completeness (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no demo script or preparation; ad-hoc product walkthrough planned |
| 1 | Severely incomplete -- demo script exists but covers <50% of buyer use cases; no fallback scenarios |
| 2 | Partial -- most use cases covered but transitions are rough; no timing plan; demo environment not validated |
| 3 | Complete -- all buyer use cases mapped to demo steps; transitions scripted; timing fits allocated slot; demo environment tested and data seeded |
| 4 | Rehearsed -- demo rehearsed with internal team; common questions anticipated with prepared answers; fallback scenarios documented for top 3 failure modes |
| 5 | Compelling -- demo tells a story aligned with buyer's business outcomes; transitions highlight competitive differentiators; follow-up materials prepared; demo recording available for buyer's internal distribution |

### technical_validation (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no technical validation performed; capabilities claimed without evidence |
| 1 | Severely incomplete -- basic product demo shown but no hands-on validation; buyer's environment not considered |
| 2 | Partial -- some technical scenarios tested but not in buyer's environment; results anecdotal, not measured |
| 3 | Validated -- POC executed against defined success criteria; results documented with metrics; buyer's environment constraints addressed; gaps identified with mitigation plans |
| 4 | Comprehensive -- all success criteria met with measured results; performance tested under buyer's expected load; integration points validated end-to-end; security requirements verified |
| 5 | Decisive -- technical validation eliminates all buyer objections; results exceed success criteria; buyer's technical team endorses the solution; competitive advantage demonstrated through measured comparison |

### solution_documentation (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no solution documentation; architecture exists only in SE's head |
| 1 | Severely incomplete -- high-level diagram exists but no component details; integration points unnamed |
| 2 | Partial -- architecture diagram with component names but no data flows; integration points listed but protocols/formats undefined |
| 3 | Complete -- architecture diagram with data flows; all integration points specified (API, protocol, format, authentication); non-functional requirements documented (performance, security, scalability) |
| 4 | Implementation-ready -- solution design detailed enough for implementation team to build without SE involvement; deployment model specified; operational considerations documented |
| 5 | Exemplary -- solution design includes decision rationale (why this approach over alternatives); risk assessment; phased implementation plan; operational runbook; buyer's team can self-serve from documentation |

### integration_clarity (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no integration requirements documented; "we'll figure it out later" approach |
| 1 | Severely incomplete -- integration points named but no technical details; direction of data flow unknown |
| 2 | Partial -- some integration points specified with protocols but authentication, error handling, and data format details missing |
| 3 | Clear -- all integration points documented with protocol, authentication method, data format, error handling approach; sample payloads provided for key integrations |
| 4 | Validated -- integration specifications tested against buyer's actual systems (or realistic simulators); round-trip data flow verified; error scenarios tested |
| 5 | Production-ready -- integration specifications include monitoring, alerting, retry logic, and graceful degradation; buyer's operations team reviewed and approved; runbook for integration troubleshooting provided |

---

## Section 6: Sprint Contract Checklist Templates

Pre-built checklists for common sales engineering deliverable types. The generator includes the relevant checklist(s) in each sprint contract. The evaluator uses them as acceptance criteria.

### For Demo Deliverables

- [ ] All buyer-stated use cases mapped to demo steps
- [ ] Demo script has clear transitions between scenarios with talking points
- [ ] Timing plan fits within allocated presentation slot (with buffer)
- [ ] Demo environment validated and data seeded before delivery
- [ ] Fallback scenarios documented for top 3 likely failure modes (network, data, feature)
- [ ] Competitive differentiators highlighted at natural points in the flow
- [ ] Follow-up action items template prepared for post-demo capture
- [ ] Customer environment data (if used) handled per data classification requirements
- [ ] No customer production data in demo environment without explicit authorization

### For POC Deliverables

- [ ] Success criteria defined in writing and agreed with buyer before POC starts
- [ ] Success criteria are measurable (not subjective "it works well")
- [ ] Environment requirements documented and validated before execution
- [ ] POC timeline defined with milestones and evaluation checkpoints
- [ ] Results documented against each success criterion with measured evidence
- [ ] Gap analysis included if any criteria not fully met, with mitigation options
- [ ] Recommendation provided (proceed to purchase / modify scope / stop)
- [ ] Customer data used in POC classified and handled per agreement
- [ ] POC environment decommissioned or data purged after evaluation per customer requirements

### For Solution Design Deliverables

- [ ] Architecture diagram shows all system components and their relationships
- [ ] All integration points specified with protocol, authentication, data format
- [ ] Data flows documented including direction, frequency, and volume estimates
- [ ] Non-functional requirements addressed (performance targets, security, scalability, availability)
- [ ] Deployment model specified (cloud, on-premises, hybrid) with justification
- [ ] Sample API payloads provided for key integration points
- [ ] Risk assessment included for technical implementation risks
- [ ] Customer environment data and architecture details classified as confidential
- [ ] No customer infrastructure details shared outside authorized team

### For Technical Comparison Deliverables

- [ ] All buyer evaluation criteria listed with product response for each
- [ ] Evidence type specified per criterion (demo, documentation, reference, POC result)
- [ ] Honest gap assessment included (not just strengths)
- [ ] Competitive positioning documented without disparaging specific competitors
- [ ] Scoring methodology explained if self-assessment scores provided
- [ ] Competitive intelligence sourced from public information only

### Sales Engineering Anti-Patterns

These trigger automatic score penalties when detected by the evaluator:

| Anti-Pattern | Criterion Affected | Penalty | Detection Signal |
|-------------|-------------------|---------|-----------------|
| **Demo Without Discovery** -- presenting product capabilities before understanding buyer's technical requirements and use cases | demo_completeness | Drop to max 2 | Demo script not mapped to buyer use cases; generic product walkthrough; no technical discovery notes on file |
| **Scope Creep POC** -- POC scope expanding beyond agreed success criteria; no clear end date or evaluation method | technical_validation | Drop to max 2 | Success criteria changed after POC started; no timeline; buyer adding requirements mid-POC without formal scope change |
| **Vaporware Demo** -- demonstrating features that do not exist or require significant custom development; roadmap items shown as current capabilities | demo_completeness | Drop to max 0 | Demo includes unreleased features without disclosure; product roadmap items presented as generally available |
| **Undocumented Architecture** -- solution design exists only in SE's verbal description; no written architecture or integration specifications | solution_documentation | Drop to max 1 | No solution design document; integration requirements verbal only; implementation team has no written reference |
| **Integration Handwave** -- claiming integration is "easy" or "standard" without specifying protocol, authentication, data format, and error handling | integration_clarity | Drop to max 2 | Integration points listed without technical details; "we support REST APIs" without specifying endpoints or contracts |
| **Customer Data Leak** -- using customer environment data, architecture details, or technical requirements in other customer engagements without authorization | solution_documentation | Drop to max 0 | Customer-specific data found in generic templates; architecture details from one customer referenced in another's POC |
