---
name: harness-sen
description: "Sales enablement domain skill for the harness framework. Provides content-first, coaching-first, and certification-based methodologies, content coverage verification, and evaluation criteria for sales enablement programs. Activated when domain_profile is sales_enablement."
---

# Sales Enablement Domain Skill

> **Domain-specific.** This skill provides the HOW for sales enablement and readiness projects. The harness provides the WHEN (orchestration, sprint contracts, feature ledger). This skill provides the HOW (content strategy, coaching methodology, certification programs, adoption measurement, evaluation criteria anchors).

Activated when `domain_profile: sales_enablement` is declared in `.harness/spec.md`.

---

## Section 1: Sales Enablement Methodology

Select based on enablement program type and organizational maturity during `/harness:start`:

| Methodology | When to Use | Harness Mapping |
|-------------|-------------|-----------------|
| Content-First | New product launch, messaging refresh, or competitive positioning update; content gaps identified as primary barrier to seller effectiveness | 1 harness sprint = 1 content development cycle (audit -> gap analysis -> creation -> review -> publish) |
| Coaching-First | Skill development needed; new hire onboarding; methodology adoption (e.g., rolling out MEDDPICC to the team) | 1 harness sprint = 1 coaching program cycle (assessment -> curriculum design -> delivery -> practice -> certification) |
| Certification-Based | Compliance-driven enablement; partner channel certification; measurable proficiency requirements | 1 harness sprint = 1 certification module (learning objectives -> content -> assessment -> scoring -> badge) |
| Just-in-Time (JIT) | Deal-specific enablement; competitive situation response; urgent field request | 1 harness sprint = 1 rapid-response deliverable (request -> triage -> create -> distribute -> measure) |
| Program-Based | Large-scale enablement transformation; annual kickoff preparation; multi-quarter initiative | 1 harness sprint = 1 program milestone (strategy -> design -> pilot -> rollout -> measure -> iterate) |

**Default:** Content-First (if not specified by user).

### Methodology Selection Guide

| Enablement Signal | Recommended Methodology | Reason |
|------------------|------------------------|--------|
| "Reps don't know how to position against competitor X" | Content-First | Competitive battle cards and messaging frameworks are the primary gap |
| "New reps take too long to ramp" | Coaching-First | Structured onboarding curriculum with skill-building milestones |
| "Partners need to be certified to resell" | Certification-Based | Measurable proficiency with formal assessment and credential |
| "We just lost a deal to competitor Y -- what do we do?" | Just-in-Time | Rapid competitive response for active deal support |
| "We're launching a new product line next quarter" | Program-Based | Multi-faceted program covering content, coaching, and certification |
| "Reps aren't using the sales methodology we trained" | Coaching-First + Certification-Based | Reinforcement through coaching with proficiency validation |

---

## Section 2: Development Methodology

Select based on deliverable type and program stage:

| Methodology | When to Use | How It Drives the Generator |
|-------------|-------------|----------------------------|
| Audience-first | Any enablement content where persona alignment is critical | Generator defines target personas and their buyer journey context FIRST, then creates content mapped to each persona's needs |
| Outcome-first | Enablement tied to measurable business outcomes (quota attainment, win rate, ramp time) | Generator defines success metrics FIRST, then designs content and programs to move those metrics |
| Modular design | Reusable content across multiple programs or audiences | Generator creates atomic content modules FIRST, then assembles them into program-specific configurations |
| Feedback-driven | Iterative improvement of existing enablement programs | Generator collects field feedback FIRST, then prioritizes improvements by impact on seller effectiveness |
| Competitive-first | Market-driven enablement where competitive dynamics change frequently | Generator maps competitive landscape FIRST, then creates positioning, objection handling, and differentiation content |

**Default:** Audience-first for new programs, Feedback-driven for existing programs.

### Generator First-Action Table

| Methodology | Generator writes first | Then |
|-------------|----------------------|------|
| Audience-first | Persona definitions + buyer journey map + content need matrix | Content pieces mapped to persona x journey stage intersections |
| Outcome-first | Success metrics + baseline measurements + target improvements | Program design optimized to move each metric |
| Modular design | Content module taxonomy + reuse rules + assembly patterns | Individual modules with metadata tags for automated assembly |
| Feedback-driven | Field feedback summary + impact scoring + prioritized backlog | Updated content addressing highest-impact feedback items |
| Competitive-first | Competitive landscape matrix + positioning framework | Battle cards, objection handling guides, competitive talk tracks |

