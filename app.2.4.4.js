// Đệ Nhị Web v1.9.1 — Hotfix + Deck Detail CRUD
const $ = (id) => document.getElementById(id);

const DB = { name: "de_nhi_web_db", version: 1, store: "decks" };

const STORAGE = {
  settings: "de_nhi_settings_v2",
  progress: "de_nhi_progress_v2",
  seedKey: "de_nhi_seed_key",
};

const STARTER_DECK = [{"id": "st_001", "word": "abandon", "ipa": "/əˈbændən/", "meaning": "từ bỏ", "example": "He decided to abandon the plan.", "example_vi": "Anh ấy quyết định từ bỏ kế hoạch."}, {"id": "st_002", "word": "ability", "ipa": "/əˈbɪləti/", "meaning": "khả năng", "example": "She has the ability to learn fast.", "example_vi": "Cô ấy có khả năng học nhanh."}, {"id": "st_003", "word": "achieve", "ipa": "/əˈtʃiːv/", "meaning": "đạt được", "example": "You can achieve your goals.", "example_vi": "Bạn có thể đạt được mục tiêu."}, {"id": "st_004", "word": "advice", "ipa": "/ədˈvaɪs/", "meaning": "lời khuyên", "example": "He gave me good advice.", "example_vi": "Anh ấy cho tôi lời khuyên tốt."}, {"id": "st_005", "word": "afford", "ipa": "/əˈfɔːrd/", "meaning": "có đủ khả năng (chi trả)", "example": "I can't afford a new phone.", "example_vi": "Tôi không đủ tiền mua điện thoại mới."}, {"id": "st_006", "word": "agree", "ipa": "/əˈɡriː/", "meaning": "đồng ý", "example": "I agree with your idea.", "example_vi": "Tôi đồng ý với ý tưởng của bạn."}, {"id": "st_007", "word": "allow", "ipa": "/əˈlaʊ/", "meaning": "cho phép", "example": "They don't allow smoking here.", "example_vi": "Họ không cho phép hút thuốc ở đây."}, {"id": "st_008", "word": "amazing", "ipa": "/əˈmeɪzɪŋ/", "meaning": "đáng kinh ngạc", "example": "It was an amazing trip.", "example_vi": "Đó là chuyến đi đáng kinh ngạc."}, {"id": "st_009", "word": "announce", "ipa": "/əˈnaʊns/", "meaning": "thông báo", "example": "They announced the results.", "example_vi": "Họ đã thông báo kết quả."}, {"id": "st_010", "word": "anxious", "ipa": "/ˈæŋkʃəs/", "meaning": "lo lắng", "example": "She feels anxious about the exam.", "example_vi": "Cô ấy lo lắng về kỳ thi."}, {"id": "st_011", "word": "appear", "ipa": "/əˈpɪr/", "meaning": "xuất hiện", "example": "A rainbow appeared.", "example_vi": "Cầu vồng xuất hiện."}, {"id": "st_012", "word": "arrange", "ipa": "/əˈreɪndʒ/", "meaning": "sắp xếp", "example": "Let's arrange a meeting.", "example_vi": "Hãy sắp xếp một cuộc họp."}, {"id": "st_013", "word": "arrive", "ipa": "/əˈraɪv/", "meaning": "đến nơi", "example": "We arrived late.", "example_vi": "Chúng tôi đến muộn."}, {"id": "st_014", "word": "assist", "ipa": "/əˈsɪst/", "meaning": "hỗ trợ", "example": "Can you assist me?", "example_vi": "Bạn có thể hỗ trợ tôi không?"}, {"id": "st_015", "word": "avoid", "ipa": "/əˈvɔɪd/", "meaning": "tránh", "example": "Avoid making the same mistake.", "example_vi": "Tránh mắc lại lỗi đó."}, {"id": "st_016", "word": "balance", "ipa": "/ˈbæl.əns/", "meaning": "cân bằng", "example": "Work-life balance matters.", "example_vi": "Cân bằng công việc-cuộc sống rất quan trọng."}, {"id": "st_017", "word": "benefit", "ipa": "/ˈben.ə.fɪt/", "meaning": "lợi ích", "example": "Exercise has many benefits.", "example_vi": "Tập thể dục có nhiều lợi ích."}, {"id": "st_018", "word": "bother", "ipa": "/ˈbɑːðər/", "meaning": "làm phiền", "example": "Sorry to bother you.", "example_vi": "Xin lỗi vì làm phiền bạn."}, {"id": "st_019", "word": "calm", "ipa": "/kɑːm/", "meaning": "bình tĩnh", "example": "Stay calm.", "example_vi": "Hãy bình tĩnh."}, {"id": "st_020", "word": "capture", "ipa": "/ˈkæp.tʃɚ/", "meaning": "bắt/ghi lại", "example": "She captured the moment on camera.", "example_vi": "Cô ấy ghi lại khoảnh khắc bằng máy ảnh."}, {"id": "st_021", "word": "challenge", "ipa": "/ˈtʃæl.ɪndʒ/", "meaning": "thử thách", "example": "This is a big challenge.", "example_vi": "Đây là một thử thách lớn."}, {"id": "st_022", "word": "consider", "ipa": "/kənˈsɪd.ɚ/", "meaning": "cân nhắc", "example": "Consider all options.", "example_vi": "Hãy cân nhắc mọi lựa chọn."}, {"id": "st_023", "word": "contain", "ipa": "/kənˈteɪn/", "meaning": "chứa đựng", "example": "This box contains books.", "example_vi": "Cái hộp này chứa sách."}, {"id": "st_024", "word": "contribute", "ipa": "/kənˈtrɪb.juːt/", "meaning": "đóng góp", "example": "Everyone can contribute.", "example_vi": "Ai cũng có thể đóng góp."}, {"id": "st_025", "word": "convince", "ipa": "/kənˈvɪns/", "meaning": "thuyết phục", "example": "He convinced me to try.", "example_vi": "Anh ấy thuyết phục tôi thử."}, {"id": "st_026", "word": "create", "ipa": "/kriˈeɪt/", "meaning": "tạo ra", "example": "They create new products.", "example_vi": "Họ tạo ra sản phẩm mới."}, {"id": "st_027", "word": "damage", "ipa": "/ˈdæm.ɪdʒ/", "meaning": "thiệt hại", "example": "The storm caused damage.", "example_vi": "Cơn bão gây thiệt hại."}, {"id": "st_028", "word": "decide", "ipa": "/dɪˈsaɪd/", "meaning": "quyết định", "example": "Decide quickly.", "example_vi": "Quyết định nhanh."}, {"id": "st_029", "word": "deliver", "ipa": "/dɪˈlɪv.ɚ/", "meaning": "giao/trao", "example": "They deliver food.", "example_vi": "Họ giao đồ ăn."}, {"id": "st_030", "word": "describe", "ipa": "/dɪˈskraɪb/", "meaning": "mô tả", "example": "Describe your experience.", "example_vi": "Hãy mô tả trải nghiệm của bạn."}, {"id": "st_031", "word": "develop", "ipa": "/dɪˈvel.əp/", "meaning": "phát triển", "example": "He wants to develop skills.", "example_vi": "Anh ấy muốn phát triển kỹ năng."}, {"id": "st_032", "word": "effort", "ipa": "/ˈef.ɚt/", "meaning": "nỗ lực", "example": "It takes effort.", "example_vi": "Nó cần nỗ lực."}, {"id": "st_033", "word": "enable", "ipa": "/ɪˈneɪ.bəl/", "meaning": "cho phép/giúp có thể", "example": "This enables faster work.", "example_vi": "Điều này giúp làm việc nhanh hơn."}, {"id": "st_034", "word": "encourage", "ipa": "/ɪnˈkɝː.ɪdʒ/", "meaning": "khuyến khích", "example": "Teachers encourage students.", "example_vi": "Giáo viên khuyến khích học sinh."}, {"id": "st_035", "word": "enjoy", "ipa": "/ɪnˈdʒɔɪ/", "meaning": "thưởng thức", "example": "Enjoy your meal.", "example_vi": "Chúc bạn ngon miệng."}, {"id": "st_036", "word": "escape", "ipa": "/ɪˈskeɪp/", "meaning": "trốn thoát", "example": "They escaped safely.", "example_vi": "Họ trốn thoát an toàn."}, {"id": "st_037", "word": "estimate", "ipa": "/ˈes.tə.meɪt/", "meaning": "ước tính", "example": "We estimate the cost.", "example_vi": "Chúng tôi ước tính chi phí."}, {"id": "st_038", "word": "exact", "ipa": "/ɪɡˈzækt/", "meaning": "chính xác", "example": "Give the exact number.", "example_vi": "Hãy đưa số chính xác."}, {"id": "st_039", "word": "expand", "ipa": "/ɪkˈspænd/", "meaning": "mở rộng", "example": "The company expanded.", "example_vi": "Công ty đã mở rộng."}, {"id": "st_040", "word": "fail", "ipa": "/feɪl/", "meaning": "thất bại", "example": "Don't be afraid to fail.", "example_vi": "Đừng sợ thất bại."}, {"id": "st_041", "word": "feature", "ipa": "/ˈfiː.tʃɚ/", "meaning": "tính năng", "example": "This app has a new feature.", "example_vi": "App này có tính năng mới."}, {"id": "st_042", "word": "focus", "ipa": "/ˈfoʊ.kəs/", "meaning": "tập trung", "example": "Focus on the task.", "example_vi": "Tập trung vào nhiệm vụ."}, {"id": "st_043", "word": "forgive", "ipa": "/fɚˈɡɪv/", "meaning": "tha thứ", "example": "Please forgive me.", "example_vi": "Làm ơn tha thứ cho tôi."}, {"id": "st_044", "word": "gather", "ipa": "/ˈɡæð.ɚ/", "meaning": "tụ tập/thu thập", "example": "People gathered outside.", "example_vi": "Mọi người tụ tập bên ngoài."}, {"id": "st_045", "word": "improve", "ipa": "/ɪmˈpruːv/", "meaning": "cải thiện", "example": "We need to improve.", "example_vi": "Chúng ta cần cải thiện."}, {"id": "st_046", "word": "increase", "ipa": "/ɪnˈkriːs/", "meaning": "tăng lên", "example": "Prices increased.", "example_vi": "Giá tăng lên."}, {"id": "st_047", "word": "influence", "ipa": "/ˈɪn.flu.əns/", "meaning": "ảnh hưởng", "example": "Parents influence children.", "example_vi": "Cha mẹ ảnh hưởng con cái."}, {"id": "st_048", "word": "mention", "ipa": "/ˈmen.ʃən/", "meaning": "nhắc đến", "example": "He mentioned your name.", "example_vi": "Anh ấy nhắc đến tên bạn."}, {"id": "st_049", "word": "observe", "ipa": "/əbˈzɝːv/", "meaning": "quan sát", "example": "Observe carefully.", "example_vi": "Quan sát kỹ."}, {"id": "st_050", "word": "prefer", "ipa": "/prɪˈfɝː/", "meaning": "thích hơn", "example": "I prefer tea to coffee.", "example_vi": "Tôi thích trà hơn cà phê."}];


