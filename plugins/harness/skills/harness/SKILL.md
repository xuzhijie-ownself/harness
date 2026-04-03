---
name: harness
description: Designs and runs Anthropic-style long-running application harnesses for autonomous coding. Use when turning a short prompt into a multi-agent workflow, dispatching initializer/planner/generator/evaluator/coordinator roles, tracking completion through a machine-readable feature list, negotiating sprint contracts before coding, making incremental progress on failing features across sessions, or running until the required feature set passes. Also activate for /init, /session, /run, /reset commands, context reset with handoff files, supervised vs continuous execution modes, or questions about Anthropic harness design patterns and context anxiety.
---

# Harness

> **Domain-agnostic.** This harness works for any project type — web apps, CLI tools, APIs, libraries, infrastructure, data pipelines, mobile apps, or any software development workflow. The patterns below are not specific to any tech stack or domain.

Blend the two Anthropic articles rather than following only one of them:

- The November 26, 2025 article contributes the initializer, feature-list ledger, progress log, and incremental one-feature-at-a-time completion discipline.
- The March 24, 2026 article contributes the planner/generator/evaluator role split, sprint contracts, skeptical QA, and model-sensitive simplification.

If the harness keeps creating new sprints but never finishes, it is missing the 2025 completion machinery.
If the harness finishes in one sprint without a written rationale, it is no longer clearly following the 2026 sprinted harness.

## Article Default

The default harness should have:

- an initializer phase
- a machine-readable feature list with explicit pass/fail status
- a planner when the user prompt is too short to define a full app
- a generator
- an evaluator
- a coordinator when the user wants continuous unattended progress
- bounded implementation rounds or sprints
- iterative evaluator feedback
- a project-level stop condition

The goal is not to maximize the number of sprints.
The goal is to drive the required feature set to passing status and stop.

## GAN Pattern

This harness follows a GAN-like (Generative Adversarial Network) pattern from Anthropic's engineering articles:

- **Generator** produces artifacts (code, documents, configs, or domain-appropriate outputs).
- **Evaluator** adversarially grades the output with skeptical QA — "mostly works" is a fail.
- **Loop**: generate → evaluate → feedback → regenerate until acceptance.
- **Separation rule**: The generator cannot self-approve. The evaluator cannot edit product artifacts. This separation is the core integrity guarantee.

The adversarial tension between generator and evaluator prevents the common failure mode where a model is too lenient grading its own work. This pattern applies regardless of domain — whether building software, writing tender documents, or designing architecture.


## Workflow Entry

Whenever this skill is activated (by any agent, command, or direct invocation):

### State Check
1. Verify `.harness/` directory exists. If not -> suggest `/harness:init`
2. Read `.harness/state.json` -> verify `mode`, `variant`, `current_sprint_phase` exist
3. Read `.harness/features.json` -> verify at least one feature exists
4. Read `.harness/config.json` -> use defaults for missing fields
5. Read `release.json` (project root) if exists -> know current version

### Domain Skill Routing
Based on `domain_profile` in state.json or spec.md:
- `software` -> also read `harness-sdlc` skill
- `architecture` -> also read `harness-ea` skill
- `business_analysis` -> also read `harness-ba` skill
- `solution_architecture` -> also read `harness-sa` skill
- `ops` -> also read `harness-ops` skill
- `custom` -> read spec.md for custom criteria
- If missing -> default to `software`

### Integrity Invariants
- features.json `passes` field only changed by evaluator evidence
- state.json `current_round` only incremented by coordinator or session
- release.json only written by releaser agent
- No command or skill may bypass these ownership rules

### Command Pre-Flight Validation

Every command (/init, /run, /session, /reset, /release) must run these validation steps before proceeding:

1. If the command requires `.harness/`: verify directory exists. If not -> "No harness found. Run /harness:init first." STOP.
2. If reading `state.json`: verify it contains `mode`, `variant`, `current_sprint_phase`. If missing fields -> warn and use defaults.
3. If reading `features.json`: verify it is valid JSON with at least one feature. If malformed -> STOP with error.
4. If reading `config.json`: verify it is valid JSON. If missing -> use defaults silently.

