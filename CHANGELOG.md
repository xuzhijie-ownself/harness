# Changelog

## [2.0.1] - 2026-04-03

### Features Shipped
- **F-001**: Add README Sync to releaser -- releaser now verifies and updates README.md during every release

### Deferred
- None

### Stats
- Sprint count: 1
- Required features: 1/1 passing

### Summary
Added a "README Sync" section to the releaser role file (`plugins/harness/skills/harness/roles/releaser.md`). The releaser now automatically verifies and updates README.md as part of every release: version references, architecture diagrams, skills/profiles tables, and install command URLs. Discovery uses glob patterns (`plugins/*/skills/*/SKILL.md`) -- no hardcoded skill names. Prose and explanatory text are never rewritten; only factual content is updated. Patch release -- additive instruction change with no breaking changes.

## [2.0.0] - 2026-04-03

### Features Shipped
- **F-001**: Create harness-sdlc-suite plugin structure -- moved 5 domain skills to new skills-only plugin
- **F-002**: Create harness-sdlc-suite index skill -- domain registry with profiles, routing, and pipeline
- **F-003**: Make core SKILL.md domain-blind -- zero references to specific domain skills
- **F-004**: Update marketplace manifest -- two entries in plugins[] array
- **F-005**: Update Codex manifest -- dual skill paths array
- **F-006**: Update install scripts -- copy from both plugins, uninstall removes both
- **F-007**: Update README -- two-plugin architecture documentation

### Deferred
- None

### Stats
- Sprint count: 4
- Required features: 7/7 passing

### Summary
Breaking change: Refactored the harness from a single-plugin monolith into a two-plugin architecture. The core plugin (`harness`) is now domain-blind -- it contains all orchestration machinery (6 agents, 5 commands, profile system, authenticity gate, sprint loop) but zero references to specific domain skills. The SDLC suite plugin (`harness-sdlc-suite`) bundles the 5 existing domain skills (harness-sdlc, harness-ea, harness-ba, harness-sa, harness-ops) under a new index skill that serves as the domain registry.

This separation allows the core harness to be used standalone with a `custom` profile, and enables future domain skill suites (e.g., harness-research-suite) to be developed independently without modifying the core.

Updated: marketplace manifest (2 plugins), Codex manifest (dual skill paths), install scripts (both plugins), README (architecture diagram, install commands, domain skills table).

## [1.0.0] - 2026-04-03

### Features Shipped
- **F-001**: Agent file deduplication -- 6 agent files converted to thin YAML wrappers (-317 lines)
- **F-002**: Command pre-flight extraction -- shared validation block in SKILL.md
- **F-003**: SKILL.md trim -- non-core sections moved to references/advanced.md (-60 lines)
- **F-004**: Codex detection simplification -- 25-line procedure condensed to 10-line decision tree
- **F-005**: Conditional calibration -- calibration file required only when expected_sprint_count > 3
- **F-006**: Retrospective merge -- retros append to progress.md instead of separate files

### Deferred
- None

### Stats
- Sprint count: 3
- Required features: 6/6 passing

### Summary
Harness kernel simplification release. Reduced total prose across 19 core files by ~232 lines (9%) while preserving all functionality and maintaining dual-runtime compatibility (Claude Code + Codex). Agent files became thin YAML wrappers pointing to role files as single source of truth. Shared command pre-flight extracted to SKILL.md. Non-core SKILL.md sections moved to new references/advanced.md. Codex detection condensed to decision tree. Calibration made conditional for short runs. Retrospectives merged into progress.md. No behavioral changes. Marks harness as mature at v1.0.0.

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
Added 3 new domain skills completing the delivery pipeline coverage from business analysis through solution design to deployment.

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
Added pre-flight/post-flight integrity guards to all 5 command entry points and all 3 skill entry points. Moved release artifacts to project root so they survive .harness/ cleanup. Added manifest version synchronization to the releaser agent.

---
*Generated by the releaser agent.*
