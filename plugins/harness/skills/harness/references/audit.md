# Audit Reference Skill

> **Process-specific.** This reference skill provides audit methodology, verification strategy, and evaluation criteria for harness process audits. It is not a domain skill for external projects -- it audits the harness's own process, artifacts, and score integrity.

Read this file when running a postmortem, verifying sprint compliance, or detecting process drift across harness runs.

---

## Section 1: Audit Methodology

Select the audit type based on what triggered the audit and what evidence is available.

| Audit Type | When to Use | What It Examines |
|------------|-------------|-----------------|
| Process audit | Post-run review, retrospective, or compliance check | Was the harness process followed? Were roles separated? Did the coordinator advance/pause/stop explicitly? Were contract reviews done before implementation? |
| Artifact audit | Missing or incomplete sprint artifacts detected | Do all required artifacts exist for each round (proposal, review, report, eval.md, eval.json)? Are they well-formed and internally consistent? |
| Drift audit | Score anomalies, repeated failures, or stale references suspected | Do score trends show inflation or deflation? Are naming conventions current? Do file references resolve? Are deprecated terms still in use? |
| Full audit | Release preparation or post-incident review | Combines process, artifact, and drift audits into a single pass. Use for release sign-off or when a run had failures. |

### Audit Type Selection Guide

| Signal | Recommended Audit | Reason |
|--------|------------------|--------|
| All features passed first attempt | Process audit | Verify the process was followed, not that scores were inflated |
| Multiple retries on same feature | Drift audit + process audit | Check for score inconsistency and whether failure surface was reducing |
| Missing artifacts discovered | Artifact audit | Quantify the gap before attempting recovery |
| Pre-release checkpoint | Full audit | Comprehensive verification before version tag |
| Evaluator and generator disagree | Process audit | Check whether contract checks were defined and evaluated consistently |

---

## Section 2: Audit Approach

The approach determines the order and emphasis of audit steps. Select based on the audit trigger and available time.

| Approach | Order of Operations | Best For |
|----------|-------------------|----------|
| Integrity-first | 1. Run stale reference grep 2. Check naming conventions 3. Verify feature status consistency 4. Then process and artifacts | Quick health check, CI gate, pre-release |
| Compliance-first | 1. Verify all artifacts exist 2. Check role separation 3. Validate contract-before-implementation 4. Then scores and drift | Post-run compliance review, stakeholder reporting |
| Trend-first | 1. Extract score trends across rounds 2. Check for inflation/deflation 3. Analyze failure patterns 4. Then artifacts and process | Multi-round runs, debugging persistent failures |

### Approach Selection Guide

| Available Time | Audit Trigger | Recommended Approach |
|---------------|---------------|---------------------|
| Under 5 minutes | Quick check | Integrity-first |
| 15-30 minutes | Post-run review | Compliance-first |
| 30+ minutes | Deep investigation | Trend-first or full audit with compliance-first |

---

## Section 3: Verification Strategy

What constitutes "testing" for a harness audit. These are the concrete verification methods.

### Stale Reference Detection

Run the canonical integrity grep to find deprecated terms and dead references:

```bash
grep -rn "review_mode\|codex_detection\|events\.jsonl\|events\.mjs\|metrics\.mjs\|summary\.md\|decomposition\.md\|init\.md\|NN-contract\b\|NN-evaluation\|builder-report\|contract-review\|not_started\|in_progress\b\|functional\b\|polished\b" plugins/ --include="*.md" --include="*.mjs"
```

Target: 0 matches. Any match indicates a stale reference that needs updating.

### Artifact Count Verification

For each completed round N, verify these 5 artifacts exist:
1. `NN-proposal.md` -- sprint proposal from generator
2. `NN-review.md` -- contract review from evaluator
3. `NN-report.md` -- builder report from generator
4. `NN-eval.md` -- evaluation report from evaluator
5. `NN-eval.json` -- structured evaluation data from evaluator