const state = {
  view: "home",
  deckId: "__all", // __all, __fav, or real deck id
  decks: [],       // [{id,name,createdAt,updatedAt,wordsCount}]
  deckWords: new Map(), // deckId -> words[]
  cards: [],       // current deck cards
  index: 0,
  flipped: false,

  favorites: new Set(), // `${deckId}:${wordId}`
  seen: {},

  theme: "light",
  learnNewOnly: false,
  ttsAutoFront: false,
  ttsAutoBack: false,
  autoOn: false,
  autoFront: 4,
  autoBack: 6,
  random: false,
  voicePref: "US",
  speakMode: "word"
};

let autoTimer = null;
let autoStepTimer = null;
let autoPhase = 'front';
let autoPhaseStart = 0;
let lastCardStart = Date.now();
let timeSum = 0;
let timeCount = 0;

// ---------- IndexedDB ----------
function openDB(){
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB.name, DB.version);
    req.onupgradeneeded = () => {
      const db = req.result;
      if(!db.objectStoreNames.contains(DB.store)){
        db.createObjectStore(DB.store, { keyPath: "id" }); // {id,name,createdAt,updatedAt,words:[...]}
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGetAll(){
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB.store, "readonly");
    const st = tx.objectStore(DB.store);
    const req = st.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(deck){
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB.store, "readwrite");
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
    tx.objectStore(DB.store).put(deck);
  });
}

async function idbXoá(deckId){
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB.store, "readwrite");
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
    tx.objectStore(DB.store).delete(deckId);
  });
}

async function idbClear(){
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB.store, "readwrite");
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
    tx.objectStore(DB.store).clear();
  });
}

function uid(){
  return (crypto?.randomUUID?.() || `id_${Date.now()}_${Math.random().toString(16).slice(2)}`);
}

// Stable word id: keep progress when re-importing the same words
function stableWordId(word){
  const s = String(word||"").trim().toLowerCase();
  // FNV-1a 32-bit
  let h = 2166136261;
  for(let i=0;i<s.length;i++){
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // unsigned
  return "w_" + (h >>> 0).toString(16);
}

// User interaction: avoid auto-timer "ghost flips/next"
let autoInternalStep = false;
let lastAutoSpeakKey = "";

function onUserInteract(){
  if(autoInternalStep) return;
  if(!state.autoOn) return;
  stopAuto();
  startAuto();
}

// ---------- Settings / Progress ----------
function saveSettings(){
  localStorage.setItem(STORAGE.settings, JSON.stringify({
    theme: state.theme,
    autoOn: state.autoOn,
    autoFront: state.autoFront,
    autoBack: state.autoBack,
    random: state.random,
    voicePref: state.voicePref,
    speakMode: state.speakMode
  }));
}

function loadSettings(){
  try{
    const s = JSON.parse(localStorage.getItem(STORAGE.settings) || "{}");
    if(s.theme) state.theme = s.theme;
    if(typeof s.autoOn === "boolean") state.autoOn = s.autoOn;
    if(typeof s.autoFront === "number") state.autoFront = s.autoFront;
    if(typeof s.autoBack === "number") state.autoBack = s.autoBack;
    if(typeof s.random === "boolean") state.random = s.random;
    if(s.voicePref) state.voicePref = s.voicePref;
    if(s.speakMode) state.speakMode = s.speakMode;
  }catch{}
}


function cleanupOrphanProgress(){
  // Remove favorites/seen entries that no longer exist in current decks
  const valid = new Set();
  for(const [deckId, words] of state.deckWords.entries()){
    for(const w of (words||[])){
      if(w && w.id) valid.add(String(w.id));
    }
  }

  // Favorites: Set of wordId
  const fav = new Set();
  for(const id of state.favorites || []){
    if(valid.has(String(id))) fav.add(String(id));
  }
  state.favorites = fav;

  // SRS: object wordId->srs
  const srsClean = {};
  const srs = state.srs || {};
  for(const [id, v] of Object.entries(srs)){
    if(valid.has(String(id))) srsClean[id] = v;
  }
  state.srs = srsClean;

  // Seen: object wordId->count (or truthy)
  const seenClean = {};
  const seen = state.seen || {};
  for(const [id, v] of Object.entries(seen)){
    if(valid.has(String(id))) seenClean[id] = v;
  }
  state.seen = seenClean;

  // Persist back
  try{
    const raw = localStorage.getItem(STORAGE.progress) || "{}";
    let p = {};
    try{ p = JSON.parse(raw); }catch{ p = {}; }
    p.favorites = Array.from(fav);
    p.seen = seenClean;
    p.srs = srsClean;
    localStorage.setItem(STORAGE.progress, JSON.stringify(p));
  }catch{}
}

function loadProgress(){
  try{
    const p = JSON.parse(localStorage.getItem(STORAGE.progress) || "{}");
    if(p && Array.isArray(p.favorites)) state.favorites = new Set(p.favorites);
    state.seen = (p && p.seen && typeof p.seen === "object") ? p.seen : {};
  state.srs = (p.srs && typeof p.srs === 'object') ? p.srs : {};
}catch{}
}

function saveProgress(){
  localStorage.setItem(STORAGE.progress, JSON.stringify({
    favorites: Array.from(state.favorites),
    seen: state.seen
  }));
}

// ---------- Theme ----------
function setTheme(theme){
  state.theme = theme;
  document.body.setAttribute("data-theme", theme);
  const tl = $("themeLight");
  const td = $("themeDark");
  if(tl && td){
    tl.classList.toggle("active", theme==="light");
    td.classList.toggle("active", theme==="dark");
  }
  saveSettings();
}


function downloadJson(payload, filename){
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}


// ---------- Bundled Data (meta_1_83_full) ----------
async function importBundledDataIfEmpty(force=false){
  try{
    const seedVersion = "meta_1_83_full_v1";
    const seeded = localStorage.getItem(STORAGE.seedKey) === seedVersion;

    const decksEmpty = !Array.isArray(state.decks) || state.decks.length === 0;
    const wordsEmpty = totalWordCount() === 0;

    // Auto-seed only when user has no usable data yet (new user / empty words)
    if(!force && seeded && !decksEmpty && !wordsEmpty) return;
    if(!force && !decksEmpty && !wordsEmpty) return;

    const res = await fetch("./data/index.json", {cache:"no-store"});
    if(!res.ok) return;
    const idx = await res.json();
    const files = Array.isArray(idx.files) ? idx.files : [];
    if(files.length === 0) return;

    // Non-blocking toast
    try{
      const host = document.querySelector(".toastHost") || document.body;
      const t = document.createElement("div");
      t.className = "toast";
      t.textContent = "Đang nạp dữ liệu mặc định…";
      host.appendChild(t);
      setTimeout(()=> t.remove(), 3500);
    }catch{}

    const newDecks = [];
    for(const file of files){
      const r = await fetch("./data/" + file, {cache:"no-store"});
      if(!r.ok) continue;
      let parsed = null;
      try{ parsed = await r.json(); }catch{ parsed = null; }
      if(!parsed) continue;

      let cards = [];
      let deckName = file.replace(/\.json$/i,"");
      let deckId = "deck_" + deckName.replace(/[^a-z0-9]+/gi,"_").toLowerCase();

      if(Array.isArray(parsed)){
        cards = parsed;
      }else if(Array.isArray(parsed.cards)){
        cards = parsed.cards;
        if(parsed.name) deckName = String(parsed.name);
        if(parsed.id) deckId = String(parsed.id);
      }

      const words = [];
      for(const it of cards){
        const w = normalizeWordItem(it);
        if(w && w.word) words.push(w);
      }
      if(words.length === 0) continue;

      const deck = { id: deckId, name: deckName, createdAt: Date.now() };
      newDecks.push(deck);
      state.deckWords.set(deckId, words);
      localStorage.setItem(STORAGE.deckWords(deckId), JSON.stringify(words));
    }

    if(newDecks.length === 0) return;

    state.decks = newDecks;
    state.activeDeckId = newDecks[0].id;
    localStorage.setItem(STORAGE.decks, JSON.stringify(state.decks));
    localStorage.setItem(STORAGE.seedKey, seedVersion);
  }catch(e){
    console.error(e);
  }
}

// ---------- Helpers ----------
function debounce(fn, wait){
  let t = null;
  return (...args)=>{
    if(t) clearTimeout(t);
    t = setTimeout(()=>fn(...args), wait);
  };
}

function confirmDanger(message){
  // Two-step confirm to avoid accidental deletion
  const ok1 = confirm(message);
  if(!ok1) return false;
  return confirm("Xác nhận lần nữa: thao tác này không thể hoàn tác.");
}

function escapeHtml(s){
  return String(s ?? "").replace(/[&<>"']/g, (m)=>({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    "\"":"&quot;",
    "'":"&#39;"
  }[m]));
}