## Configuration

The harness uses `.harness/config.json` as the single configuration source for persistent preferences. State.json holds runtime state (round, phase, errors); config.json holds tunable settings.

The initializer creates a default `config.json` during `/init`. Users can edit it manually between sessions. Config.json values take precedence over state.json defaults when both define the same field (e.g., `context_reset_threshold`).

Key fields: `use_codex` (auto/on/off), `context_reset_threshold`, `auto_commit`, `auto_retro`, `retro_interval`, `max_retry_on_failure`, `evaluator_strictness` (lenient/standard/strict), `commit_prefix_pass`, `commit_prefix_fail`, `commit_tag`. See [references/patterns.md](references/patterns.md) for the full schema and field descriptions.

## Dispatch Rules

When the environment supports separate agents or sessions, dispatch explicitly:

1. Spawn an `initializer` agent to create the operational scaffold.
2. Spawn a `planner` agent to produce or refine the product spec if the prompt is underspecified.
3. Spawn a `generator` agent to propose the next bounded sprint and implement it.
4. Spawn an `evaluator` agent to review the contract, then test + review + grade the implementation.
5. Spawn a `coordinator` agent in continuous mode to advance rounds automatically until a stop condition is reached.
6. Spawn a `releaser` agent after all required features pass or when the user requests `/release`.

Do not collapse these into one agent unless the environment truly cannot separate them.
If you are forced to use one agent, state that the run is an approximation and not faithful role separation.

Use these ownership boundaries:

- Initializer owns setup artifacts only.
- Planner owns product-spec and execution-strategy artifacts only.
- Generator edits product code and generator-owned reports only.
- Evaluator does not edit product code; it writes testing, review, QA, and acceptance artifacts only.
- Coordinator owns run-state, loop control, and decomposition decisions only.

Use role-scoped references so each subagent reads only the context it needs:

- [roles/initializer.md](roles/initializer.md)
- [roles/planner.md](roles/planner.md)
- [roles/generator.md](roles/generator.md)
- [roles/evaluator.md](roles/evaluator.md)
- [roles/coordinator.md](roles/coordinator.md)
- [roles/releaser.md](roles/releaser.md)
- [references/patterns.md](references/patterns.md) for shared schemas and templates only

## Initializer

The initializer exists to prevent endless re-planning and drifting scope.

Initializer responsibilities:

- Create the working harness scaffold.
- Write `.harness/features.json`.
- Write `.harness/progress.md`.
- Write `.harness/init.md` or an equivalent setup artifact that explains how to start and verify the app.
- Write `.harness/state.json` when the run will continue automatically.
- Record the initial baseline status of required features as failing until they are proven.

Do not skip the feature list. It is the main completion ledger.

## Planner

- Expand a short prompt into an ambitious but finite product spec.
- Define the required feature set clearly enough that the initializer can track it.
- Stay focused on product context, user stories, feature depth, and high-level technical design.
- Avoid brittle low-level technical prescriptions.
- Do not keep adding roadmap items during execution unless the user changes scope or the evaluator proves a missing dependency blocks completion.
- Write an explicit execution strategy.

## Execution Strategy

Every planned app spec should include an `Execution strategy` section.

That section should declare:

- chosen harness variant
- chosen execution mode
- expected sprint count or a written rationale for why one sprint is acceptable
- default target ordering for failing required features
- whether multi-feature sprints are allowed
- why simplified mode is not yet justified, or the evidence that it is justified

If the run finishes in one sprint, the planner or coordinator should state why sprint decomposition was not load-bearing for this specific app.

## Generator

- Build against the accepted spec, the current feature list, and the accepted contract.
- At the start of every coding round, pick the highest-priority required feature that is still failing.
- Make incremental progress on that feature instead of opening new scope.
- Default to one failing required feature per sprint.
- Do not target multiple failing required features in one sprint unless the accepted execution strategy explicitly allows it and the contract includes a short grouping waiver.
- Implement only after evaluator review of the contract.
- Leave evidence behind: changed files, commands run, tests attempted, open risks, and which feature IDs may now pass.
- Self-evaluate, but never self-approve and never flip a feature to passing without evidence.

