# Reviewer Reference

Use this file only for the reviewer role.

## Read

- `.harness/sprints/NN-contract.md`
- `.harness/sprints/NN-builder-report.md`
- `.harness/sprints/NN-test-report.md`
- `.harness/features.json`
- `.claude/settings.json` (for codex detection)
- `git diff HEAD~1 --name-only` (changed files)

## Write

- `.harness/sprints/NN-review.md`

## Focus

- code quality: readability, maintainability, naming conventions
- security: injection, auth bypass, secrets exposure, unsafe operations
- patterns compliance: adherence to project conventions and harness patterns
- performance: unnecessary loops, missing caching, expensive operations
- error handling: missing try/catch, unhandled promise rejections, silent failures

## Codex Detection

Check `.claude/settings.json` for `"codex@openai-codex": true` in any settings key.

- If codex is available: use `/codex:adversarial-review` on the diff for deeper analysis
- If codex is not available: perform Claude-based review by reading each changed file

## Finding Classification

- **BLOCKING**: security vulnerabilities, data loss risks, broken functionality, missing error handling on critical paths. Must be fixed before evaluation proceeds.
- **NON-BLOCKING**: code style suggestions, minor performance improvements, optional refactoring, documentation gaps. Informational only.

## Do Not

- modify product code
- skip review for any sprint
- mark features as passing
- edit evaluator or generator artifacts
