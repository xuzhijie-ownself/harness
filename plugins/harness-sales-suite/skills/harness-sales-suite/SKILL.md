---
name: harness-sales-suite
description: "Sales domain skill suite for the harness framework. Index skill that provides domain profile routing, sales pipeline phases, and references to all sales domain skills. Activated when any sales suite domain profile is selected (sales, sales_engineering, tender_management, sales_enablement, sales_operations)."
---

# Harness Sales Suite

> **Domain registry for revenue execution.** This index skill routes to the correct domain skill based on the `domain_profile` declared in `state.json` or `spec.md`. It also defines the end-to-end sales pipeline that connects all domain skills.

## Domain Profiles

Each domain declares 4 primary evaluation criteria, artifact taxonomy, verification methods, and stakeholder lens.

| Profile | Criteria | Artifact Types | Stakeholder Lens |
|---------|----------|---------------|-----------------|
| `sales` | qualification_depth, pipeline_coverage, deal_documentation, close_readiness | Opportunity plans, proposals, close plans, mutual action plans | Account Executive, Sales Manager |
| `sales_engineering` | demo_completeness, technical_validation, solution_documentation, integration_clarity | Demo scripts, POC plans, solution architectures, technical comparisons | Sales Engineer, Pre-sales Architect |
| `tender_management` | compliance_coverage, response_completeness, win_theme_clarity, submission_readiness | RFP responses, compliance matrices, pricing volumes, past performance volumes | Proposal Manager, Bid Manager, Capture Lead |
| `sales_enablement` | content_coverage, audience_relevance, adoption_measurability, maintenance_sustainability | Playbooks, battle cards, training curricula, messaging frameworks, certification programs | Enablement Lead, Product Marketing Manager |
| `sales_operations` | data_completeness, process_documentation, reporting_accuracy, scalability_design | Forecast models, pipeline reports, territory plans, compensation plans, process maps | Sales Ops Analyst, RevOps Manager |

## Domain Skill Routing

Based on `domain_profile` in `state.json` or `spec.md`, load the matching domain skill:

| `domain_profile` | Skill Name | Relative Path |
|-------------------|------------|---------------|
| `sales` | harness-sales | `../harness-sales/SKILL.md` |
| `sales_engineering` | harness-se | `../harness-se/SKILL.md` |
| `tender_management` | harness-tm | `../harness-tm/SKILL.md` |
| `sales_enablement` | harness-sen | `../harness-sen/SKILL.md` |
| `sales_operations` | harness-so | `../harness-so/SKILL.md` |

If `domain_profile` is `custom`, do not load any domain skill from this suite -- the project defines its own criteria inline in `spec.md`.

## End-to-End Sales Pipeline

Domain skills map to phases in a revenue execution workflow. Not every deal needs every phase -- the planner routes based on deal type and complexity.

```
Lead / Opportunity
    |
    +- Phase 1: Discovery & Qualification    (harness-sales)
    +- Phase 2: Technical Validation         (harness-se)
    +- Phase 3: Formal Procurement           (harness-tm)
    +- Phase 4: Enablement & Readiness       (harness-sen)
    +- Phase 5: Revenue Operations           (harness-so)
    +- Phase 6: Negotiation & Close          (harness-sales)
    +- Phase 7: Onboarding & Handoff         (harness-sales + harness-se)
    |
    v
Closed Deal / Customer Success
```

## Phase Routing

| Deal Type | Phases | Security Level | Example |
|-----------|--------|----------------|---------|
| Transactional sale | 1 -> 6 | Baseline -- standard pricing, no custom terms | "Renew a SaaS subscription" |
| Mid-market deal | 1 -> 2 -> 6 -> 7 | Standard -- demo environment isolation, NDA terms | "Sell a platform license with POC" |
| Enterprise RFP | 1 -> 2 -> 3 -> 6 -> 7 | Full -- competitive intel protection, pricing confidentiality, compliance documentation | "Respond to a government RFP" |
| Strategic account | 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 | Full + ops -- territory data, comp plan confidentiality, forecast integrity | "Land a Fortune 500 multi-year deal" |
| Channel / partner | 1 -> 4 -> 5 -> 6 | Standard -- partner-facing content, co-sell playbooks | "Enable a channel partner to resell" |

Each deal type gets at least baseline security from Phase 1 (qualification and customer data handling) + Phase 6 (pricing and contract terms). More phases = more security depth. Security considerations are embedded in each domain skill's checklists and anti-patterns rather than enforced by a separate security phase.

## Cross-Domain Composability

A project can declare a primary profile + optional secondary profile. The evaluator scores both sets of criteria. For example, a project with `primary: sales` and `secondary: sales_engineering` would score qualification_depth, pipeline_coverage, deal_documentation, close_readiness (from sales) AND demo_completeness, technical_validation, solution_documentation, integration_clarity (from sales_engineering).

Common combinations:

| Primary | Secondary | Use Case |
|---------|-----------|----------|
| `sales` | `sales_engineering` | Technical sale requiring both qualification rigor and POC planning |
| `tender_management` | `sales` | RFP response that also requires deep account qualification |
| `sales_enablement` | `sales_operations` | Enablement program with adoption metrics fed into RevOps reporting |
| `sales_operations` | `sales` | RevOps process redesign grounded in pipeline qualification data |

