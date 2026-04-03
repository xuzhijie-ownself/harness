# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/spec.md, .harness/features.json, 01-evaluation.json, core SKILL.md
- Status: in_review

## Target feature IDs
- F-003

## Goal
Make the core SKILL.md domain-blind by removing all named references to specific domain skills while preserving all orchestration logic, the profile system definition, the custom profile example, and the authenticity gate.

## Deliverables

Modified `plugins/harness/skills/harness/SKILL.md` with these removals:
1. **Domain Profiles table** (lines ~284-294): Remove the full table with rows for software, architecture, tender, research, content, business_analysis, solution_architecture, ops, custom
2. **Cross-Domain Composability** paragraph (lines ~296-297)
3. **Business Analysis Foundation** paragraph (lines ~298-300)
4. **Domain Skill References** section (lines ~306-347): Remove all 5 "When domain_profile is X..." blocks
5. **Domain Skill Routing** block under Workflow Entry (lines ~60-66): Remove the routing table mapping domain_profile to specific skills
6. **Runtime Verification Requirement** (lines ~188-194): Rewrite to reference "the active domain skill" generically instead of "harness-sdlc" by name

Replacements:
- Domain Profiles table replaced with: "Domain profiles are provided by domain skill suites (e.g., harness-sdlc-suite). See the installed suite's index skill for available profiles and routing."
- Domain Skill Routing replaced with generic delegation note
- Runtime Verification Requirement rewritten generically

Preserved sections (must NOT change):
- Profile system definition ("The harness supports multiple domains through a profile system. Each profile defines 4 primary evaluation criteria...")
- `custom` profile inline example
- Authenticity gate (full section)
- All orchestration logic (dispatch rules, execution loop, stop conditions)
- Quantified evaluation section
- All other sections

## Verification
- `grep -c "harness-sdlc\|harness-ea\|harness-ba\|harness-sa\|harness-ops" SKILL.md` returns 0
- `grep "custom" SKILL.md` still shows custom profile references
- `grep "Authenticity Gate" SKILL.md` still present
- `grep "Execution Loop" SKILL.md` still present
- `grep "Dispatch Rules" SKILL.md` still present
- `grep "domain skill suite" SKILL.md` shows the new generic reference

## Acceptance criteria
- Product depth: Core SKILL.md is truly domain-blind -- zero named domain skill references
- Functionality: All orchestration logic preserved -- dispatch, loop, stop conditions, evaluator rules
- Visual design: Clean markdown with no orphaned references or broken sections
- Code quality: No dangling references, no missing section headers, consistent formatting

## Contract checks
- `PD-01` (required): Zero mentions of harness-sdlc, harness-ea, harness-ba, harness-sa, harness-ops by name
- `FN-01` (required): Profile system definition preserved with "4 criteria" explanation
- `FN-02` (required): Custom profile still documented as inline example
- `FN-03` (required): Authenticity gate section fully preserved
- `FN-04` (required): Execution loop, dispatch rules, stop conditions all preserved
- `FN-05` (required): Runtime Verification Requirement references "the active domain skill" generically
- `VD-01` (required): No orphaned section headers or broken references
- `CQ-01` (required): YAML frontmatter preserved; consistent markdown formatting

## Risks
- Accidentally removing orchestration logic that is adjacent to domain-specific content
- Leaving orphaned references to removed sections
- Breaking markdown structure (unclosed sections, misaligned headers)
