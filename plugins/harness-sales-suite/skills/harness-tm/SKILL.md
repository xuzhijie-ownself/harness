---
name: harness-tm
description: "Tender management domain skill for the harness framework. Provides APMP/Shipley capture management methodology, color team reviews, compliance matrix validation, and evaluation criteria for formal procurement and RFP response projects. Activated when domain_profile is tender_management."
---

# Tender Management Domain Skill

> **Domain-specific.** This skill provides the HOW for formal procurement and RFP response projects. The harness provides the WHEN (orchestration, sprint contracts, feature ledger). This skill provides the HOW (capture methodology, compliance verification, response quality evaluation, submission readiness criteria).

Activated when `domain_profile: tender_management` is declared in `.harness/spec.md`.

---

## Section 1: Tender Management Methodology

Select based on procurement type and organizational maturity during `/harness:start`:

| Methodology | When to Use | Harness Mapping |
|-------------|-------------|-----------------|
| APMP/Shipley Capture Management | Large government or enterprise RFPs with formal evaluation criteria; >$1M deal value; multi-volume responses | 1 harness sprint = 1 capture phase (opportunity assessment -> capture planning -> proposal development -> submission -> post-submit) |
| Agile Proposal Development | Commercial RFPs with shorter timelines (<4 weeks); iterative review cycles; team familiarity with buyer | 1 harness sprint = 1 review-and-revise cycle (draft -> pink team -> revise -> red team -> final) |
| Color Team Review Process | Any procurement where internal quality gates are required before submission; used alongside APMP or Agile | 1 harness sprint = 1 color team gate (pink -> red -> gold -> white) |
| Bid/No-Bid Decision Framework | Early-stage opportunity qualification before committing proposal resources | 1 harness sprint = 1 bid/no-bid assessment cycle |
| Best-and-Final-Offer (BAFO) | Post-submission negotiations; shortlisted bidders asked to refine pricing or terms | 1 harness sprint = 1 BAFO response cycle |

**Default:** APMP/Shipley Capture Management (if not specified by user).

### Methodology Selection Guide

| Procurement Signal | Recommended Methodology | Reason |
|-------------------|------------------------|--------|
| Government RFP with L/M/H evaluation factors | APMP/Shipley | Formal evaluation criteria demand structured compliance and win theme approach |
| Commercial RFP, <4 week timeline | Agile Proposal Development | Speed-to-submission with iterative quality improvement |
| Multi-volume response (technical + management + pricing + past performance) | APMP/Shipley + Color Team | Volume complexity requires structured reviews at each gate |
| RFI or Sources Sought | Bid/No-Bid Framework | Low-investment qualification before full proposal effort |
| Shortlisted, invited to negotiate | BAFO | Focused refinement of pricing and terms for competitive advantage |
| Sole-source or directed award | Agile Proposal Development | Lighter process sufficient when competition is limited |

### Color Team Review Definitions

| Color Team | Timing | Purpose | Exit Criteria |
|-----------|--------|---------|---------------|
| Pink Team | 50% draft complete | Storyboard and outline review; verify win strategy alignment | All sections outlined with win themes mapped; compliance matrix at 100% coverage |
| Red Team | 90% draft complete | Full document review simulating evaluator perspective | All sections written; scores simulated against evaluation criteria; no compliance gaps |
| Gold Team | Final pricing review | Pricing strategy validation; competitive positioning check | Pricing approved by authority; win probability assessed; competitive analysis complete |
| White Team | Pre-submission | Production quality check; packaging and logistics verification | All volumes formatted; page counts within limits; electronic submission tested; physical copies printed |

---

## Section 2: Development Methodology

Select based on proposal stage and deliverable type:

| Methodology | When to Use | How It Drives the Generator |
|-------------|-------------|----------------------------|
| Compliance-first | RFPs with strict Section L/M requirements; government procurements | Generator builds compliance matrix FIRST mapping every requirement to response section, then writes content to fill each requirement |
| Win-theme-driven | Competitive procurements where differentiation matters more than compliance alone | Generator defines win themes and discriminators FIRST, then weaves them throughout response sections |
| Template-based | Repeat procurements with existing boilerplate; short-timeline RFPs | Generator starts with template library, customizes to specific buyer context, then validates compliance |
| Capture-led | Long-cycle opportunities where pre-RFP positioning drives win probability | Generator builds capture plan with competitive assessment FIRST, then develops proposal content aligned with capture strategy |
| Past-performance-led | Procurements where past performance is highest-weighted evaluation factor | Generator assembles past performance narratives FIRST, then builds technical approach to reinforce proven capabilities |

