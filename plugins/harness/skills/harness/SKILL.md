---
name: harness
description: Designs and runs Anthropic-style long-running application harnesses for autonomous coding. Use when turning a short prompt into a multi-agent workflow, dispatching initializer/planner/generator/evaluator/coordinator roles, tracking completion through a machine-readable feature list, negotiating sprint contracts before coding, making incremental progress on failing features across sessions, or running until the required feature set passes. Also activate for /start, /session, /run, /reset commands, context reset with handoff files, supervised vs continuous execution modes, or questions about Anthropic harness design patterns and context anxiety.
---

# Harness

> **Domain-agnostic.** This harness works for any project type -- web apps, CLI tools, APIs, libraries, infrastructure, data pipelines, mobile apps, or any software development workflow. The patterns below are not specific to any tech stack or domain.

Blend the two Anthropic articles rather than following only one of them:

- The November 26, 2025 article contributes the initializer, feature-list ledger, progress log, and incremental one-feature-at-a-time completion discipline.
- The March 24, 2026 article contributes the planner/generator/evaluator role split, sprint contracts, skeptical QA, and model-sensitive simplification.

If the harness keeps creating new sprints but never finishes, it is missing the 2025 completion machinery.
If the harness finishes in one sprint without a written rationale, it is no longer clearly following the 2026 sprinted harness.

The goal is not to maximize the number of sprints.
The goal is to drive the required feature set to passing status and stop.

## GAN Pattern

This harness follows a GAN-like (Generative Adversarial Network) pattern:

- **Generator** produces artifacts (code, documents, configs, or domain-appropriate outputs).
- **Evaluator** adversarially grades the output with skeptical QA -- "mostly works" is a fail.
- **Loop**: generate -> evaluate -> feedback -> regenerate until acceptance.
- **Separation rule**: The generator cannot self-approve. The evaluator cannot edit product artifacts.

## Workflow Entry

Whenever this skill is activated:

### State Check
1. Verify `.harness/` directory exists. If not -> suggest `/harness:start`
2. Read `.harness/state.json` -> verify `mode`, `variant`, `current_sprint_phase` exist
3. Read `.harness/features.json` -> verify at least one feature exists
4. Read `.harness/config.json` -> use defaults for missing fields
5. Read `release.json` (project root) if exists -> know current version

### Domain Skill Routing
Based on `domain_profile` in state.json or spec.md:
- If a domain skill suite is installed, read its index skill for profile-to-skill routing
- `custom` -> read spec.md for custom criteria
- If missing -> default to `software`

### Integrity Invariants
- features.json `passes` field only changed by evaluator evidence
- state.json `current_round` only incremented by coordinator or session
- release.json only written by releaser agent

### Command Pre-Flight Validation

Every command (/start, /run, /session, /reset, /release) must:
1. Verify `.harness/` exists if required. If not -> STOP.
2. Validate `state.json` has `mode`, `variant`, `current_sprint_phase`. Warn on missing fields.
3. Validate `features.json` is valid JSON with at least one feature. STOP on malformed.
4. Validate `config.json` is valid JSON. Use defaults silently if missing.

## Configuration

The harness uses `.harness/config.json` for persistent preferences. State.json holds runtime state; config.json holds tunable settings.

Key fields: `context_reset_threshold`, `auto_commit`, `auto_retro`, `retro_interval`, `max_retry_on_failure`, `evaluator_strictness` (lenient/standard/strict), `commit_prefix_pass`, `commit_prefix_fail`, `commit_tag`. See [references/patterns.md](references/patterns.md) for the full schema.

## Dispatch Rules

Dispatch these roles explicitly when the environment supports separate agents:

1. **Initializer** -- create scaffold. See [roles/initializer.md](roles/initializer.md).
2. **Planner** -- produce or refine the product spec. See [roles/planner.md](roles/planner.md).
3. **Generator** -- propose sprint contracts and implement. See [roles/generator.md](roles/generator.md).
4. **Evaluator** -- review contracts, test, review code, grade. See [roles/evaluator.md](roles/evaluator.md).
5. **Coordinator** -- advance rounds automatically in continuous mode. See [roles/coordinator.md](roles/coordinator.md).
6. **Releaser** -- version bumps, changelog, git tags. See [roles/releaser.md](roles/releaser.md).

Ownership boundaries:
- Initializer owns setup artifacts only.
- Planner owns product-spec and execution-strategy only.
- Generator edits product code and generator-owned reports only.
- Evaluator writes testing, review, QA, and acceptance artifacts only.
- Coordinator owns run-state and loop control only.

Shared schemas and templates: [references/patterns.md](references/patterns.md).

## Quantified Evaluation

Every evaluation round must produce numeric criterion scores plus contract-check results. Primary criteria come from the domain profile (default `software`: product_depth, functionality, visual_design, code_quality).

