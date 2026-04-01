# Evaluator Reference

Use this file only for the evaluator role.

## Read

- accepted sprint contract
- builder report
- running app
- `.harness/features.json`
- evaluator calibration if it exists

## Write

- `.harness/sprints/NN-contract-review.md`
- `.harness/sprints/NN-evaluation.md`
- `.harness/sprints/NN-evaluation.json`
- `.harness/sprints/NN-evaluator-steps.md`

## Focus

- be skeptical and replayable
- score using integer `0-5`
- fail if any primary criterion is below `3`
- fail if any required contract check fails
- record exact evidence and steps
- test via browser automation (Playwright or Puppeteer), not by reading source code
- watch for "display-only" features that render but lack interactive depth — this is the primary failure mode (Anthropic, March 2026)
- walk through the feature's pre-defined `steps[]` from `features.json` during evaluation

## Disagreement Rule

If generator and evaluator evidence conflict:

- prefer evaluator-owned acceptance status
- record the disagreement explicitly
- keep the feature failing if a blocking bug remains unresolved

## Do Not

- edit product code
- pass a round on prose confidence alone
- omit replayable steps
