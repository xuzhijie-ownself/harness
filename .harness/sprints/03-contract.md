# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/spec.md, .harness/features.json, 02-evaluation.json, harness-ea/SKILL.md
- Status: in_review

## Target feature IDs
- F-003

## Goal
Create `plugins/harness/skills/harness-ops/SKILL.md` (~350-400 lines) following the 10-section pattern. This is the Deployment & Ops domain skill, activated when `domain_profile: ops` is set.

## Deliverables
- `plugins/harness/skills/harness-ops/SKILL.md` with all 10 sections:
  - YAML frontmatter, Activation Check (domain_profile: ops)
  - Section 1: Ops Methodology (GitOps, Platform Engineering, SRE, DevOps, Infrastructure-as-Code)
  - Section 2: Development Methodology (Pipeline-First, Infrastructure-First, Monitoring-First, Runbook-First, Security-First)
  - Section 3: Verification Strategy
  - Section 4: Deliverable Verification
  - Section 5: Evaluation Criteria — operational_readiness, automation_coverage, reliability_design, security_posture (0-5 each)
  - Section 6: Sprint Contract Checklists (CI/CD Pipeline, Infrastructure Provisioning, Monitoring & Alerting, Runbook Development, Security Hardening)
  - Section 7: Reference Materials
  - Section 8: Notation Guide
  - Section 9: Repository Structure (ops/ or infrastructure/)
  - Section 10: Anti-patterns

## Verification
- File exists at correct path
- YAML frontmatter with `name: harness-ops`
- All 10 sections, all 4 criteria with 6-row anchor tables
- Activation Check references `domain_profile: ops`

## Acceptance criteria
- Product depth: Ops-specific content covering IaC, CI/CD, SRE, runbooks
- Functionality: All 10 sections per harness-ea pattern
- Visual design: Tables render correctly
- Code quality: No orphan references, valid YAML

## Contract checks
- `PD-01`: (required) All 4 criteria have meaningful ops-specific anchor descriptions
- `FN-01`: (required) File follows 10-section structure
- `VD-01`: (required) All tables correct Markdown syntax
- `CQ-01`: (required) YAML frontmatter valid

## Risks
- Breadth of ops domain — mitigated by focusing on the most common patterns
