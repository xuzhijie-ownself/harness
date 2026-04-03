---
name: harness-sa
description: Solution Architecture domain skill for the harness plugin. Provides SA methodology selection (C4 Model, Arc42, 4+1 View, Domain-Driven Design, Microservices Patterns), development methodology (API-First, Component-First, Data-First, Event-First, Contract-First), verification strategy, deliverable verification, evaluation criteria (design_coherence, technical_depth, integration_clarity, implementability), and sprint contract checklist templates. Activated when domain_profile is "solution_architecture".
---

# Solution Architecture Domain Skill

> **Domain-specific.** This skill provides the HOW for solution architecture projects. The harness provides the WHEN (orchestration, sprint contracts, feature ledger). This skill provides the HOW (framework selection, development methodology, deliverable verification, evaluation criteria anchors, and solution design patterns).

Activated when `domain_profile: solution_architecture` is declared in `.harness/spec.md`.

## Scope of This Skill

This skill covers the Solution Architecture lifecycle for a single solution:
- **Context**: Business drivers, constraints, stakeholders, quality attributes
- **Design**: Component decomposition, API contracts, data models, integration patterns
- **Validation**: Design reviews, proof of concept, capacity modeling, failure mode analysis
- **Communication**: Architecture diagrams, decision records, technical specifications

This skill is distinct from `harness-ea` (Enterprise Architecture). EA covers enterprise-wide capability mapping, portfolio management, and governance frameworks (TOGAF, Zachman). SA focuses on a single solution's technical design — how components fit together, how APIs are defined, how data flows, and how the solution meets non-functional requirements.

It is framework-agnostic at its core — any of the supported approaches can be selected. The C4 Model is the default because it provides progressive detail levels (Context, Container, Component, Code) that map naturally to harness sprints.


## Activation Check

This skill activates when `domain_profile: solution_architecture` is set in `.harness/spec.md` or `.harness/state.json`.

Before using this skill's procedures:
1. Verify the project produces solution design deliverables (HLDs, LLDs, API specs, data models — not enterprise-wide capability maps)
2. Read spec.md -> identify the selected SA framework (C4, Arc42, 4+1, etc.)
3. If no framework specified -> default to C4 Model
4. Check if `solution-architecture/` directory exists -> if yes, verify against the Repository Structure (Section 9)
5. Identify the architecture style -> select appropriate patterns from Section 7

---

## Section 1: SA Methodology

Select based on project characteristics during `/harness:init`:

| Framework | When to Use | Phase Structure | Harness Mapping |
|-----------|-------------|-----------------|-----------------|
| C4 Model | Most solution designs, progressive detail | Context, Container, Component, Code | 1 sprint = 1 C4 level |
| Arc42 | Documentation-heavy, European standard | 12 sections (constraints, context, building blocks, runtime, deployment, etc.) | 1 sprint = 2-3 Arc42 sections |
| 4+1 View | Complex systems, multiple stakeholder perspectives | Logical, Development, Process, Physical + Scenarios | 1 sprint = 1 view |
| Domain-Driven Design | Complex business domains, bounded contexts | Strategic design (contexts, maps) -> Tactical design (aggregates, entities, services) | 1 sprint = 1 bounded context |
| Microservices Patterns | Distributed systems, cloud-native | Decomposition, Communication, Data, Deployment, Observability | 1 sprint = 1 pattern category |

**Default:** C4 Model (if not specified by user).

The planner writes the selected framework into `spec.md` during initialization. The coordinator uses the mapping to structure sprint boundaries accordingly.

---

## Section 2: Solution Architecture Development Methodology

Select based on project type and stakeholder needs:

| Methodology | When to Use | How It Drives the Generator |
|-------------|-------------|----------------------------|
| API-First | Integration-heavy, multi-team | Generator defines API contracts FIRST (OpenAPI/AsyncAPI specs), then designs components around them |
| Component-First | Monolith decomposition, modularization | Generator identifies components and boundaries FIRST, then defines interfaces between them |
| Data-First | Data-intensive applications, analytics | Generator designs data models FIRST (conceptual, logical, physical), then builds services around data flows |
| Event-First | Event-driven, real-time, CQRS | Generator defines domain events and event flows FIRST, then designs producers, consumers, and projections |
| Contract-First | Multi-team, external integrations | Generator writes interface contracts FIRST (API specs, message schemas, SLAs), then implements behind contracts |