## Evaluator

- Act as skeptical QA, code reviewer, and tester — all in one pass.
- Review the proposed sprint contract before code is written.
- After implementation: write and run tests, review code quality, and grade acceptance.
- Interact with the running application the way a user would.
- For browser apps, use Playwright or an equivalent browser tool.
- For full-stack apps, test UI flows, API behavior, and database state when possible.
- Grade against hard thresholds for product depth, functionality, visual design, and code quality.
- Fail the sprint or round if any one criterion misses the bar.
- Update acceptance only after verification evidence exists.
- If Codex plugin is detected (`.claude/settings.json` has `"openai-codex"` in `extraKnownMarketplaces` or `"codex@openai-codex": true` in `enabledPlugins`), use the `codex` CLI for adversarial code review. Falls back to Claude-only review if the CLI is not installed or not authenticated.

### Runtime Verification Requirement

For software projects (`domain_profile: software`), the evaluator MUST read `skills/harness-sdlc/SKILL.md` for runtime verification procedures. Build-only verification (`npm run build` passing) is NOT sufficient — the evaluator must also:
1. Verify database is initialized (detect ORM, run migrations)
2. Verify the application starts without errors
3. Verify at least one API endpoint responds successfully
4. Verify health check passes

The SingPost project demonstrated that 14 features can pass build verification while the app crashes on startup due to an uninitialized database. Runtime verification prevents this class of failures.

## Coordinator

The coordinator exists to keep the run convergent and auditable.

Coordinator responsibilities:

- maintain `.harness/state.json`
- choose the next failing required feature after each accepted or failed round
- enforce the execution strategy chosen in the spec
- record when the run pauses, retries, simplifies, or stops
- prevent silent drift from sprinted mode into simplified mode

The coordinator should also write a short rationale whenever it:

- groups multiple features into one sprint
- changes the expected sprint plan
- pauses for repeated failure
- switches harness variant

## Release & Versioning

The releaser agent manages version bumps, changelog generation, and git tags.

### When to Release

- Automatically: the coordinator spawns the releaser after all required features pass.
- Manually: the user runs `/release` to cut a release checkpoint mid-run.

### Releaser Role

- Owns: `release.json` (project root), `CHANGELOG.md` (project root)
- Reads: `features.json`, `state.json`, `summary.md`, `progress.md`
- Does NOT modify product code or feature status

### release.json (project root)

Tracks all releases with version history. Schema documented in [references/patterns.md](references/patterns.md).

Fields: `current_version`, `releases[]` (version, date, features_shipped, features_deferred, changelog, sprint_count, previous_version), `next_version`.

### Changelog

Generated from feature evidence in `features.json`. Each entry lists shipped features, deferred features, sprint count, and notable changes.

### Version Bump Rules

| Condition | Bump | Example |
|-----------|------|---------|
| Only bug fixes or reliability improvements | patch | 0.1.0 -> 0.1.1 |
| At least one new feature shipped | minor | 0.1.0 -> 0.2.0 |
| Breaking changes to existing behavior | major | 0.2.0 -> 1.0.0 |

### Git Tags

The releaser creates an annotated git tag for each release: `git tag -a vX.Y.Z -m "Release vX.Y.Z"`.

### Manifest Synchronization

After creating the release commit and git tag, the releaser syncs the new version into all plugin manifest files:

1. `.claude-plugin/marketplace.json` -- update `plugins[0].version`
2. `plugins/harness/.claude-plugin/plugin.json` -- update `version`
3. `.codex-plugin/plugin.json` -- update `version`

This prevents version drift between `release.json` and the plugin descriptors.

### Dispatch

- [roles/releaser.md](roles/releaser.md)

## Feature Maturity

Features have a `maturity` field alongside the binary `passes` flag. Maturity adds granularity for tracking overall project readiness:

