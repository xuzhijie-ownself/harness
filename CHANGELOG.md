# Changelog

## [2.2.2] - 2026-04-06

### Features Shipped
- **F-015**: Script hardening — JSDoc annotations, runtime validation, circular dep detection, error standardization, git escaping fix
- **F-016**: Feature-update subcommand — CLI mutation of feature.passes/status/maturity
- **F-017**: Per-step metrics — lib/metrics.mjs, metrics-summary subcommand, file_changes + evaluation_scores in cost_tracking
- **F-018**: Structured event logging — lib/events.mjs, log-event/read-events subcommands, append-only events.jsonl
- **F-019**: Postmortem command — `/harness:postmortem` with Timeline, Score Trends, Failure Analysis, Process Compliance, Recommendations

### Fixes
- Round numbering offset: initializer now documents `current_round: 0` so first increment lands on 1
- Error recovery: coordinator writes handoff.md before retry on connection errors
- `postmortem-data` subcommand: deterministic data gathering for LLM synthesis

### Stats
- Sprint count: 3
- Required features: 5/5 passing
- Total subcommands: 12 (was 7 in v2.2.1)

## [2.2.1] - 2026-04-04

### Features Shipped
- **F-011**: Fix evaluator codex scope -- codex review now applies to all changes including documentation
- **F-012**: Build harness-companion.mjs -- 7 subcommands for mechanical harness operations (feature-select, state-mutate, auto-commit, validate-artifacts, progress-append, check-stop, cleanup-sprints)
- **F-013**: Wire scripts into hooks and docs -- hooks.json, session.md, coordinator.md updated to call scripts
- **F-014**: End-to-end verification -- all subcommands tested against real harness artifacts

### Stats
- Sprint count: 3
- Required features: 4/4 passing

### Summary
Script automation for harness mechanical operations. ~60% of the harness workflow (state updates, feature selection, auto-commit, artifact validation, progress tracking) is now handled by `harness-companion.mjs` — a zero-dependency Node.js ES module with atomic JSON writes and structured stdout. Reduces LLM token burn on deterministic tasks. Also fixed the evaluator's implicit documentation-only exemption for codex review.

## [2.2.0] - 2026-04-04

### Breaking
- **F-003**: `/harness:init` renamed to `/harness:start` to avoid collision with Claude Code built-in `/init`

### Core Fixes
- **F-001**: Complete `architecture` to `enterprise_architecture` domain profile rename
- **F-002**: Remove domain-specific leaks from core — generic evaluation schema, runtime verification, cross-domain composability
- **F-003**: Rename `/init` command to `/start`

### Suite Index Additions
- **F-004**: Cross-phase handoff protocol with 8-phase output table, dependency matrix, scope escalation
- **F-005**: Criteria key mapping table for all 5 domain profiles
- **F-006**: Domain verification methods table (what "runtime verification" means per profile)

### Domain Skill Depth
- **F-007**: EA — Zachman framework, FEAF phases, ADR template, ArchiMate tool guidance, workshop template
- **F-008**: BA — Elicitation interview template, MoSCoW/Kano/weighted prioritization, sign-off workflow, traceability matrix
- **F-009**: SA — DDD strategic+tactical design, OpenAPI/AsyncAPI templates, STRIDE threat modeling, capacity modeling
- **F-010**: Ops — GitOps reconciliation, SRE SLO/SLI/error budgets, runbook template, P0-P4 incident response, DORA metrics

### Stats
- Sprint count: 6
- Required features: 10/10 passing

### Summary
Major SDLC suite completeness release. Core framework made fully domain-agnostic. All 5 domain skills (software, EA, BA, SA, ops) now have practical templates, tool guidance, and methodology depth. ~2,700 lines added across the suite.

## [2.1.0] - 2026-04-04

### Features Shipped
- **F-001**: Add README Sync to releaser -- releaser now verifies and updates README.md during every release
- **F-002**: Fix Codex evaluation detection and review integration -- 3-source detection with any-one-passes semantics, /codex:adversarial-review as primary review method

### Deferred
- None

### Stats
- Sprint count: 2
- Required features: 2/2 passing

### Summary
Fixed the evaluator Codex detection pre-flight which always fell back to Claude-only review. The detection logic in `advanced.md` was rewritten to check 3 sources (project `enabledPlugins`, global `extraKnownMarketplaces`, CLI on PATH) with any-one-passes semantics. The review method was changed from a raw codex CLI call to `/codex:adversarial-review` plugin skill with severity-to-BLOCKING/NON-BLOCKING mapping. The evaluator.md condensed decision tree was updated to match the new 3-check procedure. Also includes the README Sync feature from the prior sprint (F-001), which adds automatic README.md verification and update during every release.

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
