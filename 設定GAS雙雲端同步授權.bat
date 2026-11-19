@echo off
chcp 65001 > nul
title 設定 GitHub ➔ Google Apps Script 雙雲端全自動同步
cd /d "%~dp0"

echo ==============================================================================
echo   🔗 GitHub ➔ Google Apps Script (GAS) 雙雲端全自動同步配置嚮導
echo ==============================================================================
echo.
echo 【重要步驟說明】：
echo 1. 本嚮導將引導您完成一次性 Google OAuth 授權。
echo 2. 授權後，GitHub Actions 將具備直接將代碼推送到您 Google Apps Script 的權限。
echo 3. 未來您只需雙擊「一鍵推送到雲端.bat」，代碼就會【同時更新 GitHub 與 Google 雲端】！
echo.
echo ==============================================================================
echo [步驟 1/3] 開啟 Google Apps Script API 權限
echo ==============================================================================
echo 正在為您打開 Google Apps Script 帳號設定頁面...
echo 請確認頁面中的「Google Apps Script API」已切換為【開啟 (ON)】。
echo.
start "" "https://script.google.com/home/usersettings"
pause
echo.

echo ==============================================================================
echo [步驟 2/3] 執行 Google 帳號授權登入 (clasp login)
echo ==============================================================================
echo 系統即將啟動 Google 官方授權視窗...
echo 請在彈出的瀏覽器中點選您的 Google 帳號並點選【允許 / 繼續】。
echo.
cmd /c "clasp login"

if not exist "%USERPROFILE%\.clasprc.json" (
    echo.
    echo ❌ [錯誤] 未偵測到授權憑證檔案 (%USERPROFILE%\.clasprc.json)。
    echo 請確認您已在瀏覽器完成 Google 登入授權後重新執行本腳本。
    pause
    exit /b 1
)

echo.
echo ✅ [成功] 已成功取得 Google 官方授權憑證！
echo 正在將憑證安全加密上傳至 GitHub Secrets (CLASPRC_JSON)...
gh secret set CLASPRC_JSON --repo oscarmark2007-bot/oscarmark2007 < "%USERPROFILE%\.clasprc.json"
echo ✅ GitHub 憑證加密設定完成！
echo.

echo ==============================================================================
echo [步驟 3/3] 設定您的 Google Apps Script 指令碼 ID (Script ID)
echo ==============================================================================
echo 如何取得 Script ID：
echo 1. 打開您的 Google Apps Script 專案網頁。
echo 2. 點擊左側齒輪圖標【專案設定 (Project Settings)】。
echo 3. 複製「指令碼 ID (Script ID)」(一串由英數字組成的長字串)。
echo.
set /p SCRIPT_ID="請貼上您的 Script ID 並按 Enter: "

if "%SCRIPT_ID%"=="" (
    echo ⚠️ 未輸入 Script ID，您可以稍後手動在 GitHub Secrets 中添加 SCRIPT_ID。
) else (
    echo 正在將 Script ID 加密存入 GitHub Secrets...
    echo %SCRIPT_ID%| gh secret set SCRIPT_ID --repo oscarmark2007-bot/oscarmark2007
    
    echo {"scriptId":"%SCRIPT_ID%","rootDir":"./"} > .clasp.json
    echo ✅ Script ID 設定完成！
)

echo.
echo ==============================================================================
echo 🎉🎉🎉 恭喜！GitHub ➔ Google Apps Script 雙雲端全自動同步已全部配置完成！
echo ==============================================================================
echo 未來任何時刻：
echo 只要在本地資料夾點擊【一鍵推送到雲端.bat】
echo 系統就會自動執行：
echo   1. 推送到 GitHub 雲端 (GitHub Pages 即時更新)
echo   2. 觸發 GitHub Actions 自動將最新 Code.gs 與 Index.html 同步至 Google Apps Script 雲端！
echo ==============================================================================
echo.
pause