| Level | Meaning | Scoring Trigger |
|-------|---------|----------------|
| `draft` | Initial implementation, known gaps | Any criterion below 3 |
| `functional` | Core behavior works | All criteria >= 3 (also sets passes = true) |
| `reviewed` | Passed evaluation with acceptable scores | All criteria >= 3, evaluator accepted |
| `polished` | Production-ready quality | All criteria >= 4 |
| `accepted` | Stakeholder sign-off | Set manually by user/stakeholder, not by evaluator |

The evaluator sets maturity automatically based on scores after grading. The `accepted` level is never set by the evaluator — it requires explicit stakeholder sign-off, which is particularly relevant for architecture, tender, and business_analysis domain profiles.

## Domain Profiles

The harness supports multiple domains through a profile system. Each profile defines 4 primary evaluation criteria, artifact taxonomy, verification methods, and stakeholder lens.

| Profile | Criteria | Artifact Types | Stakeholder Lens |
|---------|----------|---------------|-----------------|
| `software` (default) | product_depth, functionality, visual_design, code_quality | Code, tests, configs, UI | End users, developers |
| `architecture` | coherence, standards_compliance, stakeholder_coverage, feasibility | ADRs, capability maps, diagrams | Enterprise architects, CTO |
| `tender` | requirements_coverage, regulatory_alignment, cost_justification, risk_mitigation | Spec docs, compliance matrices | Procurement, legal |
| `research` | rigor, novelty, reproducibility, clarity | Papers, notebooks, citations | Reviewers, peers |
| `content` | clarity, engagement, accuracy, brand_alignment | Articles, scripts, briefs | Audience, editors |
| `business_analysis` | completeness, traceability, stakeholder_alignment, feasibility | BRDs, use cases, process maps | Business owners, PMs |
| `solution_architecture` | design_coherence, technical_depth, integration_clarity, implementability | HLDs, API specs, data models, C4 diagrams | Solution architects, tech leads |
| `ops` | operational_readiness, automation_coverage, reliability_design, security_posture | IaC configs, pipelines, runbooks, dashboards | SREs, platform engineers, DevOps |
| `custom` | User-defined (4 criteria in spec) | User-defined | User-defined |

### Cross-Domain Composability
A project can declare a primary profile + optional secondary profile. The evaluator scores both sets of criteria.

### Business Analysis Foundation
- `source_requirement` field in features.json links features to original business needs
- Deliverables classified as: primary, supporting, governance
- Stakeholder lens influences how the evaluator grades quality

### Domain Skill References

When `domain_profile` is `software`, the evaluator and generator should read the `harness-sdlc` domain skill at `skills/harness-sdlc/SKILL.md` for:
- Tech-stack-specific verification procedures
- ORM/database detection and migration commands
- Server framework detection and startup verification
- Test framework detection and execution
- Evaluation criteria anchors with concrete 0-5 descriptions
- Sprint contract checklist templates

The domain skill provides the HOW; the harness provides the WHEN.

When `domain_profile` is `architecture`, the evaluator and generator should read the `harness-ea` domain skill at `skills/harness-ea/SKILL.md` for:
- Architecture framework selection (TOGAF, Zachman, FEAF, ArchiMate, SAFe, Lean EA)
- Architecture development methodology (ADR-First, Capability-First, Viewpoint-Driven)
- Deliverable verification procedures (document structure, cross-references, notation)
- TOGAF phase gate checks with required deliverables
- Evaluation criteria anchors (coherence, standards_compliance, stakeholder_coverage, feasibility)
- Sprint contract checklist templates for each TOGAF phase

When `domain_profile` is `business_analysis`, the evaluator and generator should read the `harness-ba` domain skill at `skills/harness-ba/SKILL.md` for:
- BA methodology selection (Waterfall BA, Agile BA, Lean BA, Design Thinking BA, Six Sigma BA)
- Development methodology (Requirements-First, User-Story-First, Process-First, Data-First, Stakeholder-First)
- Deliverable verification procedures (document structure, cross-references, traceability)
- BRD section gate checks with required content
- Evaluation criteria anchors (completeness, traceability, stakeholder_alignment, feasibility)
- Sprint contract checklist templates for BA phases

