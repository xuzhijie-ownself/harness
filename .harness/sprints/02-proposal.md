# Sprint Proposal

## Metadata
- Role: generator
- Agent: coordinator-as-generator
- Inputs: .harness/spec.md, .harness/features.json, 01-eval.json
- Status: in_review

## Target feature IDs
- F-059

## Goal
Release v2.3.0 bundling core fixes (F-045 through F-049), sales suite (F-050 through F-056), audit skill and slim command (F-057, F-058), and sales suite registration (F-060).

## Deliverables

### release.json
- Add new entry for v2.3.0 with date, features_shipped (F-045 through F-060), sprint_count
- Update current_version to "2.3.0"
- Set next_version to "2.3.1"
- Set previous_version to "2.2.9"

### CHANGELOG.md
- Add [2.3.0] section at the top with subsections for:
  - Core Fixes (F-045..F-049) -- from prior cycles
  - Sales Suite (F-050..F-056) -- domain skills build + quality audit
  - Audit Skill (F-057, F-058) -- reference skill + postmortem slim
  - Runtime Registration (F-060) -- sales suite across all runtimes
  - Stats (sprint count, required features count)

### Plugin manifest version sync
- `plugins/harness/.claude-plugin/plugin.json` -- bump to 2.3.0
- `plugins/harness-sdlc-suite/.claude-plugin/plugin.json` -- bump to 2.3.0
- `plugins/harness-sales-suite/.claude-plugin/plugin.json` -- bump to 2.3.0
- `.claude-plugin/marketplace.json` -- bump all 3 plugin versions to 2.3.0
- `.codex-plugin/plugin.json` -- bump version to 2.3.0

### README.md
- Verify architecture section shows 3 plugins (already present)
- No other changes needed -- architecture section already current

### Git tag
- Create v2.3.0 tag

## Verification
- `PD-01` (required): release.json current_version is "2.3.0" with features F-045 through F-060
- `FN-01` (required): CHANGELOG.md has [2.3.0] section with all feature groups
- `FN-02` (required): All 5 manifests show version 2.3.0
- `VD-01` (required): CHANGELOG format matches existing entries
- `CQ-01` (required): Git tag v2.3.0 exists, README architecture section shows 3 plugins

## Acceptance criteria
- Product depth: release entry comprehensive with all feature groups documented
- Functionality: all manifests synced, tag created, changelog complete
- Visual design: CHANGELOG formatting consistent with prior entries
- Code quality: valid JSON throughout, no version mismatches

## Risks
- Need to correctly identify which features shipped in the F-045 through F-049 range from prior cycles (these were part of earlier releases, need to verify)
