---
name: harness-sdlc-suite
description: "Software delivery lifecycle domain skill suite for the harness framework. Index skill that provides domain profile routing, delivery pipeline phases, and references to all SDLC domain skills. Activated when any SDLC suite domain profile is selected (software, architecture, business_analysis, solution_architecture, ops)."
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

| Project Type | Phases | Security Level | Example |
|-------------|--------|----------------|---------|
| Quick prototype | 1 -> 6 | Baseline — spec.md security context + sdlc checklists | "Build me a CLI tool" |
| Internal tool | 1 -> 2 -> 4 -> 6 | Standard — + BA security requirements + SA threat model | "Automate our docket submissions" |
| Enterprise system | 1 -> 2 -> 3 -> 4 -> 6 -> 8 | Full — + EA security architecture + ops security posture | "Modernize our claims platform" |
| Architecture only | 1 -> 2 -> 3 | Design — requirements + architecture security | "Design our target-state EA" |

Each phase is a separate harness run (`/start` -> `/run` -> `/release`). Each run's output becomes the next run's input context. Every project type gets at least baseline security from Phase 1 (spec.md security context) + Phase 6 (sdlc checklists and anti-patterns). More phases = more security depth.

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

## Phase Handoff Protocol

When a project spans multiple delivery phases, each phase must produce defined outputs before the next phase can start. This protocol governs what crosses phase boundaries.

### Required Outputs per Phase

| Phase | Owning Skill | Required Output Artifacts | Security Output | Format |
|-------|-------------|--------------------------|-----------------|--------|
| 1. Discovery & Intake | harness core (planner) | `features.json`, `spec.md`, `state.json` | Security Context in spec.md | JSON + Markdown in `.harness/` |
| 2. Business Analysis | harness-ba | BRD, use case catalog, requirements traceability matrix | Security/privacy requirements in BRD | Markdown deliverables + updated `features.json` |
| 3. Enterprise Architecture | harness-ea | Capability map, target-state architecture, ADRs | Security zoning, trust boundaries | Markdown deliverables + updated `features.json` |
| 4. Solution Architecture | harness-sa | HLD, API specs, data model, C4 diagrams | STRIDE threat model for external components | Markdown deliverables + updated `features.json` |
| 5. Project Planning | harness core (coordinator) | Sprint plan, `state.json` with round targets | Security work in sprint backlog | JSON + Markdown in `.harness/` |
| 6. Software Development | harness-sdlc | Working code, tests, build artifacts | Secure code per sdlc checklists | Code + `.harness/sprints/` artifacts |
| 7. Testing & QA | harness-sdlc (evaluator) | Evaluation reports, test results, `NN-eval.json` | Security test results (SAST, dep audit) | JSON + Markdown in `.harness/sprints/` |
| 8. Deployment & Handover | harness-ops | Deployment configs, runbooks, release artifacts | Security posture verified | IaC configs + Markdown + `release.json` |

### Phase Dependencies

Phases are sequential by default. The output of each phase is the input context for the next.

| Dependency | Relationship | Notes |
|-----------|-------------|-------|
| Phase 1 -> Phase 2 | Sequential | `spec.md` and `features.json` feed BA analysis |
| Phase 2 -> Phase 3 | Sequential | BRD and requirements feed EA design |
| Phase 3 -> Phase 4 | Sequential | Target-state architecture constrains solution design |
| Phase 2 -> Phase 4 | Parallel-eligible | SA can start from BRD if EA is not needed (e.g., internal tools) |
| Phase 4 -> Phase 5 | Sequential | HLD informs sprint decomposition and feature ordering |
| Phase 5 -> Phase 6 | Sequential | Sprint plan drives development rounds |
| Phase 6 -> Phase 7 | Sequential | Code must exist before evaluation |
| Phase 7 -> Phase 8 | Sequential | Passing evaluation required before deployment |

The Phase Routing table (above) shows which phases are included per project type. Skipped phases do not produce artifacts, and downstream phases accept the most recent upstream output as input.

### Artifact Handoff Format

Phase handoff uses the existing `.harness/` artifact layout:

- `features.json` carries forward across all phases, with each phase updating feature status and evidence.
- `spec.md` is the cross-phase contract -- downstream phases read it but do not modify it.
- Each phase run produces its own `sprints/` directory with proposals, reviews, reports, and evaluations.
- When starting a new phase, the planner reads the prior phase's final evaluation and `progress.md` as input context.

### Scope Change Escalation

When a downstream phase discovers that an upstream phase's outputs are insufficient:

1. **Detection**: The current phase's evaluator identifies the gap as a blocker in `NN-eval.md`.
2. **Logging**: The coordinator adds a blocker entry to `progress.md` referencing the upstream phase and the specific missing artifact or content.
3. **Re-entry**: The upstream phase is re-entered with a targeted sprint that addresses only the identified gap. The coordinator creates a new round scoped to the upstream phase's domain skill.
4. **Resumption**: Once the upstream gap is resolved and passes evaluation, the downstream phase resumes from where it was blocked.

Security gaps are a valid escalation trigger. Examples: SA finds no security requirements from BA → BA re-enters to capture them. Dev finds no auth pattern from SA → SA re-enters to design auth.

## Criteria Key Mapping

The `primary_scores` object in `NN-eval.json` uses 4 keys determined by the active domain profile. Replace the `<criterion_N>` placeholders from `patterns.md` with the exact keys below.

| Profile | `criterion_1` | `criterion_2` | `criterion_3` | `criterion_4` |
|---------|--------------|--------------|--------------|--------------|
| `software` | `product_depth` | `functionality` | `visual_design` | `code_quality` |
| `enterprise_architecture` | `coherence` | `standards_compliance` | `stakeholder_coverage` | `feasibility` |
| `business_analysis` | `completeness` | `traceability` | `stakeholder_alignment` | `feasibility` |
| `solution_architecture` | `design_coherence` | `technical_depth` | `integration_clarity` | `implementability` |
| `ops` | `operational_readiness` | `automation_coverage` | `reliability_design` | `security_posture` |

The `custom` profile defines its own 4 keys inline in the `spec.md` Domain Profile section. The evaluator reads those keys at evaluation time and uses them as `primary_scores` keys in `NN-eval.json`.

## Domain Verification Methods

Each domain profile defines what constitutes "runtime verification" for its artifact types. The evaluator uses the method below matching the active `domain_profile`.

| Profile | Verification Method | What to Check | Tooling |
|---------|-------------------|---------------|---------|
| `software` | Build + runtime + browser | App compiles, starts, responds to HTTP, UI renders correctly | Build tools, curl/HTTP, Playwright/browser |
| `enterprise_architecture` | Deliverable completeness + cross-reference integrity | Required docs exist per phase, internal references resolve, no dangling IDs | Grep, file existence checks |
| `business_analysis` | Deliverable completeness + scenario walkthrough | Required sections present, requirement IDs trace end-to-end, no orphaned requirements | Grep, traceability matrix validation |
| `solution_architecture` | Deliverable completeness + contract validation | Design docs exist, API specs parse, cross-references resolve, ADRs cover key decisions | Grep, schema validation (OpenAPI/AsyncAPI) |
| `ops` | Config validation + dry-run + completeness | IaC configs lint-clean, pipeline definitions parse, runbooks have required sections | Linters (terraform validate, kubeval), file checks |

The `custom` profile defines its own verification method in `spec.md`. When no domain-specific tooling is available, the evaluator falls back to deliverable completeness checks: file existence and required section presence.
