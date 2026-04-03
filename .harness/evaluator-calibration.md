# Evaluator Calibration

## Metadata
- Role: evaluator
- Agent: evaluator-1
- Inputs: spec.md (domain profile: software), round 1 evaluation
- Status: active

## Context
This project adds an Authenticity Gate to the harness framework. All changes are additive Markdown documentation edits to framework files. Criteria are adapted for documentation-quality evaluation since there is no executable code or UI.

## Criterion: product_depth

### Score 2 (below acceptable)
- Gate section exists but is incomplete -- missing dimensions, missing rules, or missing ordering specification

### Score 3 (acceptable baseline)
- All 4 dimensions defined with clear generic definitions. Gate rules specify binary pass/fail, ordering, and failure semantics. Minimal but complete.

### Score 4 (strong)
- Beyond minimal: includes disambiguation notes, dual-side control description, and integration context. Definitions are precise and actionable.

### Score 5 (excellent for scope)
- Complete with examples, edge case guidance, and cross-domain applicability notes. Every clause is unambiguous.

## Criterion: functionality

### Score 2 (below acceptable)
- Schema or template additions exist but are malformed, missing required fields, or inconsistent with existing structure

### Score 3 (acceptable baseline)
- Schema additions are valid JSON with all required fields. Templates have the correct sections. Integrates with existing structure without breaking it.

### Score 4 (strong)
- Programmatically validated JSON. Template sections are actionable with clear prompt text. Clean integration points.

### Score 5 (excellent for scope)
- Includes validation scripts, error examples, and migration notes for existing evaluations.

## Criterion: visual_design (documentation structure/readability)

### Score 2 (below acceptable)
- Formatting inconsistent with existing files. Heading hierarchy broken. Tables malformed.

### Score 3 (acceptable baseline)
- Formatting matches existing file conventions. Heading hierarchy correct. Tables render properly.

### Score 4 (strong)
- Formatting is consistent AND the new sections read naturally in the flow of the existing document. Emphasis, lists, and tables used appropriately.

### Score 5 (excellent for scope)
- Documentation is a model of clarity -- could be used as a style reference for future additions.

## Criterion: code_quality (documentation precision/terminology)

### Score 2 (below acceptable)
- Contains domain-specific terminology leaks or ambiguous language that could be misinterpreted

### Score 3 (acceptable baseline)
- Generic middleware language throughout. No domain-specific terms. Language is clear if not concise.

### Score 4 (strong)
- Zero terminology leaks (automated scan passes). Precise, consistent terminology. No redundancy. Disambiguation where needed.

### Score 5 (excellent for scope)
- Terminology is so precise that it could serve as a glossary reference. Every term is used consistently across all modified files.
