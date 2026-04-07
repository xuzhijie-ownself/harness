---
name: harness-sales
description: "Core sales domain skill for the harness framework. Provides methodology selection (MEDDPICC, Challenger, SPIN, Sandler, BANT), qualification verification, deal documentation standards, and evaluation criteria for revenue execution projects. Activated when domain_profile is sales."
---

# Core Sales Domain Skill

> **Domain-specific.** This skill provides the HOW for revenue execution projects. The harness provides the WHEN (orchestration, sprint contracts, feature ledger). This skill provides the HOW (methodology selection, qualification strategy, deal verification, evaluation criteria anchors).

Activated when `domain_profile: sales` is declared in `.harness/spec.md`.

---

## Section 1: Sales Methodology

Select based on deal characteristics and buyer complexity during `/harness:start`:

| Methodology | When to Use | Harness Mapping |
|-------------|-------------|-----------------|
| MEDDPICC (Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion, Competition) | Enterprise deals with complex buying committees, long sales cycles, >$100K ACV | 1 harness sprint = 1 deal stage gate (discovery -> qualification -> validation -> proposal -> negotiation -> close) |
| Challenger Sale | Commoditized markets where insight-led selling differentiates; buyer has status-quo bias | 1 harness sprint = 1 teaching conversation + reframe cycle |
| SPIN Selling (Situation, Problem, Implication, Need-Payoff) | Consultative sales where understanding buyer pain drives the conversation; mid-market deals | 1 harness sprint = 1 discovery-to-proposal cycle |
| Sandler Selling System | Deals where upfront qualification saves wasted pursuit; buyer has budget authority ambiguity | 1 harness sprint = 1 Sandler submarine step (bonding -> upfront contract -> pain -> budget -> decision -> fulfillment -> post-sell) |
| BANT (Budget, Authority, Need, Timeline) | High-volume, transactional sales with clear budget cycles; qualification speed matters more than depth | 1 harness sprint = 1 qualification checkpoint |

**Default:** MEDDPICC (if not specified by user).

### Methodology Selection Guide

| Deal Signal | Recommended Methodology | Reason |
|-------------|------------------------|--------|
| Multiple stakeholders, >6 month cycle | MEDDPICC | Tracks each buying committee member and decision criteria systematically |
| Buyer says "we're fine with current solution" | Challenger | Teaching-based approach breaks through status-quo bias |
| Buyer pain is unclear or latent | SPIN | Implication and need-payoff questions surface hidden cost of inaction |
| Buyer requests pricing before discovery | Sandler | Upfront contract establishes mutual commitment before investment of time |
| Inbound lead with stated budget and timeline | BANT | Fast qualification to prioritize pipeline velocity |
| Government / public sector procurement | MEDDPICC + formal process mapping | Decision process documentation is legally required |

---

## Section 2: Development Methodology

Select based on deliverable type and deal stage:

| Methodology | When to Use | How It Drives the Generator |
|-------------|-------------|----------------------------|
| Discovery-first | New opportunities, unknown buyer landscape | Generator maps stakeholders, captures pain points, builds initial qualification scorecard before any proposal work |
| Proposal-driven | Active opportunity with defined requirements | Generator produces proposal outline, pricing framework, and win strategy before detailed content |
| Account planning | Strategic accounts, multi-year relationships | Generator builds account map, whitespace analysis, and relationship strategy before tactical deal work |
| Pipeline hygiene | Portfolio management, forecast accuracy | Generator audits existing deals for stage accuracy, next steps, and close date validity before new deal work |
| Close planning | Late-stage deals with identified path to close | Generator produces mutual action plan, contract terms checklist, and implementation timeline |

**Default:** Discovery-first for new deals, Proposal-driven for active opportunities.

### Generator First-Action Table

| Methodology | Generator writes first | Then |
|-------------|----------------------|------|
| Discovery-first | Stakeholder map + pain/gain matrix | Qualification scorecard with MEDDPICC fields |
| Proposal-driven | Executive summary + win themes | Detailed proposal sections with proof points |
| Account planning | Account org chart + whitespace map | Relationship development plan + opportunity roadmap |
| Pipeline hygiene | Stage audit report + deal health scores | Updated close dates + next-step commitments |
| Close planning | Mutual action plan + timeline | Contract terms checklist + procurement requirements |

---

## Section 3: Verification Strategy

### Qualification Verification

Default for all sales projects. The evaluator verifies each level is addressed.