When `domain_profile` is `solution_architecture`, the evaluator and generator should read the `harness-sa` domain skill at `skills/harness-sa/SKILL.md` for:
- SA framework selection (C4 Model, Arc42, 4+1 View, Domain-Driven Design, Microservices Patterns)
- Development methodology (API-First, Component-First, Data-First, Event-First, Contract-First)
- Deliverable verification procedures (API spec linting, component boundary checks, data model consistency)
- C4 level gate checks and Arc42 section gate checks
- Evaluation criteria anchors (design_coherence, technical_depth, integration_clarity, implementability)
- Sprint contract checklist templates for SA phases

When `domain_profile` is `ops`, the evaluator and generator should read the `harness-ops` domain skill at `skills/harness-ops/SKILL.md` for:
- Ops methodology selection (GitOps, Platform Engineering, SRE, DevOps, Infrastructure-as-Code)
- Development methodology (Pipeline-First, Infrastructure-First, Monitoring-First, Runbook-First, Security-First)
- Deliverable verification procedures (IaC linting, pipeline syntax validation, secret scanning)
- Pipeline stage gate checks with required stages
- Evaluation criteria anchors (operational_readiness, automation_coverage, reliability_design, security_posture)
- Sprint contract checklist templates for ops phases

## Quantified Evaluation

Do not rely on prose-only judgments. Every evaluation round should produce numeric criterion scores plus granular contract-check results.

Primary criteria are determined by the domain profile declared in spec.md. The default `software` profile uses: product_depth, functionality, visual_design, code_quality.

Score each primary criterion on a `0-5` scale:

- `0`: absent, broken, or not meaningfully implemented
- `1`: severely incomplete or mostly non-functional
- `2`: partially present but below acceptable quality
- `3`: acceptable baseline for the sprint goal
- `4`: strong implementation with only minor issues
- `5`: excellent implementation for the scoped work

Hard rules:

- Any primary criterion below `3` fails the round.
- Any required contract check marked failed fails the round.
- Any blocking bug in a core user flow fails the round even if the numeric average looks acceptable.
- Use integer scores only. Do not use vague bands like "3-ish" or "high 2".

You may report an average score as a trend signal, but never use the average to override a failed criterion.

## Authenticity Gate

After the domain criteria scoring (0-5 scale) above, every evaluation round applies a binary Authenticity Gate. This gate is a cross-cutting quality check that detects technically-competent-but-generic output -- artifacts that score adequately on domain criteria yet show no evidence of project-specific decision-making.

The gate checks four dimensions. Each dimension is binary pass/fail -- not scored on a 0-5 scale. The gate runs AFTER domain criteria scoring and is independent of those scores.

### Dimensions

| Dimension | Definition |
|-----------|------------|
| **internal_consistency** | All artifacts share consistent conventions -- structure, terminology, and style form a unified whole rather than appearing assembled from different sources. |
| **intentionality** | Evidence of project-specific decisions tailored to THIS project's context. Artifacts reflect deliberate choices rather than unmodified defaults or generic template output. |
| **craft** | Technical fundamentals are correct for the artifact type -- consistent structure, clear hierarchy, uniform conventions, and formatting that follows established standards for the deliverable format. |
| **fitness_for_purpose** | Every deliverable is usable by the target audience without requiring additional explanation. Artifacts serve their stated purpose and can be consumed as-is. |

### Gate Rules

- The gate is **binary pass/fail** per dimension. There is no partial credit.
- The gate runs **after** the 4 domain criteria are scored (0-5). Domain scores are recorded first; then the authenticity gate is applied as an overlay.
- If **any** dimension fails, the round **fails** -- regardless of how high the domain criteria scores are.
- The gate does not replace domain criteria scoring. It adds a second layer of quality assurance that catches a different class of defects (generic/template output vs. domain-specific quality).

### Dual-Side Control

