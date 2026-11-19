/**
 * OSCARMARK2007 - Pro Dual-Core English Learning & Music Platform
 * Architecture:
 * 1. AudioEngine (Core audio, Web Audio API, procedural white noise, A-B loop, visualization)
 * 2. EnglishModule (Interactive bilingual transcript, word tokens, dictionary, shadowing)
 * 3. MusicModule (Vinyl turntable, LRC synchronized lyrics, local file loader, playlist)
 * 4. VocabVault (Storage, spaced repetition, export)
 */

// ==================== 1. EMBEDDED SAMPLE DATA ====================

const SAMPLE_LESSONS = {
  'lesson-1': {
    title: '01. Mixed Conditionals & Modern Business Terminology',
    artist: 'Professor Mark - Advanced ESL',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg', // Sample fallback stream
    sentences: [
      {
        start: 0,
        end: 5.2,
        en: "Shrinkflation occurs when the price of a product remains the same, but the packaging size gets smaller.",
        cn: "縮水式通膨是指產品價格保持不變，但包裝份量卻變小了（縮水＋通膨）。"
      },
      {
        start: 5.3,
        end: 11.5,
        en: "Skimpflation happens when a company uses cheaper ingredients to make the same product in order to keep the price steady.",
        cn: "偷工減料型通膨是指企業為了維持價格，改用更廉價的原料來製造相同產品。"
      },
      {
        start: 11.6,
        end: 18.2,
        en: "Greedflation describes when corporations raise prices excessively under the guise of general inflation to boost profits.",
        cn: "貪婪通膨則描述企業藉口整體物價通膨，趁機過度哄抬價格以擴大利潤。"
      },
      {
        start: 18.3,
        end: 25.8,
        en: "If consumers had been more vigilant, companies would not be employing these deceptive pricing tactics today.",
        cn: "如果消費者當初更加警惕，企業今天就不會採用這些欺騙性的定價策略。（混合假設語氣）"
      },
      {
        start: 25.9,
        end: 35.0,
        en: "Mastering these nuances empowers international scholars to articulate economic phenomena with precision.",
        cn: "掌握這些微妙差異，能讓國際學者更精準地闡述現代經濟現象。"
      }
    ]
  },
  'lesson-2': {
    title: '02. Study Abroad & International Zoom Presentation',
    artist: 'Academic English Series',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_morning.ogg',
    sentences: [
      {
        start: 0,
        end: 6.0,
        en: "Welcome everyone to our cross-border academic conference on global curriculum normalization.",
        cn: "歡迎大家參加我們關於全球課程規範化的跨國學術會議。"
      },
      {
        start: 6.1,
        end: 13.0,
        en: "Before we delve into the transcript data verification, please ensure your microphone remains muted.",
        cn: "在我們深入探討成績單數據驗證之前，請先確認您的麥克風保持靜音。"
      },
      {
        start: 13.1,
        end: 21.0,
        en: "Clear articulation and structured logic are paramount when defending your thesis in international symposiums.",
        cn: "在國際研討會上為論文答辯時，清晰的咬字與嚴謹的邏輯是至關重要的。"
      },
      {
        start: 21.1,
        end: 30.0,
        en: "Consistent shadowing exercises will dramatically enhance your conversational cadence and natural rhythm.",
        cn: "持續的影子跟讀練習將能大幅提升您的口說抑揚頓挫與自然語感節奏。"
      }
    ]
  },
  'lesson-3': {
    title: '03. The Power of Habit & Daily Deep Work',
    artist: 'Mindset & Cognitive Mastery',
    audioUrl: 'https://actions.google.com/sounds/v1/weather/gentle_rain.ogg',
    sentences: [
      {
        start: 0,
        end: 6.5,
        en: "Success is not an overnight breakthrough; it is the cumulative result of daily micro-habits executed with intention.",
        cn: "成功絕非一朝一夕的突破，而是每天帶著專注覺知所累積的微小習慣成效。"
      },
      {
        start: 6.6,
        end: 14.0,
        en: "When you immerse yourself in focused listening, your auditory cortex adapts to recognize subtle phoneme boundaries.",
        cn: "當您沉浸於專注聆聽時，您的大腦聽覺皮質會逐漸調適並精準辨識微小的音素邊界。"
      },
      {
        start: 14.1,
        end: 22.5,
        en: "Eliminate external distractions, put on your headphones, and let the synergy of music and language guide your flow.",
        cn: "隔絕外界雜訊干擾，戴上耳機，讓音樂與語言的協同效應引領您進入心流狀態。"
      }
    ]
  }
};

