# Copilot Instructions for Harness

This project is a multi-agent sprint orchestration middleware. Read these files for full context:

## Core Framework
- `plugins/harness/skills/harness/SKILL.md` -- orchestration spec, dispatch rules, stop conditions
- `plugins/harness/skills/harness/roles/*.md` -- agent role instructions (single source of truth)
- `plugins/harness/skills/harness/references/patterns.md` -- JSON schemas, artifact templates
- `plugins/harness/skills/harness/references/advanced.md` -- variant B/C, decay testing

## Domain Skills (SDLC Suite)
- `plugins/harness-sdlc-suite/skills/harness-sdlc-suite/SKILL.md` -- domain registry and routing
- `plugins/harness-sdlc-suite/skills/harness-sdlc/SKILL.md` -- software development
- `plugins/harness-sdlc-suite/skills/harness-ea/SKILL.md` -- enterprise architecture
- `plugins/harness-sdlc-suite/skills/harness-ba/SKILL.md` -- business analysis
- `plugins/harness-sdlc-suite/skills/harness-sa/SKILL.md` -- solution architecture
- `plugins/harness-sdlc-suite/skills/harness-ops/SKILL.md` -- deployment and ops

## Scripts (runtime-agnostic, works via bash)
```bash
node plugins/harness/scripts/harness-companion.mjs --help
```

## Conventions
- See `CLAUDE.md` for development conventions (applies to all AI agents, not just Claude)
- Sprint artifacts: `NN-proposal.md`, `NN-review.md`, `NN-report.md`, `NN-eval.md`, `NN-eval.json`
- Feature status: `pending` / `done` only
- Feature maturity: `draft` / `reviewed` / `accepted` only