The authenticity gate operates as a dual-side control:

- **Generator side (prevention)**: The generator applies a pre-implementation checklist covering all 4 dimensions before building. This prevents generic output at the source.
- **Evaluator side (detection)**: The evaluator applies a post-grading gate after scoring domain criteria. This catches any generic output that slipped through the generator's self-check.

Both sides reference the same 4 dimensions. The generator's checklist and the evaluator's gate are two views of the same quality standard.


## Criterion Design

Each sprint contract must define:

- a granular checklist under the domain profile's primary criteria
- whether each check is required or advisory
- the verification method for each check

The evaluator should score both:

- the four primary criteria
- the contract checklist items

Primary criteria measure overall quality.
Checklist items measure whether the sprint actually satisfied the contract.

## Evaluator Output Contract

Every evaluation round should emit all of these:

- `.harness/sprints/NN-evaluation.md`
- `.harness/sprints/NN-evaluation.json`

The Markdown artifact is for human review.
The JSON artifact is for machine-readable continuity across long runs.

The Markdown artifact must include these sections:
- **Test Results**: tests written, suite results, coverage
- **Code Review**: findings classified as BLOCKING or NON-BLOCKING
- **Replayable Steps**: exact verification actions for reproducing the evaluation

The JSON artifact should include at least:

- `decision`
- `target_feature_ids`
- `primary_scores`
- `contract_checks`
- `blockers`
- `non_blocking_issues`
- `feature_evidence`
- `test_results`
- `review_findings`

Do not mark a feature as passing based only on the Markdown summary if the structured evaluation artifact is missing or inconsistent.

## Feature-List Discipline

Maintain a machine-readable `.harness/features.json` with at least:

- `id`
- `title`
- `required`
- `priority`
- `status`
- `passes`
- `evidence`
- `notes`

Rules:

- Every required feature starts as not passing.
- A feature becomes passing only after evaluator-backed evidence.
- Do not invent new required features mid-run unless the planner or user changes scope.
- Do not open a new sprint until the current target feature IDs are either accepted, explicitly deferred, or blocked by a documented dependency.
- Prefer "finish one failing feature cleanly" over "start three more features optimistically."

## Session Start Checklist

At the start of every coding session or reset session:

1. Read `.harness/progress.md`.
2. Read `.harness/features.json`.
3. Read the execution strategy in `.harness/spec.md`.
4. Start the app and verify the current baseline.
5. Choose the highest-priority required feature that is still failing.
6. Work only on that bounded scope unless a documented blocker forces a contract revision.

If the session starts by inventing a new roadmap instead of checking the failing feature list, the harness is drifting.

## Auto-Commit Protocol

Every sprint must result in a git commit. This prevents work loss and creates a traceable history.

### Commit Message Format

| Outcome | Prefix | Format |
|---------|--------|--------|
| Evaluation PASS | `feat` | `feat(F-XXX): <title> — sprint N [harness]` |
| Evaluation FAIL | `wip` | `wip(F-XXX): <title> — sprint N attempt [harness]` |
| Implementation pre-eval | `wip` | `wip(F-XXX): implement <title> — sprint N [harness]` |

### Rules
- Never leave changes uncommitted between sprints
- Generator commits after implementation (before evaluation)
- Coordinator/session commits after evaluation result
- Use `git add -A` to stage all changes
- The `[harness]` tag identifies automated commits

## Execution Modes

Choose one mode explicitly:

- `supervised`: complete one bounded round, surface the result, and wait for the user before advancing
- `continuous`: keep advancing rounds automatically until all stop conditions are satisfied or a documented blocker pauses the run

Use `continuous` when the user asks the harness to keep going without manual retriggering.
Use `supervised` when the user wants tight review between rounds.

## Choose The Right Harness Variant

### Variant A: Full-Stack Sprinted Harness

Use this by default when the user asks to follow the 2026 app-harness article.

