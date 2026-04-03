# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-4
- Inputs: .harness/spec.md, .harness/features.json, 03-evaluation.json, current README.md
- Status: accepted

## Target feature IDs
- F-007

## Goal
Update README.md to document the two-plugin architecture (core harness + SDLC suite), updated install commands, architecture diagram showing both plugin trees, domain skills table referencing SDLC suite plugin, and a note that core can be used standalone with custom profile.

## Deliverables

Modified `README.md` with:

1. **Architecture overview**: Update intro and description to mention two-plugin architecture (core + SDLC suite)
2. **Install commands**: Update marketplace install to install both plugins; update git clone commands for new repo name (`harness`)
3. **Architecture diagram**: Show both `plugins/harness/` and `plugins/harness-sdlc-suite/` directory trees
4. **Domain Skills table**: Reference SDLC suite plugin as the source of domain skills
5. **Delivery Pipeline**: Keep but note it comes from the SDLC suite
6. **Artifact layout**: Add `plugins/harness-sdlc-suite/` to the layout
7. **Standalone note**: Add note that core harness can be used standalone with `custom` profile
8. **Shared Contract table**: Update to include SDLC suite locations

## Verification
- `grep "harness-sdlc-suite" README.md` returns matches
- `grep "two-plugin\|two plugin" README.md` returns matches
- `grep "standalone\|custom profile" README.md` returns matches
- Architecture diagram shows both plugin directories

## Acceptance criteria
- Product depth: README accurately describes two-plugin architecture
- Functionality: All 6 verification steps from features.json satisfied
- Visual design: Clean markdown, readable tables, clear architecture diagram
- Code quality: No broken links, no outdated references to single-plugin structure

## Contract checks
- `PD-01` (required): README documents two-plugin architecture overview
- `PD-02` (required): README has updated install commands for both plugins
- `FN-01` (required): Architecture diagram shows both plugin directory trees
- `FN-02` (required): Domain Skills table references SDLC suite plugin
- `FN-03` (required): README notes core can be used standalone with custom profile
- `VD-01` (required): Artifact layout shows plugins/harness-sdlc-suite/
- `CQ-01` (required): No references to old single-plugin structure remain

## Risks
- Forgetting to update a reference to the old repo name
- Leaving outdated architecture diagram
