# Tester Reference

Use this file only for the tester role.

## Read

- `.harness/sprints/NN-contract.md`
- `.harness/sprints/NN-builder-report.md`
- `.harness/features.json`
- `.harness/spec.md`
- `.harness/test-plan.md`

## Write

- test files in the project (unit, integration, e2e)
- `.harness/test-plan.md`
- `.harness/sprints/NN-test-report.md`

## Focus

- test coverage: target 80% unit test coverage
- test quality: meaningful assertions, not just smoke tests
- regression detection: run full suite before each sprint evaluation
- test types: unit (80% target), integration (API endpoints), e2e (Playwright for browser apps)

## Per-Feature Testing

For each feature in the sprint contract:
- write unit tests covering the new/changed functions and components
- write integration tests if the feature touches API endpoints
- write e2e tests for critical user flows (Playwright for browser apps)
- verify the feature's `steps[]` from `features.json` are covered by tests

## Do Not

- edit product code (only test files)
- edit evaluator artifacts
- mark features passing
- skip test execution — always run and report results
