# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, features.json, install.sh, install.bat, reset.md, session.md, CLAUDE.md
- Status: accepted

## Overview

Tri-runtime refactoring for the harness project (v2.3.0). The harness supports three runtimes -- Claude Code, Codex CLI, and Copilot CLI -- but the install scripts are monolithic (always install everything), command files contain runtime-specific language, and procedural logic is duplicated across session.md and reset.md instead of centralized in a reference file. This spec delivers four features across two sprints: make install selective with state tracking, neutralize runtime-specific terminology, extract shared procedures into a single orchestration reference, and document runtime capabilities in a table.

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Shell scripts, batch scripts, Markdown command files, Markdown reference files
- Stakeholder lens: Harness maintainers, plugin users across all three runtimes

## Shipped scope

### F-061: Selective install with state tracking

Redesign install.sh and install.bat to support suite-level granularity.

- Positional argument: `install.sh [core|sdlc|sales|all]` (default: `all`). Same pattern for install.bat.
- State file: `.harness-installed` in the target project root. Plain text, one line per installed suite name (`core`, `sdlc`, `sales`). Created on first install, updated on subsequent installs.
- Install flow: read `.harness-installed` if it exists, add the requested suite(s), write the updated state, then regenerate `.codex-plugin/plugin.json` and `.github/copilot-instructions.md` from the combined installed-suite state. Only include skills paths for installed suites in the generated manifests.
- Uninstall flow: `install.sh --uninstall [sdlc|sales|all]`. Remove the named suite from `.harness-installed`, regenerate manifests. `core` cannot be uninstalled separately -- attempting `--uninstall core` prints an error and exits non-zero.
- All three path prefixes rewritten correctly in generated manifests: `plugins/harness/`, `plugins/harness-sdlc-suite/`, `plugins/harness-sales-suite/`.
- `all` installs core + sdlc + sales. `core` installs only the core harness.

### F-063: Generic terminology

- reset.md line 22: change "Claude Code session" to "session".
- Audit all files under `plugins/harness/commands/` and `plugins/harness/skills/harness/` for references to a specific runtime where the context is generic. Replace with runtime-neutral phrasing (e.g., "a new Claude Code session" becomes "a new session"). Do NOT change text that is genuinely runtime-specific (e.g., marketplace install instructions in install.sh, the CLAUDE.md file itself, or instructions that only apply to one runtime).

### F-064: Extract reset and session procedures to references/orchestration.md

- Create `plugins/harness/skills/harness/references/orchestration.md` with two sections: `## Session Procedure` and `## Reset Procedure`.
- Move the procedural steps from session.md into `## Session Procedure`: Session Startup, Contract Phase (including interactive review loop), Implementation Phase, Evaluation Phase, Post-flight, Auto-Commit, Artifact Validation, Session End, Handoff Cleanup, Sprint Resume table.
- Move the procedural steps from reset.md into `## Reset Procedure`: Steps 1-8, Phase Resume explanation, Post-flight.
- session.md becomes a thin wrapper (~10-15 lines of content after frontmatter): frontmatter + brief description + "Read `plugins/harness/skills/harness/references/orchestration.md` section 'Session Procedure' and follow it."
- reset.md becomes a thin wrapper (~10-15 lines of content after frontmatter): frontmatter + brief description + preconditions + "Read `plugins/harness/skills/harness/references/orchestration.md` section 'Reset Procedure' and follow it."
- All script calls, interactive review loops, phase resume tables, and handoff cleanup logic move intact. No behavioral change.

### F-066: Runtime capabilities table

- Add a `## Runtime Capabilities` section to CLAUDE.md with a Markdown table.
- Rows: Claude Code, Codex CLI, Copilot CLI.
- Columns: slash commands, agent spawning, hooks (git hooks / pre-post commit), skills/plugin reading, script execution, interactive review (user-in-the-loop during contract phase).
- Use Yes / No / Partial with brief inline notes where a capability is partial or conditional.
- Place the section after the existing "Design Principles" section.

## User stories

- As a user installing the harness into a project that only needs SDLC workflows, I want to run `install.sh sdlc` and get only core + sdlc skills registered, so my Codex/Copilot manifests stay clean.
- As a user removing the sales suite, I want to run `install.sh --uninstall sales` and have manifests regenerated without sales paths, without losing my sdlc install.
- As a harness maintainer, I want command files to use runtime-neutral language so the same instructions read correctly regardless of which runtime executes them.
- As a harness maintainer, I want session.md and reset.md to be thin wrappers pointing to a single orchestration reference, so procedural updates happen in one place.
- As a new user evaluating runtimes, I want a capabilities table in CLAUDE.md so I can quickly see which features are available in each environment.

