# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, postmortem findings F-040/F-041, plugins/harness/commands/start.md, plugins/harness/commands/session.md, release.json, CHANGELOG.md
- Status: accepted

## Overview

Harness v2.2.8 is a patch release addressing two postmortem findings from the v2.2.7 cycle. F-040 adds abandon/resume guidance to both interactive review loops introduced in the previous cycle (start.md Spec Review and session.md Contract Review). F-041 cuts the patch release itself, bundling all unreleased changes since v2.2.7.

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Markdown command files
- Stakeholder lens: Harness users (developers running /start and /session), harness maintainers

Note: "visual_design" maps to command file clarity, formatting consistency, and user-facing message quality for this infrastructure cycle.

## Design direction

Minimal textual insertions. Each review loop gains a single-line note explaining what happens if the user abandons mid-review and how to resume. The release step follows the standard releaser flow.

## Shipped scope

### Sprint 1 -- Abandon guidance and patch release

**F-040: Add abandon guidance to both interactive review loops**
- In `plugins/harness/commands/start.md`, Spec Review section (between steps 5 and 6): add a note after the loop description stating "If you stop mid-review, the phase stays at idle. Resume with /harness:start to continue."
- In `plugins/harness/commands/session.md`, Contract Review section (between steps 7 and 8): add a note after the loop description stating "If you stop mid-review, the phase stays at contract. Resume with /harness:session to continue."
- These are informational notes, not new steps. They do not change step numbering.

**F-041: Release as patch v2.2.8**
- Cut a patch release (v2.2.8) including all unreleased changes since v2.2.7
- This includes the interactive review loops from the previous cycle (F-037, F-038, F-039) plus the abandon guidance from F-040
- Follow standard releaser flow: update release.json, CHANGELOG.md, plugin.json manifests, README version references

## User stories

- As a harness user, I want to know what happens if I stop in the middle of a spec review or contract review, so I am not worried about losing progress.
- As a harness user, I want to know how to resume an abandoned review, so I can pick up where I left off.
- As a harness maintainer, I want unreleased changes shipped as a patch, so the version history stays clean and users get the latest fixes.

## Execution strategy
- Variant: Variant A (sprinted, single generate-evaluate loop per round)
- Mode: continuous
- Expected sprint count: 1 (both features are trivial edits -- two single-line note insertions and a standard release cut; no code logic involved)
- Default target ordering: F-040 then F-041 (add the notes first so the release includes them)
- Multi-feature sprint policy: Both features grouped in one sprint. F-040 is two single-line insertions. F-041 is the release that packages F-040. Grouping waiver justified by: F-041 depends on F-040 being done, and both are trivially small.
- Simplification policy: If the sprint fails evaluation, fix in a second round. These are markdown-only changes.
- Methodology: agile

## High-level technical design

- **start.md changes**: Add a note line after the "This loop repeats until the user approves" sentence in the Spec Review section. The note reads: "If you stop mid-review, the phase stays at idle. Resume with /harness:start to continue." This is not a new numbered step.
- **session.md changes**: Add a note line after the "This loop repeats until the user approves" sentence in the Contract Review section. The note reads: "If you stop mid-review, the phase stays at contract. Resume with /harness:session to continue." This is not a new numbered step.
- **Release (F-041)**: Standard releaser flow -- bump version to 2.2.8 in release.json, plugin.json manifests, CHANGELOG.md, README.md version references.
- **No script changes**: No new subcommands or script logic.
- **No schema changes**: state.json, features.json, config.json unchanged.

## Non-goals

- Changing review loop behavior (the loops already work correctly; this only adds informational text)
- Adding new sprint phases or state transitions for abandon/resume (the existing phase semantics already handle this)
- Changing step numbering in either command file
- Any feature work beyond the two postmortem findings

## Definition of done

1. `plugins/harness/commands/start.md` Spec Review section contains abandon/resume guidance note
2. `plugins/harness/commands/session.md` Contract Review section contains abandon/resume guidance note
3. Step numbering in both files is unchanged
4. Existing behavior of both command files is preserved
5. v2.2.8 release cut with updated release.json, CHANGELOG.md, plugin.json manifests, and README version references

## Security Context
- data_sensitivity: none
- external_exposure: none
- auth_model: none
- compliance: none

## Risks

- **Minimal risk**: Both findings are single-line text insertions. The release step follows established patterns with 15+ prior releases in the changelog.
