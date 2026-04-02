# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, floofy-scribbling-eagle.md plan, existing plugin source
- Status: accepted

## Overview

The Harness Codex Fix + Enhancements project addresses five defects and gaps discovered across 30+ sprints of real harness usage (SingPost 14, plugin v2 10, plugin v3 11, SDLC skill 3). The primary failure: codex review never triggered despite being configured, because the evaluator's codex detection was written as descriptive guidance rather than mandatory sequential steps. Secondary issues include incomplete artifact enforcement (3 of 5 checked), missing context freshness tracing, and build-only verification passing where runtime verification should be required.

This is a documentation/schema fix project -- all changes target Markdown agent instructions and JSON schema definitions within the plugin, not application code.

## Shipped scope

### F-001: Evaluator Codex Pre-Flight
Rewrite `plugins/harness/agents/evaluator.md` codex detection from descriptive bullets to a mandatory sequential pre-flight section ("Section 0") inserted before the testing section. Add SDLC skill reference to the evaluator's read list.

### F-002: Evaluator Role Mirror
Mirror the pre-flight changes in `plugins/harness/skills/harness/roles/evaluator.md`. Add `harness-sdlc` to the Read list. Replace descriptive codex bullets with reference to pre-flight.

### F-003: Evaluation Schema Update
Add `codex_detection` object (with fields `config_use_codex`, `settings_codex_enabled`, `detection_result`, `fallback_reason`) to `review_findings` in the `NN-evaluation.json` schema in `plugins/harness/skills/harness/references/patterns.md`. Update the `NN-evaluation.md` template's Code Review section to include detection fields.

### F-004: Coordinator Enforcement
In `plugins/harness/agents/coordinator.md`: add a Codex Detection Enforcement section, expand sprint artifact checks from 3 to 5 (adding contract-review.md and evaluation.json), and add context freshness trace logging (`rounds_since_reset: N / threshold`) at round start. Mirror codex enforcement in `plugins/harness/skills/harness/roles/coordinator.md`.

### F-005: SKILL.md Runtime Verification
Strengthen the evaluator section of `plugins/harness/skills/harness/SKILL.md` to require runtime verification (application starts and responds) for software-profile projects, not just build-only verification.

## User stories

- As a harness user with the Codex plugin installed, I want the evaluator to actually detect and invoke codex review so that I get deeper code analysis without manual intervention.
- As a harness operator, I want all 5 sprint artifacts enforced before round advancement so that incomplete sprints cannot silently pass.
- As a harness operator, I want context freshness traced in progress.md so that I can see when a context reset is approaching.
- As a harness user running software projects, I want the evaluator to verify the app actually starts (not just builds) so that runtime failures are caught.

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Markdown instructions, JSON schemas, plugin configuration files
- Stakeholder lens: Harness plugin developers, harness end-users

Note: Although the domain profile is `software`, the artifacts being modified are documentation and schema files, not application code. Evaluation criteria should be interpreted accordingly -- "functionality" means the instructions produce correct agent behavior, "code_quality" means the Markdown/JSON is well-structured and unambiguous, "visual_design" maps to document clarity and formatting, and "product_depth" means the fix addresses the root cause comprehensively.

## Execution strategy
- Variant: Variant A (sprinted)
- Mode: continuous
- Expected sprint count: 5 (one feature per sprint)
- Default target ordering: F-003 (schema first, since evaluation artifacts reference this schema) then F-001 then F-002 then F-004 then F-005
- Multi-feature sprint policy: one feature per sprint; no grouping unless a feature is trivially small (under 5 lines of change) and shares the same file as the current target
- Simplification policy: not justified -- all 5 features are discrete, well-scoped fixes with clear verification. Each sprint targets a single file or file pair. No simplification needed.

## High-level technical design
- Frontend: N/A (plugin documentation project)
- Backend: N/A
- Data/storage: N/A
- Files modified: 6 Markdown files + 1 JSON schema section across the plugin tree

### File map

| Feature | Files modified |
|---------|---------------|
| F-003 | `plugins/harness/skills/harness/references/patterns.md` |
| F-001 | `plugins/harness/agents/evaluator.md` |
| F-002 | `plugins/harness/skills/harness/roles/evaluator.md` |
| F-004 | `plugins/harness/agents/coordinator.md`, `plugins/harness/skills/harness/roles/coordinator.md` |
| F-005 | `plugins/harness/skills/harness/SKILL.md` |

## Non-goals
- Modifying application/product code
- Changing the harness runtime loop logic
- Adding new harness commands or slash commands
- Redesigning the evaluation scoring rubric
- Adding automated tests for the plugin itself (the plugin is Markdown instructions, not executable code)
- README updates

## Definition of done

All five features pass verification:

1. **F-003**: `patterns.md` contains a `codex_detection` object inside `review_findings` in the `NN-evaluation.json` schema. The `NN-evaluation.md` template's Code Review section includes detection fields.
2. **F-001**: `agents/evaluator.md` has a "Section 0" or "Pre-Flight" section before the testing section with mandatory sequential codex detection steps. The read list includes `harness-sdlc/SKILL.md`.
3. **F-002**: `roles/evaluator.md` mirrors the pre-flight section and includes `harness-sdlc` in the Read list.
4. **F-004**: `agents/coordinator.md` has codex detection enforcement, checks 5 artifacts (not 3), and includes context freshness trace. `roles/coordinator.md` references codex enforcement.
5. **F-005**: `SKILL.md` evaluator section explicitly requires runtime verification (not just build) for software-profile projects.

Verification method: file content reads and grep for key terms (`pre-flight`, `codex_detection`, `contract-review.md`, `evaluation.json`, `rounds_since_reset`, `runtime verification`).