const SAMPLE_TRACKS = [
  {
    id: 'track-1',
    title: 'Rainy Night Lofi Study Beats',
    artist: 'Chillhop Beats',
    album: 'Deep Focus Vol.1',
    url: 'https://actions.google.com/sounds/v1/weather/gentle_rain.ogg',
    cover: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=300&auto=format&fit=crop',
    lrc: `[00:00.00]🎵 Rainy Night Lofi Study Beats
[00:04.00]Soft rain falling outside the window
[00:09.50]Quiet thoughts drifting into peaceful focus
[00:15.00]Let the rhythm steady your breathing
[00:22.00]Every second of practice sharpens the mind
[00:29.00]Deep in the zone, calm and serene
[00:36.00]Learning without rush, steady and persistent`
  },
  {
    id: 'track-2',
    title: 'Warm Coffee Shop Acoustic Groove',
    artist: 'Acoustic Morning Trio',
    album: 'Cafe Study Vibes',
    url: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
    cover: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop',
    lrc: `[00:00.00]☕ Warm Coffee Shop Acoustic Groove
[00:05.00]The steam rises from a fresh cup of espresso
[00:11.00]Pages turning slowly in the corner booth
[00:17.00]Words and melodies intertwine seamlessly
[00:24.00]Mastering English one sentence at a time
[00:31.00]Stay present, enjoy the journey of wisdom`
  },
  {
    id: 'track-3',
    title: 'Forest Birds Dawn Meditation',
    artist: 'Nature Soundscapes',
    album: 'Pure Harmony',
    url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_morning.ogg',
    cover: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&auto=format&fit=crop',
    lrc: `[00:00.00]🌲 Forest Birds Dawn Meditation
[00:06.00]Morning light breaks through the pine canopy
[00:13.00]Breathe in the cool mountain breeze
[00:20.00]The mind settles into natural clarity
[00:28.00]Effortless concentration and boundless memory`
  }
];

// Built-in rapid dictionary for instant vocabulary lookup
const BUILTIN_DICT = {
  'shrinkflation': { ipa: '/ˈʃrɪŋk.fleɪ.ʃən/', meaning: '【名】縮水式通膨（價格不變但包裝容量縮水）' },
  'skimpflation': { ipa: '/ˈskɪmp.fleɪ.ʃən/', meaning: '【名】偷工減料型通膨（價格不變但改用廉價原料）' },
  'greedflation': { ipa: '/ˈɡriːd.fleɪ.ʃən/', meaning: '【名】貪婪通膨（企業以通膨為藉口惡意超額哄抬售價）' },
  'vigilant': { ipa: '/ˈvɪdʒ.əl.ənt/', meaning: '【形】警惕的、保持警覺的' },
  'deceptive': { ipa: '/dɪˈsep.tɪv/', meaning: '【形】欺騙性的、令人產生錯覺的' },
  'tactics': { ipa: '/ˈtæk.tɪks/', meaning: '【名】戰術、策略、策略手法' },
  'nuances': { ipa: '/ˈnjuː.ɑːnsɪz/', meaning: '【名】細微差別、微妙之處' },
  'empowers': { ipa: '/ɪmˈpaʊ.ərz/', meaning: '【動】使能夠、授權、賦予力量' },
  'articulate': { ipa: '/ɑːˈtɪk.jə.lət/', meaning: '【動】清楚闡述、清晰表達；【形】善於表達的' },
  'normalization': { ipa: '/ˌnɔː.mə.laɪˈzeɪ.ʃən/', meaning: '【名】常態化、規範化、標準化' },
  'transcript': { ipa: '/ˈtræn.skrɪpt/', meaning: '【名】成績單、文字記錄、抄本' },
  'paramount': { ipa: '/ˈpær.ə.maʊnt/', meaning: '【形】至高無上的、最重要的、首要的' },
  'symposiums': { ipa: '/sɪmˈpəʊ.zi.əmz/', meaning: '【名】學術研討會、專題討論會' },
  'cadence': { ipa: '/ˈkeɪ.dəns/', meaning: '【名】節奏、抑揚頓挫、韻律' },
  'shadowing': { ipa: '/ˈʃæd.əʊ.ɪŋ/', meaning: '【名】影子跟讀法（聽力口說同步訓練法）' },
  'auditory': { ipa: '/ˈɔː.dɪ.tər.i/', meaning: '【形】聽覺的、聽力的' },
  'cortex': { ipa: '/ˈkɔː.teks/', meaning: '【名】大腦皮層、外皮' },
  'phoneme': { ipa: '/ˈfəʊ.niːm/', meaning: '【名】音素、語音基本單位' },
  'synergy': { ipa: '/ˈsɪn.ə.dʒi/', meaning: '【名】協同效應、增效作用' },
  'phenomena': { ipa: '/fɪˈnɒm.ɪ.nə/', meaning: '【名】現象（複數）' }
};

// ==================== 2. MAIN APPLICATION CORE ====================

