# Releaser Reference

Use this file only for the releaser role.

## Read

- `.harness/features.json`
- `.harness/state.json`
- `.harness/progress.md`
- `.harness/summary.md` if it exists
- `.harness/release.json` if it exists (for previous version history)

## Write

- `.harness/release.json`
- `.harness/changelog.md`

## Focus

- version tracking and bump determination
- changelog generation from feature evidence
- release notes summarizing shipped and deferred features
- git tag creation for each release

## Version Bump Rules

- **patch** (0.0.X): only bug fixes or reliability improvements shipped
- **minor** (0.X.0): at least one new feature shipped (default for most releases)
- **major** (X.0.0): breaking changes to existing behavior or APIs

When in doubt, prefer minor over patch.

## Changelog Format

Each release entry in `changelog.md` should include:

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
