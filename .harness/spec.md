# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt (sales suite quality audit), harness-sales-suite plugin.json, harness-sales-suite/SKILL.md (index), harness-sales/SKILL.md (structure check), features.json (prior cycle F-045..F-049 complete)
- Status: accepted

## Overview

Quality audit and remediation of the harness-sales-suite plugin (v2.2.9). The prior build cycle produced all 6 SKILL.md files (1 index + 5 domain skills) but the process was broken -- 55% of sprint artifacts were missing, meaning the domain skills were never properly evaluated against their own criteria anchors. Five harness core fixes (F-045 through F-049) have since landed: hard gate on artifact validation, auto-complete state, handoff cleanup, mode mismatch warning, and sprint grouping respect. This cycle re-runs the sales suite through a proper quality gate with those fixes active.

The work is audit-first: read each domain skill, verify structural completeness against a 6-section checklist, verify criteria anchor quality, verify methodology tables, verify anti-patterns and security guidance, then fix any gaps found. The final sprint runs a Codex adversarial review on the entire suite and remediates blocking/high findings.

## Design direction

Not applicable -- these are domain skill markdown files, not user-facing UI. Quality direction: each SKILL.md should be a self-contained reference that a harness evaluator can use without reading the index skill. Sections should be consistent across all 5 domain skills in structure and depth.

## Shipped scope

- **F-050**: Audit and fix harness-sales/SKILL.md -- verify 6 core sections (methodology table, criteria anchors 1-5 for all 4 criteria, verification methods, contract check templates, anti-patterns, security guidance), fix any gaps
- **F-051**: Audit and fix harness-tm/SKILL.md -- same 6-section checklist applied to tender management
- **F-052**: Audit and fix harness-se/SKILL.md -- same 6-section checklist applied to sales engineering
- **F-053**: Audit and fix harness-sen/SKILL.md -- same 6-section checklist applied to sales enablement
- **F-054**: Audit and fix harness-so/SKILL.md -- same 6-section checklist applied to sales operations
- **F-055**: Integration audit -- index skill routing table matches all 5 domain skills, criteria key mapping is consistent between index and each domain skill, verification methods in index match domain skill detail, no orphaned or missing cross-references
- **F-056**: Codex adversarial review on the entire harness-sales-suite directory -- run review, triage findings into BLOCKING/HIGH/LOW, fix all BLOCKING and HIGH findings

## User stories

- As a harness evaluator, I want each sales domain skill to have complete criteria anchors (scores 1-5 for all 4 criteria) so that I can score sprint deliverables without guessing what each score level means.
- As a harness operator, I want consistent section structure across all 5 domain skills so that switching between profiles does not require learning a new layout.
- As a harness operator, I want anti-patterns documented in each domain skill so that generators avoid common mistakes without trial and error.
- As a harness operator, I want the index skill routing table to be provably consistent with the domain skills it references so that profile switching does not break.
- As a harness operator, I want the suite to survive adversarial review so that downstream users can trust the quality of the domain guidance.

## Execution strategy
- Variant: Variant A
- Mode: continuous
- Expected sprint count: 3
- Default target ordering: F-050, F-051, F-052, F-053, F-054, F-055, F-056
- Multi-feature sprint policy: Features are grouped into sprints as defined below. Grouping waiver rationale is provided per sprint. The generator must still include a grouping waiver in each proposal.
- Simplification policy: If a domain skill audit reveals no gaps, the feature still passes -- the audit itself (with documented evidence of completeness) is the deliverable. Do not invent gaps to fill.
- Methodology: agile

### Sprint plan

**Sprint 1: Core domain skill audits (F-050, F-051, F-052)**
- F-050: Audit harness-sales/SKILL.md against 6-section checklist, fix gaps
- F-051: Audit harness-tm/SKILL.md against 6-section checklist, fix gaps
- F-052: Audit harness-se/SKILL.md against 6-section checklist, fix gaps
- Rationale: Three independent file audits using the same checklist. No cross-dependencies. Grouping avoids 2 unnecessary round-trips while keeping scope reviewable (3 files, same audit pattern).

**Sprint 2: Remaining skills + integration (F-053, F-054, F-055)**
- F-053: Audit harness-sen/SKILL.md against 6-section checklist, fix gaps
- F-054: Audit harness-so/SKILL.md against 6-section checklist, fix gaps
- F-055: Integration audit -- cross-reference consistency between index skill and all 5 domain skills
- Rationale: F-053 and F-054 follow the same audit pattern as Sprint 1. F-055 depends on all 5 domain skills being audited first (F-050..F-054). Grouping F-055 here avoids an extra sprint while ensuring all domain skills are finalized before the integration check runs.

