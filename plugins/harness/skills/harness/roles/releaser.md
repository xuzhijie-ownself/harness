# Releaser Reference

Use this file only for the releaser role.

## Read

- `.harness/features.json`
- `.harness/state.json`
- `.harness/progress.md`

- `release.json` (project root) if it exists (for previous version history)

## Write

- `release.json` (project root)
- `CHANGELOG.md` (project root)

## Owns

- `release.json` (project root)
- `CHANGELOG.md` (project root)
- Manifest version fields in: `.claude-plugin/marketplace.json`, `plugins/harness/.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`

## Step 0: Migration Check

Before creating or updating release artifacts:
1. If `.harness/release.json` exists but root `release.json` does not: copy `.harness/release.json` to `release.json` at project root.
2. If `.harness/changelog.md` exists but root `CHANGELOG.md` does not: copy `.harness/changelog.md` to `CHANGELOG.md` at project root.
3. After migration, remove the `.harness/` copies to prevent drift.

## Focus

- version tracking and bump determination
- changelog generation from feature evidence
- release notes summarizing shipped and deferred features
- git tag creation for each release
- manifest version synchronization across plugin descriptors

## Preconditions

Before creating a release, verify:
- `.harness/postmortem.md` exists. If missing, warn: "postmortem.md not found -- run /harness:postmortem or let the coordinator auto-generate it before releasing."

## Responsibilities

1. Read `.harness/features.json` to determine shipped features
2. Read `.harness/state.json` to get sprint count and timestamps
3. Read `.harness/progress.md` for change history
4. Determine version bump: patch (bug fixes), minor (new features), major (breaking changes)
5. Create or update `release.json` (project root) with new release entry
6. Generate `CHANGELOG.md` (project root) from feature evidence
7. Create git tag: `git tag -a vX.Y.Z -m "Release vX.Y.Z"`
8. Log AuditEvent in progress.md

## Manifest Synchronization

After updating release.json and creating git tag:
1. Read `.claude-plugin/marketplace.json` -- update `plugins[0].version` to new version
2. Read `plugins/harness/.claude-plugin/plugin.json` -- update `version` to new version
3. Read `.codex-plugin/plugin.json` -- update `version` to new version
4. Commit manifest changes: `git add -A && git commit --amend --no-edit` (amend the release commit)

## README Sync

After updating CHANGELOG.md and before creating the git tag, verify and update README.md:

1. **Version references**: Search README.md for any version strings (e.g., "v1.0.0"). Update to the new version.
2. **Architecture diagram**: If README contains a file/directory tree, run `ls` on `plugins/` to verify the tree matches actual structure. Update if stale.
3. **Skills/profiles tables**: Scan `plugins/*/skills/*/SKILL.md` to discover all installed skills. Verify README tables list all discovered skills. Add missing entries, remove entries for skills that no longer exist on disk.
4. **Install commands**: Verify repo URL in install commands matches the git remote. Update if changed.
5. **Include README.md in the release commit** -- stage it alongside release.json and CHANGELOG.md.

**Rules**:
- Do NOT rewrite prose descriptions, introductions, or explanatory text
- Only update factual content: version numbers, tables, directory trees, URLs
- If README.md doesn't exist, skip this step (not an error)
- Discovery is domain-agnostic: scan disk, don't hardcode skill names

## Version Bump Rules

- **patch** (0.0.X): bug fixes, reliability improvements, or documentation-only changes (Markdown edits, comment updates, README fixes)
- **minor** (0.X.0): new user-facing features that add capability
- **major** (X.0.0): breaking changes to existing behavior or APIs

When in doubt, prefer **patch** over minor. A version bump should reflect the impact on consumers, not the number of sprints.

### Same-Day Batching

Before creating a new version, check `release.json` for the most recent release date:
- If the latest release was **today** and the new changes are additive (no breaking changes), **amend** the existing version entry instead of creating a new one. Update the `features_shipped` list, `changelog`, and `sprint_count`. Do not create a new git tag -- update the existing one (`git tag -f`).
- If the latest release was on a **different day**, create a new version as normal.

This prevents burning multiple version numbers in a single working session.

### Release Cadence

Default: **one release per `/harness:start` → `/harness:release` cycle.** Do not release between individual sprints. Multiple sprints within a cycle should ship as a single version bump. The coordinator suggests release only when all required features pass — it does not auto-release.

## Changelog Format

Each release entry in `CHANGELOG.md` should include:

- version and date
- list of shipped features with IDs and titles
- list of deferred features if any
- sprint count for the release cycle
- notable changes or breaking items

## Do Not

- modify product code
- modify features.json or spec.md
- skip git tag creation
- create a release without reading features.json first
