#!/usr/bin/env bash
# Install Harness for Codex CLI and Copilot CLI.
# Marketplace users: use marketplace instead (e.g. claude plugin install harness@harness)
#
# Usage:
#   cd your-project
#   bash plugins/harness/install.sh [core|sdlc|sales|all]   # install (default: all)
#   bash plugins/harness/install.sh --uninstall [sdlc|sales|all]  # remove suite(s)
#
# The script uses your current working directory as the project root.

set -e

PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(pwd)"
STATE_FILE="$PROJECT_ROOT/.harness-installed"

# Calculate relative path from project root to this repo clone
REL_PATH="$(python3 -c "import os; print(os.path.relpath('$PLUGIN_DIR', '$PROJECT_ROOT'))" 2>/dev/null || echo "plugins/harness")"

# Read version from source manifest
VERSION="$(node -e "console.log(JSON.parse(require('fs').readFileSync('$PLUGIN_DIR/.codex-plugin/plugin.json','utf8')).version)" 2>/dev/null || echo "0.0.0")"

# ── Helpers ─────────────────────────────────────────────────────────

read_state() {
  if [ -f "$STATE_FILE" ]; then
    cat "$STATE_FILE"
  fi
}

write_state() {
  # Atomic write: write to tmp then move
  local tmp="$STATE_FILE.tmp"
  printf "%s\n" "$@" > "$tmp"
  mv "$tmp" "$STATE_FILE"
}

has_suite() {
  local suite="$1"
  read_state | grep -qx "$suite" 2>/dev/null
}

add_suite() {
  local suite="$1"
  if ! has_suite "$suite"; then
    local current
    current="$(read_state)"
    if [ -z "$current" ]; then
      write_state "$suite"
    else
      write_state $current "$suite"
    fi
  fi
}

remove_suite() {
  local suite="$1"
  local current
  current="$(read_state)"
  local remaining=()
  while IFS= read -r line; do
    if [ "$line" != "$suite" ] && [ -n "$line" ]; then
      remaining+=("$line")
    fi
  done <<< "$current"
  if [ ${#remaining[@]} -eq 0 ]; then
    write_state "core"
  else
    write_state "${remaining[@]}"
  fi
}

generate_manifests() {
  local installed
  installed="$(read_state)"

  # Build skills paths array for plugin.json
  local skills_json="./$REL_PATH/plugins/harness/skills/"
  local skills_array="[\"$skills_json\""

  if echo "$installed" | grep -qx "sdlc"; then
    skills_array="$skills_array, \"./$REL_PATH/plugins/harness-sdlc-suite/skills/\""
  fi
  if echo "$installed" | grep -qx "sales"; then
    skills_array="$skills_array, \"./$REL_PATH/plugins/harness-sales-suite/skills/\""
  fi
  skills_array="$skills_array]"

  # Generate .codex-plugin/plugin.json
  mkdir -p "$PROJECT_ROOT/.codex-plugin"
  cat > "$PROJECT_ROOT/.codex-plugin/plugin.json" << EOF
{
  "name": "harness",
  "version": "$VERSION",
  "skills": $skills_array
}
EOF
  echo "  [OK] Codex    -> .codex-plugin/plugin.json"

  # Generate .github/copilot-instructions.md with corrected file references
  mkdir -p "$PROJECT_ROOT/.github"
  local sed_expr="s|plugins/harness/|$REL_PATH/plugins/harness/|g"
  if echo "$installed" | grep -qx "sdlc"; then
    sed_expr="$sed_expr; s|plugins/harness-sdlc-suite/|$REL_PATH/plugins/harness-sdlc-suite/|g"
  fi
  if echo "$installed" | grep -qx "sales"; then
    sed_expr="$sed_expr; s|plugins/harness-sales-suite/|$REL_PATH/plugins/harness-sales-suite/|g"
  fi

  # Start with the base template and filter sections based on installed suites
  local src="$PLUGIN_DIR/.github/copilot-instructions.md"
  local content
  content="$(cat "$src")"

  # If sdlc is not installed, remove SDLC suite section lines
  if ! echo "$installed" | grep -qx "sdlc"; then
    content="$(echo "$content" | grep -v "harness-sdlc-suite")"
  fi
  # If sales is not installed, remove Sales suite section lines
  if ! echo "$installed" | grep -qx "sales"; then
    content="$(echo "$content" | grep -v "harness-sales-suite")"
  fi

  # Apply path rewrites
  echo "$content" | sed "$sed_expr" > "$PROJECT_ROOT/.github/copilot-instructions.md"
  echo "  [OK] Copilot  -> .github/copilot-instructions.md"
}

# ── Uninstall ────────────────────────────────────────────────────────
if [ "${1:-}" = "--uninstall" ]; then
  TARGET="${2:-all}"

  if [ "$TARGET" = "core" ]; then
    echo "Error: cannot uninstall core separately. Use '--uninstall all' to remove everything."
    exit 1
  fi

  echo "Harness -- Uninstall suite: $TARGET"
  echo "  Project: $PROJECT_ROOT"
  echo ""

  if [ "$TARGET" = "all" ]; then
    rm -rf "$PROJECT_ROOT/.codex-plugin" 2>/dev/null || true
    echo "  [OK] Removed .codex-plugin/"
    rm -f "$PROJECT_ROOT/.github/copilot-instructions.md" 2>/dev/null || true
    echo "  [OK] Removed .github/copilot-instructions.md"
    rm -f "$STATE_FILE" 2>/dev/null || true
    echo "  [OK] Removed .harness-installed"
    echo ""
    echo "[OK] Fully uninstalled."
  else
    if ! has_suite "$TARGET"; then
      echo "  Suite '$TARGET' is not installed. Nothing to do."
      exit 0
    fi
    remove_suite "$TARGET"
    echo "  [OK] Removed '$TARGET' from .harness-installed"
    generate_manifests
    echo ""
    echo "[OK] Uninstalled '$TARGET'. Manifests regenerated."
  fi
  exit 0
fi

# ── Install ──────────────────────────────────────────────────────────
TARGET="${1:-all}"

# Validate argument
case "$TARGET" in
  core|sdlc|sales|all) ;;
  *)
    echo "Error: unknown argument '$TARGET'. Use: core, sdlc, sales, or all."
    exit 1
    ;;
esac

echo "Harness -- Install for Codex CLI / Copilot CLI"
echo "  Source : $PLUGIN_DIR"
echo "  Project: $PROJECT_ROOT"
echo "  RelPath: $REL_PATH"
echo "  Suite  : $TARGET"
echo ""

# Ensure core is always in state
add_suite "core"

case "$TARGET" in
  core)
    # core only -- already added above
    ;;
  sdlc)
    add_suite "sdlc"
    ;;
  sales)
    add_suite "sales"
    ;;
  all)
    add_suite "sdlc"
    add_suite "sales"
    ;;
esac

echo "  [OK] State    -> .harness-installed ($(read_state | tr '\n' ' ' | sed 's/ $//'))"

generate_manifests

echo ""
echo "[OK] Installed."
echo ""
echo "  Codex CLI:   codex   (auto-detects .codex-plugin/plugin.json)"
echo "  Copilot CLI: copilot (auto-reads .github/copilot-instructions.md)"
echo ""
echo "  Marketplace users: use marketplace install instead"
