# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/features.json, .harness/plan-core-fixes.md, target files (SKILL.md, patterns.md, evaluator.md, init.md, plugin.json)
- Status: in_review

## Target feature IDs
- F-001
- F-002
- F-003

## Grouping waiver

These 3 features are grouped in a single sprint because:

1. **Tight coupling on shared files**: F-002 and F-003 both edit `plugins/harness/skills/harness/SKILL.md` and `plugins/harness/skills/harness/references/patterns.md`. Splitting them into separate sprints would create merge conflicts or require re-reading the same files twice for sequential edits.
2. **Same category**: All three are category "fix" targeting documentation correctness. None adds new behavior -- they correct existing text to match intended semantics.
3. **F-001 + F-002 overlap**: F-001 fixes the EA skill's `architecture` string, and F-002 removes the hardcoded domain profile list from core. Both address the same root cause (domain-specific content leaking into wrong layers). Testing them separately wastes a round.
4. **Markdown-only, mechanically verifiable**: Every change is a string replacement in a Markdown or JSON file. No code, no tests, no build. Risk of regression is near zero.

Splitting these into 3 separate sprints would increase total round count without reducing risk.

## Goal

Make the core harness files truly domain-agnostic, complete the EA rename, and rename `/init` to `/start` to avoid collision with Claude Code's built-in `/init` command. All changes are Markdown/JSON text edits.

## Deliverables

### F-001: Complete architecture to enterprise_architecture rename
- **File**: `plugins/harness-sdlc-suite/skills/harness-ea/SKILL.md`
  - Line 3 (frontmatter description): change `domain_profile is "architecture"` to `domain_profile is "enterprise_architecture"`
  - Line 10: change `domain_profile: architecture` to `domain_profile: enterprise_architecture`
  - Line 25: change `domain_profile: architecture` to `domain_profile: enterprise_architecture`

### F-002: Remove domain-specific leaks from core
- **File**: `plugins/harness/skills/harness/references/patterns.md`
  - Lines ~194-218 (NN-evaluation.json schema): Replace the software-specific `primary_scores` keys (`product_depth`, `functionality`, `visual_design`, `code_quality`) with generic placeholder keys (`criterion_1`, `criterion_2`, `criterion_3`, `criterion_4`) and add a comment noting that actual keys come from the active domain profile
  - Line ~149 (state.json field reference for `domain_profile`): Replace the hardcoded profile list with text stating profiles are defined by installed domain skill suites
- **File**: `plugins/harness/skills/harness/roles/evaluator.md`
  - Lines 96-98 (Browser Testing section heading area): Rename "Browser Testing" to "Runtime Verification" and replace Playwright-specific language with generic verification language that defers to the active domain skill
- **File**: `plugins/harness/skills/harness/SKILL.md`
  - Add a brief "Cross-Domain Composability" paragraph in the Domain Profiles section explaining how primary + secondary profiles interact and how the evaluator scores both sets of criteria (consolidating scattered references into one authoritative location)

