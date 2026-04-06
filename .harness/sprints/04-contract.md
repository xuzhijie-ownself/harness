# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-4
- Inputs: .harness/spec.md, .harness/features.json, 03-evaluation.json
- Status: in_review

## Target feature IDs
- F-019 (Postmortem command)

## Goal
Create a `/harness:postmortem` command that reads all evaluation artifacts, state.json, features.json, and events.jsonl to generate a comprehensive .harness/postmortem.md with Timeline, Score Trends, Failure Analysis, Process Compliance, and Recommendations sections. The command delegates synthesis to the LLM via a command skill file.

## Deliverables
- `plugins/harness/commands/postmortem.md` -- command file for /harness:postmortem
  - Instructs the agent to read: all NN-evaluation.json files, state.json, features.json, events.jsonl
  - Instructs the agent to run metrics-summary and read-events subcommands for structured data
  - Template includes all 5 sections: Timeline, Score Trends, Failure Analysis, Process Compliance, Recommendations
- Register `./commands/postmortem.md` in `plugins/harness/.claude-plugin/plugin.json` commands array

## Verification
- PD-01: (required) postmortem.md command file exists and contains instructions for all 5 output sections
- FN-01: (required) Command references correct data sources (evaluation JSONs, state.json, features.json, events.jsonl)
- FN-02: (required) postmortem.md is registered in plugin.json commands array
- VD-01: (advisory) Command file follows the frontmatter + markdown format of existing commands
- CQ-01: (required) Command delegates synthesis to LLM, does not attempt script-level generation

## Acceptance criteria
- Product depth: command provides actionable retrospective with timeline, trends, and recommendations
- Functionality: command file is parseable, registered in plugin.json, references all data sources
- Visual design: command file format matches existing commands (release.md, run.md, etc.)
- Code quality: clean separation between data gathering (script layer) and synthesis (LLM)

## Contract checks
- `PD-01`: (required) postmortem.md references all 5 sections
- `FN-01`: (required) data source references are complete
- `FN-02`: (required) plugin.json registration
- `VD-01`: (advisory) format consistency with existing commands
- `CQ-01`: (required) LLM synthesis delegation

## Risks
- Postmortem quality depends on LLM synthesis, which cannot be fully verified by the evaluator
- Mitigated by providing clear structure and data gathering instructions in the command file
