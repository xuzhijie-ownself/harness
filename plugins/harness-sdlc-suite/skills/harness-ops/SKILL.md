---
name: harness-ops
description: Deployment & Ops domain skill for the harness plugin. Provides ops methodology selection (GitOps, Platform Engineering, SRE, DevOps, Infrastructure-as-Code), development methodology (Pipeline-First, Infrastructure-First, Monitoring-First, Runbook-First, Security-First), verification strategy, deliverable verification, evaluation criteria (operational_readiness, automation_coverage, reliability_design, security_posture), and sprint contract checklist templates. Activated when domain_profile is "ops".
---

# Deployment & Ops Domain Skill

> **Domain-specific.** This skill provides the HOW for deployment and operations projects. The harness provides the WHEN (orchestration, sprint contracts, feature ledger). This skill provides the HOW (methodology selection, development methodology, deliverable verification, evaluation criteria anchors, and ops-specific patterns).

Activated when `domain_profile: ops` is declared in `.harness/spec.md`.

## Scope of This Skill

This skill covers the full Deployment & Operations lifecycle:
- **Build**: CI/CD pipeline design, build automation, artifact management
- **Deploy**: Infrastructure provisioning, deployment strategies, configuration management
- **Operate**: Monitoring, alerting, incident response, runbooks
- **Secure**: Secret management, access control, compliance, vulnerability management
- **Optimize**: Capacity planning, cost optimization, performance tuning, reliability engineering

It is methodology-agnostic at its core — any of the supported approaches can be selected. GitOps is the default because it provides declarative infrastructure management with git as the single source of truth, mapping naturally to harness sprint boundaries.


## Activation Check

This skill activates when `domain_profile: ops` is set in `.harness/spec.md` or `.harness/state.json`.

Before using this skill's procedures:
1. Verify the project produces ops deliverables (runbooks, IaC configs, pipeline definitions, monitoring dashboards — not primarily application code)
2. Read spec.md -> identify the selected ops methodology (GitOps, SRE, Platform Engineering, etc.)
3. If no methodology specified -> default to GitOps
4. Check if `infrastructure/` or `ops/` directory exists -> if yes, verify against the Repository Structure (Section 9)
5. Identify the cloud provider/platform -> select appropriate reference patterns from Section 7

---

## Section 1: Ops Methodology

Select based on project characteristics during `/harness:init`:

| Methodology | When to Use | Phase Structure | Harness Mapping |
|-------------|-------------|-----------------|-----------------|
| GitOps | Kubernetes-native, declarative infrastructure | Define, Commit, Reconcile, Verify | 1 sprint = 1 environment or service stack |
| Platform Engineering | Internal developer platforms, self-service infrastructure | Foundation, Services, Portal, Adoption | 1 sprint = 1 platform capability |
| SRE (Site Reliability Engineering) | High-availability services, error budgets | Define SLOs, Measure SLIs, Error Budgets, Toil Reduction | 1 sprint = 1 SLO domain or toil reduction |
| DevOps | General CI/CD, culture-driven automation | Plan, Code, Build, Test, Release, Deploy, Operate, Monitor | 1 sprint = 1 pipeline stage or ops capability |
| Infrastructure-as-Code | Cloud provisioning, environment management | Design, Code, Test, Apply, Drift-Detect | 1 sprint = 1 infrastructure layer or environment |

**Default:** GitOps (if not specified by user).

The planner writes the selected methodology into `spec.md` during initialization. The coordinator uses the mapping to structure sprint boundaries accordingly.

---

## Section 2: Ops Development Methodology

Select based on project type and operational needs:

| Methodology | When to Use | How It Drives the Generator |
|-------------|-------------|----------------------------|
| Pipeline-First | CI/CD modernization, deployment automation | Generator defines pipeline stages FIRST (build, test, deploy, verify), then provisions infrastructure to support them |
| Infrastructure-First | Greenfield cloud setup, datacenter migration | Generator provisions infrastructure FIRST (networks, compute, storage, databases), then adds deployment pipelines on top |
| Monitoring-First | Observability gaps, incident reduction | Generator defines monitoring and alerting FIRST (metrics, logs, traces, dashboards, alerts), then builds runbooks around failure signals |
| Runbook-First | Operational maturity, incident response | Generator writes runbooks FIRST (procedures, escalation, recovery steps), then automates runbook steps where possible |
| Security-First | Compliance-driven, regulated environments | Generator defines security controls FIRST (IAM, encryption, network policies, audit logging), then builds infrastructure within security boundaries |