Score on a `0-5` scale. Hard rules:
- Any primary criterion below `3` fails the round.
- Any required contract check failed fails the round.
- Any blocking bug in a core flow fails the round.
- Integer scores only.

## Authenticity Gate

After domain criteria scoring, apply a binary Authenticity Gate that catches generic output:

| Dimension | Definition |
|-----------|------------|
| **internal_consistency** | Artifacts share consistent conventions throughout. |
| **intentionality** | Evidence of project-specific decisions, not unmodified defaults. |
| **craft** | Technical fundamentals correct for each artifact type. |
| **fitness_for_purpose** | Deliverables usable by target audience without extra explanation. |

If any dimension fails, the round fails regardless of domain scores. The generator applies a pre-implementation checklist (prevention); the evaluator applies a post-grading gate (detection).

## Execution Loop

In Variant A, run this loop:

1. Initializer writes `.harness/features.json` and `.harness/progress.md`.
2. Coordinator initializes `.harness/state.json` in continuous mode.
3. Planner writes `.harness/spec.md` if needed.
4. Generator writes `.harness/sprints/NN-proposal.md`.
5. Evaluator writes `.harness/sprints/NN-review.md`.
6. Generator implements and writes `.harness/sprints/NN-report.md`.
7. Evaluator grades -- writes `.harness/sprints/NN-eval.md` and `.harness/sprints/NN-eval.json`.
8. Evaluator evidence updates `.harness/features.json`.
9. Coordinator advances, pauses, or stops.

Do not keep increasing sprint count without reducing failing required features.

## Required Artifacts

- `.harness/features.json`, `.harness/progress.md`, `.harness/state.json`, `.harness/spec.md`
- `.harness/init.sh` + `.harness/init.bat`
- `.harness/sprints/NN-proposal.md`, `NN-review.md`, `NN-report.md`, `NN-eval.md`, `NN-eval.json`
- `release.json` and `CHANGELOG.md` (project root, persistent)
- Optional: `.harness/handoff.md`, `.harness/evaluator-calibration.md`, `.harness/cost-log.md`

## Execution Modes

- `supervised`: one round at a time, user confirms between rounds
- `continuous`: advance automatically until stop condition

## Harness Variants

- **Variant A (default)**: Full sprinted harness with generate-evaluate loop per round.
- **Variant B**: Reset-based for context anxiety. See [references/advanced.md](references/advanced.md).
- **Variant C**: Simplified -- remove sprint decomposition when evidence shows it adds no value. See [references/advanced.md](references/advanced.md).

## Feature Maturity

| Level | Meaning | Trigger |
|-------|---------|---------|
| `draft` | Known gaps | Any criterion < 3 |
| `reviewed` | Passed evaluation | All criteria >= 3 (passes = true) |
| `accepted` | Stakeholder sign-off | Set manually, not by evaluator |

## Domain Profiles

Profiles are provided by domain skill suites (e.g., harness-sdlc-suite). The `custom` profile allows inline criteria in spec.md. A secondary profile can be declared for cross-domain work (8 criteria total: 4 primary + 4 advisory).

## Auto-Commit Protocol

| Outcome | Prefix | Format |
|---------|--------|--------|
| PASS | `feat` | `feat(F-XXX): <title> -- sprint N [harness]` |
| FAIL | `wip` | `wip(F-XXX): <title> -- sprint N attempt [harness]` |
| Pre-eval | `wip` | `wip(F-XXX): implement <title> -- sprint N [harness]` |

Never leave changes uncommitted between sprints.

## Stop Conditions

A run is complete when:
- All required features have `passes: true`, OR
- Shipped scope is complete with remaining features explicitly deferred, OR
- A hard blocker requires user intervention.

## Continuous-Mode Pause Rules

Pause if:
- Same feature fails twice without reducing failing surface
- No feature passes after two consecutive rounds
- Generator/evaluator disagree on a blocking bug
- Run needs an undeclared variant change

## Reliability

- **Error recovery**: Log errors, retry once after 30s, STOP on second failure.
- **Context freshness**: Pause after `context_reset_threshold` rounds, write handoff, reset counter.
- **Sprint resume**: `current_sprint_phase` in state.json enables mid-sprint pickup.
- **Evaluator enforcement**: Only evaluator evidence flips pass/fail. Coordinator verifies artifacts exist.
- **Cost tracking**: Per-round timestamps in `state.json.cost_tracking`.
- **Cross-platform**: `init.sh` + `init.bat` for any platform.

## Evaluation Calibration

Calibration file required when `expected_sprint_count > 3`. Compare scores against prior round; justify changes >1. See [roles/evaluator.md](roles/evaluator.md) for details.

## Sprint Retrospective

After every `retro_interval` rounds or any FAIL, append a retrospective to progress.md. See [roles/coordinator.md](roles/coordinator.md).

## Advanced Topics

See [references/advanced.md](references/advanced.md) for: harness decay, context reset vs compaction, simplification criteria, variant B/C details, and the review checklist.
