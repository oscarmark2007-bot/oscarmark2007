# ==============================================================================
# OSCARMARK2007 - Google Apps Script 雙雲端全自動同步配置嚮導 (PowerShell 專業版)
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Clear-Host
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "  🔗 GitHub ➔ Google Apps Script (GAS) 雙雲端全自動同步配置嚮導" -ForegroundColor Yellow
Write-Host "=============================================================================="
Write-Host "說明："
Write-Host "1. 本嚮導將引導您完成一次性 Google OAuth 授權與 Script ID 設定。"
Write-Host "2. 授權後，GitHub Actions 將具備將代碼推送到您 Google Apps Script 的權限。"
Write-Host "3. 未來您只需雙擊「一鍵推送到雲端.bat」，代碼就會【同時更新 GitHub 與 Google 雲端】！"
Write-Host "==============================================================================`n"

# 步驟 1
Write-Host "[步驟 1/3] 開啟 Google Apps Script API 權限..." -ForegroundColor Cyan
Write-Host "正在為您打開 Google Apps Script 帳號設定頁面..."
Write-Host "請確認頁面中的「Google Apps Script API」已切換為【開啟 (ON)】。`n" -ForegroundColor Yellow
Start-Process "https://script.google.com/home/usersettings"
$null = Read-Host "👉 確認已切換為「開啟」後，請在此按 Enter 鍵繼續下一步"

# 步驟 2
Write-Host "`n[步驟 2/3] 執行 Google 帳號授權登入 (clasp login)..." -ForegroundColor Cyan
Write-Host "系統即將啟動 Google 官方授權視窗..."
Write-Host "請在彈出的瀏覽器中點選您的 Google 帳號，並點選【允許 / 繼續】。`n" -ForegroundColor Yellow

$claspPath = "$env:APPDATA\npm\clasp.cmd"
if (Test-Path $claspPath) {
    & $claspPath login
} else {
    cmd /c "clasp login"
}

$clasprcPath = "$HOME\.clasprc.json"
if (-not (Test-Path $clasprcPath)) {
    Write-Host "`n❌ [錯誤] 未偵測到授權憑證檔案 ($clasprcPath)。" -ForegroundColor Red
    Write-Host "請確認您已在瀏覽器點選「允許」完成授權後重新執行。"
    Read-Host "按 Enter 鍵結束"
    exit
}

Write-Host "`n✅ [成功] 已成功取得 Google 官方授權憑證！" -ForegroundColor Green
Write-Host "正在將憑證安全加密上傳至 GitHub Secrets (CLASPRC_JSON)..."

$clasprcContent = [System.IO.File]::ReadAllText($clasprcPath, [System.Text.Encoding]::UTF8).TrimStart([char]0xFEFF)
$clasprcContent | gh secret set CLASPRC_JSON --repo oscarmark2007-bot/oscarmark2007

Write-Host "✅ GitHub Secrets (CLASPRC_JSON) 加密設定完成！`n" -ForegroundColor Green

# 步驟 3
Write-Host "[步驟 3/3] 設定您的 Google Apps Script 指令碼 ID (Script ID)..." -ForegroundColor Cyan
Write-Host "如何取得 Script ID："
Write-Host "1. 打開您的 Google Apps Script 專案網頁 (https://script.google.com/home)。"
Write-Host "2. 點擊左側齒輪圖標【專案設定 (Project Settings)】。"
Write-Host "3. 複製「指令碼 ID (Script ID)」(一串由英數字組成的長字串)。`n" -ForegroundColor Yellow

$scriptId = Read-Host "👉 請貼上您的 Script ID 並按 Enter"

if ([string]::IsNullOrWhiteSpace($scriptId)) {
    Write-Host "`n⚠️ 未輸入 Script ID，您稍後可手動至 GitHub 專案設定中加入。" -ForegroundColor Yellow
} else {
    $cleanId = $scriptId.Trim()
    $cleanId | gh secret set SCRIPT_ID --repo oscarmark2007-bot/oscarmark2007
    
    $configJson = @"
{
  "scriptId": "$cleanId",
  "rootDir": "./"
}
"@
    Set-Content -Path ".clasp.json" -Value $configJson -Encoding UTF8
    Write-Host "✅ Script ID 設定完成！" -ForegroundColor Green
}

Write-Host "`n==============================================================================" -ForegroundColor Cyan
Write-Host "🎉🎉🎉 恭喜！GitHub ➔ Google Apps Script 雙雲端全自動同步已全部配置完成！" -ForegroundColor Yellow
Write-Host "=============================================================================="
Write-Host "未來任何時刻："
Write-Host "只要在本地資料夾點擊【一鍵推送到雲端.bat】"
Write-Host "系統就會自動執行："
Write-Host "  1. 推送到 GitHub 雲端 (GitHub Pages 立即更新)"
Write-Host "  2. 觸發 GitHub Actions 自動將最新代碼同步至 Google Apps Script 雲端！"
Write-Host "==============================================================================`n"
$null = Read-Host "請按 Enter 鍵結束"