function normalizeWordItem(x){
  const word = String(x.word ?? x.en ?? x.term ?? "").trim();
  if(!word) return null;
  return {
    id: String(x.id ?? stableWordId(word)),
    word,
    ipa: String(x.ipa ?? x.phonetic ?? x.pronunciation ?? "").trim(),
    meaning: String(x.meaning ?? x.meaning_vi ?? x.vi ?? "").trim(),
    example: String(x.example ?? x.example_en ?? x.sentence ?? "").trim()
  };
}

function shuffleInPlace(a){
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
}

function deckTitle(deckId){
  if(deckId === "__all") return "Tất cả thẻ";
  if(deckId === "__fav") return "Yêu thích";
  const d = state.decks.find(x => x.id === deckId);
  return d ? d.name : "Deck";
}

function markTime(){
  const dt = Math.max(0, Date.now() - lastCardStart);
  timeSum += dt;
  timeCount += 1;
  lastCardStart = Date.now();
}

// ---------- Legacy seed ----------
async function ensureLegacyDeckIfEmpty(){
  const decks = await idbGetAll();
  if(decks.length) return;

  try{
    const res = await fetch("./data/vocab.json", {cache:"no-store"});
    if(!res.ok) return;
    const j = await res.json();
    const topics = Array.isArray(j.topics) ? j.topics : [];
    const words = [];
    for(const t of topics){
      const cards = Array.isArray(t.cards) ? t.cards : [];
      for(const c of cards){
        const item = normalizeWordItem({
          id: c.id,
          word: c.word || c.en,
          ipa: c.ipa || c.phonetic,
          meaning: c.meaning || c.meaning_vi,
          example: c.example
        });
        if(item) words.push(item); // FIX: push
      }
    }
    if(!words.length) return;
    await idbPut({ id: uid(), name: "Legacy Deck", createdAt: Date.now(), updatedAt: Date.now(), words });
  }catch{
    // ignore (often file:// blocks fetch)
  }
}

async function loadDecks(){
  const all = await idbGetAll();
  state.decks = all
    .map(d => ({ id:d.id, name:d.name, createdAt:d.createdAt||0, updatedAt:d.updatedAt||0, wordsCount:(d.words||[]).length }))
    .sort((a,b)=> (b.updatedAt||0)-(a.updatedAt||0));
  state.deckWords.clear();
  for(const d of all){
    state.deckWords.set(d.id, Array.isArray(d.words) ? d.words : []);
  }
}

// ---------- Cards ----------
function buildCardsForDeck(deckId){
  if(deckId === "__all"){
    const arr = [];
    for(const d of state.decks){
      const w = state.deckWords.get(d.id) || [];
      for(const item of w) arr.push({ ...item, deckId:d.id, deckName:d.name });
    }
    return arr;
  }
  if(deckId === "__fav"){
    const arr = [];
    for(const d of state.decks){
      const w = state.deckWords.get(d.id) || [];
      for(const item of w){
        const cid = `${d.id}:${item.id}`;
        if(state.favorites.has(cid)) arr.push({ ...item, deckId:d.id, deckName:d.name });
      }
    }
    return arr;
  }
  const w = state.deckWords.get(deckId) || [];
  const d = state.decks.find(x=>x.id===deckId);
  return w.map(item => ({ ...item, deckId, deckName: d ? d.name : "Deck" }));
}

function setDeck(deckId){
  state.deckId = deckId;
  state.cards = buildCardsForDeck(deckId);
  if(state.random) shuffleInPlace(state.cards);
  state.index = 0;
  state.flipped = false;
  timeSum = 0; timeCount = 0;
  stopAuto();
  if(state.autoOn) startAuto();
  updateSidebarActive();
  updateCounts();
  updateHomeMeta();
  renderHọc();
}

// ---------- Views ----------
function showView(view){
  state.view = view;
  if(view === "review"){ enterReview(); }
  if(view === "home"){ renderStats(); }
  for(const id of ["Home","Learn","Review","Library","Settings"]){
    const el = $("view"+id);
    if(el) el.classList.toggle("hidden", id.toLowerCase() !== view);
  }
  document.querySelectorAll(".navItem").forEach(b => b.classList.toggle("active", b.dataset.view === view));
  if(view === "library") renderLibrary();
  if(view === "learn") renderHọc();
}

function updateSidebarActive(){
  document.querySelectorAll(".sideItem, .deckItem").forEach(el => {
    const d = el.dataset.deck;
    if(!d) return;
    el.classList.toggle("active", d === state.deckId);
  });
}

function renderSidebar(){
  const deckList = $("deckList");
  if(!deckList) return;
  deckList.innerHTML = "";

  document.querySelectorAll(".sideItem").forEach(b => {
    b.onclick = () => setDeck(b.dataset.deck);
  });

  const colors = ["blue","teal","green","orange","purple"];
  for(let i=0;i<state.decks.length;i++){
    const d = state.decks[i];
    const btn = document.createElement("button");
    btn.className = "deckItem";
    btn.dataset.deck = d.id;
    btn.dataset.color = colors[i % colors.length];
    btn.innerHTML = `<span class="ico"><span class="deckDot"></span></span>
                     <span class="txt">${escapeHtml(d.name)}</span>
                     <span class="num">${d.wordsCount}</span>`;
    btn.onclick = () => { setDeck(d.id); showView("learn"); };
    deckList.appendChild(btn);
  }
  updateSidebarActive();
}

// ---------- Home counts ----------
function updateCounts(){
  const allCount = state.decks.reduce((a,d)=>a+(d.wordsCount||0),0);
  $("countAll") && ($("countAll").textContent = String(allCount));
  $("countFav") && ($("countFav").textContent = String(state.favorites.size));
}

function updateHomeMeta(){
  const name = deckTitle(state.deckId);
  $("homeDeckName") && ($("homeDeckName").textContent = name === "Deck" ? "English Vocabulary" : name);
  const left = state.cards.length ? Math.max(0, state.cards.length - state.index - 1) : 0;
  $("homeDeckMeta") && ($("homeDeckMeta").textContent = `${state.autoOn ? "Tự động" : "Thủ công"} Mode • ${left} cards left`);
  $("focusNewCount") && ($("focusNewCount").textContent = `${Math.min(10, state.cards.length)} words`);
  $("focusReviewCount") && ($("focusReviewCount").textContent = `${buildReviewQueue().length} cần ôn`);
}

// ---------- Học render ----------
function currentCard(){ return state.cards[state.index] || null; }

function countSeenInDeck(deckId){
  const cards = buildCardsForDeck(deckId);
  let n = 0;
  for(const c of cards){
    const cid = `${c.deckId}:${c.id}`;
    if(state.seen && state.seen[cid]) n++;
  }
  return n;
}

function updateVoiceSeg(){
  $("voiceUK") && $("voiceUK").classList.toggle("active", state.voicePref === "UK");
  $("voiceUS") && $("voiceUS").classList.toggle("active", state.voicePref !== "UK");
}

function renderHọc(){
  const total = state.cards.length;
  const cur = currentCard();

  $("learnDeckTitle") && ($("learnDeckTitle").textContent = deckTitle(state.deckId));
  $("panelDeckName") && ($("panelDeckName").textContent = deckTitle(state.deckId));
  $("learnPos") && ($("learnPos").textContent = total ? `${state.index+1} / ${total}` : "0 / 0");
  $("progressText") && ($("progressText").textContent = total ? `${state.index+1} / ${total}` : "0 / 0");
  $("learnMode") && ($("learnMode").textContent = state.autoOn ? `Auto ${state.autoFront}/${state.autoBack}s` : "Thủ công");

  $("statWords") && ($("statWords").textContent = total ? `${state.index+1} / ${total}` : "0 / 0");
  $("statAvg") && ($("statAvg").textContent = timeCount ? `${(timeSum/timeCount/1000).toFixed(1)}s` : "—");

  const seenCount = countSeenInDeck(state.deckId);
  const pct = total ? Math.round((seenCount/total)*100) : 0;
  $("ringFg") && $("ringFg").setAttribute("stroke-dasharray", `${pct}, 100`);
  $("statPct") && ($("statPct").textContent = String(pct));

  $("toggleAuto") && ($("toggleAuto").checked = !!state.autoOn);
  $("toggleRandom") && ($("toggleRandom").checked = !!state.random);

  $("autoFront") && ($("autoFront").value = String(state.autoFront));
  $("autoBack") && ($("autoBack").value = String(state.autoBack));
  $("autoFrontLabel") && ($("autoFrontLabel").textContent = `${state.autoFront} s`);
  $("autoBackLabel") && ($("autoBackLabel").textContent = `${state.autoBack} s`);
  $("autoSecLabel") && ($("autoSecLabel").textContent = `Mặt trước ${state.autoFront}s • Mặt sau ${state.autoBack}s`);

  updateVoiceSeg();
  document.querySelectorAll('input[name="speakMode"]').forEach(r => r.checked = (r.value === state.speakMode));

  if(!cur){
    ["word","phonetic","wordBack","phoneticBack","meaning","example"].forEach(id => $(id) && ($(id).textContent="—"));
    $("btnStar") && ($("btnStar").textContent="☆");
    $("flipInner") && $("flipInner").classList.remove("isFlipped");
    return;
  }

  $("word") && ($("word").textContent = cur.word);
  $("phonetic") && ($("phonetic").textContent = cur.ipa || "—");
  $("wordBack") && ($("wordBack").textContent = cur.word);
  $("phoneticBack") && ($("phoneticBack").textContent = cur.ipa || "—");
  $("meaning") && ($("meaning").textContent = cur.meaning || "—");
  $("example") && ($("example").textContent = cur.example || "—");

  const cid = `${cur.deckId}:${cur.id}`;
  $("btnStar") && ($("btnStar").textContent = state.favorites.has(cid) ? "★" : "☆");
  $("flipInner") && $("flipInner").classList.toggle("isFlipped", state.flipped);
}

