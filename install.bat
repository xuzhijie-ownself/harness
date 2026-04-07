@echo off
setlocal

:: Install Harness for Codex CLI and Copilot CLI.
:: Claude Code users: use marketplace instead (claude plugin install harness@harness)
::
:: Usage:
::   plugins\harness\install.bat              install
::   plugins\harness\install.bat --uninstall  remove

set "PLUGIN_DIR=%~dp0"
set "PLUGIN_DIR=%PLUGIN_DIR:~0,-1%"
for %%i in ("%PLUGIN_DIR%\..\..") do set "PROJECT_ROOT=%%~fi"

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
    echo [OK] Uninstalled. The plugins\harness\ directory is unchanged.
    echo     To fully remove: rmdir /S /Q plugins\harness
    goto :eof
)

:: ── Install ────────────────────────────────────────────────────────
echo Harness -- Install for Codex CLI / Copilot CLI
echo   Source : %PLUGIN_DIR%
echo   Project: %PROJECT_ROOT%
echo.

:: Codex CLI manifest
if not exist "%PROJECT_ROOT%\.codex-plugin" mkdir "%PROJECT_ROOT%\.codex-plugin"
copy /Y "%PLUGIN_DIR%\.codex-plugin\plugin.json" "%PROJECT_ROOT%\.codex-plugin\plugin.json" > nul
echo   [OK] Codex    -^> .codex-plugin\plugin.json

:: Copilot CLI instructions
if not exist "%PROJECT_ROOT%\.github" mkdir "%PROJECT_ROOT%\.github"
copy /Y "%PLUGIN_DIR%\.github\copilot-instructions.md" "%PROJECT_ROOT%\.github\copilot-instructions.md" > nul
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