| Level | Target Coverage | Scope | When to Verify |
|-------|----------------|-------|----------------|
| Qualification completeness | 100% of MEDDPICC fields | All qualification criteria populated with evidence, not assumptions | Every sprint targeting discovery/qualification |
| Stakeholder mapping | All decision-makers identified | Economic buyer, champion, technical evaluator, legal/procurement contacts documented | Every sprint targeting account planning |
| Pain documentation | Primary + secondary pain | Business impact quantified, personal motivations captured, compelling event identified | Every sprint targeting discovery |
| Competitive positioning | All known competitors | Differentiators documented, competitive traps set, landmine questions prepared | Every sprint targeting proposal/presentation |
| Pipeline accuracy | All active deals | Stage matches actual buyer behavior, close dates based on mutual commitments, amounts reflect qualified scope | Every sprint targeting pipeline hygiene |
| Security / data handling | Deal-sensitive data | Pricing marked confidential, customer PII not stored in plain text, competitive intel classified | Every sprint (if spec.md data_sensitivity != none) |

### Deal Documentation Verification

The evaluator MUST verify documentation completeness before advancing deal stage:

| From Stage | To Stage | Required Documentation |
|------------|----------|----------------------|
| Lead | Discovery | Initial contact record, source attribution, ICP fit score |
| Discovery | Qualification | Stakeholder map, pain documentation, preliminary MEDDPICC scorecard |
| Qualification | Validation | Complete MEDDPICC scorecard, competitive landscape, technical requirements |
| Validation | Proposal | POC results or demo feedback, technical fit confirmation, procurement timeline |
| Proposal | Negotiation | Submitted proposal, pricing approval, legal review of terms |
| Negotiation | Close | Signed mutual action plan, contract redlines resolved, implementation plan |

---

## Section 4: Deliverable Verification

### Primary Deliverables

| Deliverable | Gate Check | Pass Criteria |
|-------------|-----------|---------------|
| Opportunity Plan | All MEDDPICC fields populated | No field contains "TBD" or "Unknown" -- each has evidence-backed content or explicit "Not applicable: [reason]" |
| Executive Proposal | Win themes + proof points + pricing | At least 3 differentiated win themes, each supported by a customer-relevant proof point; pricing reflects qualified scope |
| Close Plan / Mutual Action Plan | Timeline + ownership + milestones | Every milestone has an owner (both seller and buyer side), dates are mutual commitments not seller-imposed |
| Competitive Battle Card | Differentiators + traps + objection handling | Addresses top 3 competitors by name; includes "what they'll say" and "what we say back" for each |

### Supporting Deliverables

| Deliverable | Gate Check | Pass Criteria |
|-------------|-----------|---------------|
| Stakeholder Map | All roles identified with influence level | Economic buyer, champion, detractor, coach roles filled; influence scored (high/medium/low) |
| Discovery Notes | Structured capture of buyer conversation | Pain points, current state, desired future state, compelling event, decision timeline documented |
| Pricing Worksheet | Approved pricing with discount rationale | List price, discount percentage, approval authority documented; no unauthorized discounts |

### Governance Deliverables

| Deliverable | Gate Check | Pass Criteria |
|-------------|-----------|---------------|
| Deal Review Deck | Follows standard review template | Includes qualification summary, competitive position, risk assessment, ask of leadership |
| Forecast Commitment | Stage-appropriate confidence level | Commit/upside/pipeline classification matches deal evidence, not seller optimism |

---

## Section 5: Evaluation Criteria (Sales Profile)

The 4 primary criteria for the `sales` domain profile. The evaluator MUST use these anchors for consistent scoring across sprints.

### qualification_depth (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no qualification data captured; opportunity is a name and dollar amount only |
| 1 | Severely incomplete -- 1-2 MEDDPICC fields populated, rest blank or "TBD" |
| 2 | Surface-level -- most fields populated but with assumptions, not evidence; no stakeholder beyond initial contact |
| 3 | Evidence-based -- all MEDDPICC fields populated with buyer-confirmed data; economic buyer identified; champion validated through action (not just title) |
| 4 | Multi-threaded -- multiple stakeholders engaged across buying committee; competitive landscape documented; decision process mapped with timeline |
| 5 | Command of the deal -- every MEDDPICC element backed by recent buyer interaction; risk assessment updated weekly; champion actively coaching seller through internal politics |

