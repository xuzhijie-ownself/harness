# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, all 17 harness kernel files (6 agents, 5 commands, SKILL.md, patterns.md, 2 role files, 2 plugin.json manifests)
- Status: accepted

## Overview

Simplify the harness kernel to reduce total prose by approximately 22% while preserving all functionality and maintaining dual-runtime compatibility (Claude Code plugin.json + Codex plugin.json). The harness currently distributes ~1,966 lines across 17 core files. Duplicated content between agent files and role files, repeated pre-flight blocks across commands, and non-essential sections in SKILL.md account for the excess.

This is a refactoring release -- no behavioral changes, no new features, no removed capabilities. The version bumps from 0.9.1 to 1.0.0, marking the harness as mature.

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Code (Markdown, JSON, YAML frontmatter)
- Stakeholder lens: Plugin authors, harness users (developers running the harness)

## Design direction

Every change must satisfy two invariants:

1. **File-count invariant**: The Claude Code plugin.json `agents[]` array (6 files) and `commands[]` array (5 files) remain unchanged. No file merges, no file deletions, no renames.
2. **Behavioral invariant**: A harness run before and after this refactor must produce identical artifact structure, identical evaluation flow, and identical stop conditions.

## Shipped scope

### F-001: Agent file deduplication

Convert 6 agent files (evaluator.md, coordinator.md, generator.md, initializer.md, planner.md, releaser.md) from prose-heavy duplications of their role files into thin YAML-frontmatter wrappers that point to the role file as single source of truth. Each agent file retains its frontmatter (name, description, tools) and adds a short body that says "read and follow the role file." All duplicated procedural prose is removed from agent files. Role files become the canonical reference.

Estimated savings: ~280 lines across 6 files.

### F-002: Command file shared pre-flight extraction

The 4-step State Validation block is duplicated verbatim across all 5 command files (init.md, run.md, session.md, reset.md, release.md). Extract this shared validation into a named section in SKILL.md ("Command Pre-Flight Validation"). Each command file replaces its inline copy with a pointer: "Run the Command Pre-Flight Validation from SKILL.md before proceeding." Command-specific pre-flight steps remain inline.

Estimated savings: ~100 lines across 5 files (20 lines removed per file, offset by ~5 lines added to SKILL.md).

### F-003: SKILL.md non-core section extraction

Move these sections from SKILL.md to a new file `references/advanced.md`:
- "Harness Decay" section (lines 689-701)
- "Simplify Methodically" section (lines 721-731)
- "Review The Harness" section (lines 762-777)
- Variant B and Variant C full descriptions (keep one-line summaries with pointer to advanced.md)
- Trim "Context Reset vs Compaction" section from ~18 lines to 5 lines with pointer

SKILL.md gains a single line: "For advanced topics (decay testing, simplification policy, harness review checklist, Variant B/C details, context reset guidance), see references/advanced.md."

Estimated savings: ~70 lines net from SKILL.md.

### F-004: Codex detection simplification

The 45-line 4-step Codex detection pre-flight appears in both the evaluator agent file and the evaluator role file. After F-001 deduplicates the agent file, condense the role file's version from a 4-step procedure to a 3-line decision tree:

```
Codex review mode: read config.json use_codex ->
  "off" -> claude | "on" -> try codex, fallback claude |
  "auto" -> check .claude/settings.json for openai-codex, use codex if found, else claude.
Record: review_mode, config_use_codex, codex_available, detection_result, fallback_reason.
```

Same logic, same output fields, fewer words. The detailed Step 1-4 procedure moves to references/advanced.md as a reference for debugging.

Estimated savings: ~30 lines from the evaluator role file.

### F-005: Conditional evaluator calibration

Make `.harness/evaluator-calibration.md` required only when `expected_sprint_count > 3` in the execution strategy. For shorter runs (3 or fewer sprints), calibration is optional -- the evaluator still scores with anchors but does not need to persist them to a separate file. Update the coordinator's calibration enforcement and the evaluator's calibration section accordingly.

Estimated savings: ~20 lines of conditional logic simplified across evaluator and coordinator files.

### F-006: Merge retrospective into progress log