**Default:** Pipeline-First for all ops projects (if not specified).

### How Methodology Drives the Harness

The chosen methodology affects every phase:

1. **Generator behavior**: What to produce first (pipelines? infrastructure? monitoring?)
2. **Evaluator criteria**: What to prioritize (deployment reliability? infrastructure coverage? observability?)
3. **Sprint contract**: What acceptance criteria to define (pipeline stages? IaC coverage? alert coverage?)
4. **Artifact types**: What deliverables per sprint (pipeline configs? Terraform modules? Grafana dashboards?)

### Generator First-Action Table

| Methodology | Generator produces first | Then |
|-------------|------------------------|------|
| Pipeline-First | CI/CD pipeline definitions with stages, triggers, and gates | Infrastructure provisioning, deployment configs, environment promotion |
| Infrastructure-First | IaC modules for compute, networking, storage, and databases | CI/CD pipelines deploying to provisioned infrastructure |
| Monitoring-First | Monitoring stack with metrics collection, dashboards, and alert rules | Runbooks for each alert, SLO definitions, incident response procedures |
| Runbook-First | Operational runbooks with step-by-step procedures and escalation paths | Automation scripts replacing manual runbook steps, monitoring to trigger runbooks |
| Security-First | Security architecture with IAM policies, encryption config, network segmentation | Infrastructure and pipelines implementing security controls, audit logging |

---

## Section 3: Verification Strategy (Ops Equivalent of Testing)

| Verification Type | Ops Equivalent | Method |
|-------------------|---------------|--------|
| Unit test | Config validation | Each IaC module validates independently (terraform validate, helm lint, kustomize build) |
| Integration test | Environment smoke test | Provisioned environment responds to health checks, services discover each other |
| E2E test | Deployment dry-run | Full deployment pipeline executes in staging without errors, rollback tested |
| Smoke test | Deliverable completeness | Required configs, runbooks, and dashboards exist and are non-empty |
| Regression | Drift detection | Infrastructure state matches declared config (terraform plan shows no drift) |

### Operational Completeness Checks

- Does the CI/CD pipeline exist with build, test, and deploy stages?
- Are all environments provisioned with IaC (not manual)?
- Does each critical service have a health check endpoint?
- Are monitoring dashboards configured for key metrics (latency, error rate, throughput, saturation)?
- Do alert rules exist with defined severity levels and escalation paths?
- Does each alert have a corresponding runbook?
- Are secrets managed through a dedicated secret manager (not hardcoded)?
- Is there a rollback procedure documented and tested?

---

## Section 4: Deliverable Verification (Equivalent of Build/Runtime)

Since ops produces configurations and procedures, "build verification" means:

| Check | What to Verify | How |
|-------|---------------|-----|
| IaC syntax | Terraform/CloudFormation/Pulumi configs are valid | Run linting tools (terraform validate, cfn-lint, pulumi preview) |
| Pipeline syntax | CI/CD pipeline definitions are valid | Validate with platform tools (GitHub Actions, GitLab CI lint, Jenkins pipeline linter) |
| Secret scanning | No secrets in committed files | Run tools like gitleaks, truffleHog, or detect-secrets |
| Config drift | Deployed infrastructure matches IaC declarations | terraform plan, kubectl diff, or equivalent drift detection |
| Runbook completeness | Each runbook has required sections | Check for: trigger, impact, steps, escalation, rollback, verification |
| Dashboard validity | Monitoring dashboards query valid metrics | Validate Grafana/Datadog JSON, check metric names against actual emissions |
| Security compliance | Configs follow security baseline | Run checkov, tfsec, or cloud-specific security scanners |

### Pipeline Stage Gate Checks