### pipeline_coverage (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no pipeline data; deals exist only in seller's head |
| 1 | Severely incomplete -- deals listed but no stages, amounts, or close dates |
| 2 | Inconsistent -- some deals have stages and amounts but criteria for stage transitions undefined; close dates are seller-imposed guesses |
| 3 | Hygiene-compliant -- all deals have accurate stages matching buyer behavior; close dates based on mutual commitments; amounts reflect qualified scope (not aspirational) |
| 4 | Coverage-analyzed -- pipeline-to-quota ratio tracked; stage conversion rates monitored; gap analysis identifies where new pipeline is needed |
| 5 | Predictive -- weighted pipeline forecasting with historical accuracy >80%; pipeline velocity metrics (time-in-stage, conversion rates) drive coaching actions |

### deal_documentation (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no deal documentation beyond CRM opportunity record |
| 1 | Severely incomplete -- scattered notes with no structure; impossible for another AE to take over |
| 2 | Partial -- some deals have opportunity plans but they are outdated; key decisions and commitments not recorded |
| 3 | Current and structured -- every active deal has an opportunity plan updated within last 2 weeks; stakeholder map, pain documentation, and next steps documented |
| 4 | Comprehensive -- deal documentation includes competitive positioning, risk assessment, and mutual action plan; another AE could take over the deal with documentation alone |
| 5 | Institutional knowledge -- deal documentation feeds team-level playbooks; win/loss analysis captured; lessons learned shared across team |

### close_readiness (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no close plan; deal is in "negotiation" stage with no defined path to signature |
| 1 | Severely incomplete -- close date set but no mutual action plan; seller pushing timeline buyer has not agreed to |
| 2 | Partial -- mutual action plan exists but has gaps (missing procurement steps, legal review timeline undefined) |
| 3 | Defined -- mutual action plan with milestones, owners (both sides), and dates; procurement process understood; contract terms drafted |
| 4 | Validated -- mutual action plan executed on-track; legal/procurement stakeholders engaged; implementation plan discussed; no outstanding objections |
| 5 | Executable -- all mutual action plan milestones complete or on-track; contract in redlines; implementation team identified; go-live date agreed; risk of slip is near-zero |

---

## Section 6: Sprint Contract Checklist Templates

Pre-built checklists for common sales deliverable types. The generator includes the relevant checklist(s) in each sprint contract. The evaluator uses them as acceptance criteria.

### Standard Contract Checks

These are the minimum required checks for every sales sprint. Check IDs map to the 4 sales evaluation criteria.

| Check ID | Criterion | Required | Verification Method |
|----------|-----------|----------|-------------------|
| QD-01 | qualification_depth | required | Verify all MEDDPICC fields populated with evidence-based data (not assumptions or "TBD"); confirm economic buyer and champion identified and validated |
| QD-02 | qualification_depth | advisory | Verify multi-threading -- at least 2 stakeholders engaged at different levels of the buying committee |
| PC-01 | pipeline_coverage | required | Verify deal stage matches actual buyer behavior (not seller wishful thinking); close date based on mutual commitment; amount reflects qualified scope |
| PC-02 | pipeline_coverage | advisory | Verify pipeline-to-quota ratio calculated and gap analysis present if coverage < 3x |
| DD-01 | deal_documentation | required | Verify opportunity plan exists, was updated within last 2 weeks, and contains stakeholder map, pain documentation, and next steps |
| DD-02 | deal_documentation | advisory | Verify competitive battle card present with top 3 competitors and differentiation strategy |
| CR-01 | close_readiness | required | Verify mutual action plan exists with milestones, owners (both sides), and dates; procurement process documented |
| CR-02 | close_readiness | advisory | Verify implementation plan discussed with buyer's technical team and go-live date agreed |

### For Discovery / Qualification Deliverables

- [ ] All MEDDPICC fields populated with evidence-based data (not assumptions)
- [ ] Economic buyer identified by name and validated through interaction
- [ ] Champion identified and validated through action (shared internal information, facilitated introductions, or advocated internally)
- [ ] Pain documented with business impact quantified (revenue loss, cost increase, or risk exposure)
- [ ] Decision process mapped with timeline, stages, and stakeholders at each stage
- [ ] Compelling event identified (contract expiry, budget cycle, regulatory deadline, or strategic initiative)
- [ ] Competitive landscape documented (known competitors, positioning, differentiators)
- [ ] Customer data classified (public/internal/confidential) and handled per classification
- [ ] No customer PII stored in plain-text deal notes or unsecured documents

### For Proposal / Presentation Deliverables

