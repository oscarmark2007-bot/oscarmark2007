[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  🚀 OSCARMARK2007 - GitHub ＆ Google Apps Script 雙雲端全自動同步" -ForegroundColor Yellow
Write-Host "================================================================="

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$deployDesc = "AutoDeploy_" + (Get-Date -Format "yyyyMMdd_HHmmss")
$deploymentId = "AKfycbzlu1Nw4Vd1chVGOaXD4G5wF5UYlbexojAeee62oFPU7s1u4IHH53omM6nD-DXXHEZYTw"

# 0. Embed latest index.html into Englishvoice.gs
Write-Host "`n[1/4] 正在自動打包最新 HTML 至 Google Apps Script..." -ForegroundColor Cyan
python embed_kline_all.py | Out-Null
Write-Host "✅ 代碼打包完成！" -ForegroundColor Green

# 1. Push to GitHub
Write-Host "`n[2/4] 正在推送到 GitHub 與 GitHub Pages..." -ForegroundColor Cyan
git add index.html Englishvoice.gs Englishvoice.txt Index.txt sync_to_cloud.ps1
$status = git status --porcelain
if ($status) {
    git commit -m "auto: cloud sync $timestamp" | Out-Null
    git push origin main
    Write-Host "✅ GitHub 雲端推送成功！" -ForegroundColor Green
} else {
    Write-Host "ℹ️ 本機代碼無變更，略過 Git Commit。" -ForegroundColor Gray
}

# 2. Push to Google Apps Script
Write-Host "`n[3/4] 正在全自動推送到 Google Apps Script 雲端..." -ForegroundColor Cyan
$pushRes = cmd /c "npx @google/clasp push --force 2>&1"
$pushStr = ($pushRes | Out-String)

if ($pushStr -match "User has not enabled the Apps Script API") {
    Write-Host "`n⚠️ [重要提示] Google Apps Script API 尚未開啟！" -ForegroundColor Yellow
    Write-Host "👉 請前往: https://script.google.com/home/usersettings 開啟" -ForegroundColor Yellow
} elseif ($pushStr -match "Pushed") {
    Write-Host "✅ Google Apps Script 程式碼全自動推送成功！" -ForegroundColor Green

    # 3. Auto Deploy to Web App (In-place update)
    Write-Host "`n[4/4] 正在原地覆蓋部署最新版本至 Web App..." -ForegroundColor Cyan
    cmd /c "npx @google/clasp deploy -i $deploymentId -d $deployDesc"
    Write-Host "🎉 恭喜！Google Apps Script Web App 已成功覆蓋更新！" -ForegroundColor Green
} else {
    Write-Host $pushStr
}

Write-Host "`n=================================================================" -ForegroundColor Cyan
Write-Host "🌐 Web App 網址: https://script.google.com/macros/s/$deploymentId/exec" -ForegroundColor Green
Write-Host "🌐 GitHub Pages: https://oscarmark2007-bot.github.io/oscarmark2007/" -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor Cyan
