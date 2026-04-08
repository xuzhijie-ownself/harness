# Clean-Room Redesign v3.0

## Status: DESIGNED, NOT YET IMPLEMENTED

## 7 Principles (Priority-Ordered)

### Tier 1: Non-Negotiable
1. **Security by design** — every decision point includes security
2. **Single source of truth** — one location per knowledge item
3. **Domain-blind core** — orchestration only, domains are pluggable suites
4. **Separation of concerns** — generator produces, evaluator grades, neither crosses

### Tier 2: Quality & Methodology
5. **Simplification** — remove what doesn't add measured value
6. **Learn from failure** — track failures, evolve instructions from evidence
7. **Verify before trusting** — every completion claim backed by evidence

## Scripts (13 subcommands)

init-state, set-phase, increment-round, append-cost
feature-select
check-status (renamed from check-stop, read-only)
verify-completion, validate-artifacts, finalize-run
progress-append, log-failure, postmortem-data
auto-commit, cleanup-sprints (archive, not delete)

## References (split patterns.md)

schemas.md (~200 lines) — JSON schemas only
templates.md (~400 lines) — artifact templates only
orchestration.md — session + reset procedures (already exists)
audit.md — postmortem procedures (already exists)
advanced.md — variants, decay (already exists)

## Terminology Renames (22 fields)

dependencies (was depends_on), passing (was passes), checks (was steps),
targets (was active_feature_ids), expected_sprints (was expected_sprint_count),
failure_streak (was current_failure_streak), reset_threshold (was context_reset_threshold),
history (was cost_tracking), max_retries (was max_retry_on_failure),
pass_prefix (was commit_prefix_pass), fail_prefix (was commit_prefix_fail),
commit_suffix (was commit_tag), source (was source_requirement),
phase (was current_sprint_phase), round (was current_round),
completed_round (was last_completed_round), strictness (was evaluator_strictness),
passed_count (was last_feature_pass_delta), auto_retrospective (was auto_retro),
retrospective_interval (was retro_interval)

## New Fields

state.json: archived_rounds, completion_verified
config.json: enable_instruction_evolution, completion_verification_mode
eval.json: failed_approaches, completion_verified

## New Concepts

1. Failed approach tracking (log-failure + progress.md section + generator reads)
2. Completion verification (verify-completion + finalize-run gate chain)
3. Instruction evolution (coordinator appends to CLAUDE.md Lessons Learned on fail)
4. Reference oracle (planner + spec.md section + evaluator reads)
5. Authenticity gate (PRESERVED from existing design)

## Implementation: 3 Sprints

Sprint 1: Split patterns.md + new subcommands + check-stop rename + archive
Sprint 2: Terminology renames + new concepts in role files
Sprint 3: Instruction evolution + CLAUDE.md + README + Codex review
