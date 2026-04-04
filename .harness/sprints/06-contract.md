# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-1-round6
- Inputs: .harness/spec.md, .harness/features.json, .harness/plan-core-fixes.md, plugins/harness-sdlc-suite/skills/harness-sa/SKILL.md, plugins/harness-sdlc-suite/skills/harness-ops/SKILL.md
- Status: in_review

## Target feature IDs
- F-009
- F-010

## Grouping waiver

Two features are grouped in this sprint. Justification:

1. **Zero overlap**: F-009 modifies `harness-sa/SKILL.md` exclusively; F-010 modifies `harness-ops/SKILL.md` exclusively. No shared files.
2. **Identical change shape**: Both features add new depth sections to an existing domain skill file. The work is additive Markdown authoring with no structural refactoring.
3. **Approved plan**: `plan-core-fixes.md` explicitly schedules Sprint 4 as "F-009 + F-010 (SA + Ops depth)".
4. **Risk reduction**: Grouping saves a full round. Splitting would produce two near-identical contract/evaluate cycles with no additional safety benefit.
5. **Established precedent**: Sprint 05 (Round 5) successfully grouped F-007 + F-008 using the same pattern -- separate skill files, additive sections, zero overlap. All checks passed.

## Goal

Add practical depth sections to the SA and Ops domain skills so that generators and evaluators working in those domains have actionable templates, procedure definitions, and reference guidance -- not just methodology selection tables and high-level anchors.

## Deliverables

### F-009: SA skill depth (harness-sa/SKILL.md)

Four new sections appended after the existing Section 10:

| Section | Title | Content |
|---------|-------|---------|
| 11 | Domain-Driven Design Specifics | Two sub-sections: **Strategic Design** (bounded context identification checklist, context map with 7 mapping patterns -- Shared Kernel, Customer-Supplier, Conformist, Anti-Corruption Layer, Open Host Service, Published Language, Separate Ways), **Tactical Design** (entity vs value object decision table, aggregate design rules with invariant boundary guidance, domain service vs application service distinction). Includes a **Ubiquitous Language Glossary** template with columns: Term, Definition, Bounded Context, Examples, Anti-Examples. |
| 12 | API Contract Templates | Three sub-sections: **OpenAPI 3.1 Starter** (minimal but complete OpenAPI 3.1 skeleton with info, paths, components/schemas, error response schema, auth security scheme), **AsyncAPI for Events** (AsyncAPI 3.0 skeleton for event-driven interfaces with channel, message, and payload definitions), **Versioning Strategy** (URL path vs header vs query param comparison table, deprecation policy template, breaking vs non-breaking change classification). |
| 13 | Threat Modeling | **STRIDE Analysis Template** table with columns: Threat Category, Description, Affected Component, Likelihood, Impact, Risk Score, Mitigation. Pre-filled rows for each STRIDE category (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege). Includes a **Risk Scoring** matrix (Likelihood 1-5 x Impact 1-5 = Risk Score) with classification thresholds (Low/Medium/High/Critical). |
| 14 | Capacity Modeling Template | **Resource Estimation** table with columns: Component, Metric, Current Load, Peak Load, Growth Rate, Target Capacity. **Scaling Thresholds** table with columns: Resource, Metric, Warning Threshold, Critical Threshold, Scaling Action, Cooldown Period. Includes guidance on horizontal vs vertical scaling decision criteria and cost-per-unit estimation. |

### F-010: Ops skill depth (harness-ops/SKILL.md)

Five new sections appended after the existing Section 10:

| Section | Title | Content |
|---------|-------|---------|
| 11 | GitOps Implementation | Three sub-sections: **Reconciliation Loop** (pull-based reconciliation flow: observe desired state in git, compare with actual cluster state, apply drift corrections, report status), **Directory Structure** (mono-repo vs multi-repo comparison table, recommended GitOps repo layout for base/overlays/environments), **Drift Detection** (drift detection procedure with scheduled scan, alert on divergence, auto-remediation vs manual review decision tree). |
| 12 | SRE Procedures | Two sub-sections: **SLO/SLI Definition Template** (table with columns: Service, User Journey, SLI Metric, SLI Measurement, SLO Target, Rolling Window, Error Budget), **Error Budget Calculation** (formula: Error Budget = 1 - SLO Target, burn rate calculation, error budget policy with escalation triggers at 50%, 75%, 100% consumption, burn-rate alerting thresholds for 1h/6h/24h/30d windows). |
| 13 | Runbook Template | Structured runbook with required sections: **Trigger** (alert name, threshold, conditions), **Impact** (affected services, user impact severity, business impact), **Diagnostic Steps** (numbered investigation procedure), **Resolution Steps** (numbered fix procedure), **Escalation** (when to escalate, escalation contacts by severity, communication template), **Rollback** (rollback decision criteria, rollback procedure, verification after rollback). |
| 14 | Incident Response | Two sub-sections: **Severity Classification** (P0-P4 table with columns: Severity, Definition, Examples, Response Time, Update Cadence, Escalation Authority), **Incident Lifecycle** (Detection, Triage, Mitigation, Resolution, Post-Incident Review -- each phase with responsible role, required actions, and exit criteria). Includes a **Post-Incident Review Template** with sections: Timeline, Root Cause, Contributing Factors, Action Items, Lessons Learned. |
| 15 | DORA Metrics | Four sub-sections, one per metric: **Deployment Frequency** (how to measure: count deployments to production per time period; classification: Elite daily/High weekly/Medium monthly/Low yearly), **Lead Time for Changes** (measure: time from commit to production; classification thresholds), **Change Failure Rate** (measure: percentage of deployments causing incidents; classification thresholds), **Mean Time to Restore** (measure: time from incident detection to resolution; classification thresholds). Each metric includes a measurement method, data source, and improvement guidance. |