## Domain Skills

| Skill | Domain | Profile | What it provides |
|-------|--------|---------|-----------------|
| `harness-sales` | Core Sales / Revenue Execution | `sales` | Methodology selection (MEDDPICC/Challenger/SPIN/Sandler/BANT), qualification verification, deal documentation standards, evaluation criteria anchors |
| `harness-se` | Sales Engineering / Pre-sales | `sales_engineering` | Demo methodology, POC planning, solution design verification, technical comparison frameworks, evaluation criteria anchors |
| `harness-tm` | Tender Management / Procurement | `tender_management` | APMP/Shipley capture management, color team reviews, compliance matrix validation, evaluation criteria anchors |
| `harness-sen` | Sales Enablement | `sales_enablement` | Content strategy, coaching methodology, certification programs, adoption measurement, evaluation criteria anchors |
| `harness-so` | Sales Operations / RevOps | `sales_operations` | RevOps methodology, forecast modeling, territory planning, process documentation, evaluation criteria anchors |

Domain skills are loaded automatically when the matching domain profile is selected during `/harness:start`.

## Criteria Key Mapping

The `primary_scores` object in `NN-eval.json` uses 4 keys determined by the active domain profile. Replace the `<criterion_N>` placeholders from `patterns.md` with the exact keys below.

| Profile | `criterion_1` | `criterion_2` | `criterion_3` | `criterion_4` |
|---------|--------------|--------------|--------------|--------------|
| `sales` | `qualification_depth` | `pipeline_coverage` | `deal_documentation` | `close_readiness` |
| `sales_engineering` | `demo_completeness` | `technical_validation` | `solution_documentation` | `integration_clarity` |
| `tender_management` | `compliance_coverage` | `response_completeness` | `win_theme_clarity` | `submission_readiness` |
| `sales_enablement` | `content_coverage` | `audience_relevance` | `adoption_measurability` | `maintenance_sustainability` |
| `sales_operations` | `data_completeness` | `process_documentation` | `reporting_accuracy` | `scalability_design` |

The `custom` profile defines its own 4 keys inline in the `spec.md` Domain Profile section. The evaluator reads those keys at evaluation time and uses them as `primary_scores` keys in `NN-eval.json`.

## Domain Verification Methods

Each domain profile defines what constitutes "verification" for its artifact types. The evaluator uses the method below matching the active `domain_profile`.

| Profile | Verification Method | What to Check | Tooling |
|---------|-------------------|---------------|---------|
| `sales` | Qualification scorecard validation + pipeline hygiene audit | MEDDPICC fields populated, deal stages accurate, next steps defined, mutual action plan exists | Checklist walkthrough, CRM field audit |
| `sales_engineering` | Demo script validation + POC acceptance testing | Demo covers all required use cases, POC success criteria defined and measurable, solution fits technical requirements | Demo dry-run, POC criteria checklist |
| `tender_management` | Compliance matrix validation + response completeness audit | All RFP requirements addressed, compliance matrix complete, win themes consistent across volumes, submission deadline met | Section-by-section compliance check, cross-reference audit |
| `sales_enablement` | Content coverage audit + adoption measurement validation | All personas covered, content maps to buyer journey stages, adoption metrics defined and trackable | Content matrix review, persona coverage check |
| `sales_operations` | Data model validation + process documentation completeness | All pipeline stages defined, forecast model inputs documented, territory assignments complete, reporting dimensions specified | Data dictionary review, process map walkthrough |

The `custom` profile defines its own verification method in `spec.md`. When no domain-specific tooling is available, the evaluator falls back to deliverable completeness checks: file existence and required section presence.

## Phase Handoff Protocol

When a deal spans multiple pipeline phases, each phase must produce defined outputs before the next phase can start.

### Required Outputs per Phase

| Phase | Owning Skill | Required Output Artifacts | Security Output |
|-------|-------------|--------------------------|-----------------|
| 1. Discovery & Qualification | harness-sales | Qualification scorecard, opportunity plan, stakeholder map | Customer data classification, NDA status |
| 2. Technical Validation | harness-se | Demo script, POC plan, technical fit assessment | Environment data handling, IP protection |
| 3. Formal Procurement | harness-tm | RFP response, compliance matrix, pricing volume | Pricing confidentiality, competitive intel protection |
| 4. Enablement & Readiness | harness-sen | Playbooks, battle cards, training materials | Competitive intel classification in content |
| 5. Revenue Operations | harness-so | Pipeline report, forecast model, territory plan | Comp plan confidentiality, data access controls |
| 6. Negotiation & Close | harness-sales | Close plan, mutual action plan, contract terms | Contract terms review, pricing approval chain |
| 7. Onboarding & Handoff | harness-sales + harness-se | Handoff document, implementation plan, success criteria | Customer data transfer protocols |

### Scope Change Escalation

When a downstream phase discovers that an upstream phase's outputs are insufficient:

1. **Detection**: The current phase's evaluator identifies the gap as a blocker in `NN-eval.md`.
2. **Logging**: The coordinator adds a blocker entry to `progress.md` referencing the upstream phase and the specific missing artifact or content.
3. **Re-entry**: The upstream phase is re-entered with a targeted sprint that addresses only the identified gap.
4. **Resumption**: Once the upstream gap is resolved and passes evaluation, the downstream phase resumes.
