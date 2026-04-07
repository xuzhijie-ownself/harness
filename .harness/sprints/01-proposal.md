# Sprint Proposal

## Metadata
- Role: generator
- Agent: coordinator-inline-1
- Inputs: .harness/spec.md, .harness/features.json, plugins/harness-sdlc-suite (structural reference)
- Status: in_review

## Target feature IDs
- F-001

## Goal
Create the plugin scaffold and index skill for harness-sales-suite. This is the foundation that all 5 domain skills depend on. The index skill provides domain profile routing, pipeline phases, phase routing by deal type, criteria key mapping, and verification methods -- mirroring the exact structure of harness-sdlc-suite/SKILL.md.

## Deliverables

1. `plugins/harness-sales-suite/.claude-plugin/plugin.json` -- Plugin metadata following harness-sdlc-suite pattern
2. `plugins/harness-sales-suite/skills/harness-sales-suite/SKILL.md` -- Index skill with:
   - YAML frontmatter (name, quoted description)
   - Domain Profiles table (5 profiles with criteria, artifact types, stakeholder lens)
   - Domain Skill Routing table (profile -> skill name -> relative path)
   - End-to-end Sales Pipeline diagram (7 phases)
   - Phase Routing table (deal types mapped to phases and security levels)
   - Cross-Domain Composability rules
   - Domain Skills summary table
   - Criteria Key Mapping table
   - Domain Verification Methods table

## Verification

1. File existence: `plugins/harness-sales-suite/.claude-plugin/plugin.json` exists
2. File existence: `plugins/harness-sales-suite/skills/harness-sales-suite/SKILL.md` exists
3. plugin.json parses as valid JSON with required fields (name, version, description, skills)
4. SKILL.md YAML frontmatter parses without errors (name + quoted description)
5. Domain Profiles table has exactly 5 rows (sales, sales_engineering, tender_management, sales_enablement, sales_operations)
6. Domain Skill Routing table has 5 entries with relative paths
7. Criteria Key Mapping table has 5 rows with 4 criteria each
8. Domain Verification Methods table has 5 rows
9. Pipeline diagram has 7 phases
10. Phase Routing table has at least 4 deal type rows

## Acceptance criteria
- Product depth: Index skill contains all required tables, routing, and pipeline -- not just stubs
- Functionality: plugin.json valid, routing paths correct, criteria names match spec.md exactly
- Visual design: Consistent markdown formatting, tables aligned, diagram readable
- Code quality: YAML frontmatter valid, no broken references, follows SDLC suite conventions

## Contract checks

- `PD-01` (required): Domain Profiles table has 5 rows with 4 criteria each matching spec.md
- `PD-02` (required): Pipeline diagram shows all 7 phases with owning skill references
- `FN-01` (required): plugin.json parses as valid JSON with name, version, description, skills fields
- `FN-02` (required): All 5 routing table paths resolve to valid relative paths (../harness-*/SKILL.md)
- `VD-01` (advisory): Tables use consistent column widths and markdown pipe formatting
- `CQ-01` (required): YAML frontmatter name and description fields present and description is quoted

## Risks
- Criteria names must exactly match what domain skills will use later -- any mismatch forces rework in F-007
- Pipeline diagram phases must map cleanly to domain skill responsibilities
