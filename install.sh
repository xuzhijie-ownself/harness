#!/usr/bin/env bash
# Install Long-Running Harness into Claude Code's auto-load directories.
# Run once from anywhere: bash plugins/long-running-harness/install.sh

set -e

PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$PLUGIN_DIR/../.." && pwd)"
CLAUDE_DIR="$PROJECT_ROOT/.claude"

echo "Long-Running Harness — Local Install"
echo "  Plugin : $PLUGIN_DIR"
echo "  Project: $PROJECT_ROOT"
echo ""

# Create target directories
mkdir -p "$CLAUDE_DIR/commands" "$CLAUDE_DIR/agents" "$CLAUDE_DIR/skills/long-running-harness"

# Commands
cp "$PLUGIN_DIR/commands/"*.md "$CLAUDE_DIR/commands/"
echo "  ✓ Commands  → .claude/commands/"

# Agents
cp "$PLUGIN_DIR/agents/"*.md "$CLAUDE_DIR/agents/"
echo "  ✓ Agents    → .claude/agents/"

# Skill
cp "$PLUGIN_DIR/skills/long-running-harness/SKILL.md" \
   "$CLAUDE_DIR/skills/long-running-harness/SKILL.md"
# Roles + References (shared source of truth for all agents)
mkdir -p "$CLAUDE_DIR/skills/long-running-harness/roles" \
         "$CLAUDE_DIR/skills/long-running-harness/references"
cp "$PLUGIN_DIR/skills/long-running-harness/roles/"*.md \
   "$CLAUDE_DIR/skills/long-running-harness/roles/"
cp "$PLUGIN_DIR/skills/long-running-harness/references/"*.md \
   "$CLAUDE_DIR/skills/long-running-harness/references/"
echo "  ✓ Skill     → .claude/skills/long-running-harness/ (+ roles/ + references/)"

# Hooks — merge if .claude/hooks.json already exists, otherwise copy
HOOKS_SRC="$PLUGIN_DIR/hooks/hooks.json"
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
  echo "  ✓ Hooks     → merged into existing .claude/hooks.json"
else
  cp "$HOOKS_SRC" "$HOOKS_DST"
  echo "  ✓ Hooks     → .claude/hooks.json"
fi

echo ""
echo "✓ Installed. Available immediately — no restart needed."
echo ""
echo "  /init     scaffold harness for a new project"
echo "  /session  run one supervised sprint round"
echo "  /run      continuous mode (unattended)"
echo "  /reset    checkpoint + handoff when context fills"
