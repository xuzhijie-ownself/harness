@echo off
setlocal

:: Install Harness for Codex CLI and Copilot CLI.
:: Claude Code users: use marketplace instead (claude plugin install harness@harness)
::
:: Usage:
::   cd your-project
::   plugins\harness\install.bat              install
::   plugins\harness\install.bat --uninstall  remove
::
:: The script uses your current working directory as the project root.

set "PLUGIN_DIR=%~dp0"
set "PLUGIN_DIR=%PLUGIN_DIR:~0,-1%"
set "PROJECT_ROOT=%CD%"

:: Calculate relative path from project root to this repo clone (uses node)
for /f "tokens=*" %%r in ('node -e "console.log(require('path').relative('%PROJECT_ROOT%','%PLUGIN_DIR%').replace(/\\/g,'/'))"') do set "REL_PATH=%%r"
if "%REL_PATH%"=="" set "REL_PATH=plugins/harness"

:: Read version from source manifest
for /f "tokens=*" %%v in ('node -e "console.log(JSON.parse(require('fs').readFileSync('%PLUGIN_DIR:\=/%/.codex-plugin/plugin.json','utf8')).version)"') do set "VERSION=%%v"
if "%VERSION%"=="" set "VERSION=0.0.0"

:: ── Uninstall ──────────────────────────────────────────────────────
if "%~1"=="--uninstall" (
    echo Harness -- Uninstall ^(Codex/Copilot^)
    echo   Project: %PROJECT_ROOT%
    echo.

    if exist "%PROJECT_ROOT%\.codex-plugin" rmdir /S /Q "%PROJECT_ROOT%\.codex-plugin"
    echo   [OK] Removed .codex-plugin\

    del /Q "%PROJECT_ROOT%\.github\copilot-instructions.md" 2>nul
    echo   [OK] Removed .github\copilot-instructions.md

    echo.
    echo [OK] Uninstalled.
    goto :eof
)

:: ── Install ────────────────────────────────────────────────────────
echo Harness -- Install for Codex CLI / Copilot CLI
echo   Source : %PLUGIN_DIR%
echo   Project: %PROJECT_ROOT%
echo   RelPath: %REL_PATH%
echo.

:: Generate .codex-plugin/plugin.json with corrected skills paths
if not exist "%PROJECT_ROOT%\.codex-plugin" mkdir "%PROJECT_ROOT%\.codex-plugin"
node -e "const fs=require('fs');const j={name:'harness',version:'%VERSION%',skills:['./%REL_PATH%/plugins/harness/skills/','./%REL_PATH%/plugins/harness-sdlc-suite/skills/']};fs.writeFileSync('%PROJECT_ROOT:\=/%/.codex-plugin/plugin.json',JSON.stringify(j,null,2));"
echo   [OK] Codex    -^> .codex-plugin\plugin.json

:: Generate .github/copilot-instructions.md with corrected file references
if not exist "%PROJECT_ROOT%\.github" mkdir "%PROJECT_ROOT%\.github"
node -e "const fs=require('fs');const src=fs.readFileSync('%PLUGIN_DIR:\=/%/.github/copilot-instructions.md','utf8');const out=src.replace(/plugins\/harness\//g,'%REL_PATH%/plugins/harness/').replace(/plugins\/harness-sdlc-suite\//g,'%REL_PATH%/plugins/harness-sdlc-suite/');fs.writeFileSync('%PROJECT_ROOT:\=/%/.github/copilot-instructions.md',out);"
echo   [OK] Copilot  -^> .github\copilot-instructions.md

echo.
echo [OK] Installed.
echo.
echo   Codex CLI:   codex   ^(auto-detects .codex-plugin\plugin.json^)
echo   Copilot CLI: copilot ^(auto-reads .github\copilot-instructions.md^)
echo.
echo   Claude Code users: use marketplace instead
echo     claude plugin install harness@harness

endlocal