**Default:** API-First for all SA projects (if not specified).

### How Methodology Drives the Harness

The chosen methodology affects every phase:

1. **Generator behavior**: What to produce first (API specs? component diagrams? data models?)
2. **Evaluator criteria**: What to prioritize (API consistency? component cohesion? data integrity?)
3. **Sprint contract**: What acceptance criteria to define (API completeness? component boundaries? data model correctness?)
4. **Artifact types**: What deliverables per sprint (OpenAPI specs? C4 diagrams? ERDs?)

### Generator First-Action Table

| Methodology | Generator produces first | Then |
|-------------|------------------------|------|
| API-First | OpenAPI/AsyncAPI specifications with request/response schemas | Component design implementing the API contracts, data models supporting the APIs |
| Component-First | Component diagram with responsibilities and boundaries | Interface definitions between components, deployment mapping |
| Data-First | Conceptual and logical data models with entity relationships | Services that own data entities, API contracts for data access |
| Event-First | Domain event catalog with schemas and flow diagrams | Event producers, consumers, projections, and saga orchestration |
| Contract-First | Interface contracts (API specs, message schemas, SLAs) | Implementation design behind each contract, testing strategy |

---

## Section 3: Verification Strategy (SA Equivalent of Testing)

| Verification Type | SA Equivalent | Method |
|-------------------|--------------|--------|
| Unit test | Component design review | Each component has clear responsibility, defined interfaces, and no circular dependencies |
| Integration test | Interface consistency | API contracts between components are compatible (request/response schemas match, error codes consistent) |
| E2E test | Scenario walkthrough | User scenario traces through all components from entry point to data store without gaps |
| Smoke test | Deliverable completeness | Required design documents exist and are non-empty |
| Regression | Pattern compliance | Architecture patterns consistently applied (e.g., all services use the same auth pattern, all APIs follow the same versioning scheme) |

### Design Completeness Checks

- Does the system context diagram show all external systems and actors?
- Are all components defined with clear responsibilities?
- Does each API endpoint have a complete specification (request, response, errors, auth)?
- Are all data entities defined with relationships and ownership?
- Do non-functional requirements have measurable targets and design strategies?
- Are all integration points documented with protocols and data formats?
- Do architecture decision records exist for significant choices?

---

## Section 4: Deliverable Verification (Equivalent of Build/Runtime)

Since SA produces design documents, not running software, "build verification" means:

| Check | What to Verify | How |
|-------|---------------|-----|
| Document structure | Required sections present per framework | Check against C4/Arc42/4+1 section requirements |
| API specification | OpenAPI/AsyncAPI specs are valid | Lint specs with spectral or swagger-cli |
| Data model consistency | Entities referenced in APIs exist in data model | Cross-reference API schemas with data dictionary |
| Component boundaries | No circular dependencies between components | Trace dependency graph for cycles |
| NFR coverage | Each NFR has a design strategy | Cross-reference NFR list with architecture decisions |
| Integration completeness | All external systems have documented integration patterns | Cross-reference context diagram with integration specs |
| Decision records | All significant decisions documented | Verify ADR exists for each technology choice and pattern selection |

### C4 Level Gate Checks

| C4 Level | Required Deliverables |
|----------|----------------------|
| Context | System context diagram, actors list, external systems list, system purpose |
| Container | Container diagram, technology choices, container responsibilities, communication protocols |
| Component | Component diagram per container, component responsibilities, interface definitions |
| Code (optional) | Class/module diagrams for complex components, key algorithms documented |

### Arc42 Section Gate Checks

