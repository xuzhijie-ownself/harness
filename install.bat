@echo off
setlocal enabledelayedexpansion

:: Install Harness for Codex CLI and Copilot CLI.
:: Marketplace users: use marketplace instead (e.g. claude plugin install harness@harness)
::
:: Usage:
::   cd your-project
::   plugins\harness\install.bat [core|sdlc|sales|all]   install (default: all)
::   plugins\harness\install.bat --uninstall [sdlc|sales|all]  remove suite(s)
::
:: The script uses your current working directory as the project root.

set "PLUGIN_DIR=%~dp0"
set "PLUGIN_DIR=%PLUGIN_DIR:~0,-1%"
set "PROJECT_ROOT=%CD%"
set "STATE_FILE=%PROJECT_ROOT%\.harness-installed"

:: Calculate relative path from project root to this repo clone (uses node)
for /f "tokens=*" %%r in ('node -e "console.log(require('path').relative('%PROJECT_ROOT%','%PLUGIN_DIR%').replace(/\\/g,'/'))"') do set "REL_PATH=%%r"
if "%REL_PATH%"=="" set "REL_PATH=plugins/harness"

:: Read version from source manifest
for /f "tokens=*" %%v in ('node -e "console.log(JSON.parse(require('fs').readFileSync('%PLUGIN_DIR:\=/%/.codex-plugin/plugin.json','utf8')).version)"') do set "VERSION=%%v"
if "%VERSION%"=="" set "VERSION=0.0.0"

:: ── Uninstall ──────────────────────────────────────────────────────
if "%~1"=="--uninstall" (
    set "TARGET=%~2"
    if "!TARGET!"=="" set "TARGET=all"

    if "!TARGET!"=="core" (
        echo Error: cannot uninstall core separately. Use '--uninstall all' to remove everything.
        exit /b 1
    )

    echo Harness -- Uninstall suite: !TARGET!
    echo   Project: %PROJECT_ROOT%
    echo.

    if "!TARGET!"=="all" (
        if exist "%PROJECT_ROOT%\.codex-plugin" rmdir /S /Q "%PROJECT_ROOT%\.codex-plugin"
        echo   [OK] Removed .codex-plugin\
        del /Q "%PROJECT_ROOT%\.github\copilot-instructions.md" 2>nul
        echo   [OK] Removed .github\copilot-instructions.md
        del /Q "%STATE_FILE%" 2>nul
        echo   [OK] Removed .harness-installed
        echo.
        echo [OK] Fully uninstalled.
        goto :eof
    )

    :: Remove specific suite
    call :remove_suite "!TARGET!"
    echo   [OK] Removed '!TARGET!' from .harness-installed
    call :generate_manifests
    echo.
    echo [OK] Uninstalled '!TARGET!'. Manifests regenerated.
    goto :eof
)

:: ── Install ────────────────────────────────────────────────────────
set "TARGET=%~1"
if "%TARGET%"=="" set "TARGET=all"

:: Validate argument
if not "%TARGET%"=="core" if not "%TARGET%"=="sdlc" if not "%TARGET%"=="sales" if not "%TARGET%"=="all" (
    echo Error: unknown argument '%TARGET%'. Use: core, sdlc, sales, or all.
    exit /b 1
)

echo Harness -- Install for Codex CLI / Copilot CLI
echo   Source : %PLUGIN_DIR%
echo   Project: %PROJECT_ROOT%
echo   RelPath: %REL_PATH%
echo   Suite  : %TARGET%
echo.

:: Ensure core is always in state
call :add_suite "core"

if "%TARGET%"=="sdlc" call :add_suite "sdlc"
if "%TARGET%"=="sales" call :add_suite "sales"
if "%TARGET%"=="all" (
    call :add_suite "sdlc"
    call :add_suite "sales"
)

:: Show current state
set "STATE_DISPLAY="
if exist "%STATE_FILE%" (
    for /f "tokens=*" %%s in (%STATE_FILE%) do set "STATE_DISPLAY=!STATE_DISPLAY! %%s"
)
echo   [OK] State    -^> .harness-installed ^(!STATE_DISPLAY!^)

