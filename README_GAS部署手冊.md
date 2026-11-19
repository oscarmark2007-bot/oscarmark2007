# 🚀 Google Apps Script 雲端部署手冊 (VoiceTube + Spotify 專業版)

> **本機工作目錄**：[`C:/Users/oscar/OneDrive/桌面/oscarmark2007`](file:///C:/Users/oscar/OneDrive/桌面/oscarmark2007)  
> **目標**：**100% 運行於 Google Apps Script 雲端，完全不需要筆電開機或本機伺服器！**

---

## 💡 為什麼直接做在 Google Apps Script (GAS) 更好？

1. **隨處可用，免開電腦**：手機、iPad、工作電腦、圖書館電腦只要打開網址就能直接學英文、聽音樂。
2. **Google 原生無限即時翻譯 (LanguageApp)**：本系統後端直接呼叫 Google 官方翻譯 API，**完全免費、無次數上限、零延遲即時英翻中**。
3. **個人生詞本自動同步雲端**：在 VoiceTube 模式下點擊收藏的單字，自動存放在 Google 雲端儲存 (`UserProperties`)，跨裝置永不遺失。
4. **Spotify 質感深色美學**：極致深黑底色、動態滾動歌詞、沉浸播放列。

---

## 🔑 關鍵：如何徹底解決原網址的「404 / Page Not Found」問題？

您提供的原網址出現 404，是因為 Google Apps Script 的預設部署權限被設定為「僅限特定網域 (如 `gebis.org` 等) 或僅限自己」。

### 解決方法：
在 Apps Script 部署時，請務必確認將存取權限設為 **「任何人 (Anyone)」**：
* **執行身分 (Execute as)**：`我 (Me / 您的帳號)`
* **誰可以存取 (Who has access)**：`任何人 (Anyone)`  *(如此手機、無痕視窗、平板才能免登入直接開！)*

---

## 🛠️ 3 步驟快速更新部署您的 Google Apps Script

### 步驟 1：打開 Google Apps Script 專案
打開您的專案：
👉 [https://script.google.com/home](https://script.google.com/home)  
（或直接打開您建立該 Web App 的 Apps Script 專案）

---

### 步驟 2：複製貼上本機的 2 個檔案

請開啟本機 [`C:/Users/oscar/OneDrive/桌面/oscarmark2007`](file:///C:/Users/oscar/OneDrive/桌面/oscarmark2007) 資料夾：

1. **替換後端 [`Code.gs`](file:///C:/Users/oscar/OneDrive/桌面/oscarmark2007/Code.gs)**：
   * 打開本機的 `Code.gs`，按 `Ctrl + A` 全選複製。
   * 切換到網頁上的 Apps Script 編輯器，選取原本的 `Code.gs`，全選貼上覆蓋。
   * 按 `Ctrl + S` 存檔。

2. **替換前端 [`Index.html`](file:///C:/Users/oscar/OneDrive/桌面/oscarmark2007/Index.html)**：
   * 如果網頁左側沒有 `Index.html`，點選左側「檔案」旁邊的 `+` 號 ➔ 選擇「HTML」➔ 命名為 `Index`。
   * 打開本機的 `Index.html`，按 `Ctrl + A` 全選複製。
   * 貼到網頁編輯器的 `Index.html` 中，覆蓋全部內容。
   * 按 `Ctrl + S` 存檔。

---

### 步驟 3：發布為新版本部署 (Deploy)

1. 點擊編輯器右上角藍色按鈕 **「部署 (Deploy)」** ➔ 選擇 **「管理部署 (Manage deployments)」**。
2. 點選您原本的網頁應用程式部署項目，點擊右上角 **鉛筆圖標 ✏️ (編輯)**。
3. **版本 (Version)**：下拉選擇 **「新版本 (New version)」**。
4. **誰可以存取 (Who has access)**：確認為 **「任何人 (Anyone)」**。
5. 點擊 **「部署 (Deploy)」**。
6. 完成！您原本的網址（或新生成的網址）即可立即刷新，享受全新的專業級 VoiceTube + Spotify 體驗！

---

## 🌟 全新專業版功能亮點

### 1. VoiceTube 英語精讀模組
* **點詞即查 (Click-to-Translate)**：滑鼠點擊字幕中的任何英文單字，立即跳出懸浮字典卡，顯示 **KK/IPA 音標、詞性、權威繁中釋義與美音發音**。
* **單句循環 (Loop Sentence)**：點擊「🔁 單句循環」，該句子會無縫自動重播，直到聽懂為止。
* **慢速模式 (0.75x ~ 1.25x)**：一鍵放慢，聽清母語人士連音與弱讀。
* **影子跟讀 (Shadowing)**：按住麥克風跟讀原句，瀏覽器自動辨識您的發音並評測準確度百分比。

### 2. Spotify 質感音樂館
* **Spotify 沉浸深色風格**：招牌黑綠配色、專輯卡片矩陣、精緻底部播放列。
* **即時動態滾動歌詞 (Live Lyrics)**：精確同步的 LRC 動態歌詞，點選任意歌詞行直接跳轉播放時間。
* **專注白噪音伴讀 (Ambient Mixer)**：隨時混入自然雨聲與咖啡廳白噪音，深度隔絕外界干擾。

### 3. 個人雲端生詞庫 (Personal Vault)
* 點擊查詞卡片中的「⭐ 收藏至生詞庫」，自動同步到 Google 雲端儲存。
* 隨時可複習生詞、聽單字發音、查看原文例句上下文，並支援一鍵匯出為 **Anki 單字卡 CSV 檔**。
