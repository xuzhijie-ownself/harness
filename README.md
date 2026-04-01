# Harness

Multi-agent sprint orchestration harness for long-running application
development, implementing Anthropic's harness patterns.

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

Copies commands, agents, skill, roles, references, and hooks into `.claude/`.
Available immediately -- no restart needed.

To uninstall:

```bash
bash plugins/long-running-harness/install.sh --uninstall
```

### Codex

`.codex-plugin/plugin.json` is already present -- Codex loads it directly.

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

**Coming in v0.2.0:**

| Agent | Purpose | Reference |
|-------|---------|-----------|
| tester | Runs test plans after generation | `skills/harness/roles/tester.md` |
| reviewer | Code review (auto-detects Codex plugin) | `skills/harness/roles/reviewer.md` |
| releaser | Versioning, changelog, git tags | `skills/harness/roles/releaser.md` |
| architect | Design review for complex projects | `skills/harness/roles/architect.md` |

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

## Artifact Layout

```
.harness/
  features.json        # feature list with pass/fail status
  state.json           # run state, current round, active features
  progress.md          # progress log across sprints
  handoff.md           # context handoff (Variant B)
  NN-contract.md       # sprint contract per round
  NN-evaluation.md     # evaluation report per round
  NN-evaluation.json   # machine-readable evaluation per round
```

---

## Harness Variants

| Variant | When |
|---------|------|
| A: Full-Stack Sprinted | Default -- coordinator loop, continuous compaction OK |
| B: Reset-Based | Context anxiety -- use `/harness:reset` + `.harness/handoff.md` |
| C: Simplified | Sprint decomposition no longer adds lift (evidence required) |

---

## Re-install after updates

Re-run the install script. It merges hooks without duplicating and overwrites
commands, agents, and skill with the latest version.
