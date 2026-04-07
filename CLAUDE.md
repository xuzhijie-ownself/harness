# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Multi-agent sprint orchestration middleware. Two-plugin architecture: domain-blind core (`plugins/harness/`) + domain skill suite (`plugins/harness-sdlc-suite/`). Based on two Anthropic engineering articles on harness design for long-running agents.

## Key Commands

```bash
# Smoke test baseline
bash .harness/init.sh

# Script automation (all subcommands emit JSON to stdout)
node plugins/harness/scripts/harness-companion.mjs --help
node plugins/harness/scripts/harness-companion.mjs feature-select
node plugins/harness/scripts/harness-companion.mjs state-mutate --set-phase contract
node plugins/harness/scripts/harness-companion.mjs check-stop
node plugins/harness/scripts/harness-companion.mjs validate-artifacts --round 1
node plugins/harness/scripts/harness-companion.mjs finalize-round --round 1
node plugins/harness/scripts/harness-companion.mjs postmortem-data

# Integrity check after refactors
grep -rn "review_mode\|codex_detection\|events\.jsonl\|events\.mjs\|metrics\.mjs\|summary\.md\|decomposition\.md\|init\.md\|NN-contract\b\|NN-evaluation\|builder-report\|contract-review\|not_started\|in_progress\b\|functional\b\|polished\b" plugins/ --include="*.md" --include="*.mjs"
```

## Architecture Rules

- **Core is domain-blind**: `plugins/harness/` has zero references to specific domain skills (no harness-sdlc, harness-ea, etc.)
- **Role files are source of truth**: `plugins/harness/skills/harness/roles/*.md` — agent files in `agents/` are thin YAML wrappers that delegate to role files
- **GAN separation**: Generator cannot self-approve. Evaluator cannot edit product code. Tool access enforced via agent frontmatter `tools:` field
- **Zero npm dependencies** in scripts: Only Node.js built-ins (fs, path, child_process). No package.json needed
- **Atomic writes**: All JSON mutations use writeFileSync to .tmp then renameSync

## Sprint Artifact Naming Convention

```
.harness/sprints/
  NN-proposal.md     # generator writes (sprint scope)
  NN-review.md       # evaluator writes (contract review)
  NN-report.md       # generator writes (implementation report)
  NN-eval.md         # evaluator writes (grade)
  NN-eval.json       # evaluator writes (structured grade)
```

NN is zero-padded round number (01, 02, etc.).

## JSON Field Conventions

- All fields use `snake_case`
- Feature `status`: `"pending"` or `"done"` (only 2 values)
- Feature `maturity`: `"draft"`, `"reviewed"`, `"accepted"` (only 3 values)
- State `mode`: `"continuous"` or `"supervised"` (only 2 values)
- State `current_round`: starts at `0`; coordinator's first `--increment-round` brings it to 1
- Feature `passes`: boolean, only flipped by evaluator evidence in NN-eval.json

## Scripts Architecture

```
plugins/harness/scripts/
  harness-companion.mjs          # entry point (9 subcommands)
  lib/
    state.mjs                    # state.json CRUD + atomic writes
    features.mjs                 # feature selection + dependency resolution
    git.mjs                      # auto-commit with spawnSync args array
    artifacts.mjs                # sprint file validation + cleanup
    progress.mjs                 # progress.md structured append
```

Exit codes: 0 = success, 1 = user error (bad input), 2 = system error (IO failure).

## What Was Removed in v3.0.0

These features were intentionally removed. Do not re-add or reference them:
- `lib/events.mjs`, `events.jsonl`, `log-event`/`read-events` subcommands (unused event system)
- Codex detection in evaluator (Section 0 pre-flight, `review_mode`, `codex_detection`, `use_codex` config field)
- `feature-update`, `verify-round-numbering`, `metrics-summary` subcommands
- `init.md`, `summary.md`, `decomposition.md` root artifacts
- Old artifact names: `NN-contract.md`, `NN-contract-review.md`, `NN-builder-report.md`, `NN-evaluation.md/json`
- Feature status values: `not_started`, `in_progress`, `complete` (replaced by `pending`/`done`)
- Feature maturity values: `functional`, `polished` (replaced by 3-level system)
- `lib/metrics.mjs` (logic inlined into `postmortem-data` subcommand)

## Tri-Runtime Support

Three CLI runtimes share the same source files (skills, roles, references, scripts):

| Runtime | Discovery file | What it loads |
|---------|---------------|--------------|
| Claude Code | `.claude-plugin/marketplace.json` → `plugin.json` | agents, commands, skills, hooks |
| Codex CLI | `.codex-plugin/plugin.json` | skills only |
| Copilot CLI | `.github/copilot-instructions.md` | reads markdown for context |

All three read the same SKILL.md, roles/*.md, and references/*.md. Scripts work via bash on all runtimes.

When adding commands: update `plugin.json` commands array. When adding agents: update `plugin.json` agents array. Manifests must stay in sync with actual files on disk. Releaser handles version sync across Claude/Codex manifests.
