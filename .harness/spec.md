# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, floofy-scribbling-eagle.md plan, plugins/harness/skills/harness/SKILL.md
- Status: accepted

## Overview

Create a `harness-sdlc` domain skill that provides software development lifecycle knowledge to the harness plugin. The harness framework orchestrates *when* to plan, generate, evaluate, and release -- but it has no knowledge of *how* to execute software development tasks (run migrations, start servers, test endpoints, verify deployments). The SDLC skill fills this gap by encoding domain-specific procedures for methodology selection, development practices, testing strategy, build and runtime verification, and evaluation criteria anchoring.

The skill is activated when a project declares `domain_profile: software` and provides structured guidance to the planner, generator, and evaluator agents during their respective phases.

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Markdown skill files, plugin manifest updates, documentation
- Stakeholder lens: Plugin users (developers using the harness), harness agents (planner/generator/evaluator)

## Design direction

The SDLC skill follows the existing skill file convention established by `plugins/harness/skills/harness/SKILL.md`. It is a single Markdown file that agents read during their respective phases. The content is structured as reference tables and checklists -- not prescriptive code -- so agents can adapt to any tech stack or project shape.

## Shipped scope

### F-001: SDLC Skill File
Create `plugins/harness/skills/harness-sdlc/SKILL.md` containing all six sections from the plan:
1. **Methodology Selection Matrix** -- Agile/Scrum/Waterfall/Kanban/Lean with harness mapping
2. **Development Methodology** -- TDD/BDD/DDD/Clean Architecture/Prototype-First with generator behavior guidance
3. **Testing Strategy** -- test pyramid, test methodology selection per project type, framework auto-detection per language
4. **Build & Runtime Verification** -- build steps, runtime verification (the SingPost gap fix), ORM/database detection tables, server detection tables
5. **Evaluation Criteria Anchors** -- product_depth/functionality/visual_design/code_quality 0-5 scale with concrete anchor descriptions
6. **Sprint Contract Checklist Templates** -- API/UI/Database/Infrastructure checklists for generator contracts

### F-002: Harness Integration
Update `plugins/harness/skills/harness/SKILL.md` to add a reference directing agents to the `harness-sdlc` skill when `domain_profile: software` is active. This is a minimal, non-breaking addition.

### F-003: Plugin Manifest and README
Update `README.md` to document the SDLC domain skill: what it provides, how agents use it, and where it lives in the skill directory structure.

## User stories

- As a harness user building a software project, I want the evaluator to automatically detect my ORM and run migrations before testing, so that runtime verification catches database initialization failures.
- As a harness user, I want the planner to select an appropriate development methodology (TDD, BDD, Prototype-First) based on my project type, so that the generator knows what to write first.
- As a harness user, I want the evaluator to use concrete score anchors for software projects, so that evaluation scores are consistent and meaningful across sprints.
- As a harness user, I want sprint contracts to include domain-appropriate checklists (API, UI, DB, Infra), so that nothing critical is missed during implementation.

## Execution strategy
- Variant: Variant A (Full-Stack Sprinted)
- Mode: continuous
- Expected sprint count: 3 (one feature per sprint, linear dependency chain)
- Default target ordering: F-001 -> F-002 -> F-003 (sequential -- F-002 depends on F-001 existing, F-003 depends on both being complete)
- Multi-feature sprint policy: not allowed -- each feature is independent enough to warrant its own sprint and evaluation cycle
- Simplification policy: not justified -- three sprints is already minimal; simplifying to a single build round would skip the contract review step for integration changes (F-002) that could break the existing SKILL.md

### Sprint rationale
Three sprints is the natural decomposition. F-001 is the bulk of the work (creating the skill file). F-002 is a targeted edit to an existing file that should not be bundled with F-001 to avoid risk of accidentally corrupting the main harness skill. F-003 is documentation that should only be written after the skill and integration are confirmed correct.

## High-level technical design

### Skill file structure
- Location: `plugins/harness/skills/harness-sdlc/SKILL.md`
- Format: Markdown with YAML frontmatter (matching existing skill convention)
- Content: Six sections as defined in the plan, using reference tables and checklists
- Size: Expected ~300-400 lines of structured Markdown

### Integration point
- A short paragraph added to the Domain Profiles section of `plugins/harness/skills/harness/SKILL.md`
- No schema changes, no new JSON fields, no new commands

### Documentation
- README.md update: new section under "Shared Contract" or after "Domain Profiles" describing the SDLC skill

## Non-goals
- Creating domain skills for other profiles (architecture, tender, research, content, business_analysis) -- those are future work
- Modifying the harness execution loop, state.json schema, or features.json schema
- Adding new CLI commands or agent roles
- Changing the plugin.json manifest (the existing `./skills/` glob already covers new skill directories)
- Implementing any executable code -- this is a knowledge-layer skill, not runtime code
- Auto-detection tooling -- the skill documents what to detect and how, but the agents themselves perform the detection

## Definition of done
- `plugins/harness/skills/harness-sdlc/SKILL.md` exists and contains all six sections with complete reference tables
- `plugins/harness/skills/harness/SKILL.md` contains a reference to the harness-sdlc skill for software domain projects
- `README.md` documents the SDLC domain skill
- No existing harness functionality is broken by the changes
