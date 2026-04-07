# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, CLAUDE.md, plugins/harness/commands/start.md, plugins/harness/commands/session.md, plugins/harness/skills/harness/roles/planner.md, plugins/harness/skills/harness/roles/generator.md, plugins/harness/skills/harness/references/patterns.md
- Status: accepted

## Overview

Harness v2.3.0 adds interactive review loops to the two main entry-point commands (`/harness:start` and `/harness:session`) so the user can shape plan and contract content before downstream agents consume it. Today the flow is fully automated: planner writes spec.md and the initializer immediately scaffolds from it; generator writes a proposal and the evaluator immediately reviews it. Users who want to iterate on plan content resort to external `/plan` commands from other plugins, which activate "plan mode" and contaminate harness agent spawns (agents write to `.claude/plans/` instead of `.harness/sprints/`).

The fix: embed review-modify-approve loops directly in the harness commands. The user sees the artifact, can request changes, and only after explicit approval does the flow advance. This keeps all interaction inside the harness context with no plan-mode side effects.

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Markdown command files, CLAUDE.md documentation
- Stakeholder lens: Harness users (developers running /start and /session), harness maintainers

Note: "visual_design" maps to command file clarity, formatting consistency, and user-facing message quality for this infrastructure cycle.

## Design direction

Minimal insertion. Each command file gains a review loop between the artifact-write step and the next-agent-spawn step. No new files, no new scripts, no new subcommands. The loop is expressed as numbered steps in the command markdown -- the orchestrating agent (Claude Code) follows them conversationally. CLAUDE.md gets a new section documenting the interaction points.

## Shipped scope

### Sprint 1 -- Interactive review loops and documentation

**F-037: Interactive spec review in /harness:start**
- Add a review loop between planner output (step 4) and initializer spawn (step 5) in `plugins/harness/commands/start.md`
- After planner writes spec.md, show its content to the user (at minimum: overview, shipped scope, execution strategy, security context)
- Present three options: "Approve spec / Modify / Start over"
  - Approve: proceed to initializer spawn (current step 5)
  - Modify: user describes changes, planner rewrites spec.md, show again
  - Start over: planner re-generates from scratch using original user goal, show again
- The loop repeats until the user approves
- Only after approval: spawn initializer
- Remove or adjust step 7 ("Show the Execution strategy from spec.md for user confirmation") since it is now redundant -- the user already approved the full spec

**F-038: Interactive contract review in /harness:session**
- Add a review loop between generator proposal (step 6) and evaluator contract review (step 7) in `plugins/harness/commands/session.md`
- After generator writes NN-proposal.md, show its content to the user (at minimum: goal, deliverables, verification, contract checks)
- Present three options: "Approve contract / Modify / Re-propose"
  - Approve: proceed to evaluator contract review (current step 7)
  - Modify: user describes changes, generator rewrites NN-proposal.md, show again
  - Re-propose: generator writes a fresh proposal for the same feature, show again
- The loop repeats until the user approves
- Only after approval: spawn evaluator for contract review
- The existing evaluator review step (step 7) remains -- the evaluator still does its independent review after the user approves. The user shapes scope; the evaluator validates technical soundness.

**F-039: Update CLAUDE.md with interactive planning documentation**
- Add an "Interactive Review Points" section to CLAUDE.md
- Document both review loops: where they occur in the flow, what options the user has, and the rationale (avoiding plan-mode contamination)
- Keep it concise -- 10-15 lines maximum

## User stories

- As a harness user, I want to review and modify spec.md before the initializer scaffolds from it, so I can shape the plan without leaving the harness flow.
- As a harness user, I want to review and modify a sprint proposal before the evaluator reviews it, so I can adjust scope before it becomes a binding contract.
- As a harness user, I want to iterate on plans without activating "plan mode" from external plugins, so my harness agents write to the correct directories.
- As a new harness user, I want CLAUDE.md to document the review points so I know they exist.

## Execution strategy
- Variant: Variant A (sprinted, single generate-evaluate loop per round)
- Mode: continuous
- Expected sprint count: 1 (all three features edit the same small surface area -- two command markdown files and CLAUDE.md -- and are logically coupled; F-039 documents what F-037 and F-038 create)
- Default target ordering: F-037 -> F-038 -> F-039 (start.md first because it is the entry point; session.md second because it follows the same pattern; CLAUDE.md last because it documents the other two)
- Multi-feature sprint policy: All three features grouped in one sprint. F-037 and F-038 are the same interaction pattern applied to two command files. F-039 documents the changes from F-037 and F-038. Grouping waiver justified by shared pattern, small edit surface, and documentation dependency.
- Simplification policy: If the sprint fails evaluation, fix in a second round rather than splitting features. These are markdown-only changes with no code logic to debug.
- Methodology: agile

## High-level technical design

- **start.md changes**: Insert new steps between current step 4 (planner spawn) and step 5 (initializer spawn). The new steps form a loop: show spec.md content, present options, handle user choice. Renumber subsequent steps. Remove or fold step 7 (execution strategy confirmation) since it is subsumed by the new review.
- **session.md changes**: Insert new steps between current step 6 (generator proposal) and step 7 (evaluator contract review). Same loop pattern: show proposal content, present options, handle user choice. Renumber subsequent steps.
- **CLAUDE.md changes**: Add a new section after "Sprint Artifact Naming Convention" (or similar logical position) titled "Interactive Review Points". Document both loops with a brief rationale.
- **No script changes**: The review loops are conversational -- the orchestrating agent reads the markdown instructions and interacts with the user. No new subcommands or script logic needed.
- **No schema changes**: state.json, features.json, config.json are unchanged. No new sprint phases.

## Non-goals

- Adding review loops to `/harness:run` (continuous mode runs without user interaction by design)
- Adding review loops to the evaluator's contract review output (the evaluator review is a quality gate, not a user-facing proposal)
- Creating new UI or tooling for the review interaction (it is conversational via the agent)
- Changing the planner or generator role files (the roles already support being re-invoked; the command files orchestrate the loop)
- Adding new harness-companion.mjs subcommands
- Modifying state.json schema or sprint phase enum

## Definition of done

1. `plugins/harness/commands/start.md` contains a spec review loop between planner output and initializer spawn with approve/modify/start-over options
2. `plugins/harness/commands/session.md` contains a contract review loop between generator proposal and evaluator review with approve/modify/re-propose options
3. Both review loops clearly specify what content to show the user and what each option does
4. Step numbering in both command files is consistent and correct after insertions
5. CLAUDE.md contains an "Interactive Review Points" section documenting both loops
6. No changes to scripts, schemas, role files, or agent definitions
7. All existing steps in both command files are preserved (renumbered as needed) -- no behavioral regression

## Security Context
- data_sensitivity: none
- external_exposure: none
- auth_model: none
- compliance: none

## Risks

- **Step renumbering errors**: Inserting steps into existing numbered sequences risks off-by-one errors or broken cross-references. Mitigation: carefully audit all step references within each command file after renumbering.
- **Sprint Resume table in session.md**: The resume table maps phases to step numbers. Inserting steps before the implementation phase changes the step numbers. Mitigation: update the resume table to reference the new step numbers.
- **Ambiguous modify semantics**: "Modify" could mean the user edits the file directly or describes changes verbally. Mitigation: the command file should specify that the user describes changes and the planner/generator rewrites -- the user does not edit harness artifacts directly.
