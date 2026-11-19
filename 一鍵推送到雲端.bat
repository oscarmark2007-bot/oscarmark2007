@echo off
chcp 65001 > nul
title 推送代碼至 GitHub 雲端
cd /d "%~dp0"

echo ========================================================
echo   🚀 正在將最新代碼推送到 GitHub 雲端 (GitHub Pages)...
echo ========================================================
echo.

git add .
git commit -m "update: sync to cloud %date% %time%"
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo   🎉 成功推送到 GitHub 雲端！
    echo   🌐 雲端正式體驗網址:
    echo      https://oscarmark2007-bot.github.io/oscarmark2007/
    echo ========================================================
) else (
    echo.
    echo [提示] 尚未檢測到代碼變更，或推送時發生問題。
)

echo.
pause
