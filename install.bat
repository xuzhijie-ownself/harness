@echo off
setlocal enabledelayedexpansion

:: Install Long-Running Harness into Claude Code's auto-load directories.
:: Run once from anywhere: plugins\long-running-harness\install.bat

set "PLUGIN_DIR=%~dp0"
set "PLUGIN_DIR=%PLUGIN_DIR:~0,-1%"
for %%i in ("%PLUGIN_DIR%\..\..") do set "PROJECT_ROOT=%%~fi"
set "CLAUDE_DIR=%PROJECT_ROOT%\.claude"

echo Long-Running Harness -- Local Install
echo   Plugin : %PLUGIN_DIR%
echo   Project: %PROJECT_ROOT%
echo.

:: Create target directories
if not exist "%CLAUDE_DIR%\commands" mkdir "%CLAUDE_DIR%\commands"
if not exist "%CLAUDE_DIR%\agents" mkdir "%CLAUDE_DIR%\agents"
if not exist "%CLAUDE_DIR%\skills\long-running-harness" mkdir "%CLAUDE_DIR%\skills\long-running-harness"

:: Commands
copy /Y "%PLUGIN_DIR%\commands\*.md" "%CLAUDE_DIR%\commands\" > nul
echo   [OK] Commands  -^> .claude\commands\

:: Agents
copy /Y "%PLUGIN_DIR%\agents\*.md" "%CLAUDE_DIR%\agents\" > nul
echo   [OK] Agents    -^> .claude\agents\

:: Skill
copy /Y "%PLUGIN_DIR%\skills\long-running-harness\SKILL.md" "%CLAUDE_DIR%\skills\long-running-harness\SKILL.md" > nul
:: Roles + References (shared source of truth for all agents)
if not exist "%CLAUDE_DIR%\skills\long-running-harness\roles" mkdir "%CLAUDE_DIR%\skills\long-running-harness\roles"
if not exist "%CLAUDE_DIR%\skills\long-running-harness\references" mkdir "%CLAUDE_DIR%\skills\long-running-harness\references"
copy /Y "%PLUGIN_DIR%\skills\long-running-harness\roles\*.md" "%CLAUDE_DIR%\skills\long-running-harness\roles\" > nul
copy /Y "%PLUGIN_DIR%\skills\long-running-harness\references\*.md" "%CLAUDE_DIR%\skills\long-running-harness\references\" > nul
echo   [OK] Skill     -^> .claude\skills\long-running-harness\ (+ roles\ + references\)

:: Hooks -- merge if .claude\hooks.json exists, otherwise copy
set "HOOKS_SRC=%PLUGIN_DIR%\hooks\hooks.json"
set "HOOKS_DST=%CLAUDE_DIR%\hooks.json"

if exist "%HOOKS_DST%" (
  node -e "const fs=require('fs');const src=JSON.parse(fs.readFileSync('%HOOKS_SRC%','utf8'));const dst=JSON.parse(fs.readFileSync('%HOOKS_DST%','utf8'));const existing=new Set((dst.hooks||[]).map(h=>h.command));const merged={hooks:[...(dst.hooks||[]),...src.hooks.filter(h=>!existing.has(h.command))]};fs.writeFileSync('%HOOKS_DST%',JSON.stringify(merged,null,2));"
  echo   [OK] Hooks     -^> merged into existing .claude\hooks.json
) else (
  copy /Y "%HOOKS_SRC%" "%HOOKS_DST%" > nul
  echo   [OK] Hooks     -^> .claude\hooks.json
)

echo.
echo [OK] Installed. Available immediately -- no restart needed.
echo.
echo   /init     scaffold harness for a new project
echo   /session  run one supervised sprint round
echo   /run      continuous mode (unattended)
echo   /reset    checkpoint + handoff when context fills
echo.
endlocal