class AppCore {
  constructor() {
    this.audio = document.getElementById('main-audio');
    this.currentMode = 'english'; // 'english' | 'music'
    this.currentLessonKey = 'lesson-1';
    this.currentTrackIndex = 0;
    this.isBilingualVisible = true;

    // A-B Loop State
    this.pointA = null;
    this.pointB = null;
    this.loopCount = 0;
    this.activeSentenceIndex = 0;

    // Web Audio API context for white noise & visualization
    this.audioCtx = null;
    this.whiteNoises = {};

    // Vocabulary store
    this.vocabList = this.loadVocab();

    // Cache DOM elements
    this.initDOM();
    this.initAudioEvents();
    this.initUIEvents();
    this.initWebAudioNoises();
    this.initVisualizer();
    this.initMediaSession();

    // Load initial lesson & playlist
    this.loadLesson(this.currentLessonKey);
    this.renderPlaylist();
    this.renderVocabGrid();
  }

  initDOM() {
    // Tabs
    this.navTabs = document.querySelectorAll('.nav-tab');
    this.tabPanes = document.querySelectorAll('.tab-pane');
    
    // Bottom Controls
    this.playPauseBtn = document.getElementById('play-pause-btn');
    this.prevBtn = document.getElementById('prev-btn');
    this.nextBtn = document.getElementById('next-btn');
    this.seekBackBtn = document.getElementById('seek-back-btn');
    this.seekFwdBtn = document.getElementById('seek-fwd-btn');
    this.progressTrack = document.getElementById('progress-track');
    this.progressFill = document.getElementById('progress-fill');
    this.progressHandle = document.getElementById('progress-handle');
    this.abHighlight = document.getElementById('ab-highlight');
    this.currentTimeText = document.getElementById('current-time-text');
    this.durationText = document.getElementById('duration-text');
    this.mainVolumeSlider = document.getElementById('main-volume-slider');

    // Bottom Track Info
    this.bottomCover = document.getElementById('bottom-cover');
    this.bottomTitle = document.getElementById('bottom-title');
    this.bottomArtist = document.getElementById('bottom-artist');

    // English Pane
    this.transcriptContainer = document.getElementById('transcript-container');
    this.lessonSelect = document.getElementById('lesson-select');
    this.toggleCnBtn = document.getElementById('toggle-cn-btn');
    this.speedButtons = document.querySelectorAll('.speed-btn');
    this.pointAEl = document.getElementById('ab-point-a');
    this.pointBEl = document.getElementById('ab-point-b');
    this.abCountEl = document.getElementById('ab-count');
    this.setPointABtn = document.getElementById('set-point-a-btn');
    this.setPointBBtn = document.getElementById('set-point-b-btn');
    this.loopSentenceBtn = document.getElementById('loop-current-sentence-btn');
    this.clearAbBtn = document.getElementById('clear-ab-btn');
    this.recBtn = document.getElementById('rec-btn');
    this.recBtnText = document.getElementById('rec-btn-text');
    this.targetPhraseText = document.getElementById('target-phrase-text');
    this.userSpeechText = document.getElementById('user-speech-text');
    this.speechMatchBadge = document.getElementById('speech-match-badge');

    // Word Quick Card
    this.cardWord = document.getElementById('card-word');
    this.cardPhonetic = document.getElementById('card-phonetic');
    this.cardMeaning = document.getElementById('card-meaning');
    this.speakWordBtn = document.getElementById('speak-word-btn');
    this.addToVaultBtn = document.getElementById('add-to-vault-btn');

    // Music Pane
    this.vinylDisc = document.getElementById('vinyl-disc');
    this.vinylArm = document.getElementById('vinyl-arm');
    this.vinylCover = document.getElementById('vinyl-cover');
    this.musicTrackTitle = document.getElementById('music-track-title');
    this.musicTrackArtist = document.getElementById('music-track-artist');
    this.lrcContainer = document.getElementById('lrc-container');
    this.playlistContainer = document.getElementById('playlist-container');
    this.playlistCount = document.getElementById('playlist-count');
    this.musicDropzone = document.getElementById('music-dropzone');
    this.musicFileInput = document.getElementById('music-file-input');

    // Vocab Pane
    this.vocabCount = document.getElementById('vocab-count');
    this.vocabGrid = document.getElementById('vocab-grid');
    this.vocabSearch = document.getElementById('vocab-search');

    // White Noise Modal
    this.ambientBtn = document.getElementById('ambient-btn');
    this.ambientModal = document.getElementById('ambient-modal');
    this.closeAmbientBtn = document.getElementById('close-ambient-btn');

    // Theme Switch
    this.themeBtn = document.getElementById('theme-btn');
    this.themeIcon = document.getElementById('theme-icon');
  }

  // ==================== AUDIO EVENTS & A-B ENGINE ====================

  initAudioEvents() {
    this.audio.addEventListener('timeupdate', () => this.handleTimeUpdate());
    this.audio.addEventListener('play', () => this.handlePlayState(true));
    this.audio.addEventListener('pause', () => this.handlePlayState(false));
    this.audio.addEventListener('ended', () => this.handleTrackEnded());
    this.audio.addEventListener('loadedmetadata', () => {
      this.durationText.textContent = this.formatTime(this.audio.duration || 0);
      this.updateABHighlight();
    });

    // Volume
    this.mainVolumeSlider.addEventListener('input', (e) => {
      this.audio.volume = parseFloat(e.target.value);
    });
  }

