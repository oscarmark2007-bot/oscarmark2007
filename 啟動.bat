@echo off
cd /d "%~dp0"
start "" "http://localhost:8000"
python server.py 8000
if %errorlevel% neq 0 (
    start "" "index.html"
)
