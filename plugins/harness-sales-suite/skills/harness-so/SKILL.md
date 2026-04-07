---
name: harness-so
description: "Sales operations domain skill for the harness framework. Provides RevOps, data-driven, and process-first methodologies, pipeline reporting verification, and evaluation criteria for sales operations and revenue operations projects. Activated when domain_profile is sales_operations."
---

# Sales Operations Domain Skill

> **Domain-specific.** This skill provides the HOW for sales operations and revenue operations projects. The harness provides the WHEN (orchestration, sprint contracts, feature ledger). This skill provides the HOW (RevOps methodology, forecast modeling, territory planning, process documentation, evaluation criteria anchors).

Activated when `domain_profile: sales_operations` is declared in `.harness/spec.md`.

---

## Section 1: Sales Operations Methodology

Select based on organizational maturity and operational focus during `/harness:start`:

| Methodology | When to Use | Harness Mapping |
|-------------|-------------|-----------------|
| RevOps (Revenue Operations) | Cross-functional alignment needed across sales, marketing, and customer success; unified revenue engine approach | 1 harness sprint = 1 RevOps process cycle (audit -> design -> implement -> measure -> optimize) |
| Data-Driven | Forecast accuracy, pipeline analytics, or performance reporting is the primary need; decisions must be evidence-based | 1 harness sprint = 1 analytics cycle (define metrics -> build model -> validate -> deploy -> iterate) |
| Process-First | Operational inefficiency identified; manual processes need standardization or automation; scale preparation | 1 harness sprint = 1 process improvement cycle (map current -> identify gaps -> design target -> implement -> verify) |
| Territory & Quota Planning | Annual or quarterly planning cycle; territory rebalancing; quota allocation and capacity modeling | 1 harness sprint = 1 planning cycle (data collection -> modeling -> scenario analysis -> allocation -> communication) |
| Compensation Design | Sales compensation plan design or revision; incentive alignment with business strategy | 1 harness sprint = 1 comp design cycle (strategy alignment -> plan design -> modeling -> approval -> communication) |

**Default:** RevOps (if not specified by user).

### Methodology Selection Guide

| Operational Signal | Recommended Methodology | Reason |
|-------------------|------------------------|--------|
| "Our forecast is never accurate" | Data-Driven | Forecast accuracy requires systematic data collection, model building, and validation |
| "Sales, marketing, and CS are not aligned" | RevOps | Cross-functional alignment is the core RevOps value proposition |
| "We can't scale our sales process" | Process-First | Process standardization and documentation before scaling headcount |
| "Territories are unfair / quotas are wrong" | Territory & Quota Planning | Data-driven territory design and quota allocation based on market potential |
| "Our comp plan doesn't drive the right behaviors" | Compensation Design | Incentive alignment requires modeling impact before deployment |
| "We don't know what's in our pipeline" | Data-Driven + Process-First | Pipeline visibility requires both data infrastructure and process discipline |

---

## Section 2: Development Methodology

Select based on deliverable type and operational stage:

| Methodology | When to Use | How It Drives the Generator |
|-------------|-------------|----------------------------|
| Metrics-first | Any operational deliverable where KPIs drive design decisions | Generator defines success metrics and data requirements FIRST, then designs processes and reports to support those metrics |
| Process-mapping-first | Operational redesign where current-state understanding is critical | Generator maps current-state processes with pain points FIRST, then designs target-state improvements |
| Model-first | Forecasting, territory planning, or compensation design where quantitative models drive decisions | Generator builds the analytical model FIRST with assumptions documented, then designs supporting processes and reports |
| Automation-first | Operational efficiency where manual work is the primary bottleneck | Generator identifies automation opportunities FIRST, then designs automated workflows with fallback procedures |
| Governance-first | Compliance-driven operations or multi-stakeholder approval processes | Generator defines governance rules and approval workflows FIRST, then designs data flows and reporting to support governance |

**Default:** Metrics-first for reporting, Process-mapping-first for operations redesign.

### Generator First-Action Table

| Methodology | Generator writes first | Then |
|-------------|----------------------|------|
| Metrics-first | KPI definitions + data sources + measurement methodology | Reports, dashboards, and process designs supporting each KPI |
| Process-mapping-first | Current-state process map + pain point inventory + root cause analysis | Target-state process design + implementation plan |
| Model-first | Analytical model with assumptions + input data requirements + scenario definitions | Supporting data collection processes + output report formats |
| Automation-first | Manual process inventory + automation opportunity scoring + tool assessment | Automated workflow designs + exception handling procedures |
| Governance-first | Governance framework + approval matrix + compliance requirements | Data flows, reporting, and audit trail designs |