**Sprint 3: Adversarial review (F-056)**
- F-056: Codex adversarial review on entire suite, fix BLOCKING/HIGH findings
- Rationale: Must run after all domain skills and integration are finalized. Single feature sprint -- adversarial review touches the full suite and cannot be parallelized with content changes.

### 6-Section Audit Checklist (used by F-050 through F-054)

Each domain SKILL.md must contain:

1. **Methodology table**: At least 3 methodologies with columns for when-to-use and harness mapping. Methodologies must be domain-appropriate (not generic).
2. **Criteria anchors**: All 4 domain criteria must have explicit score anchors for levels 1 through 5. Each anchor must be concrete and domain-specific (not "good" / "very good" / "excellent"). Anchors must reference artifact types from the domain profile.
3. **Verification methods**: Domain-specific verification procedures that map to the contract check template. Must specify what to check and how (not just "review the document").
4. **Contract check templates**: At least 4 contract checks (one per criterion) with check IDs matching the criterion prefix pattern. Each check must specify required/advisory and verification method.
5. **Anti-patterns**: At least 5 domain-specific anti-patterns with detection guidance and remediation. Must reference real failure modes, not generic warnings.
6. **Security guidance**: Domain-specific security considerations covering data sensitivity, access control, and confidentiality relevant to the domain's artifact types. Must not be generic boilerplate.

## High-level technical design

### Files under audit

| Feature | File | Action |
|---------|------|--------|
| F-050 | `plugins/harness-sales-suite/skills/harness-sales/SKILL.md` | Audit + fix |
| F-051 | `plugins/harness-sales-suite/skills/harness-tm/SKILL.md` | Audit + fix |
| F-052 | `plugins/harness-sales-suite/skills/harness-se/SKILL.md` | Audit + fix |
| F-053 | `plugins/harness-sales-suite/skills/harness-sen/SKILL.md` | Audit + fix |
| F-054 | `plugins/harness-sales-suite/skills/harness-so/SKILL.md` | Audit + fix |
| F-055 | `plugins/harness-sales-suite/skills/harness-sales-suite/SKILL.md` + all 5 above | Cross-reference audit + fix |
| F-056 | `plugins/harness-sales-suite/` (entire directory) | Adversarial review + fix |

### Audit approach

For each domain skill (F-050 through F-054):
1. Read the full SKILL.md
2. Check each of the 6 sections against the checklist
3. Document findings as present/missing/incomplete for each section
4. Fix any gaps in-place -- add missing sections, expand incomplete anchors, fill missing anti-patterns
5. Re-verify the file after fixes

For integration (F-055):
1. Extract criteria keys from each domain skill
2. Compare against index skill criteria key mapping table
3. Extract verification methods from each domain skill
4. Compare against index skill verification methods table
5. Verify routing table paths resolve to actual files
6. Fix any inconsistencies in the index skill or domain skills as needed

For adversarial review (F-056):
1. Run Codex review on the entire plugins/harness-sales-suite directory
2. Triage findings: BLOCKING (factual errors, missing required content, broken references), HIGH (inconsistencies, weak anchors, generic content), LOW (style, formatting, minor wording)
3. Fix all BLOCKING and HIGH findings
4. Document LOW findings as non-blocking issues in evaluation

## Non-goals

- Adding new domain profiles or new domain skills
- Changing the harness core (coordinator, evaluator, generator roles)
- Modifying plugin.json structure or plugin metadata
- Adding automated tests for SKILL.md content
- Changing the sales pipeline phases or deal type routing in the index skill
- Rewriting domain skills from scratch -- this is an audit and fix cycle, not a rebuild

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Markdown domain skill files, plugin configuration
- Stakeholder lens: Harness operators, harness evaluators, domain skill consumers

## Security Context
- data_sensitivity: confidential
- external_exposure: none
- auth_model: none
- compliance: none

## Definition of done

All 7 features pass evaluation:

1. **F-050**: harness-sales/SKILL.md passes all 6 checklist sections -- methodology table with 3+ sales methodologies, criteria anchors 1-5 for all 4 sales criteria, verification methods, contract check templates, 5+ anti-patterns, security guidance
2. **F-051**: harness-tm/SKILL.md passes all 6 checklist sections with tender-management-specific content
3. **F-052**: harness-se/SKILL.md passes all 6 checklist sections with sales-engineering-specific content
4. **F-053**: harness-sen/SKILL.md passes all 6 checklist sections with sales-enablement-specific content
5. **F-054**: harness-so/SKILL.md passes all 6 checklist sections with sales-operations-specific content
6. **F-055**: Index skill routing table, criteria key mapping, and verification methods are provably consistent with all 5 domain skills -- zero orphaned references, zero mismatches
7. **F-056**: Codex adversarial review completed, all BLOCKING and HIGH findings fixed, LOW findings documented