- [ ] Executive summary leads with buyer pain and business impact, not seller capabilities
- [ ] At least 3 differentiated win themes supported by customer-relevant proof points
- [ ] Pricing reflects qualified scope and has documented approval chain
- [ ] Proposal structure addresses all buyer evaluation criteria (from discovery notes)
- [ ] Competitive differentiation woven throughout (not isolated in a "why us" section)
- [ ] Implementation timeline included with realistic milestones
- [ ] Pricing marked as confidential; no unauthorized discounts
- [ ] No competitive intelligence from NDA-protected sources

### For Close / Negotiation Deliverables

- [ ] Mutual action plan exists with milestones, owners (both seller and buyer), and dates
- [ ] Contract terms reviewed by legal with redlines tracked
- [ ] Procurement process documented (approval chain, required documents, timeline)
- [ ] Implementation plan discussed with buyer's technical team
- [ ] Go-live date agreed with buyer (not seller-imposed)
- [ ] Risk assessment updated with mitigation actions for each identified risk
- [ ] Pricing approval chain documented (discount authority, executive sign-off if needed)

### For Account Planning Deliverables

- [ ] Organization chart with key contacts and their roles in buying decisions
- [ ] Whitespace analysis identifying upsell/cross-sell opportunities
- [ ] Relationship strength scored for each key contact (strong/developing/none)
- [ ] Competitive footprint mapped (where competitors are embedded in the account)
- [ ] Strategic plan with 12-month revenue targets and milestone checkpoints
- [ ] Account data classified per customer agreement and data protection requirements

### Sales Anti-Patterns

These trigger automatic score penalties when detected by the evaluator:

| Anti-Pattern | Criterion Affected | Penalty | Detection Signal |
|-------------|-------------------|---------|-----------------|
| **Happy Ears** -- accepting buyer statements at face value without verification; treating verbal interest as commitment | qualification_depth | Drop to max 2 | MEDDPICC fields populated with "buyer said" without corroborating evidence; no negative scenario testing |
| **Single-Threading** -- only one contact at the buyer organization; no multi-stakeholder engagement | qualification_depth | Drop to max 2 | Stakeholder map has only 1 contact; no economic buyer or champion identified separately |
| **Premature Discounting** -- offering discounts before understanding buyer budget, decision criteria, or competitive landscape | close_readiness | Drop to max 2 | Pricing worksheet shows discounts before qualification is complete; no documented negotiation strategy |
| **Ghosted Pipeline** -- deals sitting in pipeline with no buyer activity for >30 days; close dates repeatedly pushed | pipeline_coverage | Drop to max 1 | Last buyer interaction >30 days ago; close date moved 2+ times without new buyer commitment |
| **Demo Before Discovery** -- presenting product capabilities before understanding buyer pain and requirements | deal_documentation | Drop to max 2 | Demo scheduled or delivered before discovery notes exist; no documented buyer pain or requirements |
| **No Mutual Action Plan** -- entering negotiation without a jointly agreed path to close | close_readiness | Drop to max 1 | Deal in negotiation/close stage with no mutual action plan document; timeline is seller-imposed |
| **Pricing Leak** -- sharing confidential pricing externally or storing it in unsecured locations | deal_documentation | Drop to max 1 | Pricing in unprotected documents, shared drives without access controls, or email threads with external recipients beyond buyer |
| **Competitor Intel Misuse** -- using NDA-protected competitive information in proposals or conversations | deal_documentation | Drop to max 0 | References to competitor internal data, pricing, or roadmap obtained through protected channels |

### Security Considerations

Domain-specific security guidance for sales deliverables. Applies when `data_sensitivity` in spec.md is anything other than `none`.

**Data Sensitivity:**
- Customer financial data (deal amounts, pricing, budgets) must be classified as confidential and stored only in access-controlled systems (CRM, deal rooms)
- Customer PII (contact names, emails, phone numbers) must not appear in plain-text deal notes, shared documents, or email threads outside the account team
- Competitive intelligence must be sourced from public channels only; NDA-protected information must never be used in deal artifacts

**Access Control:**
- Deal artifacts containing pricing must be restricted to the account team and authorized approvers
- Stakeholder maps and org charts from customer organizations must not be shared outside the selling team
- Pipeline reports with customer-specific data must be restricted to management and operations roles with need-to-know

**Confidentiality:**
- Proposals and pricing worksheets must carry a confidentiality classification header
- Customer-specific pain points and business challenges must not be referenced in marketing materials or other customer engagements without explicit consent
- Win/loss analysis must anonymize customer details before use in team training
