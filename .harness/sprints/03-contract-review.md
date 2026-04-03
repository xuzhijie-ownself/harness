# Contract Review -- Sprint 03

## Metadata
- Role: evaluator
- Agent: evaluator-1
- Inputs: 03-contract.md, features.json, all target files, broad grep of /init and harness:init references
- Status: accepted
- Reviewed by: evaluator-1
- Decision: accept (with required scope adjustments)

## Target feature IDs
- F-001
- F-002
- F-003

## Grouping Waiver Assessment

The contract groups 3 features in one sprint. Evaluating the justification:

1. **Shared file overlap**: Valid. F-002 and F-003 both edit `patterns.md` and `SKILL.md`. Sequential sprints would require re-reading and re-editing the same files.
2. **Same category (fix)**: Valid. All three are corrective text changes, not new behavior.
3. **F-001 + F-002 overlap**: Valid. Both address "domain-specific content in wrong layer."
4. **Markdown-only, mechanically verifiable**: Valid. Zero code, zero tests, zero build. Regression risk is near zero.

**Verdict on waiver**: ACCEPTED. The grouping reduces total round count without hiding risk. The changes are independent enough that a failure in one feature does not mask failures in others.

## F-001 Scope Assessment

The contract correctly identifies all 3 lines in `harness-ea/SKILL.md` that still say `architecture` without the `enterprise_` prefix:
- Line 3 (frontmatter description)
- Line 10 (activation text)
- Line 25 (activation check)

Grep confirms these are the only occurrences of `domain_profile.*architecture` without `enterprise_` across the plugins directory. The SA skill correctly uses `solution_architecture`, so no false positives there.

**Verdict**: COMPLETE scope. No gaps.

## F-002 Scope Assessment

### patterns.md evaluation schema (lines ~195-218)
The contract correctly identifies `product_depth`, `functionality`, `visual_design`, `code_quality` as software-specific keys that should become generic placeholders. There are 4 occurrences in the NN-evaluation.json schema block, plus 1 in the Domain Profile section template (line 683). The contract should clarify whether the Domain Profile section template (line ~683) also needs updating or remains as-is since it is explicitly labeled as the software profile example.

### patterns.md domain_profile field (line 149)
The contract correctly identifies the hardcoded list: `One of software (default), enterprise_architecture, tender, research, content, business_analysis, custom`. This should become a generic statement that profiles are defined by installed domain skill suites.

### evaluator.md Browser Testing section
Grep found Playwright/Puppeteer references at:
- Line 67: `Test via browser automation (Playwright or Puppeteer), not by reading source code`
- Line 103: `Use Playwright MCP (mcp__playwright) or Puppeteer to interact with the running app`

The contract targets the section around lines 96-98, but the actual references are at lines 67 and 103. The contract's verification check (FN-05) correctly uses grep to find ALL Playwright/Puppeteer mentions, so even if the line references are slightly off, the verification will catch missed occurrences.

### SKILL.md Playwright reference (line 177)
**GAP IDENTIFIED**: SKILL.md line 177 says "For browser apps, use Playwright or an equivalent browser tool." This is a software/browser-specific directive in the core skill file. The contract's F-002 scope for SKILL.md only mentions adding "Cross-Domain Composability" guidance -- it does not mention removing or genericizing the Playwright reference on line 177.

Additionally, SKILL.md line 177 context includes lines 176-182 which are heavily software-specific (browser apps, UI flows, API behavior, database state, Playwright). The contract's FN-05 check only greps `evaluator.md`, not `SKILL.md`.

### patterns.md Playwright reference (line 225)
The NN-evaluation.json schema example has `"evidence": "Playwright flow: create-edit-reload"` on line 225. This is inside the schema example block. The contract does not address this, but it is arguably acceptable as an example value.

**Verdict**: MOSTLY COMPLETE with one gap. The SKILL.md Playwright/browser-specific language (lines 176-182) is not in scope. However, this is a reasonable boundary -- the Evaluator section in SKILL.md serves as a high-level overview and can be addressed in a follow-up. The contract's stated goal of making evaluator.md generic is the higher-priority target since evaluator.md is the actual role reference file. I will not block on this but will note it as a NON-BLOCKING gap.

## F-003 Scope Assessment

The contract identifies these files for the /init to /start rename:
1. `commands/init.md` -> `commands/start.md` (file rename + content update)
2. `plugin.json` commands array update
3. `SKILL.md` references to `/init` and `harness:init`
4. `patterns.md` `/init` reference (line 151)

### Comprehensive grep results for references NOT covered by the contract

The following files contain `harness:init` or `/init` references that are NOT listed in the contract deliverables:

