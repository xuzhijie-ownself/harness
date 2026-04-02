# Sprint Contract

## Metadata
- Role: generator
- Agent: coordinator-1
- Inputs: .harness/spec.md, .harness/features.json, 01-evaluation.json
- Status: accepted

## Target feature IDs
- F-002

## Goal
Add a "Domain Skill References" subsection to the Domain Profiles section of `plugins/harness/skills/harness/SKILL.md`, directing agents to the `harness-sdlc` domain skill when `domain_profile: software` is active.

## Deliverables
- Modified `plugins/harness/skills/harness/SKILL.md` with new subsection

## Verification
- New subsection exists under Domain Profiles
- References `harness-sdlc/SKILL.md` for software domain projects
- Lists the 6 capabilities the domain skill provides
- No existing content in SKILL.md was corrupted or removed
- Line count of SKILL.md increased (not decreased)

## Acceptance criteria
- Product depth: Reference subsection is complete and informative
- Functionality: Reference correctly points to the SDLC skill file
- Visual design: N/A
- Code quality: Clean Markdown, consistent with existing SKILL.md style

## Contract checks
- `FN-01`: required -- reference subsection exists under Domain Profiles
- `FN-02`: required -- reference points to `skills/harness-sdlc/SKILL.md`
- `CQ-01`: required -- no existing content corrupted or removed

## Risks
- Corrupting existing SKILL.md content during edit
