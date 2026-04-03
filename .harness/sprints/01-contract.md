# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/spec.md, .harness/features.json, plugins/harness/skills/harness/roles/releaser.md
- Status: in_review

## Target feature IDs
- F-001

## Goal
Add a "README Sync" section to `plugins/harness/skills/harness/roles/releaser.md` that instructs the releaser to verify and update README.md during every release. The section is inserted after "Manifest Synchronization" and before "Version Bump Rules".

## Deliverables
- Modified `plugins/harness/skills/harness/roles/releaser.md` with new "## README Sync" section (~15 lines)
- No changes to `plugins/harness/agents/releaser.md` (verified it delegates to role file)

## Verification
- Read the modified releaser.md and confirm the README Sync section exists
- Confirm section position: after "## Manifest Synchronization", before "## Version Bump Rules"
- Confirm all 5 sub-steps are present (version references, architecture diagram, skills/profiles tables, install commands, staging)
- Confirm Rules block prohibits prose rewriting
- Confirm skill discovery uses glob scan, not hardcoded names
- Confirm releaser agent stub still delegates to role file without changes

## Acceptance criteria
- Product depth: The README Sync instructions are actionable and cover the four verification domains (version, tree, tables, URLs)
- Functionality: The section integrates correctly into the existing releaser workflow sequence
- Visual design: Markdown formatting is consistent with existing sections in releaser.md
- Code quality: Instructions are domain-agnostic; no hardcoded skill or path names

## Contract checks
- `PD-01`: (required) README Sync section contains 5 numbered sub-steps covering version refs, architecture diagram, skills tables, install commands, and staging
- `FN-01`: (required) Section is positioned after Manifest Synchronization and before Version Bump Rules
- `VD-01`: (advisory) Markdown heading level and list formatting matches existing releaser.md style
- `CQ-01`: (required) Skill discovery uses glob/scan pattern (e.g., `plugins/*/skills/*/SKILL.md`), not hardcoded skill names

## Risks
- Minimal: this is a ~15-line Markdown insertion into an existing file
