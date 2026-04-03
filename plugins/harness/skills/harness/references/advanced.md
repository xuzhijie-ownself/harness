# Advanced Topics

This file contains advanced harness guidance extracted from SKILL.md. Reference it when you need details on decay testing, simplification policy, harness review checklists, Variant B/C details, context reset guidance, or the detailed Codex detection procedure.

## Harness Decay

Harness assumptions decay with model improvements. Components that were load-bearing with one model generation may be unnecessary with the next.

Test removal methodically:

- Remove one component at a time and measure whether output quality drops.
- Document the evidence in `.harness/evaluator-calibration.md`.
- Re-baseline the execution strategy after each removal.
- A component that was required for Sonnet may be overhead for Opus, and vice versa.

When a component is removed, keep the feature list and evaluator-led QA as the last line of defense. These are the most durable parts of the harness.

## Context Reset vs Compaction

Compaction summarizes context in-place but preserves anxiety patterns. Context resets (Variant B) provide clean slates via structured handoff files.

Use compaction when:

- The model maintains coherence and does not rush features.
- Context usage is below ~60%.
- Quality has not degraded in later sprints compared to earlier ones.

Use a full reset (`/reset`) when:

- Context is above ~75%.
- The model shows premature closure, rushing behavior, or "context anxiety."
- Quality drops noticeably in later sprints.
- The evaluator reports increasing leniency or declining specificity.

Context resets are not a failure -- they are a deliberate strategy for long runs.

## Simplify Methodically

Remove one component at a time and observe the impact.

- Keep the initializer and feature list unless another proven ledger replaces them.
- Keep the planner if raw prompts still produce under-scoped apps.
- Keep the evaluator if the generator still ships broken or shallow results.
- Remove sprint decomposition only when the model can sustain coherent long builds without it.
- Keep iterative QA even after sprint removal until evidence shows it is no longer load-bearing.
- Re-baseline the execution strategy whenever you simplify, instead of silently drifting into a different mode.

## Variant B: Reset-Based Compatibility Harness (Full Details)

Use this only when the model shows context anxiety, loses coherence over long runs, or the environment cannot sustain continuous-session work.

- Keep the initializer/planner/generator/evaluator split.
- Reset the active coding session between chunks when needed.
- Use `.harness/handoff.md` so the next generator session can resume.
- Track `current_sprint_phase` in state.json for sprint resume across sessions.
- The `/reset` command writes a structured handoff file and checkpoints the session.

This is a fallback, not the default reading of the 2026 article.

## Variant C: Simplified Harness (Full Details)

Use this only after evidence shows sprint decomposition is no longer adding enough lift.

- Keep the feature list.
- Keep the planner if the prompt still under-specifies the app.
- Remove sprint decomposition.
- Let the generator work on a larger build round.
- Keep evaluator-led QA rounds and the pass/fail feature ledger.

Do not simplify this into a one-shot build plus a single final QA pass.
Do not enter this variant silently; write down the evidence that sprint decomposition stopped adding value.

Evidence criteria for simplification:
- The model can sustain coherent long builds without sprint boundaries.
- Quality does not degrade in later sections of a long build.
- The evaluator does not report increasing leniency.

## Review The Harness

When reviewing whether the harness was actually followed, check:

- Was an initializer used?
- Does a machine-readable feature list exist?
- Were separate planner/generator/evaluator agents explicitly dispatched?
- In continuous mode, was a coordinator used to advance rounds automatically?
- Did the spec explain the execution strategy and sprinting rationale?
- Did each sprint target one failing required feature unless a written grouping waiver existed?
- Is there a contract review artifact before implementation?
- Is there both Markdown and JSON evaluation output for each accepted round?
- Does the evaluation include test results and code review findings?
- Did the number of failing required features go down?
- Did the run stop because required features passed, not because another sprint was invented?

If the answer to the first six questions is no, or the feature count does not go down across rounds, the harness is drifting.

## Codex Detection Detailed Procedure

This is the expanded 4-step Codex detection procedure. The evaluator role file contains a condensed decision tree. Use this reference for debugging or understanding the full logic.

**Step 1**: Read `.harness/config.json`. Extract `use_codex` value. If file missing, default to `"auto"`.

**Step 2**: Decide review mode:
- If `"off"` -> set review_mode to `"claude"`. Skip to Step 4.
- If `"on"` -> set review_mode to `"codex"`. Go to Step 3.
- If `"auto"` or missing -> Read `.claude/settings.json`. Check if `"openai-codex"` exists as a key in `extraKnownMarketplaces` OR if `"codex@openai-codex": true` exists in `enabledPlugins`. If either is true, set review_mode to `"codex"`. Otherwise set to `"claude"`.

**Step 3** (codex mode only): Run the adversarial review command:
```
Bash({ command: "codex --approval-mode full-auto --quiet 'Review these code changes adversarially. Check quality, security, patterns, and design choices. Output findings as BLOCKING or NON-BLOCKING.'", timeout: 120000 })
```
If the command fails (codex CLI not installed, not authenticated, or errors), set review_mode to `"claude"` and record fallback_reason with the error message. The evaluator continues with Claude-only review -- codex failure is never a hard block.

**Step 4**: Record in BOTH `NN-evaluation.md` and `NN-evaluation.json`:
- `review_mode`: codex or claude
- `config_use_codex`: value from config.json
- `codex_available`: whether openai-codex was found in settings (extraKnownMarketplaces or enabledPlugins)
- `detection_result`: what detection found
- `fallback_reason`: why codex wasn't used (if applicable)
