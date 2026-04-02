# Sprint Contract

## Metadata
- Role: generator
- Agent: coordinator-1
- Inputs: .harness/spec.md, .harness/features.json, floofy-scribbling-eagle.md plan
- Status: accepted

## Target feature IDs
- F-001

## Goal
Create `plugins/harness/skills/harness-sdlc/SKILL.md` with YAML frontmatter and all 6 sections: Project Management Methodology, Development Methodology, Testing Strategy, Build & Runtime Verification, Evaluation Criteria (Software Profile), and Sprint Contract Checklist Templates.

## Deliverables
- `plugins/harness/skills/harness-sdlc/SKILL.md` (~300-400 lines)

## Verification
- File exists at correct path
- YAML frontmatter is valid with name and description
- All 6 sections present with complete reference tables
- ORM detection table has 7 entries (Prisma, Drizzle, TypeORM, Sequelize, Django, SQLAlchemy, Rails)
- Server detection table has 8 entries
- Framework auto-detection covers JS/TS, Python, Go, Rust, Java
- Evaluation criteria has 4 criteria with 0-5 anchors each
- 4 checklist templates (API, UI, Database, Infrastructure)

## Acceptance criteria
- Product depth: File contains all 6 sections with complete content
- Functionality: All tables and checklists are accurate and complete
- Visual design: N/A (Markdown knowledge file)
- Code quality: Well-structured Markdown, consistent formatting

## Contract checks
- `PD-01`: required -- all 6 sections present with non-trivial content
- `FN-01`: required -- methodology tables map correctly to harness concepts
- `FN-02`: required -- ORM/server detection tables have all specified entries
- `FN-03`: required -- evaluation criteria anchors cover 0-5 for all 4 criteria
- `CQ-01`: required -- valid YAML frontmatter, consistent Markdown structure

## Risks
- None significant -- this is a knowledge-layer artifact with no runtime dependencies