| Stage | Required Checks |
|-------|----------------|
| Build | Source checkout, dependency install, compilation/bundling, artifact creation |
| Test | Unit tests, integration tests, security scan, linting |
| Deploy (staging) | Infrastructure provisioning, application deployment, health check verification |
| Verify (staging) | Smoke tests, integration tests against staging, monitoring confirmation |
| Deploy (production) | Blue/green or canary deployment, traffic shifting, health check verification |
| Post-deploy | Monitoring verification, alert testing, rollback readiness confirmation |

---

## Section 5: Evaluation Criteria (Ops Profile)

The 4 primary criteria for the `ops` domain profile. The evaluator MUST use these anchors for consistent scoring across sprints.

### operational_readiness (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent — no runbooks, no monitoring, no documented procedures |
| 1 | Severely incomplete — some monitoring exists but no runbooks, no incident response process |
| 2 | Below acceptable — runbooks exist but incomplete, monitoring gaps for critical services, no escalation paths |
| 3 | Acceptable — runbooks cover critical scenarios, monitoring dashboards for key metrics, alert rules with severity levels, escalation paths defined |
| 4 | Strong — comprehensive runbooks with automated steps, SLO-based monitoring, on-call rotation defined, post-incident review process in place |
| 5 | Excellent — fully automated incident detection and response, game days conducted, chaos engineering validated, mean-time-to-recovery measured and optimized |

### automation_coverage (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent — all operations are manual |
| 1 | Severely incomplete — some scripts exist but no pipeline, manual deployments are the norm |
| 2 | Below acceptable — CI pipeline exists but CD is manual, infrastructure provisioned manually |
| 3 | Acceptable — CI/CD pipeline automates build-test-deploy, infrastructure provisioned via IaC, environments are repeatable |
| 4 | Strong — fully automated pipeline with staging and production, IaC covers all infrastructure, automated rollback, environment promotion automated |
| 5 | Excellent — zero-touch deployments, self-healing infrastructure, automated capacity scaling, GitOps reconciliation loop, canary analysis automated |

### reliability_design (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent — no redundancy, no backup, no recovery plan |
| 1 | Severely incomplete — single points of failure, no backup strategy, no health checks |
| 2 | Below acceptable — some redundancy but untested, backups exist but restore untested, health checks incomplete |
| 3 | Acceptable — redundancy for critical components, backup and restore tested, health checks on all services, rollback procedure documented |
| 4 | Strong — multi-region or multi-zone redundancy, automated failover, disaster recovery tested, SLOs defined with error budgets, circuit breakers implemented |
| 5 | Excellent — chaos engineering validates resilience, RTO/RPO targets met and measured, graceful degradation designed, zero-downtime deployments proven |

### security_posture (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent — secrets hardcoded, no access control, no encryption |
| 1 | Severely incomplete — some access control but secrets in config files, no encryption at rest |
| 2 | Below acceptable — secrets in vault but rotation not automated, basic IAM but overly permissive, partial encryption |
| 3 | Acceptable — secrets managed in dedicated vault with rotation, IAM follows least-privilege, encryption at rest and in transit, audit logging enabled |
| 4 | Strong — automated secret rotation, network segmentation with zero-trust principles, vulnerability scanning in pipeline, compliance baselines enforced (CIS, SOC2) |
| 5 | Excellent — continuous compliance monitoring, security as code fully integrated, threat modeling documented, penetration testing scheduled, incident response tested |

---

## Section 6: Sprint Contract Checklist Templates

Pre-built checklists for 5 ops phases. The generator includes the relevant checklist(s) in each sprint contract. The evaluator uses them as acceptance criteria.

### For CI/CD Pipeline

- [ ] Pipeline definition exists with build, test, and deploy stages
- [ ] Build stage produces versioned artifacts (container images, packages)
- [ ] Test stage runs unit tests, integration tests, and security scans
- [ ] Deploy stage supports at least staging and production environments
- [ ] Rollback mechanism defined and tested

### For Infrastructure Provisioning

