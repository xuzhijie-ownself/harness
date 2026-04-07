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

## Design Principles

These principles govern ALL changes to the harness. Apply them without being asked.

1. **Single source of truth**: Every piece of knowledge exists in exactly one place. Role files are the source of truth for agent behavior. Domain skills own domain criteria. No content duplication across files — use references/pointers instead.

2. **Core is domain-blind**: `plugins/harness/` has zero references to specific domain skills (no harness-sdlc, harness-ea, etc.). Domain knowledge belongs in `plugins/harness-sdlc-suite/`.

3. **Security by design**: Security is not a separate activity — it's embedded at every decision point. Each domain skill weaves security into existing criteria, checklists, and anti-patterns. The planner captures security context in spec.md for all project types.

4. **Simplification methodology**: Remove one component at a time and measure whether output quality drops. Prefer fewer files, fewer subcommands, fewer enums. Three similar lines > a premature abstraction. If a feature is never used in practice, remove it.

5. **GAN separation**: Generator cannot self-approve. Evaluator cannot edit product code. Tool access enforced via agent frontmatter `tools:` field.

6. **Zero npm dependencies** in scripts: Only Node.js built-ins (fs, path, child_process). No package.json needed.

7. **Atomic writes**: All JSON mutations use writeFileSync to .tmp then renameSync.

8. **One release per cycle**: Version bumps happen at `/harness:release`, not between sprints. Prefer patch over minor.

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

## Naming Conventions

**All names use `snake_case`** — fields, enums, criteria, file names (except SKILL.md, CLAUDE.md, CHANGELOG.md which follow their platform conventions).

**Enum design rule**: Minimal values. If 2 values suffice, don't use 3. If a value is never checked in code or role files, remove it.

| Field | Values | Notes |
|-------|--------|-------|
| feature `status` | `pending`, `done` | 2 values only |
| feature `maturity` | `draft`, `reviewed`, `accepted` | 3 values only |
| state `mode` | `continuous`, `supervised` | 2 values only |
| state `status` | `active`, `paused`, `complete` | 3 values only |
| state `current_sprint_phase` | `idle`, `contract`, `implementation`, `evaluation` | 4 values only |
| security `data_sensitivity` | `none`, `internal`, `confidential`, `regulated` | 4 values, spec.md |
| security `external_exposure` | `none`, `internal`, `public` | 3 values, spec.md |
| security `auth_model` | `none`, `single_user`, `multi_user`, `multi_tenant` | 4 values, spec.md |
| sprint artifact prefix | `NN-proposal`, `NN-review`, `NN-report`, `NN-eval` | zero-padded round |
| feature `passes` | boolean | only flipped by evaluator evidence |
| state `current_round` | starts at `0` | coordinator increments to 1 |

When adding new enums: use `snake_case`, keep values to the minimum needed, document in this table.

**YAML frontmatter rule**: All `description` fields in agent and command `.md` files MUST be quoted strings (e.g., `description: "text here"`). Unquoted multi-line descriptions cause "nested mappings" parse errors on strict YAML parsers (Copilot CLI, some Windows runtimes).

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