---

## Section 3: Verification Strategy

### Operational Verification

Default for all sales operations projects. The evaluator verifies each level is addressed.

| Level | Target Coverage | Scope | When to Verify |
|-------|----------------|-------|----------------|
| Data completeness | All required data sources connected | Every metric has a defined data source; no manual data entry for automated metrics; data refresh frequency meets reporting needs | Every sprint targeting reporting or analytics |
| Process documentation | All processes mapped and current | Every operational process documented with inputs, outputs, owners, and SLAs; no undocumented tribal knowledge for critical processes | Every sprint targeting process design |
| Report accuracy | All reports validated | Every report output verified against source data; calculations documented and auditable; known limitations disclosed | Every sprint targeting dashboard or report delivery |
| Model validation | All models tested with scenarios | Forecast models back-tested against historical data; territory models validated with actual performance; comp models stress-tested with edge cases | Every sprint targeting analytical models |
| Scalability design | Processes scale with growth | Processes designed for 2x current volume without redesign; automation handles growth; manual steps identified as tech debt | Program design sprint |
| Security / data handling | Sensitive data protected | Compensation data restricted to authorized personnel; individual performance data classified; financial projections marked confidential | Every sprint (if spec.md data_sensitivity != none) |

### Operational Readiness Verification

The evaluator MUST verify operational readiness before deployment:

| Gate | Required Artifacts | Verification Method |
|------|-------------------|-------------------|
| Pre-deploy | Process documentation, training materials, rollback plan | Process walkthrough with end users; training completion; rollback procedure tested |
| Post-deploy (30 days) | Adoption metrics, issue log, adjustment plan | Process adherence rate; error/exception rate; user feedback |

---

## Section 4: Deliverable Verification

### Primary Deliverables

| Deliverable | Gate Check | Pass Criteria |
|-------------|-----------|---------------|
| Pipeline Report / Dashboard | Data sources connected + calculations verified + refresh automated | All pipeline stages reflected; data refreshes on defined schedule; calculations match source system logic; drill-down capability for stage-level analysis |
| Forecast Model | Historical validation + scenario analysis + assumptions documented | Model back-tested against at least 2 prior periods with documented accuracy; at least 3 scenarios modeled (base/upside/downside); all assumptions explicit and adjustable |
| Territory Plan | Market data + assignment logic + quota allocation | All territories have defined accounts/geography; workload balanced (variance <20% across territories); quota sum equals company target; data sources for market sizing documented |
| Compensation Plan | Strategy alignment + financial modeling + edge case testing | Plan mechanics documented; OTE and payout curves modeled; edge cases tested (0% attainment, 200% attainment, territory change mid-period); finance-approved cost projections |

### Supporting Deliverables

| Deliverable | Gate Check | Pass Criteria |
|-------------|-----------|---------------|
| Process Map | Current and target state documented | Swim lanes with role assignments; handoff points explicit; SLAs defined for time-sensitive steps; pain points annotated on current-state map |
| Data Dictionary | All operational metrics defined | Each metric has: name, definition, data source, calculation method, owner, refresh frequency; no ambiguous or duplicate metric definitions |
| Operational Runbook | Procedures for recurring operations | Step-by-step procedures for each operational cycle (forecast, territory, comp); escalation paths defined; troubleshooting guides for common issues |

### Governance Deliverables

| Deliverable | Gate Check | Pass Criteria |
|-------------|-----------|---------------|
| Operations Review | Performance metrics + process health + recommendations | KPIs reported against targets; process adherence measured; improvement recommendations prioritized by impact |
| Change Management Plan | Stakeholder communication + training + rollback | All affected stakeholders identified; communication timeline defined; training plan with schedule; rollback criteria and procedure documented |

---

## Section 5: Evaluation Criteria (Sales Operations Profile)

The 4 primary criteria for the `sales_operations` domain profile. The evaluator MUST use these anchors for consistent scoring across sprints.

### data_completeness (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no operational data infrastructure; metrics undefined; reporting nonexistent |
| 1 | Severely incomplete -- some metrics tracked manually in spreadsheets; data sources disconnected; no single source of truth |
| 2 | Partial -- key metrics defined but data collection inconsistent; some automated, some manual; data quality issues unaddressed |
| 3 | Complete -- all required metrics defined with documented data sources; automated data collection for primary metrics; data dictionary maintained; known data quality issues documented with remediation plan |
| 4 | Comprehensive -- all metrics automated; data quality monitoring in place; historical data preserved for trend analysis; data lineage documented from source to report |
| 5 | Predictive -- data infrastructure supports real-time analytics; predictive models fed by automated data pipelines; data quality exceeds 98% accuracy; self-service analytics available to stakeholders |

