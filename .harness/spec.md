# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, harness-marketplace-refactor.md, plugin.json (core), marketplace.json, codex plugin.json, SKILL.md, install.sh, install.bat, README.md, release.json
- Status: accepted

## Overview

Refactor the harness from a single-plugin monolith into a two-plugin architecture: **harness** (domain-blind core) and **harness-sdlc-suite** (software delivery domain skills). The core plugin retains all orchestration machinery (6 agents, 5 commands, profile system mechanics, authenticity gate, sprint loop) but removes all named references to specific domain skills. The SDLC suite plugin bundles the 5 existing domain skills (harness-sdlc, harness-ea, harness-ba, harness-sa, harness-ops) under a new index skill that serves as the domain registry.

This is a v2.0.0 release -- breaking change to plugin structure. Dual-runtime compatibility (Claude Code marketplace + Codex CLI) must be maintained throughout.

**Current state**: v1.0.0 monorepo at `C:\Users\zhijie\Desktop\ai\harness`. All 5 domain skills live under `plugins/harness/skills/` alongside the core `harness/` skill.

**Target state**: Two plugins under `plugins/`, updated manifests, updated install scripts, updated documentation. Domain skills moved to `plugins/harness-sdlc-suite/skills/`.

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Plugin manifests (JSON), skill files (Markdown), shell scripts (bash/bat), documentation (Markdown)
- Stakeholder lens: Plugin consumers (developers using the harness), plugin maintainers

## Shipped scope

### F-001: Create harness-sdlc-suite plugin structure

Create `plugins/harness-sdlc-suite/.claude-plugin/plugin.json` manifest (skills-only plugin, no agents or commands). Create `plugins/harness-sdlc-suite/skills/` directory tree. Move the 5 domain skills from `plugins/harness/skills/` to `plugins/harness-sdlc-suite/skills/`:
- `harness-sdlc/` (with SKILL.md)
- `harness-ea/` (with SKILL.md)
- `harness-ba/` (with SKILL.md)
- `harness-sa/` (with SKILL.md)
- `harness-ops/` (with SKILL.md)

After this feature, `plugins/harness/skills/` contains only the `harness/` directory (core skill). No domain skill directories remain in the core plugin.

### F-002: Create harness-sdlc-suite index skill

Create `plugins/harness-sdlc-suite/skills/harness-sdlc-suite/SKILL.md` as the domain registry for software delivery. Content is extracted from core SKILL.md and includes:
- YAML frontmatter with skill name and description
- Domain Profiles table (software, architecture, business_analysis, solution_architecture, ops) with criteria, artifact types, and stakeholder lens
- Domain Skill Routing table (domain_profile value to skill name and relative path mapping)
- End-to-End Delivery Pipeline phases diagram (Discovery, BA, EA, SA, Planning, SDLC, Testing, Ops)
- Phase routing table (project type to phases mapping)
- Domain Skills summary table (skill name, domain, profile, what it provides)
- Cross-Domain Composability note
- Business Analysis Foundation note

### F-003: Make core SKILL.md domain-blind

Remove from `plugins/harness/skills/harness/SKILL.md`:
- The full Domain Profiles table (rows: software, architecture, tender, research, content, business_analysis, solution_architecture, ops, custom)
- The Domain Skill Routing section under "Workflow Entry" (the routing block that maps domain_profile to skill names)
- The Domain Skill References section (paragraphs describing when to read harness-sdlc, harness-ea, harness-ba, harness-sa, harness-ops)
- The Delivery Pipeline diagram and phase routing table
- The Domain Skills summary table
- All named references to harness-sdlc, harness-ea, harness-ba, harness-sa, harness-ops

Keep in core SKILL.md:
- Profile SYSTEM definition (how profiles work, what "4 criteria" means, how the evaluator uses them)
- The `domain_profile` field documentation in state.json schema references
- The `custom` profile as the inline example of how profiles work
- Authenticity gate (fully domain-agnostic, no changes needed)
- All orchestration (dispatch rules, execution loop, stop conditions, reliability, etc.)
- Abstract references to "domain skills" as a concept (e.g., "when a domain skill is available, the evaluator reads it") without naming specific ones
- The Runtime Verification Requirement section rewritten to reference "the active domain skill" instead of harness-sdlc by name