**Default:** Compliance-first for government RFPs, Win-theme-driven for commercial.

### Generator First-Action Table

| Methodology | Generator writes first | Then |
|-------------|----------------------|------|
| Compliance-first | Compliance matrix mapping all requirements to sections | Response content filling each requirement with evidence |
| Win-theme-driven | Win theme statements + proof points + discriminators | Section drafts weaving themes throughout |
| Template-based | Template selection + customization plan | Tailored content with buyer-specific modifications |
| Capture-led | Capture plan + competitive assessment + solution approach | Proposal outline aligned with capture strategy |
| Past-performance-led | Past performance narratives with relevance mapping | Technical approach reinforcing demonstrated capabilities |

---

## Section 3: Verification Strategy

### Compliance Verification

Default for all tender management projects. The evaluator verifies each level is addressed.

| Level | Target Coverage | Scope | When to Verify |
|-------|----------------|-------|----------------|
| Compliance matrix completeness | 100% of RFP requirements mapped | Every requirement in Section L/C/M has a response section reference | Every sprint targeting proposal content |
| Response section completeness | All mapped sections written | No section is blank, "TBD", or contains only boilerplate | Every sprint targeting content development |
| Win theme consistency | All win themes threaded | Each major section reinforces at least one win theme; themes consistent across volumes | Every sprint targeting quality review |
| Page/format compliance | 100% within limits | Page counts, font sizes, margin requirements, file format specifications met | Pre-submission sprint |
| Cross-reference integrity | All references resolve | Section cross-references, figure numbers, table numbers, acronym definitions all accurate | Pre-submission sprint |
| Pricing consistency | Technical and pricing aligned | Pricing volume reflects scope in technical volume; no conflicting quantities or rates | Pricing sprint |
| Security / data handling | Sensitive content controlled | Pricing marked confidential; competitive intel sources attributed; customer data classified | Every sprint (if spec.md data_sensitivity != none) |

### Color Team Readiness Verification

The evaluator MUST verify color team readiness before each gate:

| Gate | Required Artifacts | Verification Method |
|------|-------------------|-------------------|
| Pre-Pink Team | Compliance matrix (100%), section outlines, win theme matrix | Matrix completeness check; outline presence for every section |
| Pre-Red Team | Full draft (90%+), compliance matrix updated, executive summary | Draft completeness audit; evaluator scoring simulation |
| Pre-Gold Team | Pricing volumes, cost narrative, competitive pricing analysis | Pricing authority sign-off; competitive analysis review |
| Pre-White Team | All volumes final, production checklist, submission logistics plan | Format compliance check; electronic submission dry-run |

---

## Section 4: Deliverable Verification

### Primary Deliverables

| Deliverable | Gate Check | Pass Criteria |
|-------------|-----------|---------------|
| RFP Response (Technical Volume) | Compliance matrix 100% + win themes threaded | Every Section L requirement addressed; at least 2 discriminators per major section; no generic boilerplate |
| Compliance Matrix | All requirements mapped to response sections | Every row has a section reference, compliance status (compliant/partial/exception), and evidence pointer |
| Executive Summary | Win themes + proof points + call to action | Opens with buyer's mission/challenge, not seller capabilities; includes quantified benefits; ends with clear differentiator |
| Pricing Volume | Cost elements + assumptions + narrative | All CLINs/line items priced; assumptions documented; narrative explains pricing approach and value proposition |

### Supporting Deliverables

| Deliverable | Gate Check | Pass Criteria |
|-------------|-----------|---------------|
| Past Performance Volume | Relevance + recency + results | Each reference within 5 years; relevance to current RFP explicitly stated; quantified results included |
| Management Volume | Team structure + key personnel + transition plan | Org chart with named key personnel; resumes match position requirements; transition/phase-in plan realistic |
| Win Theme Matrix | Themes x sections coverage | Every major section has at least one theme assigned; no orphaned themes |
| Competitive Assessment | Top 3 competitors analyzed | Competitor strengths, weaknesses, likely pricing strategy, and counter-positioning documented |

