# Decomposition Decision

## Metadata
- Role: coordinator
- Agent: coordinator-1
- Inputs: spec.md, features.json
- Status: accepted

## Planned order
- Sprint 1 (Round 1): F-020, F-021, F-022 -- hooks infrastructure and verification subcommand
- Sprint 2 (Round 2): F-023, F-024 -- evaluator docs fix and finalize-round subcommand

## Grouping policy
- Multi-feature grouping justified per spec.md execution strategy

## Exceptions
- Sprint 1 groups F-020+F-021+F-022 because F-020 and F-021 both modify hooks.json (shared file surface) and F-022 is a small independent subcommand that fits within the same round. Grouping waiver documented in spec.md.
- Sprint 2 groups F-023+F-024 because F-023 is documentation-only and F-024 is a small additive subcommand. Both are independent and individually small enough to batch.