function flip(){ onUserInteract(); state.flipped = !state.flipped; renderHọc(); }

function nextInternal(){
  autoInternalStep = true;
  try{ next(); } finally { autoInternalStep = false; }
}

function next(){
  onUserInteract();
  if(!state.cards.length) return;
  const c = currentCard();
  if(c){ state.seen[`${c.deckId}:${c.id}`] = 1; saveProgress(); }
  markTime();
  state.index = (state.index + 1) % state.cards.length;
  state.flipped = false;
  renderHọc();
  updateHomeMeta();
  if(state.autoOn) restartAuto();
}

function prev(){
  onUserInteract();
  if(!state.cards.length) return;
  const c = currentCard();
  if(c){ state.seen[`${c.deckId}:${c.id}`] = 1; saveProgress(); }
  markTime();
  state.index = (state.index - 1 + state.cards.length) % state.cards.length;
  state.flipped = false;
  renderHọc();
  updateHomeMeta();
  if(state.autoOn) restartAuto();
}

function toggleFav(){
  const c = currentCard();
  if(!c) return;
  const cid = `${c.deckId}:${c.id}`;
  state.favorites.has(cid) ? state.favorites.delete(cid) : state.favorites.add(cid);
  saveProgress();
  updateCounts();
  renderHọc();
}

// ---------- Speech ----------
function pickVoice(){
  const voices = speechSynthesis.getVoices ? speechSynthesis.getVoices() : [];
  const want = state.voicePref === "UK" ? ["en-gb"] : ["en-us"];
  for(const w of want){
    const v = voices.find(v => (v.lang||"").toLowerCase().startsWith(w));
    if(v) return v;
  }
  return voices.find(v => (v.lang||"").toLowerCase().startsWith("en")) || null;
}
function speak(text){
  if(!("speechSynthesis" in window) || !text) return;
  try{
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if(v) u.voice = v;
    u.rate = 0.95;
    speechSynthesis.speak(u);
  }catch{}
}

function speakCurrentReview(locale){
  const it = currentReviewItem();
  if(!it || !it.word) return;
  const text = String(it.word.word || "").trim();
  if(!text) return;
  speak(text, locale);
}

function speakCurrent(){
  const c = currentCard();
  if(!c) return;
  const txt = (state.speakMode === "word_example" && c.example) ? `${c.word}. ${c.example}` : c.word;
  speak(txt);
}



// ---------- Stats ----------
const STORAGE_STATS = "deNhiStats";