- [ ] All infrastructure defined as code (Terraform, CloudFormation, Pulumi, or equivalent)
- [ ] Environments are reproducible from IaC definitions alone
- [ ] State management configured (remote state, locking)
- [ ] Module structure follows DRY principles (shared modules for common patterns)
- [ ] Cost estimation included (infracost or equivalent)

### For Monitoring & Alerting

- [ ] Metrics collection configured for all critical services (latency, error rate, throughput, saturation)
- [ ] Dashboards created for service health and business metrics
- [ ] Alert rules defined with severity levels (critical, warning, info)
- [ ] Alert routing configured with escalation paths and on-call schedule
- [ ] SLOs defined with measurable SLIs for key user journeys

### For Runbook Development

- [ ] Runbook exists for each critical alert
- [ ] Each runbook includes: trigger condition, impact assessment, diagnostic steps, resolution steps, escalation path, verification steps
- [ ] Runbooks reviewed by on-call engineers
- [ ] Automated remediation implemented for common scenarios
- [ ] Post-incident review template defined

### For Security Hardening

- [ ] Secrets stored in dedicated vault (HashiCorp Vault, AWS Secrets Manager, etc.)
- [ ] IAM policies follow least-privilege principle
- [ ] Network segmentation implemented (VPC, security groups, network policies)
- [ ] Encryption enabled at rest and in transit
- [ ] Vulnerability scanning integrated into CI/CD pipeline

---

## Section 7: Reference Materials

### Ops Frameworks

| Framework | Scope | Key Concepts |
|-----------|-------|-------------|
| DORA Metrics | DevOps performance measurement | Deployment frequency, lead time, change failure rate, MTTR |
| Google SRE Book | Site reliability engineering practices | SLOs, error budgets, toil reduction, incident management |
| AWS Well-Architected (Ops Pillar) | Cloud operational excellence | Organization, preparation, operation, evolution |
| NIST Cybersecurity Framework | Security and compliance | Identify, Protect, Detect, Respond, Recover |
| ITIL 4 | IT service management | Service value chain, practices, guiding principles |

### Common Tools by Category

| Category | Tools | Use Case |
|----------|-------|----------|
| IaC | Terraform, Pulumi, CloudFormation, Ansible | Infrastructure provisioning and configuration |
| CI/CD | GitHub Actions, GitLab CI, Jenkins, ArgoCD | Build, test, and deploy automation |
| Containers | Docker, Kubernetes, Helm, Kustomize | Application packaging and orchestration |
| Monitoring | Prometheus, Grafana, Datadog, New Relic | Metrics, dashboards, and alerting |
| Logging | ELK Stack, Loki, Splunk, CloudWatch Logs | Centralized log aggregation and search |
| Security | HashiCorp Vault, Checkov, Trivy, Falco | Secret management and security scanning |

---

## Section 8: Notation Guide

### Infrastructure Diagram Conventions

| Element | Symbol | Usage |
|---------|--------|-------|
| Cloud Region | Large dashed rectangle | Geographic boundary (us-east-1, eu-west-1) |
| Availability Zone | Dashed rectangle within region | Redundancy boundary |
| VPC/Network | Solid rectangle | Network isolation boundary |
| Subnet | Colored rectangle | Public (green), private (blue), data (orange) |
| Compute Instance | Server icon | VM, container, or serverless function |
| Database | Cylinder | Managed database service |
| Load Balancer | Horizontal bar with arrows | Traffic distribution |
| CDN/Edge | Cloud icon | Content delivery and edge computing |
| Security Group | Shield icon | Network access control |

### Pipeline Flow Notation

| Element | Representation | Usage |
|---------|---------------|-------|
| Stage | Rectangle with stage name | A phase of the pipeline (Build, Test, Deploy) |
| Step | Rounded rectangle within stage | A single action within a stage |
| Gate | Diamond | Approval or quality gate between stages |
| Parallel | Forked arrow | Steps running concurrently |
| Artifact | Document icon | Build output passed between stages |
| Trigger | Circle | Event that starts the pipeline (push, schedule, webhook) |

### Network Topology Standards