- Planner expands a short prompt into a rich product spec.
- Initializer creates the completion ledger and baseline artifacts.
- Generator works one bounded sprint at a time from the spec and feature list.
- Default cadence is one failing required feature per sprint.
- Evaluator reviews the proposed sprint before implementation.
- Coordinator advances the loop automatically in continuous mode.
- Generator implements the sprint.
- Evaluator tests, reviews, and grades the live app — either accepts the targeted feature IDs or sends the sprint back.
- The build can remain one continuous run with compaction rather than resets.

### Variant B: Reset-Based Compatibility Harness

Fallback for context anxiety or environments that cannot sustain continuous sessions. See [references/advanced.md](references/advanced.md) for full details.

### Variant C: Simplified Harness

Remove sprint decomposition when evidence shows it is no longer adding value. See [references/advanced.md](references/advanced.md) for full details.

## Required Evidence

Every role-owned artifact must include a metadata block:

- `Role`
- `Agent`
- `Inputs`
- `Status`

For review and evaluation artifacts, also include:

- `Reviewed by`
- `Decision`

For feature-list updates, include evaluator-backed `evidence` entries tied to feature IDs.

For evaluation artifacts, also include:

- numeric primary scores
- contract-check results
- blockers versus non-blocking issues
- criterion-level reasoning tied to evidence
- a structured JSON mirror of the same decision
- test results (tests written, pass/fail counts, coverage)
- code review findings (blocking and non-blocking)
- replayable verification steps

## Execution Loop

In Variant A, run this loop:

1. Initializer writes or updates `.harness/features.json` and `.harness/progress.md`.
2. Coordinator initializes or updates `.harness/state.json` in continuous mode.
3. Planner writes or updates `.harness/spec.md` if the spec is incomplete.
4. Generator selects the highest-priority failing required feature ID and writes `.harness/sprints/NN-contract.md`.
5. If the generator wants multiple target feature IDs, the contract should include a grouping waiver tied to the execution strategy.
6. Evaluator writes `.harness/sprints/NN-contract-review.md`.
7. Generator revises the contract until accepted.
8. Generator implements the sprint and writes `.harness/sprints/NN-builder-report.md`.
9. Evaluator runs tests, reviews code, and grades — writes `.harness/sprints/NN-evaluation.md` and `.harness/sprints/NN-evaluation.json`.
10. Evaluator-backed evidence updates `.harness/features.json`.
11. Coordinator either advances to the next failing required feature, pauses on a blocker, or stops if completion conditions are met.

Do not keep increasing sprint count without reducing the number of failing required features.

## Required Artifacts

Start with:

- `.harness/features.json`
- `.harness/progress.md`
- `.harness/init.md` + `.harness/init.sh` + `.harness/init.bat`
- `.harness/state.json` in continuous mode
- `.harness/spec.md`
- `.harness/sprints/NN-contract.md`
- `.harness/sprints/NN-contract-review.md`
- `.harness/sprints/NN-builder-report.md`
- `.harness/sprints/NN-evaluation.md`
- `.harness/sprints/NN-evaluation.json`

Release artifacts (project root -- persist across .harness/ resets):

- `release.json` -- created by releaser after all required features pass
- `CHANGELOG.md` -- generated changelog from feature evidence

Optional supporting artifacts:

- `.harness/handoff.md` for reset-based runs only
- `.harness/summary.md` for final wrap-up
- `.harness/evaluator-calibration.md` when subjective scoring needs tighter anchors
- `.harness/decomposition.md` when sprint planning needs an auditable rationale outside the main spec
- `.harness/cost-log.md` for tracking per-sprint cost and duration

Use the shared schemas in [references/patterns.md](references/patterns.md).

## Stop Conditions

A run is complete when one of these is true:

- All required features in `.harness/features.json` have `passes: true`.
- The accepted shipped scope is complete and any remaining features are explicitly marked deferred or out of scope.
- The evaluator marks a hard blocker that requires user intervention.

If none of these conditions are checked, the harness has no definition of done.

## Continuous-Mode Pause Rules

In continuous mode, pause and record the reason if any of these happen:

