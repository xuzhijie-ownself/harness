# Harness

A unified plugin for **Claude Code** and **Codex** implementing Anthropic's
long-running agent harness patterns.

**References:**
- https://www.anthropic.com/engineering/harness-design-long-running-apps
- https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents

---

## Install

### Claude Code (local)

```bash
# Mac / Linux / Git Bash
bash plugins/harness/install.sh

# Windows CMD
plugins\harness\install.bat
```

Copies commands, agents, skill, and hooks into `.claude/`. Available immediately.

### Codex

`.codex-plugin/plugin.json` is already present — Codex loads it directly.

---

## Commands

| Command | Purpose |
|---------|---------|
| `/harness:init` | Scaffold harness for a new project (run once) |
| `/harness:session` | Run one supervised sprint round |
| `/harness:run` | Continuous coordinator-driven loop (unattended) |
| `/harness:reset` | Checkpoint + handoff when context fills (Variant B) |

---

## Roles

| Agent | Spawned by | Reference |
|-------|-----------|-----------|
| initializer | `/harness:init` | `skills/harness/roles/initializer.md` |
| planner | `/harness:init` | `skills/harness/roles/planner.md` |
| generator | `/harness:session`, coordinator | `skills/harness/roles/generator.md` |
| evaluator | `/harness:session`, coordinator | `skills/harness/roles/evaluator.md` |
| coordinator | `/harness:run` | `skills/harness/roles/coordinator.md` |

---

## Shared Contract

Both Claude Code and Codex share:

| Element | Location |
|---------|----------|
| Role instructions | `skills/harness/roles/` |
| Artifact schemas + templates | `skills/harness/references/patterns.md` |
| Harness spec (variants, eval, stop conditions) | `skills/harness/SKILL.md` |
| Artifact layout | `.harness/` in project root |

---

## Harness Variants

| Variant | When |
|---------|------|
| A: Full-Stack Sprinted | Default — coordinator loop, continuous compaction OK |
| B: Reset-Based | Context anxiety — use `/harness:reset` + `.harness/handoff.md` |
| C: Simplified | Sprint decomposition no longer adds lift (evidence required) |

---

## Re-install after updates

Re-run the install script. It merges hooks without duplicating and overwrites
commands, agents, and skill with the latest version.