| Section | Required Content |
|---------|-----------------|
| 1. Requirements | Quality goals, stakeholders, top 3-5 requirements |
| 2. Constraints | Technical, organizational, and regulatory constraints |
| 3. Context | System context with external interfaces |
| 4. Solution Strategy | Key design decisions and technology choices |
| 5. Building Blocks | Level 1-3 decomposition with responsibilities |
| 6. Runtime | Key scenarios as sequence or activity diagrams |
| 7. Deployment | Infrastructure topology, node mapping |
| 8. Crosscutting | Security, logging, error handling, configuration |
| 9. Decisions | Architecture decision records |
| 10. Quality | Quality tree, quality scenarios |
| 11. Risks | Technical risks and debt |
| 12. Glossary | Domain terms and definitions |

---

## Section 5: Evaluation Criteria (Solution Architecture Profile)

The 4 primary criteria for the `solution_architecture` domain profile. The evaluator MUST use these anchors for consistent scoring across sprints.

### design_coherence (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent — no logical structure, components undefined |
| 1 | Severely incomplete — components listed but no clear boundaries or responsibilities |
| 2 | Below acceptable — components defined but inconsistent patterns, unclear boundaries, some circular dependencies |
| 3 | Acceptable — components have clear responsibilities, consistent decomposition pattern, no circular dependencies |
| 4 | Strong — well-defined component boundaries with explicit interfaces, consistent patterns throughout, separation of concerns evident |
| 5 | Excellent — elegant decomposition with clear rationale, every component justified, patterns applied consistently, design principles documented and followed |

### technical_depth (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent — no technical design decisions documented |
| 1 | Severely incomplete — technology choices listed but no rationale, no edge cases considered |
| 2 | Below acceptable — some design decisions documented but major gaps (e.g., no error handling strategy, no scalability consideration) |
| 3 | Acceptable — key design decisions documented with rationale, error handling and scalability addressed at high level |
| 4 | Strong — comprehensive design with edge cases addressed, capacity estimates provided, failure modes analyzed, technology choices justified with trade-offs |
| 5 | Excellent — production-grade design depth with quantified capacity models, detailed failure mode analysis, performance budgets, security threat model, and proven pattern references |

### integration_clarity (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent — no integration points documented |
| 1 | Severely incomplete — external systems mentioned but no interface specifications |
| 2 | Below acceptable — integration points identified but protocols, data formats, or error handling undefined |
| 3 | Acceptable — all integration points documented with protocols, data formats, and basic error handling |
| 4 | Strong — complete API specifications (OpenAPI/AsyncAPI), data flow diagrams, retry/circuit-breaker patterns, SLAs defined |
| 5 | Excellent — integration contracts validated with consumer teams, contract testing strategy defined, versioning policy documented, monitoring and alerting for integrations specified |

### implementability (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent — design cannot be built with available technology or resources |
| 1 | Severely incomplete — design is theoretically possible but no implementation path, missing critical details |
| 2 | Below acceptable — design is buildable but significant unknowns, no resource estimate, no phasing plan |
| 3 | Acceptable — design is buildable with identified technology, risks documented, implementation phases suggested |
| 4 | Strong — detailed implementation plan with technology validated, team skill gaps identified, phased delivery roadmap, risk mitigations in place |
| 5 | Excellent — design validated through proof of concept, team has demonstrated capability, dependencies secured, deployment strategy proven |

---

## Section 6: Sprint Contract Checklist Templates

Pre-built checklists for 5 SA phases. The generator includes the relevant checklist(s) in each sprint contract. The evaluator uses them as acceptance criteria.

### For Context & Constraints

- [ ] System purpose and scope clearly defined
- [ ] All external actors and systems identified in context diagram
- [ ] Quality attribute requirements listed with measurable targets (response time, availability, throughput)
- [ ] Technical constraints documented (platform, language, regulatory, organizational)
- [ ] Key assumptions and dependencies identified

### For Component Design

- [ ] All components identified with clear single responsibility
- [ ] Component interfaces defined (methods/endpoints, parameters, return types)
- [ ] Component dependencies mapped with no circular references
- [ ] Data ownership assigned to specific components
- [ ] Cross-cutting concerns addressed (auth, logging, error handling, configuration)

### For API Design