- the same target feature fails evaluator review twice without reducing the failing surface
- no required feature moves from failing to passing after two consecutive rounds
- generator and evaluator evidence disagree on a blocking bug and the disagreement is unresolved
- the run needs a variant change that was not declared in the execution strategy

Do not keep looping just because budget remains.

## Disagreement Protocol

When generator and evaluator evidence conflict:

1. Prefer evaluator-owned acceptance status.
2. Record the disagreement in the evaluation artifact.
3. If the disagreement is about a blocking bug, keep the target feature failing until replayable evidence resolves it.
4. If the disagreement cannot be resolved in the current round, pause continuous mode rather than silently passing.

## Evaluation Calibration

The evaluator uses a structured rubric system with **anchored examples** to prevent scoring drift.

### Rubric Anchors

Persisted calibration file (`.harness/evaluator-calibration.md`) is required only when `expected_sprint_count > 3`. For shorter runs (3 or fewer sprints), the evaluator scores with anchors conceptually without persisting them to a file.

When required: after the first evaluation round, create `evaluator-calibration.md` with concrete score anchors (descriptions of what 2, 3, 4, and 5 look like) for each of the domain profile's primary criteria. Review and update every 3 rounds.

### Comparative Scoring

For each criterion every round, the evaluator must:
- Compare against the prior round's score for the same criterion
- If a score changes by more than 1 from the prior round, justify WHY in the evaluation artifact
- Record the comparison in `NN-evaluation.md` under a "Score Justification" section
- The coordinator flags unjustified score jumps >1

## Sprint Retrospective

After every `retro_interval` rounds (from config.json, default 3) or after any FAIL evaluation, the coordinator appends a `## Retrospective -- Rounds X-Y` section to `.harness/progress.md` (not a separate file). The section covers: what worked, what didn't, adjustments for next rounds, patterns detected.

The coordinator reads the latest retrospective section in progress.md before starting each new round and incorporates learnings into generator/evaluator dispatch instructions.

## Harness Decay

Harness assumptions decay with model improvements. Test removal methodically. See [references/advanced.md](references/advanced.md).

## Context Reset vs Compaction

Use compaction when context < 60% and quality is stable. Use /reset when context > 75% or model shows context anxiety. See [references/advanced.md](references/advanced.md).

## Simplify Methodically

Remove one component at a time and observe impact. Keep the feature list and evaluator-led QA as last line of defense. See [references/advanced.md](references/advanced.md).

## Reliability

### API Error Recovery

If an agent spawn fails (timeout, API error, crash):
1. Log the error in `state.json` `errors` array.
2. Wait 30 seconds, then retry the spawn once.
3. If the retry fails, set `stop_reason` and STOP. Never silently continue.

### Context Freshness

Track `rounds_since_reset` in `state.json`. After `context_reset_threshold` rounds (default: 3), the coordinator pauses the run, writes a handoff file, and resets the counter. The next `/session` or `/run` picks up from the handoff automatically.

### Sprint Resume

`state.json` tracks `current_sprint_phase` (one of: `idle`, `contract`, `implementation`, `evaluation`). When a session starts, it checks this field and resumes from the last active phase instead of restarting the sprint.

### Evaluator Enforcement

The coordinator MUST NOT update `features.json` directly. Only evaluator evidence in `NN-evaluation.json` `feature_evidence` may flip pass/fail status. Before advancing to the next round, the coordinator verifies that `NN-contract.md`, `NN-evaluation.md`, and `NN-evaluation.json` all exist.

### Cost Tracking

`state.json` includes a `cost_tracking` object with per-round timestamps for each phase (contract, implementation, evaluation). The coordinator updates these at phase boundaries. An optional `cost-log.md` artifact provides a human-readable summary.

### Cross-Platform Init Scripts

The initializer generates both `init.sh` (bash) and `init.bat` (Windows CMD) so the harness works on any platform. `init.sh` should detect Windows (MSYS/Git Bash) and adapt accordingly.

## Review The Harness

Use the review checklist in [references/advanced.md](references/advanced.md) to verify whether a run truly followed the harness.