### process_documentation (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no documented processes; operations run on tribal knowledge and individual heroics |
| 1 | Severely incomplete -- some processes documented but outdated; critical procedures exist only in people's heads |
| 2 | Partial -- major processes documented but inconsistent format; some gaps in coverage; documentation not maintained when processes change |
| 3 | Documented -- all critical processes mapped with current-state documentation; each process has defined inputs, outputs, owners, and SLAs; runbooks exist for recurring operations |
| 4 | Optimized -- processes documented in standardized format; target-state improvements designed; automation opportunities identified; process metrics tracked (cycle time, error rate) |
| 5 | Continuous improvement -- processes regularly reviewed and updated; improvement backlog maintained; process changes managed through documented change control; process metrics drive optimization decisions |

### reporting_accuracy (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no operational reporting; leadership decisions made without data |
| 1 | Severely incomplete -- some reports exist but known to be inaccurate; numbers don't match across reports; no validation process |
| 2 | Partial -- key reports produced but accuracy varies; calculation logic undocumented; discrepancies between reports unresolved |
| 3 | Accurate -- all reports validated against source data; calculation logic documented and auditable; known limitations disclosed; refresh schedule maintained |
| 4 | Trusted -- stakeholders trust reports for decision-making; reconciliation process catches discrepancies before distribution; historical accuracy tracked; report SLAs met consistently |
| 5 | Decision-grade -- reports drive strategic decisions with confidence; automated anomaly detection flags data issues; scenario modeling available; self-service drill-down for stakeholders |

### scalability_design (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no consideration for scale; processes designed for current state only |
| 1 | Severely incomplete -- scale acknowledged as a concern but no design changes made; manual workarounds planned for growth |
| 2 | Partial -- some processes designed for growth but others remain brittle; automation planned but not implemented; capacity limits unknown |
| 3 | Designed -- processes designed to handle 2x current volume without redesign; automation implemented for high-volume repetitive tasks; capacity limits documented with trigger points for scaling |
| 4 | Validated -- scalability tested through load modeling or pilot with larger data sets; bottlenecks identified and addressed; capacity planning integrated into operational reviews |
| 5 | Elastic -- operations scale dynamically with business growth; automated scaling for data processing and reporting; minimal manual intervention for volume increases; cost-per-transaction decreases with scale |

---

## Section 6: Sprint Contract Checklist Templates

Pre-built checklists for common sales operations deliverable types. The generator includes the relevant checklist(s) in each sprint contract. The evaluator uses them as acceptance criteria.

### Standard Contract Checks

These are the minimum required checks for every sales operations sprint. Check IDs map to the 4 sales operations evaluation criteria.

| Check ID | Criterion | Required | Verification Method |
|----------|-----------|----------|-------------------|
| DT-01 | data_completeness | required | Verify all required metrics defined with documented data sources; automated data collection for primary metrics; data dictionary maintained |
| DT-02 | data_completeness | advisory | Verify data quality monitoring in place; historical data preserved; data lineage documented from source to report |
| PD-01 | process_documentation | required | Verify all critical processes mapped with inputs, outputs, owners, and SLAs; runbooks exist for recurring operations |
| PD-02 | process_documentation | advisory | Verify processes documented in standardized format; automation opportunities identified; process metrics tracked |
| RA-01 | reporting_accuracy | required | Verify all reports validated against source data; calculation logic documented and auditable; known limitations disclosed |
| RA-02 | reporting_accuracy | advisory | Verify reconciliation process exists; historical accuracy tracked; report SLAs defined |
| SL-01 | scalability_design | required | Verify processes designed for 2x current volume; automation implemented for high-volume tasks; capacity limits documented |
| SL-02 | scalability_design | advisory | Verify scalability tested through load modeling; bottlenecks identified; capacity planning integrated into reviews |

### For Pipeline / Forecast Deliverables

- [ ] All pipeline stages defined with clear entry/exit criteria
- [ ] Data sources for pipeline metrics connected and automated
- [ ] Forecast model back-tested against at least 2 historical periods
- [ ] Forecast scenarios modeled: base, upside, downside (minimum)
- [ ] Assumptions documented and adjustable by authorized users
- [ ] Report calculations verified against source system data
- [ ] Refresh schedule defined and automated where possible
- [ ] Financial projections and forecast data marked as confidential
- [ ] Access restricted to authorized personnel by role

