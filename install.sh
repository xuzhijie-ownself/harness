#!/usr/bin/env bash
# Install Harness for Codex CLI and Copilot CLI.
# Claude Code users: use marketplace instead (claude plugin install harness@harness)
#
# Usage:
#   bash plugins/harness/install.sh              # install
#   bash plugins/harness/install.sh --uninstall  # remove
#
# What this does:
#   Copies runtime manifests from the cloned repo to the project root
#   so Codex CLI and Copilot CLI can auto-detect them.

set -e

PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$PLUGIN_DIR/../.." && pwd)"

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
  echo "[OK] Uninstalled. The plugins/harness/ directory is unchanged."
  echo "     To fully remove: rm -rf plugins/harness"
  exit 0
fi

# ── Install ──────────────────────────────────────────────────────────
echo "Harness -- Install for Codex CLI / Copilot CLI"
echo "  Source : $PLUGIN_DIR"
echo "  Project: $PROJECT_ROOT"
echo ""

# Codex CLI manifest
mkdir -p "$PROJECT_ROOT/.codex-plugin"
cp "$PLUGIN_DIR/.codex-plugin/plugin.json" "$PROJECT_ROOT/.codex-plugin/plugin.json"
echo "  [OK] Codex    -> .codex-plugin/plugin.json"

# Copilot CLI instructions
mkdir -p "$PROJECT_ROOT/.github"
cp "$PLUGIN_DIR/.github/copilot-instructions.md" "$PROJECT_ROOT/.github/copilot-instructions.md"
echo "  [OK] Copilot  -> .github/copilot-instructions.md"

echo ""
echo "[OK] Installed."
echo ""
echo "  Codex CLI:   codex   (auto-detects .codex-plugin/plugin.json)"
echo "  Copilot CLI: copilot (auto-reads .github/copilot-instructions.md)"
echo ""
echo "  Claude Code users: use marketplace instead"
echo "    claude plugin install harness@harness"
