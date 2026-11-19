@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup_gas.ps1"
if %errorlevel% neq 0 (
    echo.
    echo Execution finished.
    pause
)
