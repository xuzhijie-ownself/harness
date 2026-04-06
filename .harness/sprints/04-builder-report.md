# Builder Report

## Metadata
- Role: generator
- Agent: generator-4
- Inputs: accepted 04-contract.md, spec.md, features.json
- Status: completed

## Target feature IDs
- F-019 (Postmortem command)

## Implemented

1. **plugins/harness/commands/postmortem.md** -- new command file for `/harness:postmortem`
   - Frontmatter follows the same pattern as session.md, run.md, release.md (name, description, allowed_tools)
   - Pre-flight validation checks for state.json, features.json, and at least one evaluation artifact
   - Data Gathering section instructs the agent to read 6 data sources:
     - All NN-evaluation.json files (with specific fields to extract)
     - metrics-summary subcommand output (via harness-companion.mjs)
     - state.json (cost_tracking, round info, errors)
     - features.json (pass/fail history, retry detection)
     - read-events subcommand output (via harness-companion.mjs)
     - NN-evaluation.md files for qualitative detail (optional)
   - Output Structure section provides a complete markdown template with all 5 required sections:
     - Timeline (chronological round table)
     - Score Trends (criterion scores across rounds)
     - Failure Analysis (per-feature failure history and root causes)
     - Process Compliance (artifact existence, authenticity gate, spec adherence)
     - Recommendations (3-5 actionable items)
   - Post-flight prints path and summary line

2. **plugins/harness/.claude-plugin/plugin.json** -- added `./commands/postmortem.md` to commands array

## Commands run
- `node -e "JSON.parse(...)"` to validate plugin.json remains valid JSON
- `head -6 plugins/harness/commands/postmortem.md` to verify frontmatter format
- `git add` + `git commit` for the two changed files

## Self-check
- Complete: command file exists with all 5 sections, references all data sources, registered in plugin.json
- Complete: synthesis is delegated to the LLM agent (command file provides structure and data gathering instructions; no script-level markdown generation)
- Risky: the quality of the generated postmortem depends on the LLM following the template faithfully; mitigated by providing detailed extraction instructions and a concrete output template with table structures

## Authenticity self-check
- **Internal consistency**: The command file follows the same conventions as existing commands (frontmatter with name/description/allowed_tools, section headings for preconditions/steps/post-flight, bash code blocks for script calls). The data source references use the exact subcommand names from harness-companion.mjs (metrics-summary, read-events).
- **Intentionality**: The command template is project-specific: it references harness-specific artifacts (NN-evaluation.json schema fields like primary_scores, authenticity_gate), uses the actual harness-companion.mjs subcommands rather than generic placeholders, and the output structure maps directly to the 5 sections defined in the F-019 feature spec. The Process Compliance section checks harness-specific concerns (contract checks, authenticity gate, agent spawn errors).
- **Craft**: Frontmatter YAML is valid, markdown headings follow consistent hierarchy (h1 for title, h2 for major sections, h3 for data source subsections), code blocks use bash fences, the output template uses proper markdown table syntax.
- **Fitness for purpose**: The command is self-contained -- an LLM agent can follow it without needing external documentation. Each data source has explicit extraction instructions listing which fields to pull. The output template shows exact table column headers. Post-flight tells the agent what to print so the user gets confirmation.

## Suggested feature updates
- F-019: may now pass. The command file contains all 5 output sections (PD-01), references all data sources including evaluation JSONs, state.json, features.json, and events.jsonl (FN-01), is registered in plugin.json (FN-02), follows existing command format (VD-01), and delegates synthesis to the LLM rather than script-level generation (CQ-01).
