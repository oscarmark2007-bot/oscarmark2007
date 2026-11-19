@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Write-Host '>>> 正在推送到 GitHub 雲端...' -ForegroundColor Cyan; git add .; git commit -m ('update: ' + (Get-Date).ToString('yyyy-MM-dd HH:mm')); git push origin main; Write-Host '>>> 成功推送到 GitHub 雲端！' -ForegroundColor Green; Write-Host '>>> 網址: https://oscarmark2007-bot.github.io/oscarmark2007/' -ForegroundColor Yellow; Read-Host '按 Enter 鍵結束' }"
