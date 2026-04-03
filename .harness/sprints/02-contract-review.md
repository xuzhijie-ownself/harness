# Contract Review -- Sprint 02

## Metadata
- Role: evaluator
- Agent: evaluator-2
- Inputs: .harness/sprints/02-contract.md, .harness/features.json, .harness/spec.md, plugins/harness/skills/harness/references/advanced.md, plugins/harness/skills/harness/roles/evaluator.md
- Status: accepted
- Reviewed by: evaluator-2
- Decision: accept

## Target feature IDs
- F-002

## Decision: ACCEPT

## Reasoning

### Bug diagnosis is accurate

The current advanced.md Step 2 (line 105) checks only the project-level `.claude/settings.json` for two fields (`extraKnownMarketplaces` and `enabledPlugins`). It misses:
- The global `~/.claude/settings.json` (users who install Codex globally will not be detected).
- The `which codex` CLI-on-PATH check (users with Codex installed as a CLI tool but not configured in settings will not be detected).

Additionally, Step 3 (lines 107-111) invokes a raw `codex` Bash command rather than the `/codex:adversarial-review` plugin skill that is available in this environment. The raw CLI approach is fragile and does not leverage the plugin infrastructure.

The contract correctly identifies both problems and proposes fixes for each.

### Scope is well-bounded

The contract targets exactly two Markdown files with four clearly delineated phases. Each phase specifies the file, the approximate line range, and the before/after behavior. No code, tests, or build steps are involved -- this is purely a documentation/instruction fix.

### Line references verified

I confirmed the contract's line references against the current file contents:
- advanced.md lines 102-105: Step 2 (auto mode detection) -- correct.
- advanced.md lines 107-111: Step 3 (review invocation) -- correct.
- advanced.md lines 113-118: Step 4 (recording) -- correct.
- evaluator.md lines 6-11: Read list -- correct.
- evaluator.md lines 30-39: Section 0 auto mode decision tree -- correct.

### Contract checks are well-defined

All 8 checks (FN-01 through FN-08) map 1:1 to the 8 steps in features.json for F-002. Each check has a clear verification method (grep or text inspection) and a pass/fail criterion. All checks are marked required, which is appropriate since each covers a distinct aspect of the fix.

### Acceptance criteria are appropriate

The four domain criteria (product_depth, functionality, visual_design, code_quality) are mapped to sensible expectations for a Markdown-only change:
- Product depth: self-contained procedure a reader can follow.
- Functionality: all 8 feature steps pass.
- Visual design: Markdown formatting consistency.
- Code quality: unambiguous instructions with clear ordering and consistency across the two files.

### Risks are identified and mitigated

The contract identifies three risks:
1. Consistency drift between advanced.md (detailed) and evaluator.md (condensed). Mitigation: write detailed first, then condense and cross-check. This is sound.
2. Severity mapping ambiguity. Mitigation: define an explicit mapping table rather than vague instructions. This is sound.
3. Backward compatibility. The contract correctly notes the new `detection_method` field is additive. No risk.

### No missing scope

The contract covers all modifications needed to fix the bug as described in features.json F-002. The three-source detection with any-one-passes semantics addresses the false-negative detection problem. Replacing the raw CLI call with the plugin skill addresses the fragile invocation problem. Updating evaluator.md keeps the condensed decision tree consistent with the detailed reference.

## Notes for builder

- When rewriting evaluator.md Section 0 (lines 30-39), ensure the condensed decision tree for `"auto"` mode lists all three sources in the same order as advanced.md Step 2 (project enabledPlugins, global extraKnownMarketplaces, CLI on PATH). Order consistency between the two files is part of FN-07.
- The severity mapping table in Phase 2 should use concrete Codex severity terms if known, or define a sensible default mapping if the exact terms are not documented elsewhere.
