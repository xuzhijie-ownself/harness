# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/spec.md, .harness/features.json, SKILL.md, patterns.md
- Status: in_review

## Target feature IDs
- F-001
- F-002

## Grouping waiver
F-002's evaluation schema additions directly reference the gate defined in F-001. Splitting them would create an inconsistent intermediate state where the gate is defined in SKILL.md but the evaluation schema cannot capture its results. The spec execution strategy explicitly allows this grouping.

## Goal
Add the Authenticity Gate foundation to the harness: (1) define the gate in SKILL.md with 4 dimensions as binary pass/fail, and (2) extend the evaluation JSON schema and builder report template in patterns.md to capture gate results.

## Deliverables

### F-001: SKILL.md Authenticity Gate Section
- Add a new "Authenticity Gate" section to `plugins/harness/skills/harness/SKILL.md` immediately after the "Quantified Evaluation" section
- Define 4 dimensions: coherence, intentionality, craft, fitness_for_purpose
- Specify binary pass/fail semantics (not scored 0-5)
- Specify ordering: gate runs AFTER domain criteria scoring
- Specify failure rule: any dimension fail = round fail regardless of domain scores
- Note that coherence is distinct from domain-specific criteria named "coherence" (e.g., architecture profile)
- Use generic middleware language only -- no domain-specific terms

### F-002: Evaluation Schema and Builder Report Template Updates
- Add `authenticity_gate` object to the `NN-evaluation.json` schema in `plugins/harness/skills/harness/references/patterns.md`
- Each dimension has: `pass` (boolean) and `justification` (string)
- Add `gate_result` field (pass/fail) to the authenticity_gate object
- Add authenticity self-check section to the `NN-builder-report.md` template in patterns.md
- Use generic middleware language only

## Verification

### F-001 Verification
- Read SKILL.md and confirm the Authenticity Gate section exists after "Quantified Evaluation"
- Confirm all 4 dimensions are defined with generic definitions
- Confirm binary pass/fail semantics are stated
- Confirm ordering (after domain criteria) is stated
- Confirm failure rule (any fail = round fail) is stated
- Confirm no domain-specific terminology present
- Confirm coherence disambiguation note is present

### F-002 Verification
- Read patterns.md and confirm authenticity_gate object exists in NN-evaluation.json schema
- Confirm JSON schema is syntactically valid
- Confirm builder report template has authenticity self-check section
- Confirm generic language throughout

## Acceptance criteria
- Product depth: Gate section is self-contained and complete -- all 4 dimensions fully defined
- Functionality: Schema additions are valid JSON and integrate with existing schema structure
- Visual design: N/A for Markdown documentation changes; assess structure and readability
- Code quality: Consistent with existing SKILL.md and patterns.md style and conventions

## Contract checks
- `PD-01`: (required) All 4 authenticity dimensions are defined with generic definitions in SKILL.md
- `PD-02`: (required) Binary pass/fail semantics, ordering, and failure rule are specified in SKILL.md
- `FN-01`: (required) authenticity_gate object added to NN-evaluation.json schema with 4 dimensions (pass + justification each)
- `FN-02`: (required) Authenticity self-check section added to NN-builder-report.md template
- `VD-01`: (advisory) Section placement and formatting consistent with existing SKILL.md structure
- `CQ-01`: (required) No domain-specific terminology in new content (no "colors", "typography", "UI", "gradients", "frontend", "ArchiMate", "BRD", etc.)

## Risks
- Terminology leaks: accidentally using domain-specific terms in what should be generic middleware language
- Coherence disambiguation: the word "coherence" is used as both an authenticity dimension and a domain criterion name in the architecture profile -- must be clearly disambiguated
