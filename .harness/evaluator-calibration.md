# Evaluator Calibration

## Metadata
- Role: evaluator
- Agent: evaluator-1
- Inputs: spec.md (domain profile: software), round 1 evaluation
- Status: active

## Criterion: product_depth

### Score 2 (below acceptable)
- SKILL.md exists but content is generic placeholder text, not domain-specific. Methodologies listed without harness mapping. Evaluation criteria exist but anchors are vague or copied from another domain.

### Score 3 (acceptable baseline)
- Domain-specific content is accurate for the target discipline. Methodologies include phase structures and harness mapping. Evaluation criteria have 6-row anchor tables with distinct descriptions. Reference materials cite real standards.

### Score 4 (strong)
- Deep domain knowledge evident. Methodologies include nuanced "when to use" guidance. Evaluation criteria anchors are clearly differentiated across all 6 levels. Sprint contract checklists are actionable and complete. Anti-patterns include score penalties.

### Score 5 (excellent for scope)
- Exhaustive domain coverage comparable to a professional reference. Industry-specific variations documented. Evaluation criteria anchors include concrete examples. Reference materials include both standards and frameworks with usage guidance.

## Criterion: functionality

### Score 2 (below acceptable)
- Some sections present but structural pattern broken. Missing 2+ sections from the 10-section template. Evaluation criteria exist but not all have complete anchor tables.

### Score 3 (acceptable baseline)
- All 10 sections present with correct heading structure. All 4 evaluation criteria have 6-row anchor tables. YAML frontmatter valid. Activation check present.

### Score 4 (strong)
- Full structural compliance with harness-ea pattern. Additional sub-sections where appropriate (e.g., gate checks, completeness checks). Sprint contract checklists have 5+ items each. Repository structure includes completeness check table.

### Score 5 (excellent for scope)
- Perfect structural compliance plus additions that enhance the pattern without breaking it. Every section has evaluator-facing verification guidance. Cross-references between sections are explicit.

## Criterion: visual_design

### Score 2 (below acceptable)
- Tables have syntax errors or missing header separators. Inconsistent heading hierarchy. Poor readability.

### Score 3 (acceptable baseline)
- All tables render correctly. Consistent heading hierarchy. Readable formatting.

### Score 4 (strong)
- Well-formatted tables with consistent column widths. Horizontal rules between sections. Clear visual hierarchy. Notation guides include symbol descriptions.

### Score 5 (excellent for scope)
- Publication-quality formatting. Tables are aligned and scannable. Visual hierarchy guides the reader naturally. No formatting inconsistencies.

## Criterion: code_quality

### Score 2 (below acceptable)
- Orphan references present. YAML frontmatter has errors. Naming conventions inconsistent.

### Score 3 (acceptable baseline)
- No orphan references. Valid YAML. Consistent naming conventions within the file.

### Score 4 (strong)
- No orphan references. Valid YAML. Consistent naming. Section numbering matches template. ID patterns documented (e.g., REQ-xxx, UC-xxx).

### Score 5 (excellent for scope)
- Zero quality issues. Explicit cross-references to parent SKILL.md and sibling skills. All ID patterns defined and consistent. File is self-contained and discoverable.