- [ ] All API endpoints specified with request/response schemas
- [ ] Authentication and authorization model defined per endpoint
- [ ] Error response format standardized with error codes
- [ ] API versioning strategy documented
- [ ] Rate limiting and throttling policies defined

### For Data Design

- [ ] Conceptual data model with entity relationships documented
- [ ] Data ownership per component/service defined
- [ ] Data consistency strategy chosen (strong vs eventual, saga patterns)
- [ ] Data migration strategy for schema changes documented
- [ ] Data retention, archival, and privacy requirements addressed

### For NFR & Capacity

- [ ] Performance budget defined (response times, throughput targets)
- [ ] Scalability strategy documented (horizontal/vertical, auto-scaling triggers)
- [ ] Availability target and redundancy design specified
- [ ] Security architecture documented (authentication, authorization, encryption, network segmentation)
- [ ] Disaster recovery and business continuity strategy outlined

---

## Section 7: Reference Materials

### Architecture Patterns

| Pattern | When to Use | Key Concepts |
|---------|-------------|-------------|
| Layered (N-Tier) | Traditional web applications, clear separation of concerns | Presentation, business logic, data access, database layers |
| Microservices | Complex domains, independent deployment, team autonomy | Bounded contexts, service mesh, API gateway, event bus |
| Event-Driven | Real-time processing, loose coupling, CQRS | Event sourcing, publish/subscribe, event store, projections |
| Hexagonal (Ports & Adapters) | Testability, framework independence | Core domain, ports (interfaces), adapters (implementations) |
| CQRS | Read/write asymmetry, complex queries, event sourcing | Command model, query model, event store, projections |
| Serverless | Variable workloads, rapid scaling, pay-per-use | Functions, triggers, managed services, cold start |

### Cloud Reference Architectures

| Provider | Reference | Use Case |
|----------|-----------|----------|
| AWS | Well-Architected Framework | 6 pillars: operational excellence, security, reliability, performance, cost, sustainability |
| Azure | Azure Architecture Center | Reference architectures, design patterns, best practices |
| GCP | Google Cloud Architecture Framework | Design principles, operational excellence, system design |
| CNCF | Cloud Native Trail Map | Containerization, CI/CD, orchestration, observability, service mesh |

### Integration Patterns

| Pattern | When to Use | Key Concepts |
|---------|-------------|-------------|
| API Gateway | Multiple clients, cross-cutting concerns | Routing, auth, rate limiting, transformation |
| Message Queue | Async processing, load leveling | Producer, consumer, dead letter queue, retry |
| Event Bus | Multi-subscriber, loose coupling | Topics, subscriptions, event schema registry |
| Service Mesh | Service-to-service communication | Sidecar proxy, mTLS, circuit breaker, observability |
| BFF (Backend for Frontend) | Multiple client types with different needs | Client-specific aggregation, optimization |

---

## Section 8: Notation Guide

### C4 Diagram Conventions

| Level | Diagram Type | Elements | Detail Level |
|-------|-------------|----------|-------------|
| 1 - Context | System Context | System, Actors, External Systems | Highest level — shows system boundaries |
| 2 - Container | Container | Web App, API, Database, Message Queue | Technology choices visible |
| 3 - Component | Component | Controllers, Services, Repositories | Internal structure of containers |
| 4 - Code | Class/Module | Classes, interfaces, methods | Lowest level — only for complex parts |

### Sequence Diagram Guidelines

| Element | Usage | Convention |
|---------|-------|-----------|
| Participant | System, service, or actor | Name matches component names from C4 |
| Synchronous message | HTTP request, function call | Solid arrow with filled arrowhead |
| Asynchronous message | Event, message queue | Solid arrow with open arrowhead |
| Return message | Response, callback | Dashed arrow |
| Alt/Opt fragment | Conditional logic | Label with condition |
| Loop fragment | Repeated processing | Label with iteration condition |
| Note | Design rationale | Placed near relevant interaction |

### Component Diagram Standards