## Execution strategy

- Variant: Variant A (sprinted)
- Mode: supervised
- Expected sprint count: 2
- Methodology: agile

### Sprint plan

**Sprint 1: F-061 + F-063**
- F-061: Selective install with state tracking (install.sh, install.bat, .harness-installed).
- F-063: Generic terminology audit and fixes across commands/ and skills/.
- Grouping rationale: F-063 touches files that F-061 also modifies (both install scripts reference "Claude Code" in comments and output). Doing them together avoids merge conflicts on the same lines. Both are refactoring tasks with clear verification.

**Sprint 2: F-064 + F-066**
- F-064: Extract orchestration procedures from session.md and reset.md into references/orchestration.md.
- F-066: Runtime capabilities table in CLAUDE.md.
- Grouping rationale: Both are documentation restructuring with zero file overlap. F-064 touches session.md, reset.md, and a new orchestration.md. F-066 touches only CLAUDE.md. Independent changes reduce risk.

### Policies
- Default target ordering: F-061 -> F-063 -> F-064 -> F-066.
- Multi-feature sprint policy: grouping allowed when features share modified files or are both low-risk documentation changes. Grouping waiver required in each sprint proposal.
- Simplification policy: if a feature fails twice, the coordinator may descope optional sub-items (e.g., reduce capabilities table columns) but must not drop a required feature without user approval.

## High-level technical design

### Files changed

| Feature | File | Action |
|---------|------|--------|
| F-061 | `install.sh` | Rewrite with argument parsing, state file, dynamic manifest generation |
| F-061 | `install.bat` | Rewrite with argument parsing, state file, dynamic manifest generation |
| F-063 | `plugins/harness/commands/reset.md` | Terminology fix (line 22 + any others found) |
| F-063 | `plugins/harness/commands/*.md` | Audit and fix runtime-specific terms |
| F-063 | `plugins/harness/skills/harness/**/*.md` | Audit and fix runtime-specific terms |
| F-064 | `plugins/harness/skills/harness/references/orchestration.md` | Create (new file) |
| F-064 | `plugins/harness/commands/session.md` | Slim to thin wrapper |
| F-064 | `plugins/harness/commands/reset.md` | Slim to thin wrapper |
| F-066 | `CLAUDE.md` | Add Runtime Capabilities table section |

### State file format (.harness-installed)

```
core
sdlc
sales
```

Plain text, one suite per line, no comments, no blank lines. Scripts read with `cat`, filter with `grep`, append with `echo >> `.

## Non-goals

- Changing the Claude Code marketplace install flow.
- Adding new runtimes beyond the existing three.
- Modifying harness-companion.mjs or any script logic.
- Changing features.json schema, state.json schema, or patterns.md templates.
- Version bump or release -- version stays at 2.3.0.
- Modifying domain skill suites (harness-sdlc-suite, harness-sales-suite) content.

## Definition of done

All 4 features pass evaluation with scores of 3+ on all criteria:

1. **F-061**: `install.sh core` installs only core skills path in plugin.json. `install.sh sdlc` installs core + sdlc. `install.sh all` installs all three. `.harness-installed` tracks state correctly across multiple invocations. `--uninstall sales` removes sales and regenerates. `--uninstall core` errors. install.bat mirrors all behavior.
2. **F-063**: reset.md line 22 no longer says "Claude Code session". Grep across `plugins/harness/commands/` and `plugins/harness/skills/harness/` for unnecessary runtime-specific terms returns zero hits (excluding genuinely runtime-specific contexts).
3. **F-064**: `orchestration.md` exists with two H2 sections containing all procedural content. session.md is under 20 lines of content. reset.md is under 20 lines of content. Both point to orchestration.md. No behavioral change -- all script calls and review loops preserved in orchestration.md.
4. **F-066**: CLAUDE.md contains a Runtime Capabilities table with 3 rows and 6+ capability columns. Values are accurate per current runtime behavior.

## Security Context
- data_sensitivity: none
- external_exposure: none
- auth_model: none
- compliance: none
