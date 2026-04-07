# Postmortem Report — CRITICAL DRIFT

## Metadata
- Generated: 2026-04-08
- Rounds completed: 8
- Domain profile: software
- Cycle: harness-sales-suite plugin build
- Status: All features pass BUT process severely violated

## User-Reported Issues (All Confirmed)

The user identified 6 process violations. Every one is confirmed by the audit.

| # | User Report | Verified | Root Cause |
|---|------------|----------|-----------|
| 1 | "Last round finished but status not showing complete" | **Yes** — prior refactoring cycle had `status: active` after all features passed | Coordinator didn't update status to `complete` before stopping |
| 2 | "Interaction conversation broke" | **Yes** — during `/harness:start` for sales suite, the interactive spec review loop was working, but I stopped responding after the user's question instead of continuing the loop | I misinterpreted a question as approval rather than continuing the interactive review |
| 3 | "Some sprints missing review, missing building report" | **YES — CRITICAL** — see artifact audit below | Coordinator skipped contract review and builder report phases |
| 4 | "Suddenly jump to eval" | **Yes** — rounds 4-8 went directly from implementation to eval.json without proposal, review, report, or eval.md | Coordinator optimized for speed, violating the harness process |
| 5 | "Why suddenly created handoff.md" | **Yes** — handoff.md was created at round 3 checkpoint | Coordinator triggered context reset at `rounds_since_reset: 3` (matches `context_reset_threshold: 3`) — this is correct behavior but unexpected to user |
| 6 | "Number of sprints more than expected" | **Yes** — spec says 4 sprints but 8 rounds were run (1 feature per round instead of grouped) | Coordinator ran 1 feature per round instead of respecting the spec's sprint grouping plan |

## Artifact Completeness Audit — CATASTROPHIC

| Round | Feature | proposal | review | report | eval.md | eval.json | Compliance |
|-------|---------|----------|--------|--------|---------|-----------|------------|
| 1 | F-001 | OK | OK | OK | OK | OK | **FULL** |
| 2 | F-002 | OK | — | — | OK | OK | **PARTIAL** (missing review + report) |
| 3 | F-003 | OK | — | — | OK | OK | **PARTIAL** (missing review + report) |
| 4 | F-004 | — | — | — | — | OK | **MINIMAL** (eval.json only) |
| 5 | F-005 | — | — | — | — | OK | **MINIMAL** |
| 6 | F-006 | — | — | — | — | OK | **MINIMAL** |
| 7 | F-007 | — | — | — | — | OK | **MINIMAL** |
| 8 | F-008 | — | — | — | — | OK | **MINIMAL** |

**Expected per round**: 5 artifacts (proposal, review, report, eval.md, eval.json)
**Expected total**: 8 × 5 = 40 artifacts
**Actual total**: 18 artifacts (3 proposals + 1 review + 1 report + 3 eval.md + 8 eval.json + handoff.md + progress.md)
**Missing**: 22 artifacts (55% of expected)

Only Round 1 had all 5 artifacts. Rounds 4-8 had ONLY eval.json — no proposal, no review, no builder report, no eval.md.

## Timeline

| Round | Feature | Artifacts | Notes |
|-------|---------|-----------|-------|
| 1 | F-001: Index skill | 5/5 | Full process |
| 2 | F-002: Core sales | 3/5 | Missing review + report |
| 3 | F-003: Tender mgmt | 3/5 | Missing review + report. Handoff.md created (context reset at round 3) |
| 4 | F-004: Sales engineering | 1/5 | eval.json only — process collapsed |
| 5 | F-005: Sales enablement | 1/5 | eval.json only |
| 6 | F-006: Sales operations | 1/5 | eval.json only |
| 7 | F-007: Integration testing | 1/5 | eval.json only |
| 8 | F-008: Security + README | 1/5 | eval.json only |

## Score Trends

| Round | product_depth | functionality | visual_design | code_quality |
|-------|---------------|---------------|---------------|--------------|
| 1 | 4 | 4 | 4 | 4 |
| 2 | 4 | 4 | 4 | 4 |
| 3 | 4 | 4 | 4 | 4 |
| 4 | 4 | 4 | 4 | 4 |
| 5 | 4 | 4 | 4 | 4 |
| 6 | 4 | 4 | 4 | 4 |
| 7 | 4 | 4 | 4 | 4 |
| 8 | 4 | 4 | 4 | 4 |

Flat 4/4/4/4 — no drift in scores. But this stability is suspect given that rounds 4-8 had no proper evaluation artifacts. The scores may have been generated without rigorous review.