### F-003: Rename /init command to /start
- **File**: `plugins/harness/commands/init.md` -- rename to `plugins/harness/commands/start.md`, update frontmatter `name: start`, update heading to `# /start`
- **File**: `plugins/harness/.claude-plugin/plugin.json` -- change `"./commands/init.md"` to `"./commands/start.md"` in the commands array
- **File**: `plugins/harness/skills/harness/SKILL.md` -- replace references to `/init` with `/start` (frontmatter description, command pre-flight validation list, configuration section, workflow entry suggestion). Preserve references to `init.md`/`init.sh`/`init.bat` artifacts (those are the initializer's output files, not the command name)
- **File**: `plugins/harness/skills/harness/references/patterns.md` -- replace `/init` with `/start` in methodology field reference (line ~151)

## Verification

All checks are grep-based string searches. No build, no runtime, no browser.

1. **F-001 completeness**: `grep -r 'domain_profile.*architecture' plugins/` returns zero lines containing `architecture` without the `enterprise_` prefix (excluding this contract file and any other harness artifacts)
2. **F-002 evaluation schema**: `grep 'product_depth\|functionality\|visual_design\|code_quality' plugins/harness/skills/harness/references/patterns.md` returns zero matches in the NN-evaluation.json schema block (these keys may still appear in the NN-contract.md template as the software profile example, which is acceptable)
3. **F-002 domain_profile field**: The state.json field reference for `domain_profile` in patterns.md no longer contains a hardcoded list of profile names
4. **F-002 evaluator generic**: `grep -i 'playwright\|puppeteer' plugins/harness/skills/harness/roles/evaluator.md` returns zero matches in the Browser Testing / Runtime Verification section
5. **F-002 composability**: SKILL.md Domain Profiles section contains "secondary_profile" guidance
6. **F-003 file rename**: `plugins/harness/commands/start.md` exists and `plugins/harness/commands/init.md` does not exist
7. **F-003 plugin.json**: `grep 'commands/start.md' plugins/harness/.claude-plugin/plugin.json` returns a match
8. **F-003 no stale refs**: `grep -r 'harness:init' plugins/ README.md` returns zero matches (the skill name `harness:init` in SKILL.md should become `harness:start`)

## Acceptance criteria

Since all deliverables are Markdown documentation (not code), the domain profile criteria are adapted for documentation artifacts:

- **Product depth**: Edits are substantively correct -- the renamed values, generic placeholders, and cross-domain guidance accurately reflect the intended architecture. Not just find-replace but semantically sound.
- **Functionality**: Every grep-based verification check passes. No broken cross-references, no stale values, no missed occurrences.
- **Visual design**: Markdown formatting is preserved -- tables render correctly, code blocks are intact, heading hierarchy is consistent. No formatting regressions.
- **Code quality**: Edits are minimal and surgical. No unnecessary rewrites, no scope creep beyond the 3 features. Diff is clean and reviewable.

## Contract checks

### F-001 checks
- `PD-01`: (required) EA SKILL.md frontmatter description says `enterprise_architecture` not `architecture` -- verify by reading line 3
- `FN-01`: (required) EA SKILL.md line 10 activation says `enterprise_architecture` -- verify by reading line 10
- `FN-02`: (required) EA SKILL.md line 25 activation check says `enterprise_architecture` -- verify by reading line 25
- `FN-03`: (required) Zero grep matches for `domain_profile.*architecture` without `enterprise_` prefix across plugins/ -- verify by grep

### F-002 checks
- `PD-02`: (required) patterns.md NN-evaluation.json schema uses generic placeholder keys, not software-specific keys -- verify by reading the schema block
- `FN-04`: (required) patterns.md state.json domain_profile field reference does not hardcode a profile list -- verify by reading the field reference
- `FN-05`: (required) evaluator.md Runtime Verification section uses generic language, no Playwright/Puppeteer tool names -- verify by grep
- `FN-06`: (required) SKILL.md Domain Profiles section includes cross-domain composability guidance for secondary_profile -- verify by reading the section

### F-003 checks
- `FN-07`: (required) commands/start.md exists with `name: start` in frontmatter -- verify by reading the file
- `FN-08`: (required) commands/init.md does not exist -- verify by file absence check
- `FN-09`: (required) plugin.json commands array references `commands/start.md` -- verify by reading plugin.json
- `FN-10`: (required) Zero grep matches for `harness:init` across plugins/ and README.md -- verify by grep

### Cross-cutting checks
- `VD-01`: (required) All edited Markdown files render correctly -- tables, code blocks, headings intact -- verify by visual inspection of changed sections
- `CQ-01`: (required) Diff is minimal and surgical -- no unnecessary rewrites or scope creep beyond the 3 features -- verify by reviewing git diff

## Risks

- **Missed references**: The `/init` to `/start` rename touches multiple files. A stale reference could confuse users or break skill activation. Mitigation: systematic grep sweep after all edits.
- **Over-genericizing evaluator.md**: Removing Playwright references from evaluator.md must not remove the requirement to do runtime verification -- only the tool-specific language. The evaluator must still know to test live behavior for software projects (the domain skill provides the tool-specific guidance).
- **patterns.md schema clarity**: Replacing concrete key names with placeholders in the evaluation JSON schema could make the schema harder to understand for new users. Mitigation: add a comment in the schema noting that the software profile example is in the NN-contract.md template, and that actual keys come from the domain profile.