---

## Section 3: Verification Strategy

### Content Coverage Verification

Default for all sales enablement projects. The evaluator verifies each level is addressed.

| Level | Target Coverage | Scope | When to Verify |
|-------|----------------|-------|----------------|
| Persona coverage | All target personas addressed | Every target persona has content mapped to their role in the buying process | Every sprint targeting content creation |
| Buyer journey coverage | All journey stages addressed | Content exists for awareness, consideration, decision, and post-purchase stages (where applicable) | Every sprint targeting content strategy |
| Competitive coverage | Top competitors addressed | Battle cards, objection handling, and positioning for at least top 3 competitors | Every sprint targeting competitive content |
| Methodology alignment | Content reinforces sales methodology | Playbooks reference the organization's chosen methodology (MEDDPICC, Challenger, etc.) | Every sprint targeting sales playbooks |
| Adoption measurement | Metrics defined and trackable | Content usage, completion rates, and business impact metrics defined and baseline established | Program launch sprint |
| Security / data handling | Sensitive content classified | Competitive intel classified; pricing guidance marked confidential; customer examples anonymized | Every sprint (if spec.md data_sensitivity != none) |

### Enablement Readiness Verification

The evaluator MUST verify program readiness before launch:

| Gate | Required Artifacts | Verification Method |
|------|-------------------|-------------------|
| Pre-launch | Content complete, delivery plan, measurement framework, access configured | Content audit; delivery walkthrough; metrics baseline captured |
| Post-launch (30 days) | Adoption data, initial feedback, adjustment plan | Adoption metrics review; feedback themes; planned improvements |

---

## Section 4: Deliverable Verification

### Primary Deliverables

| Deliverable | Gate Check | Pass Criteria |
|-------------|-----------|---------------|
| Sales Playbook | Persona coverage + methodology alignment + actionable guidance | All target personas addressed; each section ties to methodology steps; includes specific talk tracks, email templates, or call scripts (not just concepts) |
| Battle Card | Competitive accuracy + positioning + objection handling | Competitor strengths and weaknesses current (within 90 days); differentiation claims backed by evidence; "what they say / what we say" format for top objections |
| Training Curriculum | Learning objectives + progressive structure + assessment | Each module has measurable learning objectives; modules build progressively; assessment validates proficiency (not just attendance) |
| Messaging Framework | Persona alignment + consistency + proof points | Messages mapped to each persona; consistent value proposition across all touchpoints; claims supported by customer evidence or data |

### Supporting Deliverables

| Deliverable | Gate Check | Pass Criteria |
|-------------|-----------|---------------|
| Content Inventory / Audit | Completeness + gap identification + freshness | All existing content cataloged; gaps identified by persona x journey matrix; stale content flagged (>6 months without update) |
| Adoption Dashboard | Metrics defined + baseline + targets | Key metrics (content usage, completion rates, deal influence) defined; baseline captured; targets set with timeline |
| Certification Program | Modules + assessment + scoring + credential | Learning path defined; each module has assessment; scoring rubric documented; credential (badge/certificate) designed |

### Governance Deliverables

| Deliverable | Gate Check | Pass Criteria |
|-------------|-----------|---------------|
| Enablement Program Review | Outcomes + adoption + adjustments | Business outcomes measured against targets; adoption rates analyzed; adjustments planned for next iteration |
| Content Maintenance Plan | Ownership + review cadence + retirement criteria | Each content piece has an owner; review schedule defined (quarterly minimum); retirement criteria documented |

---

## Section 5: Evaluation Criteria (Sales Enablement Profile)

The 4 primary criteria for the `sales_enablement` domain profile. The evaluator MUST use these anchors for consistent scoring across sprints.

### content_coverage (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no enablement content exists; sellers have no structured resources |
| 1 | Severely incomplete -- some content exists but covers <50% of personas or journey stages; major gaps in competitive or methodology content |
| 2 | Partial -- most personas have some content but quality varies; competitive content outdated; methodology content generic |
| 3 | Complete -- all target personas have content mapped to their buyer journey stages; competitive content current for top 3 competitors; methodology alignment present in playbooks |
| 4 | Comprehensive -- content covers all personas, journey stages, and competitive scenarios; content modular and reusable; linked to methodology steps with specific guidance |
| 5 | Strategic -- content program feeds seller behavior change; content tied to measurable business outcomes; continuous improvement loop from field feedback to content updates |