**Depends on**: F-001, F-002.

### F-004: Update marketplace manifest

Update `.claude-plugin/marketplace.json` to list two plugins in the `plugins[]` array:
- `harness` (source: `./plugins/harness`, existing entry updated)
- `harness-sdlc-suite` (source: `./plugins/harness-sdlc-suite`, new entry)

Both entries include name, source, description, version (2.0.0), author, and metadata.

**Depends on**: F-001.

### F-005: Update Codex manifest

Update `.codex-plugin/plugin.json`:
- Change `skills` from a single string (`"./plugins/harness/skills/"`) to an array of two paths:
  - `"./plugins/harness/skills/"`
  - `"./plugins/harness-sdlc-suite/skills/"`
- Update version to 2.0.0
- Update description to reflect two-plugin architecture

**Depends on**: F-001.

### F-006: Update install scripts

Modify `install.sh` and `install.bat` to:
- Create target directories for all domain skills under `.claude/skills/` (harness-sdlc-suite/, harness-sdlc/, harness-ea/, harness-ba/, harness-sa/, harness-ops/)
- Copy core skill from `plugins/harness/skills/harness/` (existing behavior)
- Copy domain skills from `plugins/harness-sdlc-suite/skills/` (new behavior)
- Support `--uninstall` for both plugin trees (remove all skill directories)
- Maintain existing hooks merge behavior unchanged
- Maintain existing agents and commands copy behavior unchanged (still from core plugin only)

**Depends on**: F-001.

### F-007: Update README

Update `README.md` to document:
- Two-plugin architecture overview (core + SDLC suite)
- Updated install commands (marketplace installs both plugins)
- Updated architecture diagram showing both plugin directory trees
- Updated Domain Skills table referencing the SDLC suite plugin
- Updated artifact layout showing `plugins/harness-sdlc-suite/`
- Note that core can be used standalone with `custom` profile

**Depends on**: F-001.

## User stories

- As a harness user, I want to install the core harness without any domain skills so that I can use it with custom profiles only.
- As a harness user, I want to install the SDLC suite alongside core so that I get all 5 software delivery domain skills automatically.
- As a plugin maintainer, I want the core SKILL.md to contain zero references to specific domain skills so that adding new skill suites requires no core changes.
- As a Codex CLI user, I want the Codex manifest to discover skills from both plugins so that domain skills load automatically.
- As a local installer, I want install.sh and install.bat to copy from both plugin directories so that all skills are available after local install.

## Execution strategy

- **Variant**: Variant A (Full-Stack Sprinted Harness)
- **Mode**: continuous
- **Expected sprint count**: 4 sprints
  - Sprint 1: F-001 + F-002 (grouped -- F-002 requires the directory structure created by F-001; both are foundational setup with no verification risk from grouping since they create new files without modifying existing ones)
  - Sprint 2: F-003 (standalone -- the most complex feature requiring surgical editing of core SKILL.md; needs dedicated evaluator review to verify no orchestration logic was removed)
  - Sprint 3: F-004 + F-005 + F-006 (grouped -- three small manifest/script updates that all depend on F-001 only, are independent of each other, and each is under 30 lines of changes)
  - Sprint 4: F-007 (standalone -- documentation wrap-up after all structural changes are verified)
- **Default target ordering**: F-001 > F-002 > F-003 > F-004 > F-005 > F-006 > F-007 (dependency-driven: F-003 blocked until F-001 + F-002 pass; F-004/F-005/F-006/F-007 blocked until F-001 passes)
- **Multi-feature sprint policy**: Allowed when features are small, share a dependency, and do not modify the same files. Grouping waiver required in each sprint contract.
- **Simplification policy**: Not justified. The core SKILL.md surgery (F-003) is the riskiest change in this project -- it requires line-by-line verification that no orchestration logic was removed alongside the domain-specific content. Sprint contracts with evaluator review are load-bearing for this class of refactor.
- **Methodology**: agile (default)

## High-level technical design

### Plugin structure (target)

