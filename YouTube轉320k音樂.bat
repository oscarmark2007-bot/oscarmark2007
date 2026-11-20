@echo off
chcp 65001 >nul
cd /d "%~dp0"
python yt_to_mp3.py
if errorlevel 1 pause