### audience_relevance (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- content not targeted to any specific audience; generic marketing materials repurposed as enablement |
| 1 | Severely incomplete -- audience identified but content not tailored; same messaging for all personas regardless of role or buying stage |
| 2 | Partial -- some persona customization but inconsistent; talk tracks generic; examples not relevant to persona's daily challenges |
| 3 | Relevant -- content tailored to each persona's role, challenges, and decision criteria; examples resonate with persona context; language appropriate for audience |
| 4 | Personalized -- content includes persona-specific scenarios, objection handling, and success stories; field reps report content is useful in actual conversations |
| 5 | Transformative -- content changes seller behavior; reps use it proactively (not just when mandated); measurable improvement in conversation quality tied to content adoption |

### adoption_measurability (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no adoption metrics defined; no way to know if anyone uses the content |
| 1 | Severely incomplete -- basic view counts only; no engagement or outcome metrics |
| 2 | Partial -- usage metrics tracked (views, downloads) but no correlation to business outcomes; no completion tracking for training |
| 3 | Measurable -- adoption metrics defined and tracked (usage, completion, certification pass rates); baseline established; targets set |
| 4 | Correlated -- adoption metrics linked to business outcomes (win rate improvement, ramp time reduction, deal size increase); regular reporting to stakeholders |
| 5 | Predictive -- adoption data predicts business outcomes; enablement ROI quantified; data drives content investment decisions and program prioritization |

### maintenance_sustainability (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no maintenance plan; content created and abandoned |
| 1 | Severely incomplete -- ownership unclear; no review schedule; stale content mixed with current |
| 2 | Partial -- some content has owners but review cadence undefined; no retirement criteria; freshness varies widely |
| 3 | Sustainable -- every content piece has an assigned owner; review cadence defined (quarterly minimum); stale content flagged and retired; update process documented |
| 4 | Proactive -- content freshness monitored automatically; field feedback triggers updates; competitive content updated within 30 days of market changes |
| 5 | Self-sustaining -- maintenance built into organizational workflow; content lifecycle managed from creation through retirement; community contribution model for field-generated content |

---

## Section 6: Sprint Contract Checklist Templates

Pre-built checklists for common sales enablement deliverable types. The generator includes the relevant checklist(s) in each sprint contract. The evaluator uses them as acceptance criteria.

### Standard Contract Checks

These are the minimum required checks for every sales enablement sprint. Check IDs map to the 4 sales enablement evaluation criteria.

| Check ID | Criterion | Required | Verification Method |
|----------|-----------|----------|-------------------|
| CT-01 | content_coverage | required | Verify all target personas have content mapped to buyer journey stages; competitive content current for top 3 competitors; methodology alignment present |
| CT-02 | content_coverage | advisory | Verify content is modular and reusable across programs; content tagged with persona and journey stage metadata |
| AR-01 | audience_relevance | required | Verify content tailored to each persona's role, challenges, and decision criteria; language appropriate for audience; examples resonate with persona context |
| AR-02 | audience_relevance | advisory | Verify field reps have validated content relevance; persona-specific scenarios and objection handling included |
| AM-01 | adoption_measurability | required | Verify adoption metrics defined (usage, completion, certification pass rates); baseline established; targets set with timeline |
| AM-02 | adoption_measurability | advisory | Verify adoption metrics linked to business outcomes; regular reporting cadence defined |
| MS-01 | maintenance_sustainability | required | Verify every content piece has assigned owner; review cadence defined (quarterly minimum); stale content flagged |
| MS-02 | maintenance_sustainability | advisory | Verify content freshness monitoring process; retirement criteria documented; update triggers defined |

### For Playbook / Battle Card Deliverables

- [ ] All target personas identified and addressed with persona-specific content
- [ ] Content aligned to organization's sales methodology (MEDDPICC, Challenger, etc.)
- [ ] Competitive positioning current (validated within 90 days)
- [ ] Talk tracks and objection handling include specific language (not just topics)
- [ ] Proof points supported by customer evidence, data, or third-party validation
- [ ] Content formatted for consumption context (field reference card, presentation, self-study)
- [ ] Competitive intelligence sourced from public/authorized channels only
- [ ] Customer examples anonymized unless explicit permission obtained
- [ ] Pricing guidance marked as confidential with appropriate access controls