function isoDay(d=new Date()){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const da = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${da}`;
}

function loadStats(){
  let s = { lastDay: isoDay(), streak: 0, todayCount: 0, total: 0 };
  try{
    const raw = localStorage.getItem(STORAGE_STATS);
    if(raw) s = {...s, ...JSON.parse(raw)};
  }catch{}
  // Day rollover
  const today = isoDay();
  if(s.lastDay !== today){
    // determine if yesterday
    const d = new Date();
    d.setDate(d.getDate()-1);
    const yday = isoDay(d);
    if(s.lastDay === yday && s.todayCount > 0){
      s.streak = (s.streak||0) + 1;
    }else if(s.todayCount > 0){
      s.streak = 1;
    }else{
      s.streak = 0;
    }
    s.lastDay = today;
    s.todayCount = 0;
  }
  return s;
}

function saveStats(s){
  try{ localStorage.setItem(STORAGE_STATS, JSON.stringify(s)); }catch{}
}

function renderStats(){
  const s = loadStats();
  const elToday = $("statToday");
  const elStreak = $("statStreak");
  const elTotal = $("statTotal");
  const elDue = $("statDue");
  const elCards = $("statCards");
  const elDecks = $("statDecks");
  if(elToday) elToday.textContent = String(s.todayCount||0);
  if(elStreak) elStreak.textContent = String(s.streak||0);
  if(elTotal) elTotal.textContent = String(s.total||0);
  // Derived stats
  const now = Date.now();
  let due = 0;
  try{
    for(const k in state.srs){ const it = state.srs[k]; if(it && Number(it.due||0) <= now) due++; }
  }catch{}
  let cards = 0;
  try{ for(const d of (state.decks||[])){ cards += (state.deckWords.get(d.id)||[]).length; } }catch{}
  const decks = (state.decks||[]).length;
  if(elDue) elDue.textContent = String(due);
  if(elCards) elCards.textContent = String(cards);
  if(elDecks) elDecks.textContent = String(decks);
}

// ---------- Review (SRS - SM-2 mini) ----------
function getTodayStartMs(){
  const d = new Date();
  d.setHours(0,0,0,0);
  return d.getTime();
}
function addDaysMs(ms, days){
  return ms + days*24*60*60*1000;
}
function sm2Update(prev, quality){
  // quality: 0..5 (we'll use 2/4/5)
  const now = Date.now();
  const p = prev || { ease: 2.5, interval: 0, reps: 0, lapses: 0, due: now };

  let ease = p.ease || 2.5;
  let interval = p.interval || 0;
  let reps = p.reps || 0;
  let lapses = p.lapses || 0;

  // SM-2 ease formula
  ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if(ease < 1.3) ease = 1.3;

  if(quality < 3){
    // fail
    lapses += 1;
    reps = 0;
    interval = 1;
  }else{
    // success
    if(reps === 0) interval = 1;
    else if(reps === 1) interval = 6;
    else interval = Math.round(interval * ease);
    reps += 1;
  }

  const due = addDaysMs(getTodayStartMs(), interval);
  return { ease, interval, reps, lapses, due, updatedAt: now };
}

function buildReviewQueue(){
  const now = Date.now();
  const due = [];
  for(const [deckId, words] of state.deckWords.entries()){
    for(const w of (words||[])){
      if(!w || !w.id) continue;
      const id = String(w.id);
      const s = state.srs[id];
      // If never reviewed but has been seen/favorited => due now
      const hasSeen = !!state.seen[id] || state.favorites.has(id);
      if(!s){
        if(hasSeen) due.push({deckId, word: w, id});
        continue;
      }
      if((s.due || 0) <= now) due.push({deckId, word: w, id});
    }
  }
  // stable order: due first by due time
  due.sort((a,b)=>{
    const sa = state.srs[a.id]; const sb = state.srs[b.id];
    return (sa?.due||0) - (sb?.due||0);
  });
  return due;
}


let reviewQueue = [];
let reviewIndex = 0;
let reviewFlipped = false;
let showSrsInfo = false;

function enterReview(){
  reviewQueue = buildReviewQueue();
  // sort most overdue first (oldest due first)
  reviewQueue.sort((a,b)=> (a.due||0) - (b.due||0));
  reviewIndex = 0;
  reviewFlipped = false;
  renderReview();
}

function currentReviewItem(){
  return reviewQueue[reviewIndex] || null;
}

function setReviewFlip(on){
  reviewFlipped = !!on;
  const inner = $("rFlipInner");
  if(inner) inner.classList.toggle("isFlipped", reviewFlipped);
}

function toggleSrsInfo(){
  showSrsInfo = !showSrsInfo;
  const box = $("rSrsMeta");
  if(box) box.classList.toggle("hidden", !showSrsInfo);
}

function renderReview(){
  const dueText = $("reviewDueText");
  const posText = $("reviewPosText");
  if(dueText) dueText.textContent = `Đến hạn: ${reviewQueue.length}`;
  if(posText) posText.textContent = `${reviewQueue.length ? (reviewIndex+1) : 0} / ${reviewQueue.length}`;

  const it = currentReviewItem();
  if(!it){
    $("rWord") && ($("rWord").textContent = "Không có thẻ đến hạn");
    $("rPhonetic") && ($("rPhonetic").textContent = "—");
    $("rHint") && ($("rHint").textContent = "Hãy học thêm ở tab Học để tạo lịch ôn.");
    $("rWordBack") && ($("rWordBack").textContent = "—");
    $("rPhoneticBack") && ($("rPhoneticBack").textContent = "—");
    $("rMeaning") && ($("rMeaning").textContent = "—");
    $("rExample") && ($("rExample").textContent = "—");
    $("rSrsMeta") && ($("rSrsMeta").textContent = "");
    setReviewFlip(false);
    return;
  }

  const w = it.word || {};
  $("rWord") && ($("rWord").textContent = w.word || "—");
  $("rPhonetic") && ($("rPhonetic").textContent = w.ipa || "—");
  $("rHint") && ($("rHint").textContent = "Chạm để xem nghĩa");
  $("rWordBack") && ($("rWordBack").textContent = w.word || "—");
  $("rPhoneticBack") && ($("rPhoneticBack").textContent = w.ipa || "—");
  $("rMeaning") && ($("rMeaning").textContent = w.meaning || "—");
  $("rExample") && ($("rExample").textContent = w.example || "—");

  // SM-2 meta
  const s = state.srs[String(w.id)] || { interval: 0, ease: 2.5, due: 0, reps: 0 };
  const dueDate = s.due ? new Date(s.due).toLocaleDateString() : "—";
  const meta = `SM-2\n• Due: ${dueDate}\n• Interval: ${Math.round(s.interval||0)} ngày\n• Ease: ${(s.ease||2.5).toFixed(2)}\n• Reps: ${s.reps||0}`;
  const box = $("rSrsMeta");
  if(box){
    box.textContent = meta;
    box.classList.toggle("hidden", !showSrsInfo);
  }

  setReviewFlip(false);
}

function reviewRate(grade){
  const it = currentReviewItem();
  if(!it) return;
  const w = it.word;
  if(!w || !w.id) return;

  // Update SM-2
  const id = String(w.id);
  const s = state.srs[id] || { interval: 0, ease: 2.5, due: 0, reps: 0 };
  const upd = sm2Update(s, Number(grade));
  state.srs[id] = upd;
  saveSrs();

  // Stats
  const st = loadStats();
  st.todayCount = (st.todayCount||0) + 1;
  st.total = (st.total||0) + 1;
  saveStats(st);
  renderStats();

  // Advance
  reviewIndex += 1;
  renderReview();
}

// ---------- Auto ----------
function startAuto(){
  stopAuto();
  if(!state.autoOn) return;
  if(!state.cards.length) return;

  autoPhase = "front";
  autoPhaseStart = Date.now();
  state.flipped = false;
  renderHọc();
  speakCurrent();

  const tick = () => {
    if(!state.autoOn || !state.cards.length) return;

    const now = Date.now();
    const frontMs = Math.max(2, state.autoFront) * 1000;
    const backMs  = Math.max(2, state.autoBack) * 1000;

    // Catch up if tab was throttled: advance at most a few phases quickly
    let safety = 0;
    while(safety++ < 4){
      const elapsed = now - autoPhaseStart;

      if(autoPhase === "front"){
        if(elapsed >= frontMs){
          autoPhase = "back";
          autoPhaseStart += frontMs; // preserve timeline
          state.flipped = true;
          renderHọc();
          if(state.speakMode === "word_example") speakCurrent();
          continue;
        }
        break;
      }else{ // back
        if(elapsed >= backMs){
          autoPhase = "front";
          autoPhaseStart += backMs;
          nextInternal();
          // To avoid restart loop, we temporarily bypass onUserInteract inside next() when auto tick calls it.
          break;
        }
        break;
      }
    }

    autoTimer = setTimeout(tick, 250);
  };

  autoTimer = setTimeout(tick, 250);
}

function stopAuto(){
  if(autoTimer){ clearTimeout(autoTimer); autoTimer = null; }
  if(autoStepTimer){ clearTimeout(autoStepTimer); autoStepTimer = null; }
}

function restartAuto(){
  if(state.autoOn) startAuto();
}

// ---------- Library + Deck Detail CRUD ----------
let deckDetailId = null;
let editingWordId = null;
const DD_PAGE_SIZE = 50;
let ddPage = 1;

function renderLibrary(){
  const grid = $("deckGrid");
  if(!grid) return;
  const q = ($("libSearch")?.value || "").trim().toLowerCase();
  grid.innerHTML = "";

  const filtered = state.decks.filter(d => !q || d.name.toLowerCase().includes(q));
  for(const d of filtered){
    const total = d.wordsCount || 0;
    const seen = countSeenInDeck(d.id);
    const pct = total ? Math.round((seen/total)*100) : 0;

    const card = document.createElement("div");
    card.className = "deckGridCard";
    card.innerHTML = `
      <div class="deckGridTop">
        <div class="deckGridName">${escapeHtml(d.name)}</div>
        <div class="libBadge">${pct}%</div>
      </div>
      <div class="deckGridMeta">${total} từ</div>
      <div class="deckGridBtns">
        <button class="miniBtn primary" data-act="open">Mở</button>
        <button class="miniBtn" data-act="learn">Học</button>
        <button class="miniBtn" data-act="export">Xuất</button>
        <button class="miniBtn danger" data-act="delete">Xoá</button>
      </div>
    `;
    card.querySelector('[data-act="open"]').onclick = (e)=>{ e.stopPropagation(); openDeckDetail(d.id); };
    card.querySelector('[data-act="learn"]').onclick = (e)=>{ e.stopPropagation(); setDeck(d.id); showView("learn"); };
    card.querySelector('[data-act="export"]').onclick = (e)=>{ e.stopPropagation(); exportDeck(d.id); };
    card.querySelector('[data-act="delete"]').onclick = (e)=>{ e.stopPropagation(); deleteDeck(d.id); };
    card.onclick = ()=> openDeckDetail(d.id);
    grid.appendChild(card);
  }
}

function openDeckDetail(deckId){
  deckDetailId = deckId;
  ddPage = 1;
  const d = state.decks.find(x=>x.id===deckId);
  if(!d) return;
  $("ddName") && ($("ddName").textContent = d.name);
  $("ddCount") && ($("ddCount").textContent = String(d.wordsCount||0));
  $("deckDetail") && $("deckDetail").classList.remove("hidden");
  renderDeckDetailTable();
}

function closeDeckDetail(){
  deckDetailId = null;
  $("deckDetail") && $("deckDetail").classList.add("hidden");
}

function renderDeckDetailTable(){
  const tbody = $("ddTbody");
  if(!tbody || !deckDetailId) return;

  const words = state.deckWords.get(deckDetailId) || [];
  const q = ($("ddSearch")?.value || "").trim().toLowerCase();

  const filtered = words.filter(w => {
    if(!q) return true;
    return (w.word||"").toLowerCase().includes(q) || (w.meaning||"").toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / DD_PAGE_SIZE));
  ddPage = Math.min(Math.max(1, ddPage), totalPages);

  const start = (ddPage - 1) * DD_PAGE_SIZE;
  const pageItems = filtered.slice(start, start + DD_PAGE_SIZE);

  tbody.innerHTML = "";
  for(const w of pageItems){
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><b>${escapeHtml(w.word)}</b></td>
      <td>${escapeHtml(w.ipa||"")}</td>
      <td>${escapeHtml(w.meaning||"")}</td>
      <td>${escapeHtml(w.example||"")}</td>
      <td>
        <div class="ddActions">
          <button class="miniBtn" data-act="edit">Sửa</button>
          <button class="miniBtn danger" data-act="del">Xoá</button>
        </div>
      </td>
    `;
    tr.querySelector('[data-act="edit"]').onclick = ()=> openWordModal("edit", w.id);
    tr.querySelector('[data-act="del"]').onclick = ()=> deleteWord(w.id);
    tbody.appendChild(tr);
  }

  const pageText = $("ddPageText");
  if(pageText) pageText.textContent = `${ddPage} / ${totalPages}`;

  const prevBtn = $("ddPrevPage");
  const nextBtn = $("ddNextPage");
  if(prevBtn) prevBtn.disabled = ddPage <= 1;
  if(nextBtn) nextBtn.disabled = ddPage >= totalPages;
}

async function addDeck(name){
  const deck = { id: uid(), name: String(name||"Deck mới").trim() || "Deck mới", createdAt: Date.now(), updatedAt: Date.now(), words: [] };
  await idbPut(deck);
  await refreshAll();
  await importBundledDataIfEmpty();
  await refreshAll();
  ensureStarterDeckIfEmpty();
  await refreshAll();
  renderStats();
}

async function renameDeck(deckId, name){
  const all = await idbGetAll();
  const d = all.find(x=>x.id===deckId);
  if(!d) return;
  d.name = String(name||d.name).trim() || d.name;
  d.updatedAt = Date.now();
  await idbPut(d);
  await refreshAll();
  renderStats();
  if(deckDetailId === deckId) $("ddName") && ($("ddName").textContent = d.name);
}

async function deleteDeck(deckId){
  if(!confirmDanger("Xoá deck này?")) return;
  await idbXoá(deckId);

  const prefix = `${deckId}:`;
  for(const k of Array.from(state.favorites)) if(k.startsWith(prefix)) state.favorites.delete(k);
  for(const k of Object.keys(state.seen||{})) if(k.startsWith(prefix)) delete state.seen[k];
  saveProgress();

  await refreshAll();
  renderStats();
  if(deckDetailId === deckId) closeDeckDetail();
  if(state.deckId === deckId) setDeck("__all");
}

async function upsertWord(deckId, wordObj){
  const all = await idbGetAll();
  const d = all.find(x=>x.id===deckId);
  if(!d) return;

  const words = Array.isArray(d.words) ? d.words : [];
  const idx = words.findIndex(x => x.id === wordObj.id);
  if(idx >= 0) words[idx] = wordObj;
  else words.unshift(wordObj);

  d.words = words;
  d.updatedAt = Date.now();
  await idbPut(d);
  await refreshAll();
  renderStats();
}

async function deleteWord(wordId){
  if(!deckDetailId) return;
  if(!confirmDanger("Xoá từ này?")) return;

  const all = await idbGetAll();
  const d = all.find(x=>x.id===deckDetailId);
  if(!d) return;

  d.words = (d.words||[]).filter(w => w.id !== wordId);
  d.updatedAt = Date.now();
  await idbPut(d);

  const cid = `${deckDetailId}:${wordId}`;
  state.favorites.delete(cid);
  delete state.seen[cid];
  saveProgress();

  await refreshAll();
  renderStats();
  renderDeckDetailTable();
  $("ddCount") && ($("ddCount").textContent = String((state.deckWords.get(deckDetailId)||[]).length));
}

