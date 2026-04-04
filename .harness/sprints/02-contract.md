# Sprint Contract

## Metadata
- Role: generator
- Agent: coordinator-as-generator (continuous mode)
- Inputs: .harness/spec.md, .harness/features.json, 01-evaluation.json
- Status: in_review

## Target feature IDs
- F-013

## Goal
Wire harness-companion.mjs subcommands into the three integration points: hooks.json, session.md, and coordinator.md. After this sprint, agents will call scripts via Bash for mechanical steps instead of performing inline state management.

## Deliverables

### 1. hooks.json (plugins/harness/hooks/hooks.json)
Replace the inline Node one-liner in the PostToolUse Bash hook with a call to:
```
node plugins/harness/scripts/harness-companion.mjs progress-append --round <n> --feature <id> --status <s>
```
The hook should call the script with appropriate arguments. Since hooks fire automatically and may not have round/feature context, the hook can call a lightweight timestamp-update variant or the script can detect missing flags and do a minimal timestamp update.

### 2. session.md (plugins/harness/commands/session.md)
Add a "Mechanical Steps (Script Calls)" section that maps each session workflow step to the corresponding script subcommand:
- Feature selection: `node plugins/harness/scripts/harness-companion.mjs feature-select`
- Phase transitions: `node plugins/harness/scripts/harness-companion.mjs state-mutate --set-phase <phase>`
- Auto-commit: `node plugins/harness/scripts/harness-companion.mjs auto-commit --feature <id> --title <text> --round <n> --status <pass|fail>`
- Artifact validation: `node plugins/harness/scripts/harness-companion.mjs validate-artifacts --round <n>`
- Progress update: `node plugins/harness/scripts/harness-companion.mjs progress-append --round <n> --feature <id> --status <s>`

Update existing inline instructions to reference these script calls instead of manual JSON editing.

### 3. coordinator.md (plugins/harness/skills/harness/roles/coordinator.md)
Update the Loop Per Round section to reference script calls:
- Round increment: `state-mutate --increment-round`
- Feature selection: `feature-select`
- Phase transitions: `state-mutate --set-phase <phase>`
- Auto-commit: `auto-commit --feature <id> --title <text> --round <n> --status <pass|fail>`
- Stop condition check: `check-stop`
- Artifact validation: `validate-artifacts --round <n>`
- Progress append: `progress-append --round <n> --feature <id> --status <s>`

Remove or replace inline state management instructions with script call references.

## Verification
- hooks.json contains a command that invokes harness-companion.mjs (not an inline Node one-liner)
- session.md contains script subcommand references for all 5 mechanical steps (feature-select, state-mutate, auto-commit, validate-artifacts, progress-append)
- coordinator.md contains script subcommand references for all 7 subcommands (feature-select, state-mutate, auto-commit, validate-artifacts, progress-append, check-stop, cleanup-sprints)
- No inline state.json editing instructions remain in updated sections of session.md or coordinator.md
- All script paths use the correct relative path: `plugins/harness/scripts/harness-companion.mjs`

## Acceptance criteria
- Product depth: Script references are complete and cover all mechanical workflow steps
- Functionality: Updated docs correctly instruct agents on how to call each subcommand with proper flags
- Visual design (documentation clarity): Instructions are clear, well-formatted, and include example commands
- Code quality: hooks.json is valid JSON; Markdown files have correct structure

## Contract checks
- `PD-01` (required): hooks.json calls harness-companion.mjs instead of inline one-liner
- `PD-02` (required): session.md has a section mapping all mechanical steps to script subcommands
- `PD-03` (required): coordinator.md Loop Per Round references script calls for state management
- `FN-01` (required): All script paths resolve correctly from project root
- `FN-02` (required): Subcommand invocations include correct flags (verified by --help output)
- `VD-01` (required): Updated documentation sections are readable with clear examples
- `CQ-01` (required): hooks.json remains valid JSON after edit
- `CQ-02` (required): No inline state.json manipulation instructions remain in updated doc sections

## Risks
- hooks.json hook fires without round/feature context -- the progress-append call in hooks may need to handle missing context gracefully
- Balancing between removing all inline instructions and keeping enough context for agents to understand the workflow