| Element | Representation | Usage |
|---------|---------------|-------|
| Component | Rectangle with <<component>> stereotype | A cohesive unit with defined interfaces |
| Interface (provided) | Lollipop (circle on stick) | What the component offers |
| Interface (required) | Socket (half-circle) | What the component needs |
| Dependency | Dashed arrow | Component uses another component |
| Package | Folder shape | Grouping of related components |

---

## Section 9: Solution Architecture Repository Structure

The generator should organize SA deliverables following this repository structure:

```
.harness/
  spec.md                              # Architecture Statement of Work
  features.json                        # Architecture deliverable tracker

project-root/
  solution-architecture/
    1-context/
      system-context.md                # C4 Level 1 — system purpose, actors, external systems
      quality-attributes.md            # NFRs with measurable targets
      constraints.md                   # Technical, organizational, regulatory constraints
      assumptions.md                   # Key assumptions and dependencies
    2-design/
      container-diagram.md             # C4 Level 2 — containers, technology choices
      component-design/                # C4 Level 3 — per-container component breakdowns
        service-a-components.md
        service-b-components.md
      cross-cutting-concerns.md        # Auth, logging, error handling, config patterns
    3-api/
      api-overview.md                  # API landscape and conventions
      openapi/                         # OpenAPI specification files
        service-a-api.yaml
        service-b-api.yaml
      async-api/                       # AsyncAPI specification files (if event-driven)
        events.yaml
    4-data/
      conceptual-data-model.md         # Entity relationships and ownership
      data-dictionary.md               # Field-level definitions
      data-flow.md                     # Data movement between components
      consistency-strategy.md          # Consistency, transactions, saga patterns
    5-infrastructure/
      deployment-topology.md           # C4 Deployment diagram — nodes, containers, mapping
      scalability-strategy.md          # Scaling approach, capacity estimates
      security-architecture.md         # Security controls, threat model
      dr-strategy.md                   # Disaster recovery and business continuity
    decisions/
      ADR-001-*.md                     # Architecture Decision Records
      ADR-002-*.md
    diagrams/
      *.mermaid                        # Mermaid source files
      *.puml                           # PlantUML source files
```

### Repository Completeness Check (Evaluator)

The evaluator verifies repository structure completeness per phase:

| After Phase | Required Directories | Required Files (minimum) |
|-------------|---------------------|-------------------------|
| Context | `1-context/` | system-context.md, quality-attributes.md |
| Design | `2-design/` | container-diagram.md, at least 1 component design |
| API | `3-api/` | api-overview.md, at least 1 OpenAPI spec |
| Data | `4-data/` | conceptual-data-model.md, data-dictionary.md |
| Infrastructure | `5-infrastructure/` | deployment-topology.md, security-architecture.md |
| Any | `decisions/` | At least 1 ADR per significant decision |

---

## Section 10: Solution Architecture Anti-Patterns (Evaluator Watch List)

The evaluator should flag these common SA anti-patterns when grading:

| Anti-Pattern | What It Looks Like | Impact | Score Penalty |
|-------------|-------------------|--------|---------------|
| **Diagram-Only Architecture** | Beautiful diagrams with no supporting specifications or decision rationale | design_coherence: -2 | Drop design_coherence to max 2 |
| **Resume-Driven Architecture** | Technology choices made for novelty rather than fitness for purpose | implementability: -2 | Drop implementability to max 2 |
| **Integration by Assumption** | External system interfaces assumed without verification or contract | integration_clarity: -2 | Drop integration_clarity to max 2 |
| **NFR Hand-Waving** | "The system shall be scalable" without measurable targets or design strategy | technical_depth: -1 | Require quantified NFR targets |
| **Distributed Monolith** | Microservice structure with tight coupling, shared databases, synchronous chains | design_coherence: -2 | Flag as fundamental design issue |
| **Missing Failure Modes** | Happy path designed but no error handling, retry, or degradation strategy | technical_depth: -1 | Require failure mode analysis |
| **API Inconsistency** | Different naming conventions, error formats, or auth patterns across APIs | integration_clarity: -1 | Flag as integration risk |
| **Data Ownership Vacuum** | Data entities with no clear owning service or shared mutable state | design_coherence: -1 | Require explicit data ownership |