function openWordModal(mode, wordId=null){
  if(!deckDetailId) return;
  editingWordId = wordId;

  const err = $("wmError");
  if(err){ err.style.display="none"; err.textContent=""; }

  if(mode === "edit"){
    const w = (state.deckWords.get(deckDetailId)||[]).find(x=>x.id===wordId);
    if(!w) return;
    $("wmTitle").textContent = "Sửa từ";
    $("wmWord").value = w.word || "";
    $("wmIpa").value = w.ipa || "";
    $("wmMeaning").value = w.meaning || "";
    $("wmExample").value = w.example || "";
  }else{
    $("wmTitle").textContent = "Thêm từ";
    $("wmWord").value = "";
    $("wmIpa").value = "";
    $("wmMeaning").value = "";
    $("wmExample").value = "";
  }

  $("wordModal").classList.remove("hidden");
  $("wmWord").focus();
}

function closeWordModal(){
  $("wordModal").classList.add("hidden");
  editingWordId = null;
}

async function saveWordFromModal(){
  if(!deckDetailId) return;
  const word = ($("wmWord").value || "").trim();
  const ipa = ($("wmIpa").value || "").trim();
  const meaning = ($("wmMeaning").value || "").trim();
  const example = ($("wmExample").value || "").trim();

  const err = $("wmError");
  if(!word){
    if(err){ err.style.display="block"; err.textContent="Bắt buộc nhập từ."; }
    return;
  }

  const words = state.deckWords.get(deckDetailId) || [];
  const dup = words.find(w => (w.word||"").toLowerCase() === word.toLowerCase() && w.id !== editingWordId);
  if(dup){
    if(err){ err.style.display="block"; err.textContent="Từ này đã tồn tại trong deck."; }
    return;
  }

  await upsertWord(deckDetailId, { id: editingWordId || stableWordId(word), word, ipa, meaning, example });
  closeWordModal();
  renderDeckDetailTable();
  $("ddCount") && ($("ddCount").textContent = String((state.deckWords.get(deckDetailId)||[]).length));
}


function extractWordsFromAnyFormat(obj){
  // Returns rawItems array or null
  if(Array.isArray(obj)) return obj;
  if(obj && typeof obj === "object"){
    if(Array.isArray(obj.words)) return obj.words;
    if(Array.isArray(obj.cards)) return obj.cards;
    if(Array.isArray(obj.topics)){
      const flat = [];
      for(const t of obj.topics){
        if(t && Array.isArray(t.cards)) flat.push(...t.cards);
      }
      return flat;
    }
  }
  return null;
}

function normalizeIncomingItem(x){
  if(x && typeof x === "object"){
    return {
      ...x,
      word: x.word ?? x.en ?? x.term,
      ipa: x.ipa ?? x.phonetic ?? x.pronunciation,
      meaning: x.meaning ?? x.meaning_vi ?? x.vi,
      example: x.example ?? x.sentence ?? x.example_en
    };
  }
  return x;
}

function buildNormalizedWords(rawItems){
  const seen = new Set();
  const words = [];
  for(const x of (rawItems||[])){
    const mapped = normalizeIncomingItem(x);
    const it = normalizeWordItem(mapped);
    if(!it) continue;
    const key = String(it.word||"").trim().toLowerCase();
    if(!key || seen.has(key)) continue;
    seen.add(key);
    words.push(it);
  }
  return words;
}

function parseDecksPayload(payload){
  // Accept:
  // A) {decks:[{id,name,words:[...] }], legacy:bool}
  // B) {decks:[{id,name,cards:[...] }]}
  // C) [{id,name,words|cards|topics...}, ...]
  // D) {id,name,words|cards} (single deck)
  if(Array.isArray(payload)){
    // could be list of decks OR list of words
    const looksLikeDeck = payload.some(x => x && typeof x==="object" && ("words" in x || "cards" in x || "name" in x));
    if(looksLikeDeck) return payload.map(d => ({...d}));
    // else it's words array => single deck fallback
    return [{ name: "Imported Decks", words: payload }];
  }
  if(payload && typeof payload === "object"){
    if(Array.isArray(payload.decks)){
      return payload.decks.map(d => ({...d}));
    }
    // single deck object
    if("words" in payload || "cards" in payload || "topics" in payload){
      return [{...payload}];
    }
  }
  return null;
}

async function importDecksAllFromFile(file){
  const txt = await file.text();
  let payload;
  try{ payload = JSON.parse(txt); }catch{ alert("JSON không hợp lệ"); return; }

  const decks = parseDecksPayload(payload);
  if(!decks || !decks.length){
    alert("File không đúng định dạng nhiều deck.");
    return;
  }

  // Ask strategy for existing decks by name
  const mode = "merge"; // mặc định gộp deck trùng tên

  const existingAll = await idbGetAll();
  const byName = new Map(existingAll.map(d => [String(d.name||"").trim().toLowerCase(), d]));

  let imported = 0, replaced = 0, merged = 0, skipped = 0;

  for(const d of decks){
    const name = String(d.name || d.title || "Deck").trim() || "Deck";
    const key = name.toLowerCase();

    // Determine raw words/cards
    let rawItems = null;
    if(Array.isArray(d.words)) rawItems = d.words;
    else if(Array.isArray(d.cards)) rawItems = d.cards;
    else rawItems = extractWordsFromAnyFormat(d);

    if(!Array.isArray(rawItems)){
      // maybe nested {words:[...]} in d.data?
      if(d.data) rawItems = extractWordsFromAnyFormat(d.data);
    }
    if(!Array.isArray(rawItems)) continue;

    const words = buildNormalizedWords(rawItems);

    const exist = byName.get(key);
    if(exist){
      if(mode === "skip"){
        skipped++;
        continue;
      }
      if(mode === "replace"){
        exist.words = words;
        exist.updatedAt = Date.now();
        await idbPut(exist);
        replaced++;
        continue;
      }
      // merge
      const cur = Array.isArray(exist.words) ? exist.words : [];
      const mergedWords = buildNormalizedWords([...cur, ...words]);
      exist.words = mergedWords;
      exist.updatedAt = Date.now();
      await idbPut(exist);
      merged++;
      continue;
    }

    await idbPut({ id: uid(), name, createdAt: Date.now(), updatedAt: Date.now(), words });
    imported++;
  }

  await refreshAll();
  renderStats();
  alert(`Nhập xong: mới ${imported}, gộp ${merged}, bỏ qua ${skipped}. (Deck trùng tên tự gộp)`);
}

async function importDeckFromFile(file){
  const rawName = (file.name || "Deck mới").replace(/\.json$/i, "");
  const name = String(rawName || "Imported Deck").trim() || "Imported Deck";

  const txt = await file.text();
  let parsed;
  try{ parsed = JSON.parse(txt); }catch{ alert("JSON không hợp lệ"); return; }

  // Accept:
  // 1) Array of words: [{word, ipa, meaning, example, ...}]
  // 2) Object with cards: { cards: [...] }
  // 3) Object with topics/cards (legacy vocab): { topics:[{cards:[...]}] }
  let rawItems = null;

  if(Array.isArray(parsed)){
    rawItems = parsed;
  }else if(parsed && typeof parsed === "object"){
    if(Array.isArray(parsed.cards)){
      rawItems = parsed.cards;
    }else if(Array.isArray(parsed.topics)){
      const flat = [];
      for(const t of parsed.topics){
        if(t && Array.isArray(t.cards)) flat.push(...t.cards);
      }
      rawItems = flat;
    }
  }

  if(!Array.isArray(rawItems)){
    alert("Định dạng JSON không hỗ trợ. Dùng mảng từ hoặc object có cards/topics.");
    return;
  }

  // Normalize + dedupe (case-insensitive)
  const seen = new Set();
  const words = [];
  for(const x of rawItems){
    // Map common legacy keys
    const mapped = (x && typeof x === "object") ? {
      ...x,
      word: x.word ?? x.en ?? x.term,
      ipa: x.ipa ?? x.phonetic ?? x.pronunciation,
      meaning: x.meaning ?? x.meaning_vi ?? x.vi,
      example: x.example ?? x.example_en ?? x.sentence
    } : x;

    const it = normalizeWordItem(mapped);
    if(!it) continue;
    const key = String(it.word||"").trim().toLowerCase();
    if(!key || seen.has(key)) continue;
    seen.add(key);
    words.push(it);
  }

  // Replace existing deck with same name (keep deckId => keep progress mapping)
  const all = await idbGetAll();
  const existing = all.find(d => String(d.name||"").trim().toLowerCase() === name.toLowerCase());

  if(existing){
    const ok = confirm(`Deck "${name}" đã tồn tại. Thay thế deck này (giữ tiến độ)?`);
    if(!ok) return;

    existing.words = words;
    existing.updatedAt = Date.now();
    await idbPut(existing);
    await refreshAll();
  renderStats();
    alert(`Đã thay thế deck: ${name} (${words.length} từ)`);
    return;
  }

  await idbPut({ id: uid(), name, createdAt: Date.now(), updatedAt: Date.now(), words });
  await refreshAll();
  renderStats();
  alert(`Đã nhập deck: ${name} (${words.length} từ)`);
}

