[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  🚀 OSCARMARK2007 - GitHub ＆ Google Apps Script 雙雲端全自動同步" -ForegroundColor Yellow
Write-Host "================================================================="

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# 1. Push to GitHub
Write-Host "`n[1/3] 正在推送到 GitHub 與 GitHub Pages..." -ForegroundColor Cyan
git add .
$status = git status --porcelain
if ($status) {
    git commit -m "auto: cloud sync $timestamp" | Out-Null
    git push origin main
    Write-Host "✅ GitHub 雲端推送成功！" -ForegroundColor Green
} else {
    Write-Host "ℹ️ 本機代碼無變更，略過 Git Commit。" -ForegroundColor Gray
}

# 2. Push to Google Apps Script
Write-Host "`n[2/3] 正在全自動推送到 Google Apps Script 雲端..." -ForegroundColor Cyan
$pushRes = cmd /c "npx @google/clasp push --force 2>&1"
$pushStr = ($pushRes | Out-String)

if ($pushStr -match "User has not enabled the Apps Script API") {
    Write-Host "`n⚠️ [重要提示] Google Apps Script API 尚未開啟！" -ForegroundColor Yellow
    Write-Host "👉 請在剛才打開的瀏覽器頁面 (https://script.google.com/home/usersettings)" -ForegroundColor Yellow
    Write-Host "   將「Google Apps Script API」開關切換為【開啟 (ON)】。" -ForegroundColor Yellow
    Write-Host "   開啟後，未來點擊此腳本即可【100% 全自動部署，無需手動複製貼上】！`n" -ForegroundColor Yellow
} elseif ($pushStr -match "Pushed") {
    Write-Host "✅ Google Apps Script 程式碼全自動推送成功！" -ForegroundColor Green

    # 3. Auto Deploy to Web App
    Write-Host "`n[3/3] 正在全自動發布 Google Apps Script Web App 新版本..." -ForegroundColor Cyan
    cmd /c "npx @google/clasp deploy --description 'Auto Deploy $timestamp'"
    Write-Host "🎉 恭喜！Google Apps Script Web App 已全自動部署上線！" -ForegroundColor Green
} else {
    Write-Host $pushStr
}

Write-Host "`n=================================================================" -ForegroundColor Cyan
Write-Host "🌐 GitHub Pages: https://oscarmark2007-bot.github.io/oscarmark2007/" -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor Cyan
