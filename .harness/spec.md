# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, releaser.md, releaser agent stub, README.md
- Status: accepted

## Overview

Add a "README Sync" step to the releaser role so that README.md is automatically verified and updated during every release. This prevents the README from drifting out of sync with actual features, version numbers, directory layouts, and skill/profile tables.

The change is additive: a new section inserted into the existing releaser role file, executed after changelog/manifest synchronization but before git tag creation.

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Markdown role files, YAML agent stubs
- Stakeholder lens: Developers using the harness, contributors

## Shipped scope

**F-001: README Sync step in releaser role**

Add a new "README Sync" section to `plugins/harness/skills/harness/roles/releaser.md`. The section is inserted after "Manifest Synchronization" and before "Version Bump Rules". It instructs the releaser to perform the following sub-steps after changelog and manifest updates but before git tag creation:

1. Read `README.md` at project root.
2. Verify version references match the new version from `release.json`.
3. Verify the architecture/file-structure diagram matches the actual directory layout on disk (discover via `ls`/`Glob`, not hardcoded paths).
4. Verify skill/profile/domain tables match installed skills discovered by scanning `plugins/*/skills/*/SKILL.md`.
5. Update any stale factual sections found in steps 2-4. Do NOT rewrite prose -- only update version strings, directory trees, and tables.
6. Stage `README.md` in the release commit (`git add README.md` before the commit that precedes the tag).

Additionally, verify that `plugins/harness/agents/releaser.md` still works correctly -- the agent stub references the role file and should need no changes since it delegates all instructions to the role file.

## User stories

- As a harness maintainer, I want the releaser to catch stale version references in README.md so I do not ship a release where the README says an old version number.
- As a contributor, I want the architecture diagram in README.md to always reflect the real directory structure so I can trust it for onboarding.
- As a user installing the harness, I want the skill/profile tables in README.md to match what is actually installed so I do not reference nonexistent skills.

## Definition of done

1. `plugins/harness/skills/harness/roles/releaser.md` contains a "README Sync" section with the verification/update sub-steps.
2. The new section is positioned after "Manifest Synchronization" and before "Version Bump Rules".
3. `plugins/harness/agents/releaser.md` still works -- confirmed that the agent stub references the role file and needs no changes.
4. The instructions are domain-agnostic: skill discovery uses glob patterns, not hardcoded skill names.
5. The instructions explicitly prohibit prose rewriting -- only factual content (version strings, directory trees, tables) may be updated.
6. Total addition is approximately 10-15 lines of Markdown in the role file.

## Execution strategy

- **Variant**: A (Full-Stack Sprinted)
- **Mode**: continuous
- **Expected sprint count**: 1 -- This is a single-feature, low-complexity change adding approximately 10-15 lines to one Markdown file with a verification-only check on a second file. No code, no tests, no build steps. One sprint is sufficient.
- **Default target ordering**: F-001 (only feature)
- **Multi-feature sprint policy**: N/A -- single feature
- **Simplification policy**: If the generator has difficulty with precise section placement within releaser.md, simplify by appending the section at the end of the file rather than inserting at the exact location. Section ordering is a preference, not a correctness requirement.
- **Methodology**: agile (default)

## High-level technical design

- **File modified**: `plugins/harness/skills/harness/roles/releaser.md` -- add a "README Sync" section (~10-15 lines) between "Manifest Synchronization" and "Version Bump Rules"
- **File verified**: `plugins/harness/agents/releaser.md` -- confirm it still delegates to the role file (expect no changes needed, since the stub says "read the role file" and the role file is the single source of truth)
- **No code changes**: This is an instruction/documentation change only
- **No build or test steps**: Markdown files do not require compilation or testing

## Non-goals

- Rewriting README prose or style
- Adding README sync to any role other than releaser
- Automated tests for the README sync step (this is a role instruction change, not executable code)
- Changing the README itself in this sprint -- only adding the releaser instruction to verify/update it at release time
- Modifying any other role files (planner, generator, evaluator, coordinator, initializer)
- Changing the agent stub beyond verifying it still works

## Version

- Current: 2.0.0
- Next: 2.0.1 (patch -- additive instruction change to releaser role, no breaking changes)
