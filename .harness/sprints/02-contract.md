# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/spec.md, .harness/features.json, 01-evaluation.json, SKILL.md (with Authenticity Gate section), generator.md, evaluator.md, roles/generator.md, roles/evaluator.md
- Status: in_review

## Target feature IDs
- F-003
- F-004
- F-005
- F-006

## Grouping waiver
These 4 features form the dual-side control pair for the Authenticity Gate. F-003 (generator checklist) and F-005 (evaluator gate) are the two sides of the same quality control. F-004 and F-006 are the corresponding role reference updates. Shipping one side without the other creates an asymmetric control surface where the generator is told to prevent issues the evaluator does not check for (or vice versa). The spec execution strategy explicitly allows this grouping.

Dependencies are satisfied within the sprint: F-003 before F-004 (F-004 depends on F-003), F-005 before F-006 (F-006 depends on F-005). F-003 and F-005 both depend on F-001, which passed in round 1.

## Goal
Add dual-side authenticity control to the generator and evaluator agents: a pre-implementation checklist for the generator (prevention) and a post-grading gate for the evaluator (detection), plus corresponding role reference updates.

## Deliverables

### F-003: Generator Pre-Implementation Checklist
- Add "Authenticity Pre-Implementation Checklist" section to `plugins/harness/agents/generator.md`
- 4 checklist items mapping to the 4 dimensions (coherence, intentionality, craft, fitness_for_purpose)
- Integrates with the existing Sprint Round Sequence (between contract acceptance and implementation)
- Generic middleware language only

### F-004: Generator Role Reference Update
- Add "Authenticity" section to `plugins/harness/skills/harness/roles/generator.md`
- Focus-level guidance that references the pre-implementation checklist
- Does not duplicate full checklist details
- Generic middleware language only

### F-005: Evaluator Post-Grading Gate
- Add step "5. Authenticity Gate" to `plugins/harness/agents/evaluator.md` after step "4. Calibration & Comparative Scoring"
- 4 dimension checks with verification methods
- Binary pass/fail semantics
- Authenticity failure overrides domain criteria pass
- Generic middleware language only

### F-006: Evaluator Role Reference Update
- Add "Authenticity Gate" section to `plugins/harness/skills/harness/roles/evaluator.md`
- Focus-level guidance that references the post-grading gate
- Does not duplicate full gate details
- Generic middleware language only

## Verification

### F-003 Verification
- Read generator.md and confirm Authenticity Pre-Implementation Checklist section exists
- Confirm 4 checklist items mapping to 4 dimensions
- Confirm generic middleware language (scan for banned terms)
- Confirm integration with existing sprint round sequence

### F-004 Verification
- Read roles/generator.md and confirm Authenticity section exists
- Confirm it references pre-implementation checklist without duplication
- Confirm generic language

### F-005 Verification
- Read evaluator.md and confirm step 5 Authenticity Gate exists after step 4
- Confirm 4 dimension checks with verification methods
- Confirm binary pass/fail semantics
- Confirm authenticity failure overrides domain criteria pass
- Confirm generic language

### F-006 Verification
- Read roles/evaluator.md and confirm Authenticity Gate section exists
- Confirm it references post-grading gate without duplication
- Confirm generic language

## Acceptance criteria
- Product depth: All 4 agent/role files updated with complete authenticity instructions
- Functionality: Checklist items and gate checks map correctly to the 4 dimensions defined in SKILL.md (F-001)
- Visual design: N/A for Markdown; assess structure and readability consistency
- Code quality: Zero domain-specific terminology; consistent with existing file conventions

## Contract checks
- `PD-01`: (required) Generator pre-implementation checklist has 4 items mapping to 4 dimensions
- `PD-02`: (required) Evaluator post-grading gate has 4 dimension checks with verification methods
- `FN-01`: (required) Generator checklist integrates with Sprint Round Sequence (placed between contract acceptance and implementation)
- `FN-02`: (required) Evaluator gate specifies binary pass/fail and override rule (any fail = round fail regardless of domain scores)
- `FN-03`: (required) Role reference files (generator, evaluator) reference their respective agent file sections
- `VD-01`: (advisory) New sections use heading hierarchy and formatting consistent with existing agent/role files
- `CQ-01`: (required) No domain-specific terminology in any new content

## Risks
- Consistency between generator checklist wording and evaluator gate wording -- must reference the same 4 dimensions with compatible language
- Integration point for evaluator: step numbering must be correct (step 5 after step 4)
- Role references must be concise enough to avoid duplicating agent file content
