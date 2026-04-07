# Contract Review

## Metadata
- Role: evaluator
- Agent: evaluator-1
- Inputs: 01-proposal.md, README.md, CLAUDE.md, features.json, spec.md, harness-companion.mjs --help
- Status: in_review
- Reviewed by: evaluator-1
- Decision: changes_requested

## Target feature IDs
- F-043, F-044

## Grouping waiver
Accepted. F-043 touches .md docs, F-044 touches .mjs scripts. No file overlap. Grouping is appropriate for audit-fix work.

## Verdict: CHANGES REQUESTED

The proposal contains one factual error in the claimed drift for F-043 and is otherwise sound. The error must be corrected before implementation proceeds.

## F-043: README + CLAUDE.md alignment

### Claim 1 -- Commands table missing postmortem: CONFIRMED
README.md lines 60-66 list 5 command rows (start, session, run, reset, release). There are 6 command files on disk (start.md, session.md, run.md, reset.md, release.md, postmortem.md). The postmortem row is genuinely missing. Fix is valid.

### Claim 2 -- README says "Dual-runtime" instead of "Tri-runtime": CONFIRMED
README.md line 8 reads: `**Dual-runtime:** Works with both Claude Code and OpenAI Codex CLI.`
CLAUDE.md line 122 reads: `## Tri-Runtime Support` and lists three runtimes (Claude Code, Codex CLI, Copilot CLI).
The README line is stale. Fix is valid. Note: the text must also change from "Works with both Claude Code and OpenAI Codex CLI" to name all three runtimes.

### Claim 3 -- Roles table missing releaser: REJECTED
README.md line 79 already contains: `| releaser | /harness:release, coordinator | plugins/harness/skills/harness/roles/releaser.md |`
The releaser row is present. The proposal incorrectly claims it is missing. This "fix" would be a no-op at best or could introduce a duplicate row.

### Claim 4 -- CLAUDE.md needs no fixes: CONFIRMED
CLAUDE.md already references tri-runtime (line 122), lists 9 subcommands (line 99), has current naming conventions table, current design principles, and current removed-features list. No drift found.

### Net for F-043
Two genuine fixes needed (postmortem command row, dual-to-tri-runtime). One false claim (releaser row) that must be removed from the deliverables.

## F-044: Script cleanup

### Claim -- Verification-only, no changes needed: PLAUSIBLE
The proposal asserts all imports are used, no unused exports, 9 subcommands confirmed, no stale comments. The evaluator ran `node harness-companion.mjs --help` and confirmed 9 subcommands. The verification-only framing is acceptable, but the generator must still demonstrate the audit was performed (e.g., import listing, grep results) in the builder report. Accepting a verification-only pass with no evidence beyond prose would violate the evaluator role's "do not pass on prose confidence alone" rule.

## Contract check review

| Check | Assessment |
|-------|-----------|
| FN-01 (postmortem row) | Valid required check. Currently failing. |
| FN-02 (tri-runtime) | Valid required check. Currently failing. |
| FN-03 (releaser in roles table) | Invalid. The releaser row already exists at README.md line 79. Remove this check or rewrite it as a verification-only check that confirms the row is present. |
| FN-04 (9 subcommands) | Valid required check. Currently passing (verified). |
| FN-05 (zero stale references) | Valid required check. Must be demonstrated with grep output. |

## Verification criteria review

- V1 (6 command rows): Valid. Currently 5 rows, should become 6.
- V2 (tri-runtime): Valid. Currently says "Dual-runtime".
- V3 (6 roles rows including releaser): Invalid as a deliverable. Already 6 rows. Rewrite as "README roles table still has 6 rows including releaser" (verification, not a fix).
- V4 (9 subcommands): Valid. Already passing.
- V5 (zero stale references): Valid. Must be demonstrated.

## Required changes before acceptance

1. Remove the claim that the releaser row is missing from the roles table. Either delete FN-03 and V3, or rewrite them as verification-only checks (confirming existing state, not claiming a fix).
2. Ensure the "Dual-runtime" fix also updates the descriptive text on the same line (currently says "Works with both Claude Code and OpenAI Codex CLI" which names only two runtimes).
3. For F-044 verification-only pass: the builder report must include concrete evidence (import audit output, grep results for stale references), not just prose assertions.

## Acceptance criteria alignment

The domain profile is `software` with criteria mapped for maintenance:
- product_depth (thoroughness of cleanup): Proposal scope is appropriate for a maintenance cycle.
- functionality (correctness of fixes): Two of three claimed F-043 fixes are genuine. One is wrong.
- visual_design (documentation clarity): Fixes improve doc accuracy. Acceptable scope.
- code_quality (script hygiene): Verification-only approach is acceptable if evidence is provided.

## Risks acknowledged
- Low risk overall. This is a small, deterministic sprint.
- The false releaser claim is a minor error, not a structural problem. Correcting the proposal and proceeding is the right path.
