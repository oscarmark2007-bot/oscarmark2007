/**
 * ==============================================================================
 * OSCARMARK2007 - VoiceTube 英語精讀 ＆ Spotify 音樂館 (GAS 核心後端)
 * ==============================================================================
 * 特色：
 * 1. 支援 Google 官方 LanguageApp 無限即時翻譯
 * 2. 支援「生字卡 (Flashcard)」雲端儲存，自動保存選詞、音標、釋義與完整文章例句
 * 3. 誰可以存取：設為「任何人 (Anyone)」，免開筆電、手機平板隨開即用！
 * ==============================================================================
 */

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index');
  return template.evaluate()
    .setTitle('OSCARMARK | VoiceTube 英語學習 ＆ 生字卡 ＆ Spotify 音樂館')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * 呼叫 Google 官方強大翻譯引擎 (LanguageApp)
 */
function apiTranslateText(text) {
  if (!text || text.trim() === '') return { success: false, text: '' };
  try {
    var translated = LanguageApp.translate(text, 'en', 'zh-TW');
    return {
      success: true,
      original: text,
      translated: translated
    };
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
      translated: text
    };
  }
}

/**
 * 儲存生字卡至雲端 (包含單字、音標、釋義、文章原句例句與例句翻譯)
 */
function apiSaveVocab(vocabItem) {
  try {
    var props = PropertiesService.getUserProperties();
    var raw = props.getProperty('OSCARMARK_VOCAB_VAULT');
    var list = raw ? JSON.parse(raw) : [];

    // 若已存在則更新例句與釋義，不存在則新增
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

/**
 * 取得雲端生字卡清單
 */
function apiGetVocabList() {
  try {
    var props = PropertiesService.getUserProperties();
    var raw = props.getProperty('OSCARMARK_VOCAB_VAULT');
    return {
      success: true,
      data: raw ? JSON.parse(raw) : []
    };
  } catch (err) {
    return { success: false, error: err.toString(), data: [] };
  }
}

/**
 * 更新生字卡掌握度 (Mastered / Review)
 */
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

/**
 * 刪除生字卡
 */
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
