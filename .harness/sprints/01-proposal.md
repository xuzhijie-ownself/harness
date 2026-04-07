# Sprint Proposal

## Metadata
- Role: generator
- Agent: generator-1
- Status: in_review

## Target feature IDs
- F-043, F-044

## Grouping waiver
Both are audit-fix patterns with no file overlap (F-043: .md docs, F-044: .mjs scripts).

## Goal
Align documentation with current state and verify scripts have no dead code.

## Deliverables

### F-043: README + CLAUDE.md alignment

**README.md fixes:**
1. Commands table: add `/harness:postmortem` row (missing — 5 rows but 6 commands on disk)
2. Header line 8: change "Dual-runtime" to "Tri-runtime" and update text to name all three runtimes (Claude Code, Codex CLI, Copilot CLI)

**CLAUDE.md fixes:**
- Audit completed: design principles current, naming table current, scripts list current (9 subcommands confirmed), removed features list current. **No fixes needed in CLAUDE.md.**

### F-044: Script cleanup

**Audit completed:**
- All imports used (selectNextFeature, checkStop, readState, writeState, setPhase, incrementRound, appendCost, autoCommit, validateArtifacts, cleanupSprints, appendProgress, updateTimestamp)
- No unused exports in any lib module
- 9 subcommands confirmed via --help
- No stale comments referencing removed features (verified by integrity grep)

**No script changes needed.** F-044 passes as verification-only.

## Verification
- V1: README has 6 command rows (start, session, run, reset, release, postmortem)
- V2: README says "Tri-runtime" not "Dual-runtime"
- V3: `node harness-companion.mjs --help` shows exactly 9 subcommands
- V5: Integrity grep returns 0 stale references

## Contract checks
- FN-01 (required): README commands table has postmortem row
- FN-02 (required): README says tri-runtime
- FN-03 (required): All 9 subcommands respond without error
- FN-04 (required): Zero stale references in integrity grep
