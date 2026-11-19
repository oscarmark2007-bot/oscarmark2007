@echo off
chcp 65001 > nul
title OSCARMARK2007 英語聽說學習 ＆ 音樂伴讀站
cd /d "%~dp0"

echo =======================================================
echo   🎧 OSCARMARK2007 英語聽說學習 ＆ 音樂伴讀系統
echo =======================================================
echo 正在為您啟動本機極速音訊伺服器...
echo.

start "" "http://localhost:8000"
python server.py 8000

if %errorlevel% neq 0 (
    echo.
    echo [提示] 未檢測到 Python 環境，正在使用預設瀏覽器直接打開 index.html...
    start "" "index.html"
    pause
)
