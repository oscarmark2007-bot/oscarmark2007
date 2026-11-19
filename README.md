# 🎧 OSCARMARK2007 雙核心英語聽說 ＆ 沉浸音樂伴讀系統 (Pro Studio)

> **本機專案路徑**：`C:\Users\oscar\OneDrive\桌面\oscarmark2007`  
> **系統定位**：全功能、隱私優先、極速響應的現代化 **英語精讀 (English Learning) ＆ 質感音樂 (Music Station) 雙核心 Web / PWA 應用程式**。

---

## 🌟 升級緣起：從 Google Apps Script 邁向專業化

原系統部署於 Google Apps Script (GAS) 網址：
`https://script.google.com/macros/s/AKfycbz1LFLoDuJnmBkBZVkfh9ZIMLreSXbPuVoS3oqrIMPEkbGAgRZSBiZIwowViHB5Hikj/exec`

在實際使用中，GAS 面臨諸多嚴重的底層限制：
1. **音訊中斷痛點**：GAS 透過 iframe 嵌入執行，**手機螢幕鎖定休眠或切換分頁時，音訊會被系統強制暫停**，無法持續聽音與跟讀。
2. **網域權限與 404**：多 Google 帳號切換或未授權網域 (如 `gebis.org`) 存取時，會頻繁出現「無法開啟檔案」或 404 錯誤。
3. **雲端冷啟動延遲**：每次打開網頁須等待 Google 容器喚醒 3~5 秒。
4. **功能深度受限**：缺乏進階音訊控制（A-B 斷句循環、動態 LRC 歌詞、點詞查義、影子跟讀評測、本機音檔拖放）。

本專案將其**徹底重構為獨立專業級架構**，徹底擺脫沙盒束縛！

---

## ✨ 雙核心功能模組

### 📚 模組一：English Learning (英語聽說精讀)
1. **A-B 區間循環 (A-B Looping)**：
   - 支援自由設置 `[A點, B點]` 重複循環，針對難懂的英語連音、弱讀進行針對性聽力轟炸。
   - 具備「一鍵循環整句」按鈕與循環計數器。
2. **無失真原音調速 (Pitch-Preserved Speed Control)**：
   - 提供 0.75x、0.9x、1.0x、1.15x、1.3x 變速，放慢聽清發音細節，加速訓練語感反應。
3. **互動式雙語字幕 (Interactive Transcript)**：
   - 播放進度與句子精準高亮同步。
   - **點擊單字即查**：文章內所有單詞均為互動 Token，點擊立即顯示音標 (IPA)、中文權威釋義，並提供發音按鈕。
4. **影子跟讀與即時口說評測 (Shadowing & Web Speech API)**：
   - 內建麥克風錄音，利用瀏覽器原生語音辨識技術，將口說發音轉文字，與原句進行準確度百分比評測。
5. **個人生詞庫 (Vocabulary Vault)**：
   - 一鍵收藏陌生單字，自動記錄「收錄當下的原句上下文」。
   - 支援匯出為 **JSON 備份** 與 **CSV (相容 Anki 單字卡)**。

---

### 🎵 模組二：聽音樂 (Music Player & 伴讀)
1. **黑膠唱片沉浸視覺 (Vinyl Turntable & Visualizer)**：
   - 播放時唱針滑入、黑膠唱片平滑旋轉，並搭配即時音訊頻譜波形動畫。
2. **動態平滑滾動歌詞 (Synchronized LRC Lyrics)**：
   - 支援標準 `.lrc` 歌詞解析，當前演唱行自動聚焦高亮放大，點擊歌詞即可快轉至該時間點。
3. **專注自然白噪音雙軌混音器 (Procedural Ambient Sound Mixer)**：
   - 聽音樂或精聽英語時，可自由混入高音質自然環境音（無需外部音檔，瀏覽器 Web Audio API 演算法即時生成）：
     - 🌧️ 窗外細雨 (Gentle Rain)
     - ☕ 溫暖咖啡館 (Coffee Shop)
     - 🔥 冬日壁爐柴火 (Campfire)
     - 🌲 森林鳥鳴 (Morning Birds)
4. **本機音樂庫直接拖曳即播 (Local Audio Support)**：
   - 支援將電腦中的 **MP3 / FLAC / M4A** 音樂檔案直接拖入網頁，即刻加入播放清單播放，隱私 100% 留存於本地硬碟。
5. **全平台背景播放 (Media Session API)**：
   - 完整支援 iPhone / Android 鎖定畫面媒體控制器、鍵盤多媒體按鍵，關閉螢幕依然音樂不斷線。

---

## 🚀 快速啟動與使用說明

### 方式一：電腦本機雙擊啟動（最推薦）
1. 在資料夾中直接雙擊 **`啟動.bat`**。
2. 系統會自動啟動極速本機音訊伺服器（支援 Range 請求，音訊拖曳零卡頓），並於瀏覽器自動打開：
   `http://localhost:8000`

### 方式二：手機與平板連線 (PWA)
1. 在電腦啟動 `啟動.bat` 後，手機連接同一 Wi-Fi。
2. 在手機瀏覽器輸入電腦的區域網路 IP（例如 `http://192.168.x.x:8000`）。
3. 點選瀏覽器選單「**加入主畫面**」（Add to Home Screen），即可獲得如同原生 App 般的全螢幕沉浸體驗！

### 方式三：免費部署至 GitHub Pages
1. 將本專案目錄推送到 GitHub（如 `https://github.com/oscarmark2007-bot/english-music-app`）。
2. 在 GitHub 倉庫開啟 Pages 設定，即可享有永久免費、免開伺服器的全球 CDN 快速存取。

---

## 📁 檔案結構說明

```text
C:\Users\oscar\OneDrive\桌面\oscarmark2007\
├── 啟動.bat                # 雙擊一鍵啟動
├── server.py               # 輕量本機 HTTP 伺服器 (支援音訊 Range 拖曳)
├── index.html              # 雙核心應用程式主介面 (English + Music)
├── manifest.json           # PWA 桌面/手機安裝設定
├── sw.js                   # Service Worker 離線快取
├── README.md               # 專案手冊與架構說明
├── css/
│   └── style.css           # 現代磨砂玻璃質感、深淺模式與黑膠唱片樣式
├── js/
│   └── app.js              # 雙核心播放引擎、LRC解析、A-B循環、白噪音與生詞庫
└── assets/
    ├── icon.png            # App 圖標
    └── default-cover.jpg   # 預設黑膠封面
```
