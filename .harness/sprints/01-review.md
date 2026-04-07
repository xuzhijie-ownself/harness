# Contract Review

## Metadata
- Role: evaluator
- Agent: evaluator-1
- Inputs: .harness/sprints/01-proposal.md, .harness/features.json, .harness/spec.md, install.sh, install.bat, CLAUDE.md
- Status: accepted
- Reviewed by: evaluator-1
- Decision: accept

## Target feature IDs
- F-033
- F-034
- F-035
- F-036

## Grouping waiver assessment

The grouping waiver is justified. All four features share three edit surfaces (install.sh, install.bat, CLAUDE.md). F-033 and F-034 are the identical path-correction logic in two languages. F-035 extends the same REL_PATH computation to a second output file. F-036 is a single rule addition. The spec explicitly groups all four in Sprint 1 with a one-sprint expected count. Splitting would create unnecessary evaluation overhead with no risk reduction benefit.

**Verdict**: Waiver accepted.

## Proposal quality

### Completeness
The proposal covers all four features with concrete deliverables, per-feature verification steps, acceptance criteria mapped to the four domain criteria, and 10 contract checks (8 required, 2 advisory). Risks are identified with mitigations. This is thorough.

### Verification clarity
Each feature has numbered verification steps that are executable from the command line. The checks are specific: validate JSON parseability, confirm path resolution to actual directories, check for the YAML rule text and rationale. These are testable without ambiguity.

### Contract checks
- PD-01, PD-02: Cover the core path-correctness and dynamic computation requirements
- FN-01 through FN-05: Cover all four features' functional output
- VD-01: Advisory, appropriate for output messaging
- CQ-01, CQ-02: Cover dependency discipline and source-file immutability

The check set is complete. Every feature has at least one required contract check. No feature can silently pass without verification.

### Acceptance criteria alignment
The criteria map to the domain profile (product_depth, functionality, visual_design, code_quality) and each has concrete, measurable sub-points. The visual_design criterion is appropriately reinterpreted as "script readability and output clarity" for this infrastructure work, consistent with spec.md.

## Implementation review (code already exists)

Since the implementation files were provided, I reviewed them against the proposal.

### install.sh observations
- REL_PATH computed via `python3 -c "import os; print(os.path.relpath(...))"` with fallback to `plugins/harness` -- matches proposal
- VERSION read from source plugin.json via node with fallback to `0.0.0` -- matches proposal
- plugin.json generated via heredoc with `$REL_PATH` interpolation -- matches proposal
- copilot-instructions.md generated via sed with two replacement patterns -- matches proposal
- REL_PATH printed during install -- matches VD-01
- Uninstall path unchanged -- matches proposal

### install.bat observations
- REL_PATH computed via `node -e "require('path').relative(...)"` with backslash-to-forward-slash conversion -- matches proposal
- Fallback to `plugins/harness` if empty -- matches proposal
- plugin.json generated via node one-liner writing JSON -- matches proposal
- copilot-instructions.md generated via node one-liner with regex replacement -- matches proposal
- Forward slashes used in JSON output -- matches proposal
- REL_PATH printed during install -- matches VD-01

### CLAUDE.md observations
- YAML frontmatter rule added after the Naming Conventions table -- matches proposal placement
- Specifies `description` fields must be quoted strings -- matches F-036 requirement
- Explains rationale (strict parser compatibility, "nested mappings" parse error) -- matches proposal

## Issues identified

### Non-blocking

1. **install.sh heredoc strips fields**: The proposal says "Preserve all other fields from the source plugin.json (name, version, description, interface, etc.)" but the implementation generates a minimal JSON with only `name`, `version`, and `skills`. Fields like `description` and `interface` from the source are dropped. This diverges from the proposal's stated approach but is acceptable because: (a) the contract checks only require valid JSON with correct skills paths, (b) the proposal itself lists "use sed on the source file OR generate JSON inline" as alternatives, and (c) the inline approach is simpler and avoids sed-on-JSON fragility. The generated file serves its purpose (Codex skill discovery). However, if Codex CLI ever reads other fields, this will need revisiting.

2. **install.bat quoting in node -e**: The `for /f` line on line 19 uses single quotes inside the node expression which are also the batch `for /f` delimiters. This works when node is present but could be fragile. This is an existing Windows batch limitation, not a blocking concern.

3. **Double-replacement risk in sed**: The sed command on line 63 of install.sh replaces `plugins/harness/` globally. If REL_PATH itself contains `plugins/harness/` (which it does in the standard case: `plugins/harness`), a second run could produce triple-prefixed paths. However, each run regenerates from the source file, not the output, so idempotency is maintained. Not blocking.

## Decision

**ACCEPT**

The proposal is well-structured with clear deliverables, testable contract checks, and appropriate risk identification. The implementation aligns with the proposal on all required contract checks. The non-blocking issues noted above are minor and do not affect the core path-correction functionality. The grouping waiver is justified by shared edit surfaces and low individual complexity.

The sprint is ready for implementation evaluation.
