---
name: harness-sdlc-suite
description: Software delivery lifecycle domain skill suite for the harness framework. Index skill that provides domain profile routing, delivery pipeline phases, and references to all SDLC domain skills. Activated when any SDLC suite domain profile is selected (software, architecture, business_analysis, solution_architecture, ops).
---

# Harness SDLC Suite

> **Domain registry for software delivery.** This index skill routes to the correct domain skill based on the `domain_profile` declared in `state.json` or `spec.md`. It also defines the end-to-end delivery pipeline that connects all domain skills.

## Domain Profiles

Each domain declares 4 primary evaluation criteria, artifact taxonomy, verification methods, and stakeholder lens.

| Profile | Criteria | Artifact Types | Stakeholder Lens |
|---------|----------|---------------|-----------------|
| `software` (default) | product_depth, functionality, visual_design, code_quality | Code, tests, configs, UI | End users, developers |
| `enterprise_architecture` | coherence, standards_compliance, stakeholder_coverage, feasibility | ADRs, capability maps, diagrams | Enterprise architects, CTO |
| `business_analysis` | completeness, traceability, stakeholder_alignment, feasibility | BRDs, use cases, process maps | Business owners, PMs |
| `solution_architecture` | design_coherence, technical_depth, integration_clarity, implementability | HLDs, API specs, data models, C4 diagrams | Solution architects, tech leads |
| `ops` | operational_readiness, automation_coverage, reliability_design, security_posture | IaC configs, pipelines, runbooks, dashboards | SREs, platform engineers, DevOps |

## Domain Skill Routing

Based on `domain_profile` in `state.json` or `spec.md`, load the matching domain skill:

| `domain_profile` | Skill Name | Relative Path |
|-------------------|------------|---------------|
| `software` | harness-sdlc | `../harness-sdlc/SKILL.md` |
| `enterprise_architecture` | harness-ea | `../harness-ea/SKILL.md` |
| `business_analysis` | harness-ba | `../harness-ba/SKILL.md` |
| `solution_architecture` | harness-sa | `../harness-sa/SKILL.md` |
| `ops` | harness-ops | `../harness-ops/SKILL.md` |

If `domain_profile` is `custom`, do not load any domain skill from this suite -- the project defines its own criteria inline in `spec.md`.

## End-to-End Delivery Pipeline

Domain skills map to phases in a delivery workflow. Not every project needs every phase -- the planner routes based on project type.

```
Customer Request
    |
    +- Phase 1: Discovery & Intake        (harness core -- /start + planner)
    +- Phase 2: Business Analysis          (harness-ba)
    +- Phase 3: Enterprise Architecture    (harness-ea)
    +- Phase 4: Solution Architecture      (harness-sa)
    +- Phase 5: Project Planning           (harness core -- planner + coordinator)
    +- Phase 6: Software Development       (harness-sdlc)
    +- Phase 7: Testing & QA               (harness-sdlc evaluator)
    +- Phase 8: Deployment & Handover      (harness-ops)
    |
    v
Delivered Product
```

## Phase Routing

| Project Type | Phases | Example |
|-------------|--------|---------|
| Quick prototype | 1 -> 6 | "Build me a CLI tool" |
| Internal tool | 1 -> 2 -> 4 -> 6 | "Automate our docket submissions" |
| Enterprise system | 1 -> 2 -> 3 -> 4 -> 6 -> 8 | "Modernize our claims platform" |
| Architecture only | 1 -> 2 -> 3 | "Design our target-state EA" |

Each phase is a separate harness run (`/start` -> `/run` -> `/release`). Each run's output becomes the next run's input context.

## Domain Skills

| Skill | Domain | Profile | What it provides |
|-------|--------|---------|-----------------|
| `harness-sdlc` | Software Development | `software` | Methodology selection, testing strategy, build/runtime verification, evaluation criteria anchors |
| `harness-ea` | Enterprise Architecture | `enterprise_architecture` | Architecture methodology (TOGAF/Zachman/FEAF), deliverable verification, TOGAF phase gates, evaluation criteria anchors |
| `harness-ba` | Business Analysis | `business_analysis` | BA methodology (Waterfall/Agile/Lean/Design Thinking/Six Sigma), requirements traceability, BRD verification, evaluation criteria anchors |
| `harness-sa` | Solution Architecture | `solution_architecture` | SA methodology (C4/Arc42/4+1/DDD/Microservices), API design verification, NFR compliance, evaluation criteria anchors |
| `harness-ops` | Deployment & Ops | `ops` | Ops methodology (GitOps/Platform Engineering/SRE/DevOps/IaC), deployment readiness, runbook verification, evaluation criteria anchors |

Domain skills are loaded automatically when the matching domain profile is selected during `/harness:start`.

## Cross-Domain Composability

A project can declare a primary profile + optional secondary profile. The evaluator scores both sets of criteria. For example, a project with `primary: software` and `secondary: ops` would score product_depth, functionality, visual_design, code_quality (from software) AND operational_readiness, automation_coverage, reliability_design, security_posture (from ops).

## Business Analysis Foundation

The `source_requirement` field in `features.json` links features to original business needs. This is particularly relevant for `business_analysis`, `enterprise_architecture`, and `solution_architecture` profiles where requirements traceability is a core evaluation criterion. Deliverables are classified as: primary, supporting, governance. The stakeholder lens influences how the evaluator grades quality.
