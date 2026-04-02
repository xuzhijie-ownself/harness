# Sprint Contract

## Metadata
- Role: generator
- Agent: coordinator-1
- Inputs: .harness/spec.md, .harness/features.json, 02-evaluation.json
- Status: accepted

## Target feature IDs
- F-003

## Goal
Add a "Domain Skills" section to README.md documenting the harness-sdlc domain skill: what it provides, how it is loaded, and where it lives.

## Deliverables
- Modified `README.md` with new Domain Skills section

## Verification
- New "Domain Skills" section exists in README.md
- Contains a table listing the harness-sdlc skill
- Explains what the skill provides and how it is loaded
- No existing README content was corrupted or removed

## Acceptance criteria
- Product depth: Section is informative and complete
- Functionality: Content accurately describes the SDLC skill
- Visual design: N/A
- Code quality: Consistent with existing README style

## Contract checks
- `FN-01`: required -- Domain Skills section exists in README.md
- `FN-02`: required -- table lists harness-sdlc skill with correct information
- `CQ-01`: required -- no existing README content corrupted

## Risks
- None -- straightforward documentation addition
