---
name: harness:migrate
description: Migrate a project from old harness format to new format.
  Detects old-format artifacts/ directory and renames to .harness/ with updated filenames and feature IDs.
allowed_tools: ["Bash", "Read", "Write", "Glob"]
---

# /harness:migrate

Migrate a project from old harness format to new format.

## What it does

1. Check if `artifacts/` directory exists (old format).
2. If yes, rename to `.harness/`:
   ```bash
   mv artifacts/ .harness/
   ```
3. Rename files inside `.harness/`:
   - `feature-list.json` → `features.json`
   - `run-state.json` → `state.json`
4. Update feature IDs from `feature-XXX` to `F-XXX` format in `features.json` if needed:
   - Read `features.json`, find any `"id": "feature-NNN"` entries
   - Replace with `"id": "F-NNN"` (zero-pad to 3 digits)
   - Write updated file back
5. Print: "Migration complete. Old `artifacts/` renamed to `.harness/`."
6. If `.harness/` already exists and `artifacts/` does not: "Already in new format. Nothing to migrate."
7. If neither exists: "No harness data found. Run /harness:init to start."
