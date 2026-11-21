# -*- coding: utf-8 -*-
import os
import json

ROOT = r"C:\Users\oscar\OneDrive\桌面\oscarmark2007"
INDEX_PATH = os.path.join(ROOT, "index.html")
GS_PATH = os.path.join(ROOT, "Englishvoice.gs")
TXT_PATH = os.path.join(ROOT, "Englishvoice.txt")

with open(INDEX_PATH, 'r', encoding='utf-8') as f:
    html_content = f.read()

# JSON encode html_content as JavaScript string literal
encoded_html = json.dumps(html_content, ensure_ascii=False)

backend_code = """
/**
 * ==============================================================================
 * OSCARMARK2007 - VoiceTube 英語精讀 ＆ Google Drive 雲端音樂館 ＆ KLine 專區
 * ==============================================================================
 * 主目錄 (PARENT_FOLDER_ID): 1ra0hX3MuMOm_FYPlj6GpDD4j7t_Gre7 (English_voice)
 * 子目錄 1: Englishvoice (ID: 132cXwwdjBGGYyxrYN1V1QMz8SrCNwNwL - 73 首音樂 / 6 篇教材)
 * 子目錄 2: KLine (新增 K-Line 投資理財 / 技術分析 / 英語音檔與教材專區)
 * ==============================================================================
 */

const PARENT_FOLDER_ID = "1ra0hX3MuMOm_FYPlj6GpDD4j7t_Gre7";
const ENGLISHVOICE_FALLBACK_ID = "132cXwwdjBGGYyxrYN1V1QMz8SrCNwNwL";
const FOLDER_ID = PARENT_FOLDER_ID;

/**
 * 內嵌最新版前端完整代碼 (單一檔案全自動整合)
 */
const EMBEDDED_HTML = """ + encoded_html + """;

function doGet(e) {
  return HtmlService.createHtmlOutput(EMBEDDED_HTML)
    .setTitle('OSCARMARK | VoiceTube 英語精讀 ＆ Spotify 雲端音樂館')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * 遞迴取得 Google Drive 資料夾內所有音檔與文字檔 (支援 Englishvoice 與 KLine 多目錄分類)
 */
function getFolderAssets(folderId, path) {
  var targetId = folderId || FOLDER_ID;
  var currentPath = path || "";
  var assets = { audios: [], articles: [], folders: ["Englishvoice", "KLine"] };

  try {
    var folder = DriveApp.getFolderById(targetId);
    var files = folder.getFiles();
    var subFolders = folder.getFolders();

    while (files.hasNext()) {
      try {
        var file = files.next();
        var fileName = file.getName();
        var fullPath = (currentPath ? currentPath + " / " : "") + fileName;
        var mime = file.getMimeType();
        var folderTag = currentPath ? currentPath.split(" / ")[0] : "根目錄";

        // 收集音檔 (.mp3, .m4a, audio/*)
        if (mime.indexOf('audio') !== -1 || fileName.toLowerCase().endsWith('.mp3') || fileName.toLowerCase().endsWith('.m4a')) {
          assets.audios.push({
            id: file.getId(),
            name: fileName,
            fullPath: fullPath,
            size: file.getSize(),
            folder: folderTag
          });
        }
        // 收集文字檔 (.txt)
        else if (mime === MimeType.PLAIN_TEXT || fileName.toLowerCase().endsWith('.txt')) {
          assets.articles.push({
            id: file.getId(),
            name: fileName.replace(/\\.[^/.]+$/, ""),
            fullName: fullPath,
            content: file.getBlob().getDataAsString("UTF-8"),
            folder: folderTag
          });
        }
        // 支援讀取 Google 文件 (Google Docs)
        else if (mime === MimeType.GOOGLE_DOCS) {
          try {
            var docText = DocumentApp.openById(file.getId()).getBody().getText();
            assets.articles.push({
              id: file.getId(),
              name: fileName,
              fullName: fullPath,
              content: docText,
              folder: folderTag
            });
          } catch(docErr) {}
        }
      } catch (fileErr) {
        console.log("略過錯誤檔案: " + fileErr);
      }
    }

    // 遞迴處理子資料夾 (如 Englishvoice, KLine 等)
    while (subFolders.hasNext()) {
      try {
        var sub = subFolders.next();
        var subName = sub.getName();
        if (assets.folders.indexOf(subName) === -1) {
          assets.folders.push(subName);
        }
        var nextPath = currentPath ? (currentPath + " / " + subName) : subName;
        var subAssets = getFolderAssets(sub.getId(), nextPath);
        assets.audios = assets.audios.concat(subAssets.audios);
        assets.articles = assets.articles.concat(subAssets.articles);
        for (var k = 0; k < subAssets.folders.length; k++) {
          if (assets.folders.indexOf(subAssets.folders[k]) === -1) {
            assets.folders.push(subAssets.folders[k]);
          }
        }
      } catch(subErr) {
        console.log("略過子資料夾: " + subErr);
      }
    }
  } catch (e) {
    console.log("資料夾讀取錯誤: " + e);
  }

  // 雙保險備援機制：若父目錄未掃瞄出音檔，直接掛載原 Englishvoice 子目錄
  if (assets.audios.length === 0 && (!folderId || folderId === FOLDER_ID)) {
    try {
      console.log("啟用備援目錄掃描: " + ENGLISHVOICE_FALLBACK_ID);
      var fallbackAssets = getFolderAssets(ENGLISHVOICE_FALLBACK_ID, "Englishvoice");
      assets.audios = assets.audios.concat(fallbackAssets.audios);
      assets.articles = assets.articles.concat(fallbackAssets.articles);
    } catch(fbErr) {
      console.log("備援掃描異常: " + fbErr);
    }
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

  var cleanText = rawText.replace(/\\n+/g, ' ');
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
 * 將文章儲存至 Google Drive 專屬資料夾 (支援指定儲存至 KLine 或 Englishvoice)
 */
function saveArticleToDrive(filename, content, targetFolderName) {
  try {
    if (!filename || !content) return "請輸入檔名與內容";
    var rootFolder = DriveApp.getFolderById(FOLDER_ID);
    var targetFolder = rootFolder;
    var destName = targetFolderName || "Englishvoice";

    // 尋找或自動建立目標子資料夾 (KLine 或 Englishvoice)
    var subs = rootFolder.getFoldersByName(destName);
    if (subs.hasNext()) {
      targetFolder = subs.next();
    } else {
      targetFolder = rootFolder.createFolder(destName);
    }

    var finalName = filename.toLowerCase().endsWith('.txt') ? filename : filename + ".txt";

    var files = targetFolder.getFilesByName(finalName);
    if (files.hasNext()) {
      var file = files.next();
      file.setContent(content);
      return "已成功更新檔案至「" + destName + "」資料夾：" + finalName;
    } else {
      targetFolder.createFile(finalName, content, MimeType.PLAIN_TEXT);
      return "已成功儲存新檔案至「" + destName + "」資料夾：" + finalName;
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
"""

with open(GS_PATH, 'w', encoding='utf-8') as f:
    f.write(backend_code)

with open(TXT_PATH, 'w', encoding='utf-8') as f:
    f.write(backend_code)

print("Generated Englishvoice.gs and Englishvoice.txt successfully!")
print("File size:", len(backend_code), "characters.")