function exportDeck(deckId){
  const deck = state.decks.find(d => d.id === deckId);
  if(!deck) return;

  const words = state.deckWords.get(deckId) || [];

  const mode = prompt('Xuất dạng nào?\n1 = Chuẩn (mảng word/meaning)\n2 = Legacy (object cards + meaning_vi)\nNhập 1 hoặc 2:', "1");
  const m2 = String(mode||"1").trim() === "2";

  let payload;
  let filename;
  if(!m2){
    // Normalized
    payload = words;
    filename = `${slug(deck.name)}.json`;
  }else{
    // Legacy-compatible
    payload = {
      id: deck.id,
      name: deck.name,
      cards: words.map(w => ({
        word: w.word || "",
        phonetic: w.ipa || "",
        meaning_vi: w.meaning || "",
        sentence: w.example || ""
      }))
    };
    filename = `${slug(deck.name)}.legacy.json`;
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

async function exportAllDecks(){
  const mode = prompt('Xuất tất cả dạng nào?\n1 = Chuẩn (mảng)\n2 = Legacy (object cards)\nNhập 1 hoặc 2:', "1");
  const legacy = String(mode||"1").trim() === "2";

  const decks = state.decks.map(d => {
    const words = state.deckWords.get(d.id) || [];
    if(!legacy){
      return { id: d.id, name: d.name, words };
    }
    return {
      id: d.id,
      name: d.name,
      cards: words.map(w => ({
        word: w.word || "",
        phonetic: w.ipa || "",
        meaning_vi: w.meaning || "",
        sentence: w.example || ""
      }))
    };
  });

  const blob = new Blob([JSON.stringify({schemaVersion:1, legacy, exportedAt:Date.now(), decks}, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = legacy ? "decks-all.legacy.json" : "decks-all.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

function exportProgress(){
  const blob = new Blob([localStorage.getItem(STORAGE.progress) || "{}"], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "de-nhi-progress.json";
  a.click();
  URL.revokeObjectURL(a.href);
}
function exportBackupAll(){
  // Full backup: decks + progress (+ settings)
  (async () => {
    const decks = await idbGetAll();
    const progressRaw = localStorage.getItem(STORAGE.progress) || "{}";
    const settingsRaw = localStorage.getItem(STORAGE.settings) || "{}";

    let progress = {};
    let settings = {};
    try{ progress = JSON.parse(progressRaw); }catch{ progress = {}; }
    try{ settings = JSON.parse(settingsRaw); }catch{ settings = {}; }

    const payload = {
      schemaVersion: 1,
      exportedAt: Date.now(),
      app: "de-nhi-web",
      version: "meta-1.9.6",
      decks: decks.map(d => ({
        id: d.id,
        name: d.name,
        createdAt: d.createdAt || 0,
        updatedAt: d.updatedAt || 0,
        words: Array.isArray(d.words) ? d.words : []
      })),
      progress: {
        favorites: Array.isArray(progress.favorites) ? progress.favorites : Array.from(state.favorites),
        seen: (progress.seen && typeof progress.seen === "object") ? progress.seen : (state.seen || {}),
        srs: (progress.srs && typeof progress.srs === "object") ? progress.srs : (state.srs || {})
      },
      settings
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "de-nhi-backup-all.json";
    a.click();
    URL.revokeObjectURL(a.href);
  })();
}

async function importBackupAllFromFile(file){
  const txt = await file.text();
  let payload;
  try{ payload = JSON.parse(txt); }catch{ alert("JSON không hợp lệ"); return; }

  if(!payload || typeof payload !== "object" || !Array.isArray(payload.decks)){
    alert("File backup không đúng định dạng.");
    return;
  }

  const ok = confirmDanger("Nhập backup sẽ ghi đè toàn bộ deck hiện có. Tiếp tục?");
  if(!ok) return;

  // Clear and restore decks
  await idbClear();
  for(const d of payload.decks){
    await idbPut({
      id: String(d.id || uid()),
      name: String(d.name || "Deck"),
      createdAt: Number(d.createdAt || Date.now()),
      updatedAt: Number(d.updatedAt || Date.now()),
      words: Array.isArray(d.words) ? d.words : []
    });
  }

  // Restore progress/settings
  try{
    const p = payload.progress || {};
    const pr = {
      favorites: Array.isArray(p.favorites) ? p.favorites : [],
      seen: (p.seen && typeof p.seen === "object") ? p.seen : {},
      srs: (p.srs && typeof p.srs === "object") ? p.srs : {}
    };
    localStorage.setItem(STORAGE.progress, JSON.stringify(pr));
  }catch{}

  try{
    if(payload.settings && typeof payload.settings === "object"){
      localStorage.setItem(STORAGE.settings, JSON.stringify(payload.settings));
    }
  }catch{}

  // Reload state
  loadSettings();
  loadProgress();
  setTheme(state.theme || "light");
  await refreshAll();
  renderStats();
  alert("Đã nhập backup thành công!");
}

function importProgress(e){
  const f = e.target.files && e.target.files[0];
  if(!f) return;
  const r = new FileReader();
  r.onload = () => {
    try{
      localStorage.setItem(STORAGE.progress, String(r.result || "{}"));
      loadProgress();
      updateCounts();
      setDeck(state.deckId);
      alert("Đã nhập tiến độ!");
    }catch{ alert("Nhập thất bại"); }
  };
  r.readAsText(f);
}


function syncGlobalSearchToLibrary(){
  const gs = $("globalSearch");
  const ls = $("libSearch");
  if(!gs || !ls) return;
  ls.value = gs.value || "";
  renderLibrary();
}

function bindKeyboardShortcuts(){
  window.addEventListener("keydown", (e) => {
    // Ignore when typing in inputs/textareas
    const t = e.target;
    const tag = (t && t.tagName) ? t.tagName.toLowerCase() : "";
    if(tag === "input" || tag === "textarea" || (t && t.isContentSửaable)) return;

    // Only apply in Học view
    if(state.view !== "learn") return;

    if(e.key === "ArrowRight"){
      e.preventDefault();
      next();
    }else if(e.key === "ArrowLeft"){
      e.preventDefault();
      prev();
    }else if(e.key === " " || e.key === "Spacebar"){
      e.preventDefault();
      flip();
    }else if(e.key === "Enter"){
      e.preventDefault();
      speakCurrent();
    }
  });
}

function bindSwipeOnCard(){
  const target = $("flipCard") || $("cardArea") || document.querySelector(".flipCard");
  if(!target) return;

  let sx = 0, sy = 0, moved = false;
  const THRESH = 50;

  target.addEventListener("touchstart", (e) => {
    if(!e.touches || !e.touches.length) return;
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
    moved = false;
  }, {passive:true});

  target.addEventListener("touchmove", (e) => {
    if(!e.touches || !e.touches.length) return;
    const dx = e.touches[0].clientX - sx;
    const dy = e.touches[0].clientY - sy;
    if(Math.abs(dx) > 10 || Math.abs(dy) > 10) moved = true;
    // prevent vertical scroll only when horizontal intent is clear
    if(Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 18){
      e.preventDefault();
    }
  }, {passive:false});

  target.addEventListener("touchend", (e) => {
    if(!moved) return;
    const ex = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : sx;
    const ey = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : sy;
    const dx = ex - sx;
    const dy = ey - sy;

    if(Math.abs(dx) > Math.abs(dy) && Math.abs(dx) >= THRESH){
      // Swipe left -> next, right -> prev
      if(dx < 0) next();
      else prev();
    }
  }, {passive:true});
}

// ---------- Bind UI ----------
function bindUI(){
  $("btnExportFull")?.addEventListener("click", exportFullBackup);
  $("fileImportFull")?.addEventListener("change", async (e)=>{
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if(!f) return;
    await importFullBackupFromFile(f);
  });

  document.querySelectorAll(".navItem").forEach(b => b.addEventListener("click", ()=> showView(b.dataset.view)));

  $("btnMởSettings")?.addEventListener("click", ()=> showView("settings"));
  $("btnContinue")?.addEventListener("click", ()=> showView("learn"));
  $("btnQuickManual")?.addEventListener("click", ()=> { state.autoOn=false; saveSettings(); showView("learn"); stopAuto(); renderHọc(); updateHomeMeta(); });
  $("btnQuickAuto")?.addEventListener("click", ()=> { state.autoOn=true; saveSettings(); showView("learn"); startAuto(); renderHọc(); updateHomeMeta(); });

  $("btnHọcNew")?.addEventListener("click", ()=> showView("learn"));
  $("btnReview")?.addEventListener("click", ()=> showView("review"));
  $("btnGoHọcFromReview")?.addEventListener("click", ()=> showView("learn"));

  $("flipCard")?.addEventListener("click", flip);
  $("btnFlip")?.addEventListener("click", (e)=>{ e.stopPropagation(); flip(); });
  $("btnNext")?.addEventListener("click", next);
  $("btnPrev")?.addEventListener("click", prev);
  $("btnShuffle")?.addEventListener("click", ()=> { onUserInteract(); shuffleInPlace(state.cards); state.index=0; state.flipped=false; renderHọc(); updateHomeMeta(); });
  $("btnReshuffle")?.addEventListener("click", ()=> { onUserInteract(); shuffleInPlace(state.cards); state.index=0; state.flipped=false; renderHọc(); updateHomeMeta(); });
  $("btnStar")?.addEventListener("click", (e)=>{ e.stopPropagation(); toggleFav(); });

  $("btnPlay")?.addEventListener("click", ()=> {
    state.autoOn = !state.autoOn;
    saveSettings();
    $("toggleAuto") && ($("toggleAuto").checked = !!state.autoOn);
    state.autoOn ? startAuto() : stopAuto();
    updateHomeMeta();
    renderHọc();
  });

  $("toggleAuto")?.addEventListener("change", ()=> {
    state.autoOn = $("toggleAuto").checked;
    saveSettings();
    state.autoOn ? startAuto() : stopAuto();
    updateHomeMeta();
    renderHọc();
  });

  $("toggleRandom")?.addEventListener("change", ()=> {
    state.random = $("toggleRandom").checked;
    saveSettings();
    setDeck(state.deckId);
  });

  $("autoFront")?.addEventListener("input", ()=> {
    state.autoFront = Number($("autoFront").value);
    saveSettings();
    if(state.autoOn) restartAuto();
    renderHọc();
  });
  $("autoBack")?.addEventListener("input", ()=> {
    state.autoBack = Number($("autoBack").value);
    saveSettings();
    if(state.autoOn) restartAuto();
    renderHọc();
  });

  $("btnSpeakUK")?.addEventListener("click", (e)=>{ e.stopPropagation(); state.voicePref="UK"; saveSettings(); updateVoiceSeg(); speakCurrent(); });
  $("btnSpeakUS")?.addEventListener("click", (e)=>{ e.stopPropagation(); state.voicePref="US"; saveSettings(); updateVoiceSeg(); speakCurrent(); });
  $("voiceUK")?.addEventListener("click", ()=>{ state.voicePref="UK"; saveSettings(); updateVoiceSeg(); });
  $("voiceUS")?.addEventListener("click", ()=>{ state.voicePref="US"; saveSettings(); updateVoiceSeg(); });

  document.querySelectorAll('input[name="speakMode"]').forEach(r => r.addEventListener("change", ()=> {
    state.speakMode = document.querySelector('input[name="speakMode"]:checked').value;
    saveSettings();
  }));

  $("btnSaveHọcSettings")?.addEventListener("click", ()=> saveSettings());

  $("themeLight")?.addEventListener("click", ()=> setTheme("light"));
  $("themeDark")?.addEventListener("click", ()=> setTheme("dark"));
  $("btnSaveTheme")?.addEventListener("click", ()=> saveSettings());

  $("btnXuấtProgress")?.addEventListener("click", exportProgress);
  $("btnXuấtBackupAll")?.addEventListener("click", exportBackupAll);
  $("btnImportBackupAll")?.addEventListener("click", ()=> $("importBackupAll")?.click());
  $("importBackupAll")?.addEventListener("change", async (e)=>{
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if(!f) return;
    await importBackupAllFromFile(f);
  });
  $("importProgress")?.addEventListener("change", importProgress);

  $("btnAddDeckLib")?.addEventListener("click", async ()=> {
    const name = prompt("Tên deck?");
    if(!name) return;
    await addDeck(name);
  });

  $("btnXuấtAllDecks")?.addEventListener("click", exportAllDecks);

  $("importDeckFile")?.addEventListener("change", async (e)=> {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if(!f) return;
    await importDeckFromFile(f);
  });

  $("importDecksAllFile")?.addEventListener("change", async (e)=> {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if(!f) return;
    await importDecksAllFromFile(f);
  });

  const debouncedRenderLibrary = debounce(renderLibrary, 200);
  $("libSearch")?.addEventListener("input", debouncedRenderLibrary);

  $("btnBackToLibrary")?.addEventListener("click", closeDeckDetail);
  $("ddSearch")?.addEventListener("input", renderDeckDetailTable);
  $("btnAddWord")?.addEventListener("click", ()=> openWordModal("add"));
  $("btnRenameDeck")?.addEventListener("click", async ()=> {
    if(!deckDetailId) return;
    const d = state.decks.find(x=>x.id===deckDetailId);
    if(!d) return;
    const name = prompt("New deck name:", d.name);
    if(!name) return;
    await renameDeck(deckDetailId, name);
  });
  $("btnXuấtDeck")?.addEventListener("click", ()=> deckDetailId && exportDeck(deckDetailId));
  $("btnXoáDeck")?.addEventListener("click", ()=> deckDetailId && deleteDeck(deckDetailId));

  $("wmClose")?.addEventListener("click", closeWordModal);
  $("wmCancel")?.addEventListener("click", closeWordModal);
  $("wmSave")?.addEventListener("click", saveWordFromModal);
  $("wordModal")?.addEventListener("click", (e)=>{ if(e.target.id==="wordModal") closeWordModal(); });

  $("globalSearch")?.addEventListener("focus", ()=> { showView("library"); syncGlobalSearchToLibrary(); });
  $("globalSearch")?.addEventListener("input", ()=> { showView("library"); syncGlobalSearchToLibrary(); });
  $("globalSearch")?.addEventListener("keydown", (e)=> {
    if(e.key === "Enter"){ e.preventDefault(); showView("library"); syncGlobalSearchToLibrary(); }
  });

  // Review handlers
  $("btnGoLearnFromReview")?.addEventListener("click", ()=> showView("learn"));
  $("btnReviewFlip")?.addEventListener("click", ()=> { setReviewFlip(!reviewFlipped); });
  $("rFlipCard")?.addEventListener("click", ()=> { setReviewFlip(!reviewFlipped); });
  $("btnToggleSrsInfo")?.addEventListener("click", toggleSrsInfo);
  $("btnReviewForget")?.addEventListener("click", ()=> reviewRate(0));
  $("btnReviewHard")?.addEventListener("click", ()=> reviewRate(3));
  $("btnReviewGood")?.addEventListener("click", ()=> reviewRate(4));
  $("btnReviewEasy")?.addEventListener("click", ()=> reviewRate(5));
  $("rSpeakUK")?.addEventListener("click", (e)=>{ e.stopPropagation(); speakCurrentReview("en-GB"); });
  $("rSpeakUS")?.addEventListener("click", (e)=>{ e.stopPropagation(); speakCurrentReview("en-US"); });

}

async function refreshAll(){
  await loadDecks();
  renderSidebar();
  renderLibrary();
  if(state.deckId !== "__all" && state.deckId !== "__fav"){
    if(!state.decks.find(d=>d.id===state.deckId)) state.deckId="__all";
  }
  setDeck(state.deckId);
  cleanupOrphanProgress();
}


function ensureStarterDeckIfEmpty(){
  try{
    if(Array.isArray(state.decks) && state.decks.length > 0) return;
    const deckId = "starter_deck";
    const deck = { id: deckId, name: "Starter 50 (Mẫu)", createdAt: Date.now() };
    state.decks = [deck];
    state.deckWords.set(deckId, STARTER_DECK.map(x => ({...x})));
    state.activeDeckId = deckId;

    // persist
    localStorage.setItem(STORAGE.decks, JSON.stringify(state.decks));
    localStorage.setItem(STORAGE.deckWords(deckId), JSON.stringify(state.deckWords.get(deckId)));

  }catch{}
}

async function init(){
  loadSettings();
  loadProgress();
  setTheme(state.theme || "light");

  await ensureLegacyDeckIfEmpty();
  await loadDecks();

  renderSidebar();
  updateCounts();
  bindUI();
  bindKeyboardShortcuts();
  bindSwipeOnCard();
  $("reviewAgain")?.addEventListener("click", ()=> reviewRate("again"));
  $("reviewGood")?.addEventListener("click", ()=> reviewRate("good"));
  $("reviewEasy")?.addEventListener("click", ()=> reviewRate("easy"));

  setDeck("__all");
  updateHomeMeta();
  renderLibrary();
  renderHọc();

  if("speechSynthesis" in window) speechSynthesis.onvoiceschanged = () => {};
}

init();
// ---------- Full Backup ----------
function exportFullBackup(){
  const payload = {
    schemaVersion: 1,
    kind: "full-backup",
    exportedAt: Date.now(),
    app: "de-nhi-web",
    decks: (state.decks||[]).map(d => ({
      id: d.id,
      name: d.name,
      createdAt: d.createdAt || null,
      words: (state.deckWords.get(d.id)||[])
    })),
    progress: {
      favorites: state.favorites || {},
      seen: state.seen || {},
      srs: state.srs || {}
    },
    settings: {
      theme: state.theme || "light",
      learnNewOnly: !!state.learnNewOnly,
      ttsAutoFront: !!state.ttsAutoFront,
      ttsAutoBack: !!state.ttsAutoBack
    }
  };

  const ts = new Date().toISOString().slice(0,19).replaceAll(":","-");
  downloadJson(payload, `de-nhi-backup-${ts}.json`);
}

async function importFullBackupFromFile(file){
  const text = await file.text();
  let parsed;
  try{ parsed = JSON.parse(text); }catch{ alert("File backup không hợp lệ (JSON)."); return; }

  if(!parsed || parsed.kind !== "full-backup" || !Array.isArray(parsed.decks)){
    alert("Đây không phải backup full đúng định dạng.");
    return;
  }

  const ok = confirm("Nhập backup sẽ GHI ĐÈ toàn bộ dữ liệu hiện tại (deck + tiến độ + cài đặt). Bạn chắc chắn?");
  if(!ok) return;

  try{
    // decks + words
    const decks = parsed.decks.map(d => ({ id:d.id, name:d.name, createdAt: d.createdAt||Date.now() }));
    localStorage.setItem(STORAGE.decks, JSON.stringify(decks));
    for(const d of decks){
      const entry = parsed.decks.find(x=>x.id===d.id);
      const words = (entry && entry.words) ? entry.words : [];
      localStorage.setItem(STORAGE.deckWords(d.id), JSON.stringify(words));
    }

    // progress
    localStorage.setItem(STORAGE.favorites, JSON.stringify(parsed.progress?.favorites || {}));
    localStorage.setItem(STORAGE.seen, JSON.stringify(parsed.progress?.seen || {}));
    localStorage.setItem(STORAGE.srs, JSON.stringify(parsed.progress?.srs || {}));

    // settings
    localStorage.setItem(STORAGE.settings, JSON.stringify(parsed.settings || {}));

    location.reload();
  }catch(e){
    console.error(e);
    alert("Nhập backup thất bại.");
  }
}




function totalWordCount(){
  try{
    let n = 0;
    for(const d of (state.decks||[])){
      const w = state.deckWords.get(d.id);
      if(Array.isArray(w)) n += w.length;
    }
    return n;
  }catch{ return 0; }
}
