# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/spec.md, .harness/features.json, retro-R1-R3.md, harness/SKILL.md, plugin.json
- Status: in_review

## Target feature IDs
- F-004
- F-005

## Grouping waiver
F-004 and F-005 are grouped per the spec's execution strategy. Both modify existing files (not creating new ones), both depend on F-001/F-002/F-003 being complete, and both are small integration changes. Grouping reduces risk by ensuring routing and registration are consistent with each other.

## Goal
Update the main SKILL.md routing table to route to all three new domain skills, and verify plugin.json discovers the new skill directories.

## Deliverables

### F-004: SKILL.md Routing Updates
- Add 3 routing entries to Domain Skill Routing section: `business_analysis`, `solution_architecture`, `ops`
- Add 2 rows to Domain Profiles table: `solution_architecture` and `ops` (business_analysis already exists)
- Add 3 reference paragraphs to Domain Skill References section

### F-005: Plugin Registration
- Verify `"./skills/"` glob in plugin.json covers harness-ba, harness-sa, harness-ops
- Add explicit paths only if glob does not cover them
- Do not change version field

## Verification
- SKILL.md routing section includes business_analysis, solution_architecture, ops entries
- Domain Profiles table has rows for all profiles including new ones
- Domain Skill References has paragraphs for harness-ba, harness-sa, harness-ops
- plugin.json skill discovery covers all new directories
- No domain-specific logic added to planner or coordinator sections

## Acceptance criteria
- Product depth: Routing entries correctly describe when each skill activates
- Functionality: All routing entries, table rows, and reference paragraphs present
- Visual design: Table formatting consistent with existing rows
- Code quality: No broken references, JSON valid, no planner/coordinator pollution

## Contract checks
- `PD-01`: (required) Each routing entry has correct domain_profile trigger
- `FN-01`: (required) All 3 routing entries, 2+ table rows, 3 reference paragraphs present
- `VD-01`: (required) Table rows match existing column format
- `CQ-01`: (required) JSON valid, no domain logic in role sections

## Risks
- Accidentally modifying planner/coordinator logic — mitigated by only editing routing and profiles sections
