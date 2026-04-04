# Contract Review -- Sprint 1

## Metadata
- Role: evaluator
- Agent: evaluator-1
- Inputs: .harness/sprints/01-contract.md, .harness/features.json, .harness/spec.md, .harness/state.json, plugins/harness/skills/harness/roles/evaluator.md
- Status: accepted
- Reviewed by: evaluator-1
- Decision: accept

## Target feature IDs
- F-011
- F-012

## Decision: ACCEPT

## Grouping Waiver Assessment

The contract groups F-011 and F-012 in a single sprint. The justification is sound:

- F-011 is a single-file edit to evaluator.md (adding an explicit clause, no removal of existing text).
- F-012 is the main deliverable (new scripts directory, 6 new files, ~250 lines).
- The two features touch completely different files and cannot conflict.
- Burning a full contract/implement/evaluate cycle on a one-paragraph edit would be wasteful.

Verdict: Grouping waiver is valid. No hidden risk from coupling.

## F-011 Analysis

The contract correctly identifies that evaluator.md does not contain an explicit "documentation-only exemption" as literal text. The current file has no skip/exempt language for the Code Review Pre-Flight section beyond the generic "CRITICAL: If you skip this pre-flight..." warning. The risk section acknowledges this -- the exemption is implicit (agents may infer they can skip codex for doc-only changes because no rule forbids it).

The fix approach is correct: add an explicit positive statement ("codex reviews all changes including documentation") and state the only valid skip condition (zero changed files). This is additive, not destructive.

The verification checks (FN-04 and F-011 verification items 1-4) are testable:
- Grep for explicit "all changes" or equivalent statement -- presence check.
- Grep for skip/exempt patterns -- absence check.
- Both are mechanical text searches the evaluator can run.

No issues found with F-011 scope or verification.

## F-012 Analysis

### Scope and Deliverables

The contract specifies 6 new files:
- `plugins/harness/scripts/harness-companion.mjs` (entry point, ~50 lines)
- `plugins/harness/scripts/lib/state.mjs` (~50 lines)
- `plugins/harness/scripts/lib/features.mjs` (~40 lines)
- `plugins/harness/scripts/lib/git.mjs` (~30 lines)
- `plugins/harness/scripts/lib/artifacts.mjs` (~30 lines)
- `plugins/harness/scripts/lib/progress.mjs` (~30 lines)

Total: ~230 lines across 6 files. The `plugins/harness/scripts/` directory does not currently exist, so all files are new. The line estimates are reasonable for the described functionality.

Seven subcommands are specified with clear input/output contracts. Each delegates to a focused lib function. This is well-scoped.

### Verification Checks Assessment

All F-012 verification checks are testable via `node` commands:

1. `node harness-companion.mjs --help` -- runnable, checks stdout text.
2. `node harness-companion.mjs feature-select` -- runnable against real .harness/ files. The contract correctly notes it should return F-011 or F-012 as eligible (both have no dependencies and passes=false).
3. `node harness-companion.mjs unknown-cmd` -- runnable, checks exit code.
4. `ls` for five lib files -- trivial.
5. Grep for non-builtin imports -- mechanical.
6. Grep for writeFileSync/renameSync pattern in state.mjs -- mechanical.
7. Pipe check-stop output through JSON.parse -- runnable.

All seven verification items produce clear pass/fail signals. No subjective checks.

### Contract Checks Assessment

Nine contract checks (PD-01, PD-02, FN-01 through FN-04, VD-01, CQ-01, CQ-02), all marked required. Each is testable:

| Check | Testable? | Method |
|-------|-----------|--------|
| PD-01 | Yes | Run each subcommand and verify non-stub output |
| PD-02 | Yes | Create test features.json with unmet dependency, run feature-select, confirm blocked feature is not selected |
| FN-01 | Yes | Run --help, check exit code 0 and output text |
| FN-02 | Yes | Run feature-select, parse JSON output |
| FN-03 | Yes | Run invalid subcommand, check exit code 1 and stderr |
| FN-04 | Yes | Grep evaluator.md for positive statement and absence of exemption language |
| VD-01 | Yes | Read --help output and stderr for clarity (minor subjectivity, acceptable) |
| CQ-01 | Yes | Grep all .mjs files for import statements, verify only builtins |
| CQ-02 | Yes | Grep state.mjs for atomic write pattern |

All checks are concrete and runnable. PD-02 (dependency resolution) is the most important functional check -- it validates the core logic of feature-select beyond a simple "does it run" test.

## Risks Assessment

The contract identifies three risks, all with mitigations:

1. **Implicit exemption in evaluator.md**: Acknowledged and mitigated by verifying presence of positive statement rather than absence of specific wording. Sound approach.

2. **Seven subcommands in one sprint**: At the upper bound but mitigated by the ~250 line scope cap and simplification policy (split into core/secondary if needed). Acceptable.

3. **Atomic write portability on Windows**: Mitigated by same-filesystem constraint. The harness runs from project root, so temp and target are co-located. Acceptable for the target audience.

No unidentified risks found. The contract does not overcommit.

## Acceptance Criteria Alignment

The four criteria (product_depth, functionality, visual_design, code_quality) map correctly to the software domain profile. The VD criterion is sensibly reinterpreted as "documentation clarity" per the spec.md note, since there is no UI. This is consistent across spec.md and the contract.

## Consistency Checks

- Contract target IDs (F-011, F-012) match state.json active_feature_ids.
- Contract deliverables match features.json descriptions.
- Contract verification aligns with features.json steps.
- Sprint 1 grouping matches the execution strategy in spec.md.
- No dependency violations: neither F-011 nor F-012 has depends_on constraints.

## Items for Evaluator to Watch During Post-Implementation Review

1. PD-02 is the critical functional test -- ensure dependency resolution is tested with a synthetic features.json, not just the project's current one (where both features have empty depends_on).
2. Verify that auto-commit subcommand does not actually create a git commit during testing -- it should be testable without side effects or have a dry-run mode.
3. Confirm that state-mutate actually performs atomic writes (temp + rename), not just direct writeFileSync to the target path.
4. Confirm the entry point handles missing .harness/ gracefully (exit code 2, not an uncaught exception stacktrace).

## Verdict

The contract is well-structured, appropriately scoped, and fully testable. The grouping waiver is justified. All nine contract checks are runnable via node commands with clear pass/fail criteria. No changes requested.

**Decision: ACCEPT**