### For Training / Certification Deliverables

- [ ] Learning objectives defined and measurable for each module
- [ ] Curriculum structure progressive (foundational -> intermediate -> advanced)
- [ ] Assessment validates proficiency, not just attendance or completion
- [ ] Scoring rubric documented with clear pass/fail criteria
- [ ] Practice exercises included (role-play scenarios, call reviews, deal analysis)
- [ ] Certification credential designed (badge, certificate, or level designation)
- [ ] Content does not include real customer data in training scenarios

### For Messaging Framework Deliverables

- [ ] Value proposition articulated for each target persona
- [ ] Messages consistent across all touchpoints (email, call, presentation, web)
- [ ] Claims supported by evidence (customer stories, data points, analyst quotes)
- [ ] Competitive differentiation embedded (not just "we're better" but specific points)
- [ ] Internal and external versions distinguished (internal strategy vs. customer-facing messages)
- [ ] Messaging tested with field reps for resonance and usability

### For Content Program Deliverables

- [ ] Content inventory / audit completed with gap analysis
- [ ] Adoption metrics defined with baseline and targets
- [ ] Content ownership assigned for each piece or category
- [ ] Review cadence established (quarterly minimum for competitive; semi-annual for methodology)
- [ ] Retirement criteria defined (maximum age, usage threshold, relevance check)
- [ ] Distribution channels identified and access configured
- [ ] Feedback mechanism established for field input on content quality

### Sales Enablement Anti-Patterns

These trigger automatic score penalties when detected by the evaluator:

| Anti-Pattern | Criterion Affected | Penalty | Detection Signal |
|-------------|-------------------|---------|-----------------|
| **Marketing Repurpose** -- repackaging marketing collateral as enablement content without tailoring for seller audience and use context | audience_relevance | Drop to max 2 | Content reads as customer-facing messaging; no seller-specific guidance; no talk tracks or objection handling |
| **Shelfware** -- creating content that is never adopted by the field; no adoption tracking or measurement | adoption_measurability | Drop to max 1 | No usage metrics; field reps unaware content exists; content not integrated into seller workflow |
| **Stale Content** -- competitive content or market positioning >6 months old without review; training materials referencing deprecated products or processes | maintenance_sustainability | Drop to max 2 | Last-updated dates >6 months; references to discontinued products; competitor information outdated |
| **One-Size-Fits-All** -- identical content for all personas regardless of role, seniority, or buyer journey stage | audience_relevance | Drop to max 2 | No persona segmentation; same talk tracks for economic buyer and technical evaluator; no journey stage mapping |
| **Certification Theater** -- certification program that measures attendance, not proficiency; passing requires only completion, not demonstrated skill | content_coverage | Drop to max 2 | Assessment is multiple choice only; 100% pass rate; no practical exercises; no skill demonstration component |
| **Competitive Intel Leak** -- sharing classified competitive intelligence in broadly distributed content without proper access controls | content_coverage | Drop to max 0 | Competitor internal data in public-facing content; NDA-protected information in general distribution; no access controls on sensitive battle cards |

### Security Considerations

Domain-specific security guidance for sales enablement deliverables. Applies when `data_sensitivity` in spec.md is anything other than `none`.

**Data Sensitivity:**
- Competitive battle cards containing market intelligence, competitor pricing estimates, or competitive strategy must be classified as confidential and restricted to internal sales teams
- Customer case studies and success stories used as proof points must have explicit customer consent for external use; internal-only versions may contain additional detail
- Training content that references specific customer deals, revenue figures, or organizational challenges must anonymize customer identity unless written permission is obtained

**Access Control:**
- Battle cards with competitive intelligence must be distributed through access-controlled channels (not email attachments or public shared drives)
- Certification assessment questions and scoring rubrics must be restricted to enablement administrators and evaluators; not shared with participants before assessment
- Pricing guidance embedded in playbooks must be restricted to authorized sales roles; marketing and partner-facing versions must exclude pricing details

**Confidentiality:**
- Internal enablement strategy documents (program roadmaps, adoption metrics, gap analyses) must not be shared with customers or partners
- Competitive positioning frameworks must carry a confidential classification; field reps must be trained on what can and cannot be shared with customers
- Adoption and performance data tied to individual sales reps must be restricted to management and enablement program owners
