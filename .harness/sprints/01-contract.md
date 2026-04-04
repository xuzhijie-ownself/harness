# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/spec.md, .harness/features.json, plugins/harness/skills/harness/roles/evaluator.md
- Status: in_review

## Target feature IDs
- F-011
- F-012

## Grouping waiver

F-011 is a single-file, single-paragraph edit to evaluator.md. It adds an explicit "codex reviews all changes including documentation" clause and narrows the skip condition to zero changed files. Splitting it into its own sprint would consume a full contract/implement/evaluate cycle for a change that takes fewer than 5 lines. F-012 is the main deliverable. Grouping them reduces total round count without hiding risk -- the two features touch completely different files and cannot conflict.

## Goal

Deliver two things in one round: (1) close the evaluator codex documentation-only escape hatch so that codex adversarial review runs on all changes regardless of file type, and (2) build the harness-companion.mjs entry point with all five lib modules and seven subcommands, giving harness agents a script interface for mechanical state management tasks.

## Deliverables

### F-011: Evaluator codex scope fix
- **File**: `plugins/harness/skills/harness/roles/evaluator.md`
- Add an explicit rule in the "Code Review Pre-Flight" section stating that codex review applies to ALL changed files, including documentation-only changes (Markdown, role files, references).
- The only valid condition for skipping the code review pre-flight entirely is when `git diff HEAD~1 --name-only` returns zero files.
- No new skip conditions introduced.

### F-012: harness-companion.mjs and lib modules
- **Entry point**: `plugins/harness/scripts/harness-companion.mjs` (~50 lines)
  - Parses `process.argv` for subcommand + flags
  - Top-level try/catch with exit code mapping (0 success, 1 user error, 2 system error)
  - JSON to stdout, human-readable errors to stderr
  - `--help` flag prints subcommand list
- **Lib modules** under `plugins/harness/scripts/lib/`:
  - `state.mjs` (~50 lines): readState(), writeState() with atomic JSON writes (write-to-temp, rename), setPhase(), incrementRound(), appendCost()
  - `features.mjs` (~40 lines): selectNextFeature() with dependency resolution via depends_on, checkStop() for stop-condition evaluation
  - `git.mjs` (~30 lines): autoCommit() using child_process.execSync, structured commit messages from config.json conventions
  - `artifacts.mjs` (~30 lines): validateArtifacts() checking .harness/sprints/ file existence, cleanupSprints() for old round cleanup
  - `progress.mjs` (~30 lines): appendProgress() for structured Markdown append to progress.md
- **Subcommands dispatched by entry point**:
  - `feature-select` -- pick next eligible feature (highest priority, passes=false, dependencies met)
  - `state-mutate --set-phase <phase>` / `--increment-round` / `--append-cost <json>`
  - `auto-commit --feature <id> --title <text> --round <n> --status <pass|fail>`
  - `validate-artifacts --round <n>`
  - `progress-append --round <n> --feature <id> --status <pass|fail> --scores <json>`
  - `check-stop` -- all required features pass? failure streak exceeded?
  - `cleanup-sprints --before-round <n>`
- **Constraints**: Zero npm dependencies. Node.js built-ins only (fs, path, child_process, url). No package.json. ES module syntax (.mjs).

## Verification

### F-011 verification
1. Open `plugins/harness/skills/harness/roles/evaluator.md` and confirm the documentation-only exemption text is absent.
2. Confirm an explicit statement exists that codex review covers all changes including documentation.
3. Confirm the only valid skip condition is zero changed files from `git diff HEAD~1 --name-only`.
4. Grep evaluator.md for any other skip/exempt/N-A patterns -- none should exist for the code review pre-flight.

### F-012 verification
1. Run `node plugins/harness/scripts/harness-companion.mjs --help` and confirm it lists all seven subcommands.
2. Run `node plugins/harness/scripts/harness-companion.mjs feature-select` against the project's `.harness/features.json` and `.harness/state.json` -- confirm valid JSON output to stdout naming F-011 or F-012 (the highest-priority eligible features).
3. Run `node plugins/harness/scripts/harness-companion.mjs unknown-cmd` and confirm exit code 1 with error to stderr.
4. Verify all five lib files exist: `ls plugins/harness/scripts/lib/{state,features,git,artifacts,progress}.mjs`.
5. Verify no `import` statements reference anything outside Node.js built-ins or local ./lib/ paths.
6. Verify atomic write pattern: grep for `writeFileSync` followed by `renameSync` in state.mjs.
7. Verify JSON to stdout: run `node plugins/harness/scripts/harness-companion.mjs check-stop 2>/dev/null | node -e "JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'))"` -- should parse without error.

## Acceptance criteria

- **Product depth**: The companion script covers all seven subcommands with meaningful implementations, not stubs. Feature selection resolves depends_on. State mutation is atomic. Progress append produces well-formed Markdown.
- **Functionality**: Every subcommand executes without error when given valid inputs and returns structured JSON to stdout. Invalid inputs produce exit code 1 with a human-readable stderr message. The evaluator.md fix correctly closes the documentation exemption loophole.
- **Visual design** (documentation clarity): The `--help` output clearly lists all subcommands with one-line descriptions. Stderr error messages identify the problem and suggest correct usage. The evaluator.md edit reads naturally within the existing document structure.
- **Code quality**: ES module conventions, consistent error handling pattern across all lib modules, atomic writes for state mutation, no npm dependencies, clean separation between entry point dispatch and lib module logic.

## Contract checks

- `PD-01` (required): All seven subcommands are implemented (not stubbed) and produce correct output for their documented purpose.
- `PD-02` (required): feature-select correctly resolves depends_on -- a feature whose dependency has passes=false is not selected.
- `FN-01` (required): `harness-companion.mjs --help` lists all seven subcommands and exits 0.
- `FN-02` (required): `harness-companion.mjs feature-select` emits valid JSON to stdout with the correct next feature.
- `FN-03` (required): Invalid subcommand produces exit code 1 with stderr message.
- `FN-04` (required): evaluator.md no longer contains a documentation-only codex exemption and explicitly requires codex review on all changes.
- `VD-01` (required): `--help` output and stderr messages are clear, correctly formatted, and actionable.
- `CQ-01` (required): Zero npm dependencies -- only Node.js built-in imports (fs, path, child_process, url, os).
- `CQ-02` (required): state.mjs uses write-to-temp-then-rename for all JSON writes.

## Risks

- **Evaluator.md exemption may not exist as explicit text**: The current evaluator.md does not contain a visible "documentation-only" exemption clause. The risk is that the exemption is implicit (agents infer they can skip codex for doc-only changes because no rule forbids it). The fix is to add an explicit "codex reviews all changes" statement rather than removing text. The verification checks for the presence of the positive statement, not the absence of specific wording.
- **Subcommand scope creep**: Seven subcommands in one sprint is at the upper bound. Mitigation: the spec already scopes total code to approximately 250 lines, and each subcommand delegates to a focused lib function. If any subcommand proves unexpectedly complex, the simplification policy from spec.md applies (split into core and secondary subcommands).
- **Atomic write portability**: fs.renameSync is atomic on POSIX but has edge cases on Windows across drives. Mitigation: harness scripts run in the project directory, so temp file and target are always on the same filesystem.
