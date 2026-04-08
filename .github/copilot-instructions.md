# Copilot Instructions for Harness

This project is a multi-agent sprint orchestration middleware. Read these files for full context:

## Core Framework
- `plugins/harness/skills/harness/SKILL.md` -- orchestration spec, dispatch rules, stop conditions
- `plugins/harness/skills/harness/roles/*.md` -- agent role instructions (single source of truth)
- `plugins/harness/skills/harness/references/patterns.md` -- JSON schemas, artifact templates
- `plugins/harness/skills/harness/references/advanced.md` -- variant B/C, decay testing
- `plugins/harness/skills/harness/references/audit.md` -- audit methodology, integrity grep, evaluation criteria

## Domain Skills (SDLC Suite)
- `plugins/harness-sdlc-suite/skills/harness-sdlc-suite/SKILL.md` -- domain registry and routing
- `plugins/harness-sdlc-suite/skills/harness-sdlc/SKILL.md` -- software development
- `plugins/harness-sdlc-suite/skills/harness-ea/SKILL.md` -- enterprise architecture
- `plugins/harness-sdlc-suite/skills/harness-ba/SKILL.md` -- business analysis
- `plugins/harness-sdlc-suite/skills/harness-sa/SKILL.md` -- solution architecture
- `plugins/harness-sdlc-suite/skills/harness-ops/SKILL.md` -- deployment and ops

## Domain Skills (Sales Suite)
- `plugins/harness-sales-suite/skills/harness-sales-suite/SKILL.md` -- sales domain registry and routing
- `plugins/harness-sales-suite/skills/harness-sales/SKILL.md` -- core sales (MEDDPICC, Challenger, SPIN, Sandler, BANT)
- `plugins/harness-sales-suite/skills/harness-se/SKILL.md` -- sales engineering (demos, POCs, technical validation)
- `plugins/harness-sales-suite/skills/harness-tm/SKILL.md` -- tender management (RFP/RFI response, compliance)
- `plugins/harness-sales-suite/skills/harness-sen/SKILL.md` -- sales enablement (playbooks, training, battle cards)
- `plugins/harness-sales-suite/skills/harness-so/SKILL.md` -- sales operations (forecasting, territory, compensation)

## Scripts (runtime-agnostic, works via bash)
```bash
node plugins/harness/scripts/harness-companion.mjs --help
```

## Conventions
- See `CLAUDE.md` for development conventions (applies to all AI agents, not just Claude)
- Sprint artifacts: `NN-proposal.md`, `NN-review.md`, `NN-report.md`, `NN-eval.md`, `NN-eval.json`
- Feature status: `pending` / `done` only
- Feature maturity: `draft` / `reviewed` / `accepted` only
