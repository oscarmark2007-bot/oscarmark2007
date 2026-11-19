# 🎧 OSCARMARK2007 雙核心英語聽說 ＆ 沉浸音樂伴讀系統 (Pro Studio)

> **📱 雲端免安裝、點開即用網址 (GitHub Pages 全球 CDN)**：  
> 👉 **[https://oscarmark2007-bot.github.io/oscarmark2007/](https://oscarmark2007-bot.github.io/oscarmark2007/)**  
> *(手機使用 Safari / Chrome 開啟後，點選「加入主畫面」，即可作為獨立 App 全螢幕離線使用！)*

---

## 🌟 系統特色

### 📚 1. VoiceTube 沉浸式英語精讀 ＆ 3D 智慧生字卡
* **即時點詞翻譯 (Click-to-Translate)**：文章/字幕中每個單字均可點選，立即彈出發音、音標與權威中文釋義。
* **選詞即入生字卡 (含例句自動收錄)**：點擊單字或用滑鼠圈選片語，自動將單字與**當前整句例句、中文翻譯**打包存入生字卡！
* **3D 智慧翻轉生字卡 (Anki 模式)**：正面顯示單字與發音，背面展示中文釋義與**文章原句例句（選取單字自動高亮）**，支援「✅ 標記已掌握」與卡片進度追蹤。
* **單句無縫循環 (Loop Sentence)**：針對難懂的連音弱讀進行針對性聽力轟炸。
* **影子跟讀 (Shadowing)**：內建麥克風錄音與 Web Speech API 即時語音辨識評測。

### 🎵 2. Spotify 質感音樂館
* **Spotify 招牌黑綠美學**：沉浸深黑底色 (`#121212`)、精選歌單卡片矩陣與底部播放控制列。
* **即時動態滾動歌詞 (Live Lyrics)**：支援標準 LRC 格式，歌詞平滑居中滾動，點選任意歌詞行直接跳轉進度。
* **專注自然白噪音伴讀 (Ambient Mixer)**：在聽歌或學英語時，隨時疊加自然雨聲與咖啡廳白噪音。

---

## 📁 專案架構

```text
C:\Users\oscar\OneDrive\桌面\oscarmark2007\
├── index.html              # 應用程式主入口 (VoiceTube + 生字卡 + Spotify UI & 邏輯)
├── Code.gs                 # Google Apps Script 雲端後端代碼
├── manifest.json           # PWA 桌面與手機安裝設定檔
├── sw.js                   # Service Worker 離線快取引擎
├── 啟動.bat                # 本機一鍵啟動
├── server.py               # 輕量 Range 支援伺服器
└── README.md               # 專案手冊
```