### Governance Deliverables

| Deliverable | Gate Check | Pass Criteria |
|-------------|-----------|---------------|
| Bid/No-Bid Decision | Scored assessment with rationale | Win probability assessed; resource requirements estimated; strategic alignment confirmed |
| Color Team Reports | Findings + recommended actions | Each finding categorized (critical/major/minor); corrective actions assigned with deadlines |
| Lessons Learned | Post-submission analysis | Win/loss factors documented; process improvements identified; template library updated |

---

## Section 5: Evaluation Criteria (Tender Management Profile)

The 4 primary criteria for the `tender_management` domain profile. The evaluator MUST use these anchors for consistent scoring across sprints.

### compliance_coverage (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no compliance matrix; requirements not mapped to response sections |
| 1 | Severely incomplete -- compliance matrix started but <50% of requirements mapped; many sections missing |
| 2 | Partial -- most requirements mapped but gaps exist; some sections reference wrong requirements; compliance statuses not tracked |
| 3 | Complete -- every requirement mapped to a response section with compliance status (compliant/partial/exception); all exceptions have documented rationale |
| 4 | Verified -- compliance matrix validated through independent review (red team); cross-references resolve correctly; exception rationale accepted by reviewer |
| 5 | Exemplary -- compliance matrix includes evidence pointers for each requirement; traceability from requirement to response to proof point; evaluator-ready formatting |

### response_completeness (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no response content written beyond headers and placeholders |
| 1 | Severely incomplete -- <50% of required sections have content; large sections are "TBD" or boilerplate |
| 2 | Partial -- most sections have content but quality varies; some sections are clearly first-draft with gaps or inconsistencies |
| 3 | Submission-ready -- all required sections written with substantive content; no "TBD" or placeholder text; page/format requirements met |
| 4 | Reviewed -- content refined through at least one color team review cycle; findings addressed; section flow is logical and reader-friendly |
| 5 | Polished -- content refined through full color team cycle (pink, red, gold, white); executive summary compelling; technical narrative tells a cohesive story with proof points |

### win_theme_clarity (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no win themes defined; response reads as generic capability statement |
| 1 | Severely incomplete -- win themes listed but not integrated into response content |
| 2 | Inconsistent -- win themes present in executive summary but not threaded through technical sections; themes are generic ("we are experienced") not differentiated |
| 3 | Threaded -- at least 3 differentiated win themes with proof points; each major section reinforces at least one theme; themes specific to this buyer's evaluation criteria |
| 4 | Discriminating -- win themes directly address buyer's stated evaluation factors; competitive positioning woven in (without naming competitors); ghost-against-competition themes present |
| 5 | Compelling -- win themes create a cohesive narrative across all volumes; each theme backed by quantified proof points from past performance; evaluator can score themes against criteria without re-reading |

### submission_readiness (0-5)

| Score | Anchor Description |
|-------|--------------------|
| 0 | Absent -- no submission plan; deadline not tracked; volumes not assembled |
| 1 | Severely incomplete -- deadline known but no production plan; volumes in various states of completion |
| 2 | Partial -- production plan exists but not on track; some volumes formatted, others still in draft layout; submission logistics undefined |
| 3 | On-track -- all volumes formatted to RFP specifications; production checklist in progress; submission method tested (e.g., portal upload tested, physical shipping arranged) |
| 4 | Complete -- white team review passed; all volumes final; backup submission method identified; submission timeline allows 24-hour buffer before deadline |
| 5 | Locked -- all volumes submitted or ready for one-click submission; confirmation received from buyer; post-submission follow-up plan defined; all team notified of status |

---

## Section 6: Sprint Contract Checklist Templates

Pre-built checklists for common tender management deliverable types. The generator includes the relevant checklist(s) in each sprint contract. The evaluator uses them as acceptance criteria.

### For RFP Response Deliverables