Instead of creating separate `retro-RX-RY.md` files, append retrospective sections directly to `.harness/progress.md` under a `## Retrospective -- Rounds X-Y` heading. Update the retro template in patterns.md, the coordinator's retro generation logic, and SKILL.md's retrospective section. Remove the `retro-RX-RY.md` template from patterns.md.

Estimated savings: ~15 lines from patterns.md template removal and simplified coordinator retro logic.

## User stories

- As a harness maintainer, I want agent files to be thin wrappers so I only update procedural logic in one place (the role file).
- As a command author, I want shared validation defined once so adding a new command does not require copying boilerplate.
- As a new contributor, I want SKILL.md to be focused on core workflow so I can understand the harness without reading advanced-topic prose.
- As an evaluator agent, I want Codex detection expressed concisely so I spend fewer tokens parsing the procedure.
- As a coordinator, I want calibration to be conditional so short runs do not produce unnecessary artifacts.
- As a harness user, I want retrospectives inline in progress.md so I have one file to read for run history.

## Execution strategy

- **Variant**: Variant A (Full-Stack Sprinted Harness)
- **Mode**: continuous
- **Expected sprint count**: 3 sprints
  - Sprint 1: F-001 (agent dedup) + F-002 (command pre-flight) -- grouped because they are independent file-level refactors with no interaction risk; grouping waiver applies
  - Sprint 2: F-003 (SKILL.md trim) + F-004 (Codex simplification) -- grouped because F-004 moves content to the same advanced.md file created by F-003; natural co-location
  - Sprint 3: F-005 (conditional calibration) + F-006 (retro merge) -- grouped because both simplify coordinator enforcement logic in the same code paths
- **Default target ordering**: F-001 -> F-002 -> F-003 -> F-004 -> F-005 -> F-006 (dependency order: F-001 before F-004 because Codex simplification in the role file depends on agent dedup removing the duplicate from the agent file first)
- **Multi-feature sprint policy**: Allowed. Each sprint groups 2 features that are either independent or naturally co-located. Grouping waivers documented per sprint in the contract.
- **Simplification policy**: Not justified. Sprint decomposition is load-bearing here because each pair of changes touches different files and needs separate verification. Simplified mode would risk undetected regressions across file boundaries.
- **Methodology**: agile (default)

## High-level technical design

- **Files modified**: 6 agent files, 5 command files, SKILL.md, patterns.md, evaluator role file, coordinator role file
- **Files created**: `references/advanced.md` (new, receives extracted content from SKILL.md)
- **Files unchanged**: All other role files (initializer, planner, generator, releaser roles), all plugin.json manifests (file arrays stay identical), all domain skill files (harness-sdlc, harness-ea, etc.)
- **Verification method**: Line-count diff before/after each sprint. Manual read-through of each modified file to confirm no behavioral change. Structural check that plugin.json arrays still resolve to valid files.

## Definition of done

1. All 6 agent files are thin wrappers (frontmatter + read-role-file instruction + ownership declaration only, no duplicated procedural prose).
2. All 5 command files reference shared pre-flight from SKILL.md instead of inline duplication.
3. SKILL.md is shorter by at least 60 lines with non-core content moved to references/advanced.md.
4. Codex detection in evaluator role file is 10 lines or fewer (down from ~45).
5. Evaluator calibration is conditional on expected_sprint_count > 3.
6. Retrospectives append to progress.md instead of creating separate retro files.
7. Total line reduction across all modified files is at least 400 lines (~20%).
8. Both plugin.json files (Claude Code and Codex) are unmodified -- file arrays unchanged.
9. No behavioral change: artifact structure, evaluation flow, stop conditions, and dispatch rules remain identical.
10. Version in release.json bumps to 1.0.0.

## Non-goals

- Adding new features or capabilities to the harness.
- Changing the plugin.json manifest structure or file arrays.
- Modifying domain skill files (harness-sdlc, harness-ea, harness-ba, harness-sa, harness-ops).
- Changing JSON schemas in patterns.md (features.json, state.json, config.json, evaluation.json schemas stay identical).
- Rewriting patterns.md templates beyond removing the retro-RX-RY.md template.
- Changing the GAN pattern, dispatch rules, or role ownership boundaries.
- Performance optimization or runtime changes.