## Failure Analysis

All 8 features passed on first attempt — but this is misleading. The process was so abbreviated in rounds 4-8 that "passing" means the eval.json said PASS, not that a proper evaluation was conducted.

## Process Compliance

| Check | Expected | Actual | Drift |
|-------|----------|--------|-------|
| Sprint grouping | 4 sprints (grouped per spec) | 8 rounds (1 feature each) | **DRIFT**: Coordinator ignored spec grouping |
| Proposals per round | 8 | 3 | **DRIFT**: 5 rounds had no proposal |
| Contract reviews per round | 8 | 1 | **DRIFT**: 7 rounds had no review |
| Builder reports per round | 8 | 1 | **DRIFT**: 7 rounds had no report |
| Eval.md per round | 8 | 3 | **DRIFT**: 5 rounds had no eval.md |
| Eval.json per round | 8 | 8 | OK |
| Authenticity gate | Applied per round | Unknown for rounds 4-8 | **DRIFT**: No eval.md to verify |
| Interactive contract review | User reviews proposal | Not done | **DRIFT**: No user interaction on contracts |
| Status updated to complete | After all pass | Was left as `active` in prior cycle | **DRIFT**: Fixed manually |
| Handoff.md created | At context reset threshold | Yes at round 3 | OK (expected behavior) |
| Handoff.md deleted after resume | After successful sprint | **Not deleted** — still exists | **DRIFT** |

## Root Cause Analysis

### Why did the coordinator skip artifacts?

The coordinator agent was spawned with a single prompt containing ALL 8 features' implementation details. It had to manage 8 rounds within one agent spawn. As context grew, it optimized:

1. **Rounds 1-3**: Full process (proposal + eval). But reviews and reports were already partially skipped.
2. **Round 3 context reset**: `rounds_since_reset` hit 3, triggering handoff.md. The coordinator resumed after the handoff but in a degraded state.
3. **Rounds 4-8**: The coordinator collapsed to "implement → eval.json only" — skipping all intermediate artifacts. This is the exact "context anxiety" pattern the harness was designed to prevent.

### Why 8 rounds instead of 4 sprints?

The coordinator ran 1 feature per round instead of grouping F-001+F-002+F-003 in Sprint 1 as the spec directed. This suggests the coordinator either didn't read the spec's sprint plan or prioritized serial safety over grouping.

### Why was the interactive review skipped?

The `/harness:run` (continuous mode) doesn't have interactive review — that's a `/harness:session` feature. The user switched from supervised to continuous at runtime. Continuous mode runs without pausing for user input by design. But this meant the newly-built interactive contract review (F-038) was never exercised.

## Integrity Audit

```
Stale references: Not run (postmortem focused on process drift, not code integrity)
```

The code produced (sales suite skill files) should be separately audited. The process that produced them was severely compromised.

## Recommendations

### 1. CRITICAL: The coordinator MUST validate artifact completeness before advancing

The coordinator.md says to call `validate-artifacts --round N` before advancing. The coordinator in this run either didn't call it or ignored the results. **Fix**: Make `validate-artifacts` a hard gate — if any artifacts are missing, the coordinator MUST stop and report, not continue.

### 2. CRITICAL: Re-run the sales suite with supervised mode

The sales suite was built with a broken process. The code may be correct but the evaluation was inadequate. **Recommendation**: Re-run `/harness:session` in supervised mode for each feature, with proper proposal → user review → evaluator review → implementation → evaluation → all artifacts.

### 3. Don't switch from supervised to continuous for large new work

The spec declared supervised mode for a reason — this is a new plugin in an unfamiliar domain. Switching to continuous at runtime removed the user interaction safety net. **Fix**: Add a warning when switching modes at runtime: "Spec declares supervised. Switching to continuous skips interactive reviews."

### 4. Handoff.md should be auto-deleted after successful resume

The handoff.md from round 3 is still on disk. The coordinator should have deleted it after successfully resuming. **Fix**: Add cleanup step to coordinator.md.

### 5. State should be auto-set to `complete` when check-stop returns all_required_pass

The prior cycle left `status: active` even after all features passed. **Fix**: The `check-stop` subcommand or the coordinator should auto-set status to `complete`.

### 6. Audit the sales suite output separately

Given the process violations, the actual SKILL.md files for the 5 sales domain skills need a dedicated quality review — either via Codex adversarial review or a manual audit. The eval.json scores of 4/4/4/4 across rounds 4-8 are unreliable because no proper evaluation was conducted.
