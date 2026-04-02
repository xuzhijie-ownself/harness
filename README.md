# Harness

Multi-agent sprint orchestration harness for long-running application
development, implementing Anthropic's harness patterns. Domain-agnostic —
works for any project type.

**6 agents:** initializer, planner, generator, evaluator, coordinator, releaser.
The evaluator handles testing, code review, and grading in one pass.

**References:**
- https://www.anthropic.com/engineering/harness-design-long-running-apps
- https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents

---

## Install

### Option 1: Claude Code Marketplace (Recommended)

```bash
claude plugin install harness@harness
```

Then reload:
```bash
/reload-plugins
```

### Option 2: Git Clone + Local Install

```bash
# Clone into your project
git clone https://github.com/xuzhijie-ownself/long-running-harness.git plugins/long-running-harness

# Install (Mac / Linux / Git Bash)
bash plugins/long-running-harness/install.sh

# Install (Windows CMD)
plugins\long-running-harness\install.bat
```

### Option 3: Codex CLI

If using [OpenAI Codex CLI](https://github.com/openai/codex), the plugin auto-loads from the `.codex-plugin/plugin.json` manifest:

```bash
# Clone the repo into your project
git clone https://github.com/xuzhijie-ownself/long-running-harness.git plugins/long-running-harness

# Codex detects .codex-plugin/plugin.json automatically
codex  # start codex in the project directory
```

The Codex plugin provides the same skill definitions and role references. Agents and commands are shared between Claude Code and Codex.

### Uninstall

```bash
# Claude Code marketplace
claude plugin uninstall harness

# Local install
bash plugins/long-running-harness/install.sh --uninstall
```

### Update

```bash
# Marketplace
claude plugin update harness

# Local
cd plugins/long-running-harness && git pull && bash install.sh
```

---

## Commands

| Command | Purpose |
|---------|---------|
| `/harness:init` | Scaffold harness for a new project (run once) |
| `/harness:session` | Run one supervised sprint round |
| `/harness:run` | Continuous coordinator-driven loop (unattended) |
| `/harness:reset` | Checkpoint + handoff when context fills (Variant B) |
| `/harness:release` | Version bump, changelog, and git tag |

---

## Roles

| Agent | Spawned by | Reference |
|-------|-----------|-----------|
| initializer | `/harness:init` | `plugins/harness/skills/harness/roles/initializer.md` |
| planner | `/harness:init` | `plugins/harness/skills/harness/roles/planner.md` |
| generator | `/harness:session`, coordinator | `plugins/harness/skills/harness/roles/generator.md` |
| evaluator | `/harness:session`, coordinator | `plugins/harness/skills/harness/roles/evaluator.md` |
| coordinator | `/harness:run` | `plugins/harness/skills/harness/roles/coordinator.md` |
| releaser | `/harness:release`, coordinator | `plugins/harness/skills/harness/roles/releaser.md` |

The harness follows a **GAN-like pattern**: the generator produces artifacts and the evaluator adversarially grades them. The generator cannot self-approve; the evaluator cannot edit product artifacts. This separation prevents the common failure mode where a model is too lenient grading its own work. The loop iterates (generate, evaluate, feedback, regenerate) until the evaluator accepts.

---

## Shared Contract

Both Claude Code and Codex share:

| Element | Location |
|---------|----------|
| Role instructions | `plugins/harness/skills/harness/roles/` |
| Artifact schemas + templates | `plugins/harness/skills/harness/references/patterns.md` |
| Harness spec (variants, eval, stop conditions) | `plugins/harness/skills/harness/SKILL.md` |
| Artifact layout | `.harness/` in project root |

---

## Artifact Layout

```
.harness/
  features.json        # feature list with pass/fail status
  state.json           # run state, current round, active features
  progress.md          # progress log across sprints
  spec.md              # product spec with execution strategy
  init.md              # human-readable setup docs
  init.sh              # dev server startup + smoke test
  handoff.md           # context handoff (Variant B)
  sprints/
    NN-contract.md       # sprint contract per round
    NN-contract-review.md # evaluator contract review
    NN-builder-report.md  # generator implementation report
    NN-evaluation.md     # evaluation (tests + review + grade)
    NN-evaluation.json   # machine-readable evaluation
```

---

## Domain Profiles

The harness supports multiple domains through a profile system. Each profile defines 4 primary evaluation criteria, artifact taxonomy, and stakeholder lens.

| Profile | Criteria | Stakeholder Lens |
|---------|----------|-----------------|
| `software` (default) | product_depth, functionality, visual_design, code_quality | End users, developers |
| `architecture` | coherence, standards_compliance, stakeholder_coverage, feasibility | Enterprise architects, CTO |
| `tender` | requirements_coverage, regulatory_alignment, cost_justification, risk_mitigation | Procurement, legal |
| `research` | rigor, novelty, reproducibility, clarity | Reviewers, peers |
| `content` | clarity, engagement, accuracy, brand_alignment | Audience, editors |
| `business_analysis` | completeness, traceability, stakeholder_alignment, feasibility | Business owners, PMs |
| `custom` | User-defined (4 criteria in spec) | User-defined |

Projects can declare a primary + optional secondary profile for cross-domain work. The `source_requirement` field in features.json links features to original business needs for BA/tender/architecture domains.

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