- [ ] Compliance matrix maps every RFP requirement to a response section
- [ ] Every mapped section contains substantive content (no "TBD", "See attached", or boilerplate-only)
- [ ] At least 3 differentiated win themes identified and threaded through response
- [ ] Executive summary leads with buyer's mission and challenge, not seller capabilities
- [ ] Past performance examples are within 5 years and explicitly relevant to current requirements
- [ ] All cross-references (section numbers, figure numbers, table numbers) resolve correctly
- [ ] Page counts within RFP-specified limits for each volume
- [ ] Font, margins, and formatting comply with RFP instructions
- [ ] Pricing volume reflects scope in technical volume (no conflicting quantities)
- [ ] No proprietary customer data or competitive intelligence from protected sources in response
- [ ] Pricing marked as business-confidential per organizational classification

### For Compliance Matrix Deliverables

- [ ] Every requirement from Section L (or equivalent) has a row in the matrix
- [ ] Each row has: requirement ID, requirement text summary, response section reference, compliance status
- [ ] Compliance status uses standard values: Compliant, Partial, Exception, N/A
- [ ] Every "Partial" or "Exception" entry has documented rationale and mitigation
- [ ] Matrix version-controlled with last-updated timestamp
- [ ] No duplicate requirement entries
- [ ] Requirement numbering matches source document exactly

### For Color Team Review Deliverables

- [ ] Review report uses standard finding categories: Critical, Major, Minor, Editorial
- [ ] Each finding has: location (volume/section/page), description, recommended action, owner, deadline
- [ ] Critical findings have a resolution plan with timeline that preserves submission deadline
- [ ] Scoring simulation included (for red team): predicted evaluator scores against stated criteria
- [ ] Action item tracker created with status tracking (open/in-progress/resolved)
- [ ] Review team composition documented (independent reviewers, not original authors)

### For Bid/No-Bid Decision Deliverables

- [ ] Win probability assessed using structured criteria (not gut feeling)
- [ ] Resource requirements estimated (labor hours, cost of pursuit, opportunity cost)
- [ ] Competitive landscape analyzed (known competitors, incumbent advantages, market intelligence)
- [ ] Strategic alignment confirmed (customer relationship, past performance relevance, solution fit)
- [ ] Decision documented with rationale and approving authority
- [ ] If bid: capture plan initiated with timeline and resource allocation
- [ ] If no-bid: customer notified per protocol; lessons captured for future opportunities

### Tender Management Anti-Patterns

These trigger automatic score penalties when detected by the evaluator:

| Anti-Pattern | Criterion Affected | Penalty | Detection Signal |
|-------------|-------------------|---------|-----------------|
| **Non-Compliant Response** -- failing to address specific RFP requirements; missing sections or ignoring mandatory instructions | compliance_coverage | Drop to max 1 | Compliance matrix has gaps; required sections missing; mandatory instructions not followed |
| **Generic Win Themes** -- using capability statements instead of buyer-specific discriminators; "we are the best" without proof | win_theme_clarity | Drop to max 2 | Win themes could apply to any bidder; no quantified proof points; themes not mapped to evaluation criteria |
| **Missed Deadline** -- submitting after the deadline or not having backup submission plan | submission_readiness | Drop to max 0 | No submission timeline; no buffer before deadline; no backup method identified |
| **No Bid/No-Bid Decision** -- committing proposal resources without structured opportunity assessment | compliance_coverage | Drop to max 2 | Proposal work begins before bid decision documented; no win probability assessment |
| **Copy-Paste Boilerplate** -- reusing previous proposal content without tailoring to current buyer's requirements and context | response_completeness | Drop to max 2 | Generic company descriptions; previous customer names not removed; requirements from different RFP referenced |
| **Skipped Color Team** -- submitting without independent review; authors self-reviewing their own sections | response_completeness | Drop to max 2 | No color team reports on file; review team is same as writing team; no finding tracker |
| **Pricing Leak** -- sharing confidential pricing externally or storing in unsecured locations; pricing inconsistent across volumes | submission_readiness | Drop to max 1 | Pricing in unprotected documents; technical volume references different quantities than pricing volume |
| **Competitive Intel Misuse** -- using NDA-protected competitive information in response; citing protected sources | win_theme_clarity | Drop to max 0 | References to competitor internal data obtained through protected channels; attribution to restricted sources |
