# Changelog

## v0.5.0 (2026-04-02)
- **fix**: Codex review detection rewritten as mandatory pre-flight with sequential steps
- **fix**: Expanded sprint artifact enforcement from 3 to 5 required artifacts
- **feat**: Codex detection enforcement in coordinator (flags process violations)
- **feat**: Context freshness trace logging in progress.md
- **feat**: Runtime verification requirement for software projects (prevents build-only evaluation)
- **fix**: Strengthened releaser invocation in coordinator (mandatory when all features pass)

## v0.4.0 (2026-04-02)
- **feat**: Restructured for Claude Code marketplace (nested plugins/harness/ pattern)
- **fix**: hooks.json format changed from array to record for Claude Code compatibility
- **feat**: Created harness-sdlc domain skill with 6 sections (methodology, testing, build/runtime, evaluation, checklists)

## v0.3.0 (2026-04-02)
- **feat**: Codex review toggle (auto/on/off in config.json)
- **feat**: Cross-domain profiles with BA foundation (7 profiles)
- **feat**: Feature dependencies (depends_on field)
- **feat**: Configurable context reset threshold
- **feat**: Cost tracking timestamps
- **feat**: GAN pattern documentation
- **feat**: Cross-platform init (sh + bat)
- **feat**: Subjective quality grading framework (rubric anchors, drift detection)
- **feat**: Sprint retrospective & learning loop
- **feat**: Feature maturity levels (draft/functional/reviewed/polished/accepted)
- **feat**: Harness configuration file (config.json)

## v0.2.0 (2026-04-02)
- **refactor**: Consolidated 9 agents to 6 (tester/reviewer/architect absorbed into evaluator)
- **fix**: Renamed command files from harness:X.md to X.md (fixed NTFS colon issue)
- **remove**: Migration command (pre-release, not needed)
- **refactor**: Simplified coordinator to 2-agent loop (generator + evaluator)

## v0.1.0 (2026-04-01)
- Initial harness plugin with 9 agents, 4 commands
- GAN-like generator/evaluator pattern
- Sprint contracts with quantified 0-5 grading
- Auto-commit protocol
- Release & versioning support
