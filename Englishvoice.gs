/**
 * ==============================================================================
 * OSCARMARK2007 - VoiceTube 英語學習 ＆ Google Drive 雲端音樂庫 ＆ 智慧生字卡
 * ==============================================================================
 * 整合您的專屬雲端硬碟資料夾 (FOLDER_ID): 132cXwwdjBGGYyxrYN1V1QMz8SrCNwNwL
 * 1. 遞迴讀取 Google Drive 中的所有音檔 (.mp3, .m4a) 與 文章 (.txt, Google Docs)
 * 2. 終極 Base64 音檔解法，徹底解決瀏覽器 iframe / Cookie 阻擋
 * 3. 整合 VoiceTube 文章自動分句與 Google 官方 LanguageApp 翻譯
 * 4. 支援「文章選字 ➔ 生字卡 ➔ 自動帶入原句為例句」雲端儲存庫
 * ==============================================================================
 */

const FOLDER_ID = "132cXwwdjBGGYyxrYN1V1QMz8SrCNwNwL";

function doGet(e) {
  var template;
  try {
    template = HtmlService.createTemplateFromFile('Index');
  } catch (e1) {
    try {
      template = HtmlService.createTemplateFromFile('index');
    } catch (e2) {
      return HtmlService.createHtmlOutput('<h2>OSCARMARK 系統載入提示</h2><p>找不到 HTML 檔案，請確認 Apps Script 左側有 Index.html 檔案。</p><pre>' + e2.toString() + '</pre>');
    }
  }
  return template.evaluate()
    .setTitle('OSCARMARK | VoiceTube 英語精讀 ＆ Spotify 雲端音樂館')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * 遞迴取得 Google Drive 資料夾內所有音檔與文字檔
 */
function getFolderAssets(folderId, path) {
  var targetId = folderId || FOLDER_ID;
  var currentPath = path || "";
  var assets = { audios: [], articles: [] };

  try {
    var folder = DriveApp.getFolderById(targetId);
    var files = folder.getFiles();
    var subFolders = folder.getFolders();

    while (files.hasNext()) {
      try {
        var file = files.next();
        var name = (currentPath ? currentPath + " / " : "") + file.getName();
        var mime = file.getMimeType();

        // 收集音檔
        if (mime.indexOf('audio') !== -1 || name.toLowerCase().endsWith('.mp3') || name.toLowerCase().endsWith('.m4a')) {
          assets.audios.push({
            id: file.getId(),
            name: file.getName(),
            fullPath: name,
            size: file.getSize()
          });
        }
        // 收集文字檔 (.txt)
        else if (mime === MimeType.PLAIN_TEXT || name.toLowerCase().endsWith('.txt')) {
          assets.articles.push({
            id: file.getId(),
            name: file.getName().replace(/\.[^/.]+$/, ""),
            fullName: name,
            content: file.getBlob().getDataAsString("UTF-8")
          });
        }
        // 支援讀取 Google 文件 (Google Docs)
        else if (mime === MimeType.GOOGLE_DOCS) {
          try {
            var docText = DocumentApp.openById(file.getId()).getBody().getText();
            assets.articles.push({
              id: file.getId(),
              name: file.getName(),
              fullName: name,
              content: docText
            });
          } catch(e) {}
        }
      } catch (fileErr) {
        console.log("略過錯誤檔案: " + fileErr);
      }
    }

    // 遞迴處理子資料夾
    while (subFolders.hasNext()) {
      try {
        var sub = subFolders.next();
        var subAssets = getFolderAssets(sub.getId(), (currentPath ? currentPath + " / " : "") + sub.getName());
        assets.audios = assets.audios.concat(subAssets.audios);
        assets.articles = assets.articles.concat(subAssets.articles);
      } catch(subErr) {
        console.log("略過子資料夾: " + subErr);
      }
    }
  } catch (e) {
    console.log("資料夾讀取錯誤: " + e);
  }

  return assets;
}

/**
 * 將音檔轉為 Base64 Data URL，徹底解決跨域與沙盒限制
 */
function getAudioBase64(fileId) {
  try {
    var file = DriveApp.getFileById(fileId);
    var mimeType = file.getMimeType();
    var blob = file.getBlob();
    var base64Data = Utilities.base64Encode(blob.getBytes());
    return "data:" + mimeType + ";base64," + base64Data;
  } catch (e) {
    return "ERROR: " + e.toString();
  }
}

/**
 * 智慧拆解英文文章為句子，並使用 Google 官方 LanguageApp 進行雙語翻譯
 */
function processArticle(rawText) {
  if (!rawText) return { sentences: [], translations: [] };

  var cleanText = rawText.replace(/\n+/g, ' ');
  var matchArray = cleanText.match(/[^.!?]+[.!?]+/g);
  var sentences = matchArray ? matchArray.map(function(s) { return s.trim(); }) : [cleanText.trim()];
  sentences = sentences.filter(function(s) { return s.length > 0; });

  if (sentences.length === 0) return { sentences: [], translations: [] };

  try {
    var separator = " ||| ";
    var translatedText = LanguageApp.translate(sentences.join(separator), 'en', 'zh-TW');
    var translations = translatedText.split("|||").map(function(s) { return s.trim(); });
    return { sentences: sentences, translations: translations };
  } catch (err) {
    return { sentences: sentences, translations: sentences.map(function() { return "(翻譯中...)"; }) };
  }
}

/**
 * 將文章儲存至 Google Drive 專屬資料夾
 */
function saveArticleToDrive(filename, content) {
  try {
    if (!filename || !content) return "請輸入檔名與內容";
    var folder = DriveApp.getFolderById(FOLDER_ID);
    var finalName = filename.toLowerCase().endsWith('.txt') ? filename : filename + ".txt";

    var files = folder.getFilesByName(finalName);
    if (files.hasNext()) {
      var file = files.next();
      file.setContent(content);
      return "已成功更新檔案：" + finalName;
    } else {
      folder.createFile(finalName, content, MimeType.PLAIN_TEXT);
      return "已成功建立新檔案：" + finalName;
    }
  } catch (e) {
    return "儲存失敗：" + e.toString();
  }
}

/**
 * 單字即時翻譯 API (點詞即查)
 */
function apiTranslateText(text) {
  if (!text || text.trim() === '') return { success: false, text: '' };
  try {
    var translated = LanguageApp.translate(text, 'en', 'zh-TW');
    return { success: true, original: text, translated: translated };
  } catch (err) {
    return { success: false, error: err.toString(), translated: text };
  }
}

/**
 * 儲存生字卡 (單字 + 音標 + 釋義 + 原文例句 + 例句翻譯)
 */
function apiSaveVocab(vocabItem) {
  try {
    var props = PropertiesService.getUserProperties();
    var raw = props.getProperty('OSCARMARK_VOCAB_VAULT');
    var list = raw ? JSON.parse(raw) : [];

    var foundIndex = -1;
    for (var i = 0; i < list.length; i++) {
      if (list[i].word.toLowerCase() === vocabItem.word.toLowerCase()) {
        foundIndex = i;
        break;
      }
    }

    vocabItem.updated_at = Utilities.formatDate(new Date(), "GMT+8", "yyyy/MM/dd HH:mm");
    if (foundIndex >= 0) {
      list[foundIndex] = Object.assign(list[foundIndex], vocabItem);
    } else {
      vocabItem.id = new Date().getTime();
      vocabItem.mastered = false;
      vocabItem.created_at = vocabItem.updated_at;
      list.unshift(vocabItem);
    }

    props.setProperty('OSCARMARK_VOCAB_VAULT', JSON.stringify(list));
    return { success: true, count: list.length, item: vocabItem };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

function apiGetVocabList() {
  try {
    var props = PropertiesService.getUserProperties();
    var raw = props.getProperty('OSCARMARK_VOCAB_VAULT');
    return { success: true, data: raw ? JSON.parse(raw) : [] };
  } catch (err) {
    return { success: false, error: err.toString(), data: [] };
  }
}

function apiToggleMastered(id) {
  try {
    var props = PropertiesService.getUserProperties();
    var raw = props.getProperty('OSCARMARK_VOCAB_VAULT');
    if (!raw) return { success: false };
    var list = JSON.parse(raw);
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        list[i].mastered = !list[i].mastered;
        break;
      }
    }
    props.setProperty('OSCARMARK_VOCAB_VAULT', JSON.stringify(list));
    return { success: true, list: list };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

function apiDeleteVocab(id) {
  try {
    var props = PropertiesService.getUserProperties();
    var raw = props.getProperty('OSCARMARK_VOCAB_VAULT');
    if (!raw) return { success: true };
    var list = JSON.parse(raw);
    list = list.filter(function(item) { return item.id !== id; });
    props.setProperty('OSCARMARK_VOCAB_VAULT', JSON.stringify(list));
    return { success: true, count: list.length };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}
