# Long-Running Harness

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
bash plugins/long-running-harness/install.sh

# Windows CMD
plugins\long-running-harness\install.bat
```

Copies commands, agents, skill, and hooks into `.claude/`. Available immediately.

### Codex

`.codex-plugin/plugin.json` is already present — Codex loads it directly.

---

## Commands

| Command | Purpose |
|---------|---------|
| `/init` | Scaffold harness for a new project (run once) |
| `/session` | Run one supervised sprint round |
| `/run` | Continuous coordinator-driven loop (unattended) |
| `/reset` | Checkpoint + handoff when context fills (Variant B) |

---

## Roles

| Agent | Spawned by | Reference |
|-------|-----------|-----------|
| initializer | `/init` | `skills/long-running-harness/roles/initializer.md` |
| planner | `/init` | `skills/long-running-harness/roles/planner.md` |
| generator | `/session`, coordinator | `skills/long-running-harness/roles/generator.md` |
| evaluator | `/session`, coordinator | `skills/long-running-harness/roles/evaluator.md` |
| coordinator | `/run` | `skills/long-running-harness/roles/coordinator.md` |

---

## Shared Contract

Both Claude Code and Codex share:

| Element | Location |
|---------|----------|
| Role instructions | `skills/long-running-harness/roles/` |
| Artifact schemas + templates | `skills/long-running-harness/references/patterns.md` |
| Harness spec (variants, eval, stop conditions) | `skills/long-running-harness/SKILL.md` |
| Artifact layout | `artifacts/` in project root |

---

## Harness Variants

| Variant | When |
|---------|------|
| A: Full-Stack Sprinted | Default — coordinator loop, continuous compaction OK |
| B: Reset-Based | Context anxiety — use `/reset` + `artifacts/handoff.md` |
| C: Simplified | Sprint decomposition no longer adds lift (evidence required) |

---

## Re-install after updates

Re-run the install script. It merges hooks without duplicating and overwrites
commands, agents, and skill with the latest version.