call :generate_manifests

echo.
echo [OK] Installed.
echo.
echo   Codex CLI:   codex   ^(auto-detects .codex-plugin\plugin.json^)
echo   Copilot CLI: copilot ^(auto-reads .github\copilot-instructions.md^)
echo.
echo   Marketplace users: use marketplace install instead
goto :eof

:: ── Subroutines ────────────────────────────────────────────────────

:add_suite
set "SUITE=%~1"
if not exist "%STATE_FILE%" (
    echo %SUITE%> "%STATE_FILE%"
    goto :eof
)
findstr /x "%SUITE%" "%STATE_FILE%" >nul 2>&1
if errorlevel 1 (
    echo %SUITE%>> "%STATE_FILE%"
)
goto :eof

:remove_suite
set "SUITE=%~1"
if not exist "%STATE_FILE%" goto :eof
set "TMPFILE=%STATE_FILE%.tmp"
type nul > "%TMPFILE%"
for /f "tokens=*" %%s in (%STATE_FILE%) do (
    if not "%%s"=="%SUITE%" echo %%s>> "%TMPFILE%"
)
move /Y "%TMPFILE%" "%STATE_FILE%" >nul
goto :eof

:has_suite
set "SUITE=%~1"
if not exist "%STATE_FILE%" exit /b 1
findstr /x "%SUITE%" "%STATE_FILE%" >nul 2>&1
exit /b %errorlevel%

:generate_manifests
:: Read installed suites
set "HAS_SDLC=0"
set "HAS_SALES=0"
if exist "%STATE_FILE%" (
    findstr /x "sdlc" "%STATE_FILE%" >nul 2>&1 && set "HAS_SDLC=1"
    findstr /x "sales" "%STATE_FILE%" >nul 2>&1 && set "HAS_SALES=1"
)

:: Build skills array
set "SKILLS=[\".\/%REL_PATH:/=\/%\/plugins\/harness\/skills\/\""
if "%HAS_SDLC%"=="1" set "SKILLS=%SKILLS%, \".\/%REL_PATH:/=\/%\/plugins\/harness-sdlc-suite\/skills\/\""
if "%HAS_SALES%"=="1" set "SKILLS=%SKILLS%, \".\/%REL_PATH:/=\/%\/plugins\/harness-sales-suite\/skills\/\""
set "SKILLS=%SKILLS%]"

:: Generate .codex-plugin/plugin.json
if not exist "%PROJECT_ROOT%\.codex-plugin" mkdir "%PROJECT_ROOT%\.codex-plugin"
node -e "const fs=require('fs');const j={name:'harness',version:'%VERSION%',skills:%SKILLS%};fs.writeFileSync('%PROJECT_ROOT:\=/%/.codex-plugin/plugin.json',JSON.stringify(j,null,2));"
echo   [OK] Codex    -^> .codex-plugin\plugin.json

:: Generate .github/copilot-instructions.md with corrected file references
if not exist "%PROJECT_ROOT%\.github" mkdir "%PROJECT_ROOT%\.github"
set "REPLACE_EXPR=src.replace(/plugins\/harness\//g,'%REL_PATH%/plugins/harness/')"
if "%HAS_SDLC%"=="1" set "REPLACE_EXPR=%REPLACE_EXPR%.replace(/plugins\/harness-sdlc-suite\//g,'%REL_PATH%/plugins/harness-sdlc-suite/')"
if "%HAS_SALES%"=="1" set "REPLACE_EXPR=%REPLACE_EXPR%.replace(/plugins\/harness-sales-suite\//g,'%REL_PATH%/plugins/harness-sales-suite/')"
node -e "const fs=require('fs');let src=fs.readFileSync('%PLUGIN_DIR:\=/%/.github/copilot-instructions.md','utf8');const out=%REPLACE_EXPR%;fs.writeFileSync('%PROJECT_ROOT:\=/%/.github/copilot-instructions.md',out);"
echo   [OK] Copilot  -^> .github\copilot-instructions.md
goto :eof