**Inside plugins/ (in scope per FN-10 check):**
- `plugins/harness-sdlc-suite/skills/harness-ba/SKILL.md:39` -- `/harness:init`
- `plugins/harness-sdlc-suite/skills/harness-ops/SKILL.md:39` -- `/harness:init`
- `plugins/harness-sdlc-suite/skills/harness-sdlc/SKILL.md:26` -- `/harness:init`
- `plugins/harness-sdlc-suite/skills/harness-sa/SKILL.md:40` -- `/harness:init`
- `plugins/harness-sdlc-suite/skills/harness-ea/SKILL.md:37` -- `/harness:init`
- `plugins/harness-sdlc-suite/skills/harness-sdlc-suite/SKILL.md:43,65,77` -- `/init` and `/harness:init`

**Outside plugins/ (in scope per FN-10 check):**
- `README.md:94,106,107,237` -- `/harness:init`
- `README.md:248,268` -- `/init`

**Outside contract grep scope but still relevant:**
- `install.sh:135` -- `/harness:init`
- `install.bat:108` -- `/harness:init`

**GAP IDENTIFIED**: The contract deliverables section only lists 4 files for F-003 changes (init.md, plugin.json, SKILL.md, patterns.md). But the FN-10 verification check (`grep -r 'harness:init' plugins/ README.md`) will fail because:
1. Five SDLC suite domain skill files reference `/harness:init`
2. The SDLC suite index skill references `/harness:init` and `/init`
3. README.md references `/harness:init` multiple times

The contract's verification check (FN-10) is correct and will catch these, but the deliverables section does not list these files. The builder needs to know they must also be edited.

Additionally, `install.sh` and `install.bat` contain `/harness:init` but are outside the FN-10 grep scope (which only checks `plugins/` and `README.md`). These should also be updated for consistency.

**SKILL.md frontmatter** (line 3): Contains "Also activate for /init, /session, /run, /reset commands" -- the contract mentions updating this but the frontmatter description is separate from the body text.

**Verdict**: INCOMPLETE deliverables list. The verification checks are correctly specified and will catch the gaps, but the deliverables section understates the work. The builder must edit at minimum 11 files for F-003, not 4. This is not a rejection-worthy issue because the verification checks will enforce completeness, but the contract should acknowledge the full file list.

## Contract Checks Assessment

All 14 checks (PD-01, FN-01 through FN-10, VD-01, CQ-01) are well-defined with clear verification methods. The checks are mechanically verifiable via grep and file reads.

One observation: the FN-10 check only greps `plugins/` and `README.md`. The `install.sh` and `install.bat` files are not in scope. This is acceptable for the sprint but should be noted as a follow-up.

## Acceptance Criteria Assessment

The criteria are adapted for documentation artifacts (not code), which is appropriate. The four criteria (product depth, functionality, visual design, code quality) are mapped to documentation equivalents.

## Risks Assessment

The three risks identified are valid:
1. Missed references -- correctly identified as the primary risk. The grep sweep is the mitigation.
2. Over-genericizing evaluator.md -- important guardrail. The evaluator must still mandate runtime verification.
3. patterns.md schema clarity -- the placeholder approach needs a clear comment pointing to the software example.

## Decision

**ACCEPT** -- with these notes for the builder:

### Required adjustments (must address or checks will fail)
1. **F-003 file scope**: The builder MUST also update `/harness:init` to `/harness:start` in ALL of:
   - `plugins/harness-sdlc-suite/skills/harness-ea/SKILL.md` (line 37)
   - `plugins/harness-sdlc-suite/skills/harness-ba/SKILL.md` (line 39)
   - `plugins/harness-sdlc-suite/skills/harness-sa/SKILL.md` (line 40)
   - `plugins/harness-sdlc-suite/skills/harness-ops/SKILL.md` (line 39)
   - `plugins/harness-sdlc-suite/skills/harness-sdlc/SKILL.md` (line 26)
   - `plugins/harness-sdlc-suite/skills/harness-sdlc-suite/SKILL.md` (lines 43, 65, 77)
   - `README.md` (lines 94, 106, 107, 237, 248, 268)
   - `SKILL.md` frontmatter line 3 (`/init` in the description)

   Without these, FN-10 (`grep -r 'harness:init' plugins/ README.md`) will fail.

### Non-blocking notes (follow-up, not sprint-blocking)
1. **F-002 SKILL.md Playwright reference**: Lines 176-182 in SKILL.md contain browser/Playwright-specific language. Consider genericizing in a follow-up sprint.
2. **F-003 install scripts**: `install.sh` line 135 and `install.bat` line 108 reference `/harness:init`. These are outside the FN-10 grep scope but should be updated for consistency.
3. **F-002 patterns.md example evidence**: Line 225 has `"Playwright flow: create-edit-reload"` as example evidence in the schema. Consider making this generic.
4. **F-002 patterns.md Domain Profile template**: Line 683 lists software-specific criteria. Clarify whether this stays as a labeled example or becomes generic.
