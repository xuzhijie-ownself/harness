# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-2
- Inputs: .harness/spec.md, .harness/features.json, .harness/progress.md, advanced.md (lines 96-118), evaluator.md (lines 1-50)
- Status: in_review

## Target feature IDs
- F-002

## Goal

Fix the Codex detection pre-flight so it no longer silently falls back to Claude-only review when Codex is available. The current detection checks only two locations in `.claude/settings.json` and invokes the raw `codex` CLI directly. This sprint rewrites the detection to check three sources with any-one-passes semantics and replaces the raw CLI call with the `/codex:adversarial-review` plugin skill, updating both `advanced.md` and `evaluator.md` to stay consistent.

## Deliverables

### Phase 1: Rewrite advanced.md Step 2 (auto mode detection)
- File: `plugins/harness/skills/harness/references/advanced.md`, lines 102-105
- Replace the current two-source check with three ordered checks using any-one-passes semantics:
  1. Project `.claude/settings.json` -- check `enabledPlugins` for `"codex@openai-codex": true`
  2. Global `~/.claude/settings.json` -- check `extraKnownMarketplaces` for `"openai-codex"`
  3. `which codex` on PATH -- shell check for CLI availability
- If any one of these three passes, set review_mode to `"codex"`. All three must fail to fall back to `"claude"`.

### Phase 2: Rewrite advanced.md Step 3 (review invocation)
- File: `plugins/harness/skills/harness/references/advanced.md`, lines 107-111
- Replace the raw `codex` CLI Bash command with `/codex:adversarial-review --wait` as the primary review method.
- Keep a raw CLI fallback if the skill invocation fails.
- Add a severity mapping table: Codex review severity levels map to BLOCKING or NON-BLOCKING categories.

### Phase 3: Update advanced.md Step 4 (recording)
- File: `plugins/harness/skills/harness/references/advanced.md`, lines 113-118
- Add a `detection_method` field to the recorded output, indicating which of the three sources triggered the codex detection (e.g., `"project enabledPlugins"`, `"global extraKnownMarketplaces"`, `"CLI on PATH"`).

### Phase 4: Update evaluator.md Read list and Section 0
- File: `plugins/harness/skills/harness/roles/evaluator.md`, lines 6-11
- Add a reference to global `~/.claude/settings.json` in the Read list alongside the existing project `.claude/settings.json`.
- File: `plugins/harness/skills/harness/roles/evaluator.md`, lines 30-39
- Rewrite the condensed decision tree for `"auto"` mode to list all three detection sources and reference `/codex:adversarial-review --wait` as the review method.

## Verification

Each deliverable maps to a feature step from features.json. Verification is by text inspection of the two modified Markdown files.

| Check ID | Feature step | Verification method |
|----------|-------------|---------------------|
| FN-01 | Step 1: advanced.md Step 2 checks 3 sources | Grep advanced.md for `enabledPlugins`, `extraKnownMarketplaces`, and `which codex` within Step 2 |
| FN-02 | Step 2: any-one-passes semantics | Confirm Step 2 states "if any one passes" or equivalent; no "all must pass" language |
| FN-03 | Step 3: /codex:adversarial-review --wait primary | Grep advanced.md Step 3 for `/codex:adversarial-review --wait` |
| FN-04 | Step 4: severity mapping | Confirm advanced.md Step 3 contains a severity-to-BLOCKING/NON-BLOCKING mapping |
| FN-05 | Step 5: detection_method field | Grep advanced.md Step 4 for `detection_method` |
| FN-06 | Step 6: evaluator.md Read list | Confirm evaluator.md Read list references both project and global settings files |
| FN-07 | Step 7: evaluator.md Section 0 auto mode | Confirm evaluator.md Section 0 lists all 3 detection checks |
| FN-08 | Step 8: evaluator.md /codex:adversarial-review | Grep evaluator.md Section 0 for `/codex:adversarial-review` |

## Acceptance criteria

- **Product depth**: The rewritten detection procedure is complete and self-contained; a reader can follow it without external references. Score 3+.
- **Functionality**: All 8 feature steps from features.json pass verification. Score 3+.
- **Visual design**: Markdown formatting is clean, consistent with surrounding sections, and uses the same heading levels and code-block conventions as the rest of the files. Score 3+.
- **Code quality**: Instructions are unambiguous, the three-check procedure has clear ordering and fallback semantics, and the two files (advanced.md and evaluator.md) stay internally consistent with each other. Score 3+.

## Contract checks

- `FN-01`: required -- advanced.md Step 2 lists all 3 detection sources
- `FN-02`: required -- advanced.md Step 2 uses any-one-passes semantics
- `FN-03`: required -- advanced.md Step 3 uses /codex:adversarial-review --wait as primary
- `FN-04`: required -- advanced.md Step 3 includes severity mapping
- `FN-05`: required -- advanced.md Step 4 includes detection_method field
- `FN-06`: required -- evaluator.md Read list references both settings files
- `FN-07`: required -- evaluator.md Section 0 auto mode matches 3-check procedure
- `FN-08`: required -- evaluator.md Section 0 references /codex:adversarial-review

## Risks

- **Consistency drift**: advanced.md is the detailed reference and evaluator.md is the condensed tree. If the condensed tree omits a source or uses different terminology, detection will still be ambiguous. Mitigation: write the detailed version first, then condense, and cross-check.
- **Severity mapping ambiguity**: Codex review output categories may not map 1:1 to BLOCKING/NON-BLOCKING. Mitigation: define a clear table with explicit categories rather than a vague "map as appropriate" instruction.
- **Backward compatibility**: Existing evaluations recorded the old field set. The new `detection_method` field is additive, so old artifacts remain valid. No risk here.