  handlePlayState(isPlaying) {
    this.playPauseBtn.textContent = isPlaying ? '⏸️' : '▶️';
    if (isPlaying) {
      this.vinylDisc.classList.add('playing');
      this.vinylArm.classList.add('playing');
    } else {
      this.vinylDisc.classList.remove('playing');
      this.vinylArm.classList.remove('playing');
    }
  }

  handleTimeUpdate() {
    const cur = this.audio.currentTime;
    const dur = this.audio.duration || 0;

    // Update Progress Bar
    if (dur > 0) {
      const pct = (cur / dur) * 100;
      this.progressFill.style.width = `${pct}%`;
      this.progressHandle.style.left = `${pct}%`;
      this.currentTimeText.textContent = this.formatTime(cur);
    }

    // A-B Looping Check
    if (this.pointA !== null && this.pointB !== null) {
      if (cur >= this.pointB) {
        this.audio.currentTime = this.pointA;
        this.loopCount++;
        this.abCountEl.textContent = this.loopCount;
        return;
      }
    }

    // Sync based on current mode
    if (this.currentMode === 'english') {
      this.syncEnglishTranscript(cur);
    } else if (this.currentMode === 'music') {
      this.syncMusicLyrics(cur);
    }
  }

  handleTrackEnded() {
    if (this.currentMode === 'music') {
      this.playNextTrack();
    } else {
      this.playPauseBtn.textContent = '▶️';
    }
  }

  // ==================== USER INTERACTION EVENTS ====================