| Element | Representation | Usage |
|---------|---------------|-------|
| Internet | Cloud shape | Public internet boundary |
| Firewall/WAF | Brick wall icon | Network security boundary |
| DNS | Globe icon | Domain name resolution |
| Service Mesh | Dotted connections | Service-to-service communication layer |
| Message Queue | Queue icon | Asynchronous communication |

---

## Section 9: Ops Repository Structure

The generator should organize ops deliverables following this repository structure:

```
.harness/
  spec.md                              # Ops Statement of Work
  features.json                        # Ops deliverable tracker

project-root/
  infrastructure/
    1-foundation/
      networking.tf                    # VPC, subnets, security groups
      iam.tf                           # IAM roles, policies, service accounts
      dns.tf                           # DNS zones and records
      secrets.tf                       # Secret manager configuration
    2-compute/
      clusters.tf                      # Kubernetes clusters or compute instances
      autoscaling.tf                   # Auto-scaling configurations
      load-balancers.tf                # Load balancer definitions
    3-data/
      databases.tf                     # Database instances and configurations
      caches.tf                        # Cache layer (Redis, Memcached)
      storage.tf                       # Object storage, file systems
    4-monitoring/
      dashboards/                      # Grafana/Datadog dashboard definitions
      alerts/                          # Alert rule definitions
      slos.md                          # SLO definitions with SLIs
    modules/
      vpc/                             # Reusable VPC module
      eks/                             # Reusable Kubernetes module
      rds/                             # Reusable database module
    environments/
      dev/                             # Dev environment overrides
      staging/                         # Staging environment overrides
      production/                      # Production environment overrides
  pipelines/
    ci.yaml                            # CI pipeline definition
    cd-staging.yaml                    # CD pipeline for staging
    cd-production.yaml                 # CD pipeline for production
  runbooks/
    incident-response.md               # General incident response procedure
    service-a-outage.md                # Service-specific runbook
    database-failover.md               # Database failover procedure
    rollback-procedure.md              # Deployment rollback steps
  security/
    baseline.md                        # Security baseline requirements
    compliance-checklist.md            # Compliance verification checklist
    threat-model.md                    # Threat model documentation
```

### Repository Completeness Check (Evaluator)

The evaluator verifies repository structure completeness per phase:

| After Phase | Required Directories | Required Files (minimum) |
|-------------|---------------------|-------------------------|
| Foundation | `infrastructure/1-foundation/` | networking.tf, iam.tf |
| Compute | `infrastructure/2-compute/` | clusters.tf or equivalent compute definition |
| Pipeline | `pipelines/` | ci.yaml, at least 1 cd pipeline |
| Monitoring | `infrastructure/4-monitoring/` | at least 1 dashboard, at least 1 alert rule, slos.md |
| Runbooks | `runbooks/` | incident-response.md, at least 1 service runbook |
| Security | `security/` | baseline.md, compliance-checklist.md |

---

## Section 10: Ops Anti-Patterns (Evaluator Watch List)

The evaluator should flag these common ops anti-patterns when grading:

| Anti-Pattern | What It Looks Like | Impact | Score Penalty |
|-------------|-------------------|--------|---------------|
| **ClickOps** | Infrastructure provisioned through console clicks, not code | automation_coverage: -2 | Drop automation_coverage to max 2 |
| **Alert Fatigue** | Hundreds of alerts with no severity classification or runbook links | operational_readiness: -2 | Drop operational_readiness to max 2 |
| **Snowflake Servers** | Each environment configured differently, no IaC reproducibility | reliability_design: -2 | Drop reliability_design to max 2 |
| **Secrets in Code** | API keys, passwords, or tokens committed to version control | security_posture: -3 | Drop security_posture to max 1 |
| **Untested Backups** | Backups configured but restore never tested | reliability_design: -1 | Require restore test evidence |
| **Monitoring Gaps** | Only uptime monitored, no latency, error rate, or saturation metrics | operational_readiness: -1 | Require RED/USE metrics |
| **Manual Deployments** | Production deployments require SSH access and manual steps | automation_coverage: -1 | Flag as automation debt |
| **Overprovisioned Infrastructure** | Resources sized for peak with no auto-scaling or right-sizing | reliability_design: -1 | Flag as cost and efficiency risk |