## Verification

### F-009 checks

1. **DDD strategic present**: Grep `harness-sa/SKILL.md` for "Strategic Design" heading -- exists
2. **Context mapping patterns**: Section names at least 5 of the 7 DDD context mapping patterns (Shared Kernel, Customer-Supplier, Conformist, Anti-Corruption Layer, Open Host Service, Published Language, Separate Ways)
3. **DDD tactical present**: Grep for "Tactical Design" heading -- exists
4. **Entity/VO guidance**: Section contains entity vs value object distinction guidance
5. **Ubiquitous language**: Grep for "Ubiquitous Language Glossary" -- exists with a template table
6. **OpenAPI starter present**: Grep for "OpenAPI" -- section contains a 3.1 specification skeleton
7. **AsyncAPI present**: Grep for "AsyncAPI" -- section contains an event-driven specification skeleton
8. **Versioning strategy**: Section contains a comparison of versioning approaches (URL path, header, or query param)
9. **STRIDE template present**: Grep for "STRIDE" -- section contains a threat analysis table with all 6 STRIDE categories
10. **Risk scoring**: Section contains a likelihood-impact risk scoring matrix
11. **Capacity modeling present**: Grep for "Capacity Modeling" heading -- exists
12. **Scaling thresholds**: Section contains a scaling thresholds table with warning and critical levels

### F-010 checks

13. **GitOps reconciliation**: Grep `harness-ops/SKILL.md` for "Reconciliation Loop" heading -- exists
14. **GitOps directory structure**: Section contains a repo layout or directory structure for GitOps
15. **Drift detection**: Grep for "Drift Detection" heading -- exists with a detection procedure
16. **SLO/SLI template**: Grep for "SLO/SLI" -- section contains a definition template table
17. **Error budget**: Section contains error budget calculation formula and burn rate thresholds
18. **Runbook template present**: Grep for "Runbook Template" heading -- exists
19. **Runbook sections**: Template contains all required sections: Trigger, Impact, Steps, Escalation, Rollback
20. **Severity classification**: Grep for "Severity Classification" -- section contains P0-P4 definitions
21. **Post-incident review**: Section contains a post-incident review template
22. **DORA present**: Grep for "DORA Metrics" heading -- exists
23. **All four metrics**: Section covers Deployment Frequency, Lead Time for Changes, Change Failure Rate, and Mean Time to Restore
24. **Metric classification**: Each metric includes classification thresholds (Elite/High/Medium/Low or equivalent)

## Acceptance criteria

Domain profile is `software` per spec.md. Criteria:

- **Product depth**: New sections provide actionable templates and guidance with enough detail for a generator or evaluator to use without external references. DDD patterns are specific (not just "use bounded contexts"), API templates are copy-paste-ready, threat modeling is structured, ops procedures are step-by-step. Score 3+ required.
- **Functionality**: All 24 verification checks pass. No existing content in either SKILL.md is broken or removed. Score 3+ required.
- **Visual design**: Consistent Markdown formatting with existing sections in each file (table style, heading hierarchy, horizontal rules between sections). Score 3+ required.
- **Code quality**: Clean Markdown -- no broken links, no orphan references, no inconsistent heading levels. Content is factually accurate for the named frameworks, patterns, and methodologies (STRIDE categories correct, DORA metric definitions correct, DDD pattern names correct, SRE terminology correct). Score 3+ required.

## Contract checks

| ID | Required | Check | Verification |
|----|----------|-------|--------------|
| PD-01 | required | SA sections contain actionable templates, not just descriptions | Read each new section; verify at least one usable template per section (table, skeleton, checklist, or matrix) |
| PD-02 | required | Ops sections contain actionable templates, not just descriptions | Read each new section; verify at least one usable template per section |
| FN-01 | required | All 12 F-009 verification checks pass | Grep + read verification per checks 1-12 |
| FN-02 | required | All 12 F-010 verification checks pass | Grep + read verification per checks 13-24 |
| FN-03 | required | Existing content in both SKILL.md files is preserved | Diff shows only additions, no deletions of prior content |
| VD-01 | required | Formatting consistent with existing sections | Heading hierarchy (##, ###), horizontal rules between sections, table pipe alignment follow the same pattern as Sections 1-10 in each file |
| CQ-01 | required | SA framework references are factually accurate | DDD context mapping patterns correctly named, STRIDE categories complete and correct, OpenAPI version is 3.1, AsyncAPI references are valid |
| CQ-02 | required | Ops framework references are factually accurate | DORA metric definitions match published research, SRE terminology matches Google SRE Book conventions, severity classification follows industry norms |
| CQ-03 | advisory | No Markdown lint warnings | Heading levels sequential, no trailing whitespace, blank lines around headings |

## Risks

- **Length**: Adding 4+5 sections to already-long files may push them past comfortable reading length. Mitigation: keep each section focused and concise -- templates and tables over prose.
- **Framework accuracy**: DDD, STRIDE, DORA, and SRE details must be factually correct. Mitigation: CQ-01 and CQ-02 checks require evaluator verification of domain-specific terminology.
- **Consistency with existing style**: New sections must match the tone and structure of Sections 1-10 in their respective files. Mitigation: VD-01 check enforces formatting parity.
- **Scope creep**: Nine new sections total (4 SA + 5 Ops) is the largest single-sprint addition in this cycle. Mitigation: each section follows a consistent internal structure (heading, table, guidance notes) to keep authoring predictable.