  initUIEvents() {
    // Mode / Tab Switching
    this.navTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        this.navTabs.forEach((t) => t.classList.remove('active'));
        this.tabPanes.forEach((p) => p.classList.remove('active'));
        tab.classList.add('active');

        const targetId = tab.getAttribute('data-tab');
        document.getElementById(targetId).classList.add('active');

        if (targetId === 'english-tab') {
          this.currentMode = 'english';
          this.loadLesson(this.currentLessonKey, false);
        } else if (targetId === 'music-tab') {
          this.currentMode = 'music';
          this.loadTrack(this.currentTrackIndex, false);
        }
      });
    });

    // Play / Pause
    this.playPauseBtn.addEventListener('click', () => {
      if (this.audio.paused) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    });

    // Seeking (Track Click)
    this.progressTrack.addEventListener('click', (e) => {
      const rect = this.progressTrack.getBoundingClientRect();
      const clickPos = (e.clientX - rect.left) / rect.width;
      if (this.audio.duration) {
        this.audio.currentTime = clickPos * this.audio.duration;
      }
    });

    // 5s Jump
    this.seekBackBtn.addEventListener('click', () => {
      this.audio.currentTime = Math.max(0, this.audio.currentTime - 5);
    });
    this.seekFwdBtn.addEventListener('click', () => {
      this.audio.currentTime = Math.min(this.audio.duration || 0, this.audio.currentTime + 5);
    });

    // Prev / Next
    this.prevBtn.addEventListener('click', () => {
      if (this.currentMode === 'english') {
        this.jumpSentence(-1);
      } else {
        this.playPrevTrack();
      }
    });
    this.nextBtn.addEventListener('click', () => {
      if (this.currentMode === 'english') {
        this.jumpSentence(1);
      } else {
        this.playNextTrack();
      }
    });

    // Speed Controls
    this.speedButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.speedButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const speed = parseFloat(btn.dataset.speed);
        this.audio.playbackRate = speed;
      });
    });

    // A-B Looping Buttons
    this.setPointABtn.addEventListener('click', () => {
      this.pointA = this.audio.currentTime;
      this.pointAEl.textContent = this.formatTime(this.pointA);
      this.updateABHighlight();
    });

    this.setPointBBtn.addEventListener('click', () => {
      if (this.pointA === null) {
        this.pointA = 0;
        this.pointAEl.textContent = '00:00';
      }
      this.pointB = Math.max(this.pointA + 0.5, this.audio.currentTime);
      this.pointBEl.textContent = this.formatTime(this.pointB);
      this.loopCount = 0;
      this.abCountEl.textContent = '0';
      this.updateABHighlight();
    });

    this.loopSentenceBtn.addEventListener('click', () => {
      const lesson = SAMPLE_LESSONS[this.currentLessonKey];
      if (!lesson || !lesson.sentences[this.activeSentenceIndex]) return;
      const s = lesson.sentences[this.activeSentenceIndex];
      this.pointA = s.start;
      this.pointB = s.end;
      this.pointAEl.textContent = this.formatTime(this.pointA);
      this.pointBEl.textContent = this.formatTime(this.pointB);
      this.loopCount = 0;
      this.abCountEl.textContent = '0';
      this.audio.currentTime = this.pointA;
      this.audio.play();
      this.updateABHighlight();
    });

    this.clearAbBtn.addEventListener('click', () => {
      this.pointA = null;
      this.pointB = null;
      this.pointAEl.textContent = '--:--';
      this.pointBEl.textContent = '--:--';
      this.loopCount = 0;
      this.abCountEl.textContent = '0';
      this.updateABHighlight();
    });

    // Lesson Dropdown
    this.lessonSelect.addEventListener('change', (e) => {
      this.currentLessonKey = e.target.value;
      this.loadLesson(this.currentLessonKey, true);
    });

    // Bilingual Toggle
    this.toggleCnBtn.addEventListener('click', () => {
      this.isBilingualVisible = !this.isBilingualVisible;
      this.toggleCnBtn.classList.toggle('active', this.isBilingualVisible);
      document.querySelectorAll('.sentence-cn').forEach((el) => {
        el.classList.toggle('hidden', !this.isBilingualVisible);
      });
    });

    // Pronounce Word Button
    this.speakWordBtn.addEventListener('click', () => {
      const word = this.cardWord.textContent;
      if (word && word !== '點擊左側單字') {
        this.speakText(word);
      }
    });

    // Add to Vault Button
    this.addToVaultBtn.addEventListener('click', () => {
      const word = this.cardWord.textContent;
      if (!word || word === '點擊左側單字') return;
      const phonetic = this.cardPhonetic.textContent;
      const meaning = this.cardMeaning.textContent;
      const context = this.targetPhraseText.textContent;

      this.saveWordToVault({ word, phonetic, meaning, context });
    });

    // Shadowing Microphone Speech Recognition
    this.initSpeechRecognition();

    // White Noise Modal
    this.ambientBtn.addEventListener('click', () => {
      this.ambientModal.classList.remove('hidden');
    });
    this.closeAmbientBtn.addEventListener('click', () => {
      this.ambientModal.classList.add('hidden');
    });

    // Theme Switcher
    this.themeBtn.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-theme');
      this.themeIcon.textContent = isLight ? '☀️' : '🌙';
    });

    // Local Music Drop & Import
    this.initLocalMusicHandlers();

    // Vocab Export
    document.getElementById('export-vocab-json').addEventListener('click', () => this.exportVocab('json'));
    document.getElementById('export-vocab-csv').addEventListener('click', () => this.exportVocab('csv'));
    document.getElementById('clear-all-vocab').addEventListener('click', () => {
      if (confirm('確定要清空所有已收藏的生詞嗎？此操作無法撤銷。')) {
        this.vocabList = [];
        this.persistVocab();
        this.renderVocabGrid();
      }
    });
  }

  // ==================== ENGLISH LESSON ENGINE ====================

  loadLesson(key, autoPlay = false) {
    const lesson = SAMPLE_LESSONS[key];
    if (!lesson) return;

    this.bottomTitle.textContent = lesson.title;
    this.bottomArtist.textContent = lesson.artist;
    this.targetPhraseText.textContent = lesson.sentences[0].en;

    // Build Transcript HTML with interactive tokens
    this.transcriptContainer.innerHTML = '';
    lesson.sentences.forEach((s, idx) => {
      const div = document.createElement('div');
      div.className = `sentence-item ${idx === 0 ? 'active' : ''}`;
      div.dataset.index = idx;
      div.dataset.start = s.start;
      div.dataset.end = s.end;

      // Tokenize English words
      const words = s.en.split(/\s+/);
      const tokenizedHTML = words.map((w) => {
        const clean = w.replace(/[^a-zA-Z]/g, '').toLowerCase();
        const isSaved = this.vocabList.some((v) => v.word.toLowerCase() === clean);
        return `<span class="word-token ${isSaved ? 'saved' : ''}" data-word="${clean}">${w}</span>`;
      }).join(' ');

      div.innerHTML = `
        <div class="sentence-timestamp">${this.formatTime(s.start)} - ${this.formatTime(s.end)}</div>
        <div class="sentence-en">${tokenizedHTML}</div>
        <div class="sentence-cn ${this.isBilingualVisible ? '' : 'hidden'}">${s.cn}</div>
      `;

      // Sentence click jumps audio
      div.addEventListener('click', (e) => {
        if (e.target.classList.contains('word-token')) {
          this.handleWordClick(e.target.dataset.word, s.en);
          return;
        }
        this.audio.currentTime = s.start;
        this.activeSentenceIndex = idx;
        this.audio.play();
      });

      this.transcriptContainer.appendChild(div);
    });

    if (this.currentMode === 'english') {
      this.audio.src = lesson.audioUrl;
      if (autoPlay) this.audio.play();
    }
  }

  handleWordClick(word, contextSentence) {
    if (!word) return;
    const lookup = BUILTIN_DICT[word] || {
      ipa: `/${word}/`,
      meaning: `【詞彙】${word}（點擊發音或加入生詞本）`
    };

    this.cardWord.textContent = word;
    this.cardPhonetic.textContent = lookup.ipa;
    this.cardMeaning.textContent = lookup.meaning;
    this.targetPhraseText.textContent = contextSentence;
  }

  syncEnglishTranscript(time) {
    const lesson = SAMPLE_LESSONS[this.currentLessonKey];
    if (!lesson) return;

    const items = this.transcriptContainer.querySelectorAll('.sentence-item');
    lesson.sentences.forEach((s, idx) => {
      if (time >= s.start && time <= s.end) {
        if (this.activeSentenceIndex !== idx) {
          this.activeSentenceIndex = idx;
          items.forEach((it) => it.classList.remove('active'));
          if (items[idx]) {
            items[idx].classList.add('active');
            items[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            this.targetPhraseText.textContent = s.en;
          }
        }
      }
    });
  }

  jumpSentence(delta) {
    const lesson = SAMPLE_LESSONS[this.currentLessonKey];
    if (!lesson) return;
    const nextIdx = Math.max(0, Math.min(lesson.sentences.length - 1, this.activeSentenceIndex + delta));
    const target = lesson.sentences[nextIdx];
    if (target) {
      this.activeSentenceIndex = nextIdx;
      this.audio.currentTime = target.start;
      this.audio.play();
    }
  }

  // ==================== SHADOWING & WEB SPEECH ====================

  initSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      this.recBtnText.textContent = '此瀏覽器不支援語音辨識';
      this.recBtn.disabled = true;
      return;
    }

    const recognition = new SpeechRec();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    let isRecording = false;

    this.recBtn.addEventListener('click', () => {
      if (!isRecording) {
        recognition.start();
        isRecording = true;
        this.recBtn.classList.add('recording');
        this.recBtnText.textContent = '聆聽中... 請大聲朗讀';
        this.userSpeechText.textContent = '...';
        this.speechMatchBadge.textContent = '錄音評測中';
        this.speechMatchBadge.className = 'match-badge';
      } else {
        recognition.stop();
        isRecording = false;
        this.recBtn.classList.remove('recording');
        this.recBtnText.textContent = '點擊開始朗讀';
      }
    });

    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join('');
      this.userSpeechText.textContent = `🗣️ 您的發音: "${transcript}"`;

      // Simple Levenshtein / Word Overlap Accuracy
      const target = this.targetPhraseText.textContent.toLowerCase().replace(/[^a-z0-9\s]/g, '');
      const user = transcript.toLowerCase().replace(/[^a-z0-9\s]/g, '');

      const targetWords = target.split(/\s+/);
      const userWords = user.split(/\s+/);
      const matched = targetWords.filter((w) => userWords.includes(w)).length;
      const score = Math.round((matched / Math.max(1, targetWords.length)) * 100);

      this.speechMatchBadge.textContent = `準確度: ${score}%`;
      if (score >= 75) {
        this.speechMatchBadge.classList.add('high');
      }
    };

    recognition.onend = () => {
      isRecording = false;
      this.recBtn.classList.remove('recording');
      this.recBtnText.textContent = '點擊重新朗讀';
    };
  }

  // ==================== MUSIC & LRC LYRICS ENGINE ====================

  loadTrack(index, autoPlay = true) {
    if (index < 0 || index >= SAMPLE_TRACKS.length) return;
    this.currentTrackIndex = index;
    const track = SAMPLE_TRACKS[index];

    this.musicTrackTitle.textContent = track.title;
    this.musicTrackArtist.textContent = track.artist;
    this.vinylCover.style.backgroundImage = `url('${track.cover}')`;
    this.bottomCover.style.backgroundImage = `url('${track.cover}')`;
    this.bottomTitle.textContent = track.title;
    this.bottomArtist.textContent = track.artist;

    this.renderLrc(track.lrc);

    // Highlight in playlist
    document.querySelectorAll('.playlist-item').forEach((item, idx) => {
      item.classList.toggle('active', idx === index);
    });

    if (this.currentMode === 'music') {
      this.audio.src = track.url;
      if (autoPlay) this.audio.play();
    }
  }

  renderLrc(lrcText) {
    this.lrcLines = [];
    this.lrcContainer.innerHTML = '';

    const lines = lrcText.split('\n');
    const regex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;

    lines.forEach((line) => {
      const match = line.match(regex);
      if (match) {
        const min = parseInt(match[1]);
        const sec = parseInt(match[2]);
        const ms = parseInt(match[3]);
        const time = min * 60 + sec + ms / (match[3].length === 2 ? 100 : 1000);
        const text = match[4].trim();

        if (text) {
          const p = document.createElement('p');
          p.className = 'lrc-line';
          p.textContent = text;
          p.dataset.time = time;
          p.addEventListener('click', () => {
            this.audio.currentTime = time;
            this.audio.play();
          });
          this.lrcContainer.appendChild(p);
          this.lrcLines.push({ time, element: p });
        }
      }
    });
  }

  syncMusicLyrics(time) {
    if (!this.lrcLines || this.lrcLines.length === 0) return;

    for (let i = 0; i < this.lrcLines.length; i++) {
      const cur = this.lrcLines[i];
      const next = this.lrcLines[i + 1];

      if (time >= cur.time && (!next || time < next.time)) {
        this.lrcLines.forEach((l, idx) => {
          if (idx === i) {
            l.element.classList.add('active');
            l.element.classList.remove('past');
            l.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else if (idx < i) {
            l.element.classList.remove('active');
            l.element.classList.add('past');
          } else {
            l.element.classList.remove('active', 'past');
          }
        });
        break;
      }
    }
  }

  playNextTrack() {
    let next = this.currentTrackIndex + 1;
    if (next >= SAMPLE_TRACKS.length) next = 0;
    this.loadTrack(next, true);
  }

  playPrevTrack() {
    let prev = this.currentTrackIndex - 1;
    if (prev < 0) prev = SAMPLE_TRACKS.length - 1;
    this.loadTrack(prev, true);
  }

  renderPlaylist() {
    this.playlistContainer.innerHTML = '';
    this.playlistCount.textContent = SAMPLE_TRACKS.length;

    SAMPLE_TRACKS.forEach((track, idx) => {
      const li = document.createElement('li');
      li.className = `playlist-item ${idx === this.currentTrackIndex ? 'active' : ''}`;
      li.innerHTML = `
        <div class="track-info-cell">
          <h4>${track.title}</h4>
          <small>${track.artist}</small>
        </div>
        <span class="track-duration">--:--</span>
      `;
      li.addEventListener('click', () => {
        this.loadTrack(idx, true);
      });
      this.playlistContainer.appendChild(li);
    });
  }

  initLocalMusicHandlers() {
    // Dropzone
    this.musicDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.musicDropzone.classList.add('dragover');
    });
    this.musicDropzone.addEventListener('dragleave', () => {
      this.musicDropzone.classList.remove('dragover');
    });
    this.musicDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.musicDropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        this.handleLocalFiles(e.dataTransfer.files);
      }
    });

    this.musicFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        this.handleLocalFiles(e.target.files);
      }
    });
  }

  handleLocalFiles(files) {
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const title = file.name.replace(/\.[^/.]+$/, '');
      SAMPLE_TRACKS.push({
        id: `local-${Date.now()}-${Math.random()}`,
        title: title,
        artist: '本地音樂 (Local File)',
        album: '我的私密曲庫',
        url: url,
        cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop',
        lrc: `[00:00.00]🎵 ${title}\n[00:05.00]享受本地高音質無損音檔播放`
      });
    });

    this.renderPlaylist();
    // Switch to newly added track
    this.loadTrack(SAMPLE_TRACKS.length - 1, true);
  }

  // ==================== PROCEDURAL WHITE NOISE GENERATOR ====================

  initWebAudioNoises() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const setupNoise = (sliderId, type) => {
      const slider = document.getElementById(sliderId);
      let sourceNode = null;
      let gainNode = null;

      slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (!this.audioCtx) {
          this.audioCtx = new AudioContext();
        }
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }

        if (val > 0) {
          if (!sourceNode) {
            // Create white noise buffer
            const bufferSize = this.audioCtx.sampleRate * 2;
            const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
              data[i] = Math.random() * 2 - 1;
            }

            sourceNode = this.audioCtx.createBufferSource();
            sourceNode.buffer = buffer;
            sourceNode.loop = true;

            // Lowpass / Bandpass filter to simulate nature tones
            const filter = this.audioCtx.createBiquadFilter();
            if (type === 'rain') {
              filter.type = 'lowpass';
              filter.frequency.value = 800;
            } else if (type === 'fire') {
              filter.type = 'bandpass';
              filter.frequency.value = 400;
            } else if (type === 'cafe') {
              filter.type = 'bandpass';
              filter.frequency.value = 1200;
            } else {
              filter.type = 'highpass';
              filter.frequency.value = 1800;
            }

            gainNode = this.audioCtx.createGain();
            sourceNode.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioCtx.destination);
            sourceNode.start();
          }
          gainNode.gain.setValueAtTime(val * 0.4, this.audioCtx.currentTime);
        } else if (gainNode) {
          gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
        }
      });
    };

    setupNoise('noise-rain-vol', 'rain');
    setupNoise('noise-fire-vol', 'fire');
    setupNoise('noise-cafe-vol', 'cafe');
    setupNoise('noise-birds-vol', 'birds');
  }

  // ==================== VISUALIZER CANVAS ====================

  initVisualizer() {
    const canvas = document.getElementById('audio-visualizer-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isPlaying = !this.audio.paused;
      const bars = 28;
      const barWidth = canvas.width / bars - 2;

      for (let i = 0; i < bars; i++) {
        let h = 4;
        if (isPlaying) {
          h = Math.sin(Date.now() / 150 + i * 0.4) * 20 + 25;
        }
        ctx.fillStyle = isPlaying ? '#6366f1' : 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(i * (barWidth + 2), canvas.height - h, barWidth, h);
      }
    };
    draw();
  }

  // ==================== VOCABULARY VAULT ====================

  loadVocab() {
    try {
      const raw = localStorage.getItem('oscarmark_vocab');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  persistVocab() {
    localStorage.setItem('oscarmark_vocab', JSON.stringify(this.vocabList));
    this.vocabCount.textContent = this.vocabList.length;
  }

  saveWordToVault({ word, phonetic, meaning, context }) {
    if (this.vocabList.some((v) => v.word.toLowerCase() === word.toLowerCase())) {
      alert(`「${word}」已經在您的生詞庫中囉！`);
      return;
    }

    const item = {
      id: Date.now(),
      word,
      phonetic,
      meaning,
      context,
      date: new Date().toLocaleDateString('zh-TW')
    };

    this.vocabList.unshift(item);
    this.persistVocab();
    this.renderVocabGrid();

    // Re-mark token in transcript
    document.querySelectorAll(`.word-token[data-word="${word.toLowerCase()}"]`).forEach((el) => {
      el.classList.add('saved');
    });

    alert(`🎉 已將單字「${word}」收入生詞庫！`);
  }

  renderVocabGrid() {
    this.vocabCount.textContent = this.vocabList.length;
    this.vocabGrid.innerHTML = '';

    if (this.vocabList.length === 0) {
      this.vocabGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; color: var(--text-dim); padding: 40px;">
          📖 目前尚無生詞記錄。在英語精讀模式中點擊任何單詞，即可一鍵收藏至此！
        </div>
      `;
      return;
    }

    this.vocabList.forEach((v) => {
      const card = document.createElement('div');
      card.className = 'vocab-card glass-inner';
      card.innerHTML = `
        <div class="vocab-card-top">
          <div class="vocab-card-word">${v.word}</div>
          <div class="vocab-card-actions">
            <button class="mini-icon-btn speak-v-btn" title="發音">🔊</button>
            <button class="mini-icon-btn del-v-btn" title="刪除">✕</button>
          </div>
        </div>
        <div class="phonetic">${v.phonetic}</div>
        <div class="word-meaning">${v.meaning}</div>
        ${v.context ? `<div class="vocab-card-context">“${v.context}”</div>` : ''}
      `;

      card.querySelector('.speak-v-btn').addEventListener('click', () => {
        this.speakText(v.word);
      });

      card.querySelector('.del-v-btn').addEventListener('click', () => {
        this.vocabList = this.vocabList.filter((x) => x.id !== v.id);
        this.persistVocab();
        this.renderVocabGrid();
      });

      this.vocabGrid.appendChild(card);
    });
  }

  exportVocab(format) {
    if (this.vocabList.length === 0) {
      alert('生詞庫目前為空，無法匯出。');
      return;
    }

    let dataStr = '';
    let filename = '';

    if (format === 'json') {
      dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.vocabList, null, 2));
      filename = `oscarmark_vocab_${Date.now()}.json`;
    } else {
      // CSV format compatible with Anki import
      let csv = 'Front,Back,Context\n';
      this.vocabList.forEach((v) => {
        const front = `"${v.word} ${v.phonetic}"`;
        const back = `"${v.meaning.replace(/"/g, '""')}"`;
        const ctx = `"${(v.context || '').replace(/"/g, '""')}"`;
        csv += `${front},${back},${ctx}\n`;
      });
      dataStr = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csv);
      filename = `oscarmark_anki_cards_${Date.now()}.csv`;
    }

    const a = document.createElement('a');
    a.href = dataStr;
    a.download = filename;
    a.click();
  }

  // ==================== UTILITIES ====================

  speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  }

  updateABHighlight() {
    if (this.pointA !== null && this.pointB !== null && this.audio.duration) {
      const dur = this.audio.duration;
      const left = (this.pointA / dur) * 100;
      const width = ((this.pointB - this.pointA) / dur) * 100;
      this.abHighlight.style.display = 'block';
      this.abHighlight.style.left = `${left}%`;
      this.abHighlight.style.width = `${width}%`;
    } else {
      this.abHighlight.style.display = 'none';
    }
  }

  formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }

  initMediaSession() {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => this.audio.play());
      navigator.mediaSession.setActionHandler('pause', () => this.audio.pause());
      navigator.mediaSession.setActionHandler('previoustrack', () => this.prevBtn.click());
      navigator.mediaSession.setActionHandler('nexttrack', () => this.nextBtn.click());
    }
  }
}

// Bootstrap when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.app = new AppCore();
});