Use `validate-artifacts --round N` to automate this check. Missing artifacts are a blocking gate.

### Score Trend Analysis

Extract `primary_scores` from each `NN-eval.json` and build a trend table:

| Round | Criterion 1 | Criterion 2 | Criterion 3 | Criterion 4 | Decision |
|-------|-------------|-------------|-------------|-------------|----------|

Flags:
- Any score jump of more than 1 point between consecutive rounds without a documented `drift_check` justification
- Any criterion that stays at exactly 3 for more than 3 consecutive rounds (plateau may indicate lenient grading)
- Any score of 5 on a round that had blockers or non-blocking issues

### Feature Pass-Rate Calculation

```
pass_rate = features_passing / total_required_features
first_attempt_rate = features_passed_first_try / total_required_features
retry_rate = total_rounds / total_required_features  (closer to 1.0 = fewer retries)
```

---

## Section 4: Deliverable Verification

What makes a good postmortem report. Use this checklist to verify completeness.

### Required Sections

| Section | Minimum Evidence | Verification |
|---------|-----------------|-------------|
| Timeline | Table with round, date, features, decision, duration for every round | Row count matches rounds completed |
| Score Trends | Table with all primary criteria across all rounds | Column count matches domain profile criteria count |
| Failure Analysis | Per-feature breakdown of retries, root cause, resolution | Entry for every feature that failed at least once, or explicit "all passed first attempt" |
| Process Compliance | Assessment of spec adherence, artifact presence, contract checks, authenticity gate | Covers all 5 artifact types and role separation |
| Integrity Audit | Stale reference grep results with match count | Grep command executed, results reported (even if 0 matches) |
| Recommendations | 3-5 actionable items based on evidence | Each recommendation cites specific data from the report |

### Table Completeness Enforcement

Every section MUST have a table or explicit data statement, even when the result is "none found" or "all passed." Do not reduce a section to a one-liner. The table structure with data rows must be present.

### Evidence Depth

- Timeline: include duration per round if cost_tracking timestamps are available
- Score Trends: include drift warnings from finalize-round if any were reported
- Failure Analysis: include what changed between failing and passing attempts
- Recommendations: distinguish "keep doing" from "change" from "new practice"

---

## Section 5: Evaluation Criteria

Four criteria for auditing harness process quality. Score 0-5 using the anchors below.

### process_compliance

Was the harness process followed correctly?

| Score | Anchor |
|-------|--------|
| 0 | No harness process used -- no spec, no features.json, no separated roles |
| 1 | Harness started but severely incomplete -- missing most artifacts, roles collapsed |
| 2 | Process partially followed -- some artifacts exist but contract reviews skipped or roles not separated |
| 3 | Process followed with minor gaps -- all required artifacts exist, roles separated, but some contract checks missing or authenticity gate not applied |
| 4 | Process followed well -- all artifacts present, roles separated, contract checks defined and evaluated, authenticity gate applied, minor non-blocking gaps only |
| 5 | Process followed rigorously -- all artifacts complete, all gates applied, explicit pause/stop decisions, retrospectives conducted at intervals |

### artifact_completeness

Are all required artifacts present and well-formed?

| Score | Anchor |
|-------|--------|
| 0 | No sprint artifacts exist |
| 1 | Fewer than half of expected artifacts exist |
| 2 | Most artifacts exist but some rounds are missing key files (eval.json, review.md) |
| 3 | All 5 artifacts exist for every round, but some have minimal content or missing sections |
| 4 | All artifacts complete with proper metadata, sections populated, JSON well-formed, minor formatting gaps only |
| 5 | All artifacts complete, well-formed, internally consistent, with proper metadata and cross-references |

### drift_detection

Do score trends and naming conventions reveal process drift?

