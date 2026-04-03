#!/usr/bin/env bash
# Install Harness into Claude Code's auto-load directories.
# Run once from anywhere: bash install.sh
#
# Options:
#   --uninstall   Remove all harness files from .claude/

set -e

PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$PLUGIN_DIR/../.." && pwd)"
CLAUDE_DIR="$PROJECT_ROOT/.claude"

# Domain skill names from harness-sdlc-suite
SUITE_SKILLS=(harness-sdlc-suite harness-sdlc harness-ea harness-ba harness-sa harness-ops)

# ── Uninstall ────────────────────────────────────────────────────────
if [ "${1:-}" = "--uninstall" ]; then
  echo "Harness -- Uninstall"
  echo "  Project: $PROJECT_ROOT"
  echo ""

  # Commands
  for cmd in init run session reset release; do
    rm -f "$CLAUDE_DIR/commands/${cmd}.md" 2>/dev/null || true
  done
  echo "  [OK] Removed commands"

  # Agents
  for agent in coordinator evaluator generator initializer planner releaser; do
    rm -f "$CLAUDE_DIR/agents/${agent}.md" 2>/dev/null || true
  done
  echo "  [OK] Removed agents"

  # Core skill directory
  rm -rf "$CLAUDE_DIR/skills/harness"
  echo "  [OK] Removed skills/harness/"

  # Domain skill directories from harness-sdlc-suite
  for skill in "${SUITE_SKILLS[@]}"; do
    rm -rf "$CLAUDE_DIR/skills/$skill"
  done
  echo "  [OK] Removed SDLC suite skills (${SUITE_SKILLS[*]})"

  # Note: hooks.json is NOT removed -- it may contain non-harness hooks.
  echo ""
  echo "[OK] Uninstalled. Hooks.json left intact (may contain other hooks)."
  exit 0
fi

# ── Install ──────────────────────────────────────────────────────────
echo "Harness -- Local Install"
echo "  Plugin : $PLUGIN_DIR"
echo "  Project: $PROJECT_ROOT"
echo ""

# Create target directories for core skill
mkdir -p "$CLAUDE_DIR/commands" \
         "$CLAUDE_DIR/agents" \
         "$CLAUDE_DIR/skills/harness" \
         "$CLAUDE_DIR/skills/harness/roles" \
         "$CLAUDE_DIR/skills/harness/references"

# Commands -- simple filenames (init.md, run.md, etc.)
for f in "$PLUGIN_DIR/plugins/harness/commands/"*.md; do
  [ -f "$f" ] || continue
  cp "$f" "$CLAUDE_DIR/commands/"
done
echo "  [OK] Commands    -> .claude/commands/"

# Agents
cp "$PLUGIN_DIR/plugins/harness/agents/"*.md "$CLAUDE_DIR/agents/"
echo "  [OK] Agents      -> .claude/agents/"

# Core skill -- SKILL.md
cp "$PLUGIN_DIR/plugins/harness/skills/harness/SKILL.md" \
   "$CLAUDE_DIR/skills/harness/SKILL.md"

# Roles
cp "$PLUGIN_DIR/plugins/harness/skills/harness/roles/"*.md \
   "$CLAUDE_DIR/skills/harness/roles/"

# References
cp "$PLUGIN_DIR/plugins/harness/skills/harness/references/"*.md \
   "$CLAUDE_DIR/skills/harness/references/"
echo "  [OK] Core skill  -> .claude/skills/harness/ (+ roles/ + references/)"

# Domain skills from harness-sdlc-suite
SUITE_DIR="$PLUGIN_DIR/plugins/harness-sdlc-suite/skills"
if [ -d "$SUITE_DIR" ]; then
  for skill in "${SUITE_SKILLS[@]}"; do
    skill_src="$SUITE_DIR/$skill"
    if [ -d "$skill_src" ]; then
      mkdir -p "$CLAUDE_DIR/skills/$skill"
      cp "$skill_src/"*.md "$CLAUDE_DIR/skills/$skill/" 2>/dev/null || true
      # Copy subdirectories if they exist (e.g., roles/, references/)
      for subdir in "$skill_src"/*/; do
        if [ -d "$subdir" ]; then
          subname="$(basename "$subdir")"
          mkdir -p "$CLAUDE_DIR/skills/$skill/$subname"
          cp "$subdir"*.md "$CLAUDE_DIR/skills/$skill/$subname/" 2>/dev/null || true
        fi
      done
    fi
  done
  echo "  [OK] SDLC suite  -> .claude/skills/ (${SUITE_SKILLS[*]})"
else
  echo "  [--] SDLC suite not found at $SUITE_DIR (skipped)"
fi

# Hooks -- merge if .claude/hooks.json already exists, otherwise copy
HOOKS_SRC="$PLUGIN_DIR/plugins/harness/hooks/hooks.json"
HOOKS_DST="$CLAUDE_DIR/hooks.json"

if [ -f "$HOOKS_DST" ]; then
  node -e "
    const fs = require('fs'), path = require('path');
    const srcPath = path.resolve(process.argv[1]);
    const dstPath = path.resolve(process.argv[2]);
    const src = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
    const dst = JSON.parse(fs.readFileSync(dstPath, 'utf8'));
    const existing = new Set((dst.hooks || []).map(h => h.command));
    const merged = { hooks: [...(dst.hooks || []), ...src.hooks.filter(h => !existing.has(h.command))] };
    fs.writeFileSync(dstPath, JSON.stringify(merged, null, 2));
  " "$HOOKS_SRC" "$HOOKS_DST"
  echo "  [OK] Hooks       -> merged into existing .claude/hooks.json"
else
  cp "$HOOKS_SRC" "$HOOKS_DST"
  echo "  [OK] Hooks       -> .claude/hooks.json"
fi

echo ""
echo "[OK] Installed. Available immediately -- no restart needed."
echo ""
echo "  /harness:init       scaffold harness for a new project"
echo "  /harness:session    run one supervised sprint round"
echo "  /harness:run        continuous mode (unattended)"
echo "  /harness:reset      checkpoint + handoff when context fills"
