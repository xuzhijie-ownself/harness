# Changelog

## [0.9.1] - 2026-04-03

### Features Shipped
- **F-001**: Rename Authenticity Gate dimension `coherence` to `internal_consistency`

### Deferred
- None

### Stats
- Sprint count: 1
- Required features: 1/1 passing

### Summary
Renamed the Authenticity Gate dimension `coherence` to `internal_consistency` across all 6 base framework files to eliminate naming overlap with the harness-ea domain criterion `coherence`. Removed 3 disambiguation notes that existed solely because of the naming conflict. No logic changes -- text substitution only.

Files modified:
- `plugins/harness/skills/harness/SKILL.md` -- dimension table rename, disambiguation note removed
- `plugins/harness/skills/harness/references/patterns.md` -- JSON key rename, display label rename
- `plugins/harness/agents/generator.md` -- checklist item rename
- `plugins/harness/skills/harness/roles/generator.md` -- bullet label rename
- `plugins/harness/agents/evaluator.md` -- verification table rename, disambiguation note removed
- `plugins/harness/skills/harness/roles/evaluator.md` -- dimension list rename, disambiguation instruction removed

## [0.9.0] - 2026-04-03

### Features Shipped
- **F-001**: SKILL.md Authenticity Gate Section
- **F-002**: Evaluation Schema and Builder Report Template Updates
- **F-003**: Generator Pre-Implementation Checklist
- **F-004**: Generator Role Reference Update
- **F-005**: Evaluator Post-Grading Gate
- **F-006**: Evaluator Role Reference Update

### Deferred
- None

### Stats
- Sprint count: 2
- Required features: 6/6 passing

### Summary
Added a domain-agnostic Authenticity Gate to the harness base framework as a cross-cutting binary pass/fail quality gate. The gate prevents AI-generated generic/template output by enforcing 4 dimensions -- coherence, intentionality, craft, and fitness for purpose -- after domain criteria scoring.

Key changes:
- SKILL.md: New "Authenticity Gate" section after "Quantified Evaluation" defining all 4 dimensions, gate rules, and dual-side control
- patterns.md: Added `authenticity_gate` object to NN-evaluation.json schema (4 dimensions with pass/justification each) and authenticity self-check section to NN-builder-report.md template
- generator.md: Added pre-implementation authenticity checklist (prevention side)
- evaluator.md: Added step 5 post-grading authenticity gate (detection side)
- roles/generator.md and roles/evaluator.md: Added corresponding role reference sections

All new text uses generic middleware language with zero domain-specific terminology.

## [0.8.0] - 2026-04-02

### Features Shipped
- **F-001**: Business Analysis Domain Skill (harness-ba)
- **F-002**: Solution Architecture Domain Skill (harness-sa)
- **F-003**: Deployment & Ops Domain Skill (harness-ops)
- **F-004**: Phase Routing Table in SKILL.md
- **F-005**: Plugin Registration

### Deferred
- None

### Stats
- Sprint count: 4
- Required features: 5/5 passing

### Summary
Added 3 new domain skills completing the delivery pipeline coverage from business analysis through solution design to deployment:
- `harness-ba` activates for `domain_profile: business_analysis` with evaluation criteria: completeness, traceability, stakeholder_alignment, feasibility
- `harness-sa` activates for `domain_profile: solution_architecture` with evaluation criteria: design_coherence, technical_depth, integration_clarity, implementability
- `harness-ops` activates for `domain_profile: ops` with evaluation criteria: operational_readiness, automation_coverage, reliability_design, security_posture

Each skill follows the 10-section pattern established by harness-ea: activation check, methodology selection, development methodology, verification strategy, deliverable verification, evaluation criteria (4 criteria with 0-5 anchor tables), sprint contract checklists, reference materials, notation guide, repository structure, and anti-patterns.

Updated the main SKILL.md with routing entries, Domain Profiles table rows, and Domain Skill References for all three new skills. Verified plugin.json glob coverage.

## [0.7.0] - 2026-04-02

### Features Shipped
- **F-001**: Release artifacts to project root
- **F-002**: /init pre-flight guard
- **F-003**: /session post-flight release trigger + dependency resolution + handoff cleanup
- **F-004**: /run timeout safety + release verification
- **F-005**: /reset state preservation
- **F-006**: /release validation guards
- **F-007**: State validation in all commands
- **F-008**: Releaser manifest sync
- **F-009**: Harness SKILL.md workflow entry section
- **F-010**: harness-sdlc activation check
- **F-011**: harness-ea activation check

### Deferred
- None

### Stats
- Sprint count: 11
- Required features: 11/11 passing

### Summary
Added pre-flight/post-flight integrity guards to all 5 command entry points (/init, /session, /run, /reset, /release) and all 3 skill entry points (harness, harness-sdlc, harness-ea). Moved release artifacts to project root so they survive .harness/ cleanup. Added manifest version synchronization to the releaser agent.

---
*Generated by the releaser agent.*
