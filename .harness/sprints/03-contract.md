# Sprint Contract

## Metadata
- Role: generator
- Agent: coordinator-as-generator
- Inputs: .harness/spec.md, .harness/features.json, roles/coordinator.md, roles/evaluator.md, SKILL.md, patterns.md
- Status: in_review

## Target feature IDs
- F-005
- F-006

## Grouping waiver
F-005 (conditional calibration) and F-006 (retro merge) are grouped because both simplify coordinator enforcement logic. F-005 modifies calibration enforcement in coordinator + evaluator roles. F-006 modifies retrospective logic in coordinator role, SKILL.md, and patterns.md. Both reduce coordinator overhead.

## Goal
Make calibration conditional on expected_sprint_count > 3. Merge retrospectives into progress.md instead of separate files.

## Deliverables

### F-005: Conditional evaluator calibration
- Modify coordinator role file: calibration enforcement conditional on expected_sprint_count > 3
- Modify evaluator role file: calibration section reflects conditional requirement
- Modify SKILL.md: calibration section reflects conditional requirement
- Evaluator still scores with anchors even without persisted calibration file

### F-006: Merge retrospective into progress log
- Remove retro-RX-RY.md template from patterns.md
- Add retrospective section format to progress.md template in patterns.md
- Modify coordinator role file: retro appends to progress.md instead of creating separate files
- Modify SKILL.md: retrospective section references inline progress.md format

## Verification

### F-005 checks
- PD-05 (required): Calibration enforcement in coordinator is conditional on expected_sprint_count > 3
- FN-05 (required): Evaluator calibration section reflects conditional requirement
- CQ-05 (required): SKILL.md calibration section updated accordingly

### F-006 checks
- PD-06 (required): retro-RX-RY.md template removed from patterns.md
- FN-06 (required): progress.md template in patterns.md includes retrospective section
- CQ-06 (required): Coordinator retro logic appends to progress.md

## Acceptance criteria
- Product depth: Calibration is smart (conditional). Retros are inline (fewer files).
- Functionality: No behavioral change for runs with > 3 sprints. Retro content still generated.
- Visual design: Consistent Markdown formatting
- Code quality: Reduced file proliferation; simpler coordinator logic

## Risks
- Must ensure calibration is still available when needed (> 3 sprints)
- Retro content in progress.md must not clutter the main log
