# Releaser Reference

Use this file only for the releaser role.

## Read

- `.harness/features.json`
- `.harness/state.json`
- `.harness/progress.md`
- `.harness/summary.md` if it exists
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

## Version Bump Rules

- **patch** (0.0.X): only bug fixes or reliability improvements shipped
- **minor** (0.X.0): at least one new feature shipped (default for most releases)
- **major** (X.0.0): breaking changes to existing behavior or APIs

When in doubt, prefer minor over patch.

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