| Score | Anchor |
|-------|--------|
| 0 | Cannot assess -- no evaluation data available |
| 1 | Severe drift -- deprecated terms throughout, scores inconsistent, no drift_check fields |
| 2 | Moderate drift -- some stale references found, score jumps without justification |
| 3 | Minor drift -- stale reference grep is clean, scores mostly consistent, drift_check fields present but sparse |
| 4 | Low drift -- zero stale references, all score changes justified, naming conventions current throughout |
| 5 | No drift detected -- zero stale references, all score changes have drift_check justification, feature status uses only current enum values, no deprecated naming anywhere |

### recommendation_quality

Are recommendations actionable, evidence-backed, and domain-relevant?

| Score | Anchor |
|-------|--------|
| 0 | No recommendations provided |
| 1 | Generic advice not tied to evidence (e.g., "write better tests") |
| 2 | Some recommendations cite evidence but are vague on action (e.g., "improve score trends" without saying how) |
| 3 | Recommendations are actionable and cite specific data, but miss some patterns visible in the audit data |
| 4 | Recommendations are actionable, evidence-backed, and cover the main patterns -- distinguish "keep doing" from "change" |
| 5 | Recommendations are specific, prioritized, evidence-backed, cover all significant patterns, and include concrete next steps with measurable outcomes |

---

## Section 6: Audit Checklists and Anti-Patterns

### Post-Run Audit Checklist

Use this checklist to verify a completed harness run. Adapted from the review checklist in patterns.md.

1. Was an initializer used to create spec.md and features.json?
2. Does a machine-readable feature list (features.json) exist with correct schema?
3. Were separate planner/generator/evaluator agents explicitly dispatched?
4. Was there a proposal review artifact (NN-review.md) before implementation started?
5. Did spec.md explain the execution strategy and sprint grouping rationale?
6. Did each sprint target one failing required feature unless a grouping waiver existed?
7. Did the number of failing required features go down over the run?
8. Did each accepted round include all 5 artifacts (proposal, review, report, eval.md, eval.json)?
9. In continuous mode, did the coordinator either advance, pause, or stop explicitly?
10. Were contract checks defined in proposals and evaluated in eval.json?
11. Was the authenticity gate applied in evaluations?
12. Were features.json updates backed by evaluator evidence only (not coordinator-direct)?
13. Was validate-artifacts run after each round (blocking gate)?
14. Do all features.json entries use only `pending`/`done` status and `draft`/`reviewed`/`accepted` maturity?

### Canonical Integrity Grep

This is the single source of truth for the stale reference detection pattern. All other files that reference this grep (CLAUDE.md, postmortem.md) should point here.

```bash
grep -rn "review_mode\|codex_detection\|events\.jsonl\|events\.mjs\|metrics\.mjs\|summary\.md\|decomposition\.md\|init\.md\|NN-contract\b\|NN-evaluation\|builder-report\|contract-review\|not_started\|in_progress\b\|functional\b\|polished\b" plugins/ --include="*.md" --include="*.mjs"
```

Expected result: 0 matches. Each match is a stale reference requiring remediation.

### Anti-Patterns

| Anti-Pattern | Detection Signal | Penalty |
|-------------|-----------------|---------|
| Missing artifacts | `validate-artifacts` reports gaps | Blocking -- round cannot advance |
| Stale handoff | `.harness/handoff.md` exists after a successful round | Non-blocking -- delete the file |
| Unset status | features.json has `status: ""` or missing field | Blocking -- feature tracking broken |
| Score inflation | All scores 5/5 on a round with non-blocking issues reported | Drift warning -- evaluator should justify |
| Skipped reviews | NN-review.md missing but implementation proceeded | Blocking -- contract review is mandatory |
| Role collapse | Generator wrote eval artifacts or evaluator wrote product code | Blocking -- separation of concerns violated |
| Silent continuation | Coordinator advanced after a FAIL without logging retry or stop | Process violation -- check state.json errors array |
| Dependency bypass | Feature targeted while depends_on features still failing | Blocking -- coordinator should have skipped |