```
plugins/
  harness/                              # Plugin 1: Core (domain-blind)
    .claude-plugin/plugin.json          # agents[], commands[], skills[]
    agents/ (6 YAML stubs)
    commands/ (5 command files)
    hooks/hooks.json
    skills/
      harness/                          # Core skill ONLY
        SKILL.md
        roles/ (6 role files)
        references/ (patterns.md, advanced.md)
        agents/ (openai.yaml)

  harness-sdlc-suite/                   # Plugin 2: SDLC Suite (skills-only)
    .claude-plugin/plugin.json          # skills[] only, no agents/commands
    skills/
      harness-sdlc-suite/              # Index skill (domain registry)
        SKILL.md
      harness-sdlc/SKILL.md            # Software domain
      harness-ea/SKILL.md              # Enterprise Architecture domain
      harness-ba/SKILL.md              # Business Analysis domain
      harness-sa/SKILL.md              # Solution Architecture domain
      harness-ops/SKILL.md             # Deployment & Ops domain
```

### Manifests

- `.claude-plugin/marketplace.json`: two entries in `plugins[]`
- `plugins/harness/.claude-plugin/plugin.json`: unchanged (skills path `./skills/` still resolves to core skill only after domain skills are moved out)
- `plugins/harness-sdlc-suite/.claude-plugin/plugin.json`: new, skills-only plugin manifest
- `.codex-plugin/plugin.json`: `skills` becomes array of two paths

### Install scripts

- `install.sh` / `install.bat`: add a second copy loop for `plugins/harness-sdlc-suite/skills/` targeting `.claude/skills/`
- Uninstall path: remove all skill directories from both plugins

### Content extraction strategy

Sections moving from SKILL.md to index SKILL.md:
1. Domain Profiles table (the `| Profile | Criteria | ... |` table)
2. Cross-Domain Composability paragraph
3. Business Analysis Foundation paragraph
4. Domain Skill References paragraphs (5 "When domain_profile is X..." blocks)
5. Domain Skill Routing block (under Workflow Entry)
6. Delivery Pipeline diagram and phase routing table
7. Domain Skills summary (if present as a separate section)

Core SKILL.md replacements:
- Domain Profiles table replaced with abstract profile system description + `custom` inline example
- Domain Skill Routing replaced with generic: "If a domain skill suite is installed, read its index skill for routing"
- Domain Skill References removed entirely (routing handled by index skill)
- Runtime Verification Requirement rewritten to reference "the active domain skill" generically

## Definition of done

1. `plugins/harness/skills/` contains only the `harness/` directory -- no domain skill directories (harness-sdlc, harness-ea, harness-ba, harness-sa, harness-ops)
2. `plugins/harness-sdlc-suite/skills/` contains 6 directories: harness-sdlc-suite (index), harness-sdlc, harness-ea, harness-ba, harness-sa, harness-ops
3. Core SKILL.md has zero mentions of "harness-sdlc", "harness-ea", "harness-ba", "harness-sa", "harness-ops" by name
4. Core SKILL.md still documents the profile system abstractly (how profiles work, custom profile example, domain_profile field)
5. Index SKILL.md contains the full Domain Profiles table, Domain Skill Routing, and Delivery Pipeline diagram
6. `.claude-plugin/marketplace.json` lists two plugins
7. `.codex-plugin/plugin.json` has dual skill paths as an array
8. `install.sh` and `install.bat` copy skills from both plugin directories
9. `README.md` reflects two-plugin architecture with updated diagrams
10. All 5 domain skill SKILL.md files are byte-identical before and after the move (content unchanged)
11. Version bumped to 2.0.0 in all manifests via releaser after all features pass

## Non-goals

- Creating additional domain suites (e.g., harness-research-suite) -- future work
- Changing any agent or command file behavior -- pure structural refactor
- Modifying any of the 5 domain skill SKILL.md files themselves -- content moves unchanged
- Changing the harness orchestration logic in core SKILL.md (dispatch rules, execution loop, stop conditions, etc.)
- Publishing to a new GitHub repository -- post-release manual step
- Updating `.claude/settings.json` or memory files -- user handles manually
- Adding new domain profiles or changing existing profile criteria
