@echo off
setlocal enabledelayedexpansion

:: Install Harness into Claude Code's auto-load directories.
:: Run once from anywhere: plugins\long-running-harness\install.bat
::
:: Options:
::   --uninstall   Remove all harness files from .claude\

set "PLUGIN_DIR=%~dp0"
set "PLUGIN_DIR=%PLUGIN_DIR:~0,-1%"
for %%i in ("%PLUGIN_DIR%\..\..") do set "PROJECT_ROOT=%%~fi"
set "CLAUDE_DIR=%PROJECT_ROOT%\.claude"

:: ── Uninstall ──────────────────────────────────────────────────────
if "%~1"=="--uninstall" (
    echo Harness -- Uninstall
    echo   Project: %PROJECT_ROOT%
    echo.

    :: Commands
    for %%c in (init run session reset release) do (
        del /Q "%CLAUDE_DIR%\commands\%%c.md" 2>nul
    )
    echo   [OK] Removed commands

    :: Agents
    for %%a in (coordinator evaluator generator initializer planner releaser) do (
        del /Q "%CLAUDE_DIR%\agents\%%a.md" 2>nul
    )
    echo   [OK] Removed agents

    :: Skill directory
    if exist "%CLAUDE_DIR%\skills\harness" rmdir /S /Q "%CLAUDE_DIR%\skills\harness"
    echo   [OK] Removed skills\harness\

    echo.
    echo [OK] Uninstalled. Hooks.json left intact (may contain other hooks).
    goto :eof
)

:: ── Install ────────────────────────────────────────────────────────
echo Harness -- Local Install
echo   Plugin : %PLUGIN_DIR%
echo   Project: %PROJECT_ROOT%
echo.

:: Create target directories
if not exist "%CLAUDE_DIR%\commands" mkdir "%CLAUDE_DIR%\commands"
if not exist "%CLAUDE_DIR%\agents" mkdir "%CLAUDE_DIR%\agents"
if not exist "%CLAUDE_DIR%\skills\harness" mkdir "%CLAUDE_DIR%\skills\harness"
if not exist "%CLAUDE_DIR%\skills\harness\roles" mkdir "%CLAUDE_DIR%\skills\harness\roles"
if not exist "%CLAUDE_DIR%\skills\harness\references" mkdir "%CLAUDE_DIR%\skills\harness\references"

:: Commands — simple filenames (init.md, run.md, etc.)
for %%f in ("%PLUGIN_DIR%\plugins\harness\commands\*.md") do copy /Y "%%f" "%CLAUDE_DIR%\commands\" > nul
echo   [OK] Commands    -^> .claude\commands\

:: Agents
copy /Y "%PLUGIN_DIR%\plugins\harness\agents\*.md" "%CLAUDE_DIR%\agents\" > nul
echo   [OK] Agents      -^> .claude\agents\

:: Skill
copy /Y "%PLUGIN_DIR%\plugins\harness\skills\harness\SKILL.md" "%CLAUDE_DIR%\skills\harness\SKILL.md" > nul

:: Roles
copy /Y "%PLUGIN_DIR%\plugins\harness\skills\harness\roles\*.md" "%CLAUDE_DIR%\skills\harness\roles\" > nul

:: References
copy /Y "%PLUGIN_DIR%\plugins\harness\skills\harness\references\*.md" "%CLAUDE_DIR%\skills\harness\references\" > nul
echo   [OK] Skill       -^> .claude\skills\harness\ (+ roles\ + references\)

:: Hooks -- merge if .claude\hooks.json exists, otherwise copy
set "HOOKS_SRC=%PLUGIN_DIR%\plugins\harness\hooks\hooks.json"
set "HOOKS_DST=%CLAUDE_DIR%\hooks.json"

if exist "%HOOKS_DST%" (
    node -e "const fs=require('fs');const src=JSON.parse(fs.readFileSync('%HOOKS_SRC:\=\\%','utf8'));const dst=JSON.parse(fs.readFileSync('%HOOKS_DST:\=\\%','utf8'));const existing=new Set((dst.hooks||[]).map(h=>h.command));const merged={hooks:[...(dst.hooks||[]),...src.hooks.filter(h=>!existing.has(h.command))]};fs.writeFileSync('%HOOKS_DST:\=\\%',JSON.stringify(merged,null,2));"
    echo   [OK] Hooks       -^> merged into existing .claude\hooks.json
) else (
    copy /Y "%HOOKS_SRC%" "%HOOKS_DST%" > nul
    echo   [OK] Hooks       -^> .claude\hooks.json
)

echo.
echo [OK] Installed. Available immediately -- no restart needed.
echo.
echo   /harness:init       scaffold harness for a new project
echo   /harness:session    run one supervised sprint round
echo   /harness:run        continuous mode (unattended)
echo   /harness:reset      checkpoint + handoff when context fills
echo.
endlocal