### For Territory / Quota Deliverables

- [ ] Territory assignments cover all accounts with no gaps or overlaps
- [ ] Workload balanced across territories (variance <20%)
- [ ] Quota sum equals company revenue target
- [ ] Market data sources for territory sizing documented and current
- [ ] Scenario analysis performed for at least 2 alternative configurations
- [ ] Historical performance data used to inform territory potential
- [ ] Change management plan for territory transitions
- [ ] Individual quota assignments classified as confidential
- [ ] Territory data not shared across competing teams without authorization

### For Process / Operations Deliverables

- [ ] Current-state process mapped with pain points identified
- [ ] Target-state process designed with measurable improvements
- [ ] Process owners assigned for each process
- [ ] SLAs defined for time-sensitive handoffs
- [ ] Automation opportunities identified and prioritized
- [ ] Runbook created for recurring operational procedures
- [ ] Rollback plan documented for process changes
- [ ] Training plan for affected stakeholders

### For Compensation Deliverables

- [ ] Plan mechanics documented with payout calculations
- [ ] OTE and payout curves modeled for target, below, and above performance
- [ ] Edge cases tested (0%, 50%, 100%, 150%, 200%+ attainment; mid-period territory change; role change)
- [ ] Financial cost projection approved by finance
- [ ] Plan communication materials prepared for sales team
- [ ] Dispute resolution process defined
- [ ] Compensation data restricted to HR, finance, and direct management chain only
- [ ] Individual compensation details not stored in shared operational systems without access controls

### Sales Operations Anti-Patterns

These trigger automatic score penalties when detected by the evaluator:

| Anti-Pattern | Criterion Affected | Penalty | Detection Signal |
|-------------|-------------------|---------|-----------------|
| **Spreadsheet Hell** -- critical operational data managed in uncontrolled spreadsheets instead of systems of record; no version control, no audit trail | data_completeness | Drop to max 2 | Key metrics calculated in local spreadsheets; multiple versions of "the forecast" circulating; no reconciliation process |
| **Tribal Knowledge** -- critical processes exist only in individuals' heads; no documentation; single points of failure | process_documentation | Drop to max 1 | Process owner departure causes operational disruption; new hires cannot self-serve procedures; "ask Bob" is the documented process |
| **Vanity Metrics** -- reporting metrics that look good but do not drive decisions or reflect actual business health | reporting_accuracy | Drop to max 2 | Reports shown to leadership never questioned; no metric tied to action; numbers always positive regardless of performance |
| **Manual Scale** -- planning to hire more people instead of automating repetitive processes; no capacity planning | scalability_design | Drop to max 2 | Headcount requests for operational tasks that could be automated; same process steps done manually at 100 and 1000 accounts |
| **Comp Plan Leak** -- sharing individual compensation details, OTE, or attainment data beyond authorized audience | data_completeness | Drop to max 0 | Compensation data in shared drives without access controls; individual quotas visible in pipeline reports; comp plan details in broadly distributed emails |
| **Forecast Manipulation** -- adjusting forecast data to match desired narrative instead of reflecting deal reality; sandbagging or inflating | reporting_accuracy | Drop to max 0 | Forecast consistently wrong in same direction; deal amounts change dramatically at quarter-end; no audit trail for forecast changes |

### Security Considerations

Domain-specific security guidance for sales operations deliverables. Applies when `data_sensitivity` in spec.md is anything other than `none`.

**Data Sensitivity:**
- Compensation plans, individual OTE, quota assignments, and attainment data must be classified as confidential and restricted to HR, finance, and the direct management chain
- Forecast models containing deal-level data (amounts, close dates, customer names) must be classified as confidential; aggregated forecasts may be shared more broadly
- Territory plan data containing account assignments, market sizing, and revenue potential by territory must be restricted to sales leadership and operations

**Access Control:**
- Pipeline dashboards must implement role-based access: reps see their own pipeline, managers see their team, leadership sees all; no cross-team visibility without authorization
- Compensation modeling tools and data must be restricted to compensation analysts, HR, and finance; individual plan details must not be accessible through operational reporting
- Process automation credentials (API keys, integration tokens, system accounts) must be managed through a secrets vault; no credentials stored in code, documents, or shared configuration files

**Confidentiality:**
- Individual sales performance data (attainment, pipeline, activity metrics) must not be shared outside the management chain without the rep's knowledge
- Financial projections and cost models (including compensation cost projections) must carry a confidential classification and not be included in broadly distributed reports
- Vendor and tool evaluation data (pricing, contracts, capabilities) used in operations tool selection must be classified per vendor NDA terms
