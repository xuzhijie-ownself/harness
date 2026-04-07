#!/usr/bin/env bash
# Install Harness for Codex CLI and Copilot CLI.
# Claude Code users: use marketplace instead (claude plugin install harness@harness)
#
# Usage:
#   cd your-project
#   bash plugins/harness/install.sh              # install
#   bash plugins/harness/install.sh --uninstall  # remove
#
# The script uses your current working directory as the project root.

set -e

PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(pwd)"

# Calculate relative path from project root to this repo clone
REL_PATH="$(python3 -c "import os; print(os.path.relpath('$PLUGIN_DIR', '$PROJECT_ROOT'))" 2>/dev/null || echo "plugins/harness")"

# Read version from source manifest
VERSION="$(node -e "console.log(JSON.parse(require('fs').readFileSync('$PLUGIN_DIR/.codex-plugin/plugin.json','utf8')).version)" 2>/dev/null || echo "0.0.0")"

# ── Uninstall ────────────────────────────────────────────────────────
if [ "${1:-}" = "--uninstall" ]; then
  echo "Harness -- Uninstall (Codex/Copilot)"
  echo "  Project: $PROJECT_ROOT"
  echo ""

  rm -rf "$PROJECT_ROOT/.codex-plugin" 2>/dev/null || true
  echo "  [OK] Removed .codex-plugin/"

  rm -f "$PROJECT_ROOT/.github/copilot-instructions.md" 2>/dev/null || true
  echo "  [OK] Removed .github/copilot-instructions.md"

  echo ""
  echo "[OK] Uninstalled."
  exit 0
fi

# ── Install ──────────────────────────────────────────────────────────
echo "Harness -- Install for Codex CLI / Copilot CLI"
echo "  Source : $PLUGIN_DIR"
echo "  Project: $PROJECT_ROOT"
echo "  RelPath: $REL_PATH"
echo ""

# Generate .codex-plugin/plugin.json with corrected skills paths
mkdir -p "$PROJECT_ROOT/.codex-plugin"
cat > "$PROJECT_ROOT/.codex-plugin/plugin.json" << EOF
{
  "name": "harness",
  "version": "$VERSION",
  "skills": [
    "./$REL_PATH/plugins/harness/skills/",
    "./$REL_PATH/plugins/harness-sdlc-suite/skills/"
  ]
}
EOF
echo "  [OK] Codex    -> .codex-plugin/plugin.json"

# Generate .github/copilot-instructions.md with corrected file references
mkdir -p "$PROJECT_ROOT/.github"
sed "s|plugins/harness/|$REL_PATH/plugins/harness/|g; s|plugins/harness-sdlc-suite/|$REL_PATH/plugins/harness-sdlc-suite/|g" \
  "$PLUGIN_DIR/.github/copilot-instructions.md" > "$PROJECT_ROOT/.github/copilot-instructions.md"
echo "  [OK] Copilot  -> .github/copilot-instructions.md"

echo ""
echo "[OK] Installed."
echo ""
echo "  Codex CLI:   codex   (auto-detects .codex-plugin/plugin.json)"
echo "  Copilot CLI: copilot (auto-reads .github/copilot-instructions.md)"
echo ""
echo "  Claude Code users: use marketplace instead"
echo "    claude plugin install harness@harness"
