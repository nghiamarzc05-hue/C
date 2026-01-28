(function(){
'use strict';

function debounce(fn, delay){
  let t; 
  return function(...args){
    clearTimeout(t);
    t = setTimeout(()=>fn.apply(this,args), delay);
  }
}

/* Ứng dụng học từ vựng đa ngôn ngữ — 100% client-side */
(() => {
  "use strict";

  const KHOA = {
    DU_LIEU: "dnhv_du_lieu_v1",
    TIEN_DO: "dnhv_tien_do_v1",
    CAI_DAT: "dnhv_cai_dat_v1",
  };

  const TRANG_THAI = {
    CHUA_DANH_DAU: "chua-danh-dau",
    CHUA_NHO: "chua-nho",
    DA_NHO: "da-nho",
  };

  const macDinhCaiDat = {
    packId: "en-US",
    giaoDien: "tu-dong", // tu-dong | sang | toi
    mode: "chu-de", // chu-de | ngau-nhien | tu-kho
    auto: false,
    intervalSec: 5,
    hienNghia: true,
    hienIpa: false,
    hienViDu: true,
    ttsVoiceURI: "",
    ttsRate: 1.0,
    ttsPitch: 1.0,
    ttsVolume: 1.0,
  };

  // ====== Tiện ích ======
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  const thongBao = (msg, kieu = "info") => {
    const nhatKy = $("#nhatKy");
    const prefix = kieu === "loi" ? "LỖI" : kieu === "ok" ? "OK" : "INFO";
    const dong = `[${new Date().toLocaleTimeString("vi-VN")}] ${prefix}: ${msg}\n`;
    nhatKy.textContent = dong + nhatKy.textContent;
  };

  const taiJson = async (url) => {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(`Không tải được dữ liệu: ${url}`);
    return await r.json();
  };

  const taiLocal = (khoa, macDinh) => {
    try {
      const raw = localStorage.getItem(khoa);
      if (!raw) return macDinh;
      return JSON.parse(raw);
    } catch {
      return macDinh;
    }
  };

  const luuLocal = (khoa, obj) => {
    localStorage.setItem(khoa, JSON.stringify(obj));
  };

  const taiCsv = async (file) => {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) throw new Error("CSV trống hoặc không hợp lệ.");
    const header = parseCsvLine(lines[0]).map(s => s.trim());
    const rows = lines.slice(1).map(parseCsvLine);
    return { header, rows };
  };

  function parseCsvLine(line){
    // CSV tối giản: hỗ trợ dấu phẩy và dấu ngoặc kép
    const out = [];
    let cur = "";
    let inQ = false;
    for (let i=0;i<line.length;i++){
      const ch = line[i];
      if (ch === '"'){
        if (inQ && line[i+1] === '"'){ cur += '"'; i++; }
        else inQ = !inQ;
      } else if (ch === "," && !inQ){
        out.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out;
  }

  // ====== Trạng thái ứng dụng ======
  const state = {
    duLieu: null,        // {schemaVersion, packs:[...]}
    pack: null,          // pack hiện tại
    caiDat: taiLocal(KHOA.CAI_DAT, macDinhCaiDat),
    tienDo: taiLocal(KHOA.TIEN_DO, { byItem: {}, kho: {} }), // byItem[id]={status, difficult, lastSeen}
    boLoc: {
      q: "",
      topicId: "tat-ca",
      difficulty: "tat-ca",
      status: "tat-ca",
    },
    hoc: {
      danhSach: [], // mảng itemId theo thứ tự học
      index: 0,
      flipped: false,
      topicIdDangChon: null,
    },
    // PATCH_v2
    autoTimer: null,
    tts: { voices: [], supported: false, isPlaying: false },
    index: {},
    stats: {},
    ui: {}, // Fix: Khởi tạo namespace UI để tránh crash
  };

  // ====== DOM ======
  // PATCH_v2
  const dom = {
    oTim: $("#oTim"),
    btnXoaTim: $("#btnXoaTim"),
    btnCheDo: $("#btnCheDo"),
    btnCaiDat: $("#btnCaiDat"),
    btnHuongDan: $("#btnHuongDan"),
    btnGiaoDienNhanh: $("#btnGiaoDienNhanh"),
    dlgCheDo: $("#dlgCheDo"),
    dlgCaiDat: $("#dlgCaiDat"),
    dlgHuongDan: $("#dlgHuongDan"),
    chonGoi: $("#chonGoi"),
    chonGiaoDien: $("#chonGiaoDien"),
    chonGiongDoc: $("#chonGiongDoc"),
    ttsTocDo: $("#ttsTocDo"),
    ttsCaoDo: $("#ttsCaoDo"),
    ttsAmLuong: $("#ttsAmLuong"),
    lblTtsTocDo: $("#lblTtsTocDo"),
    lblTtsCaoDo: $("#lblTtsCaoDo"),
    lblTtsAmLuong: $("#lblTtsAmLuong"),

    dsChuDe: $("#dsChuDe"),
    dsTatCa: $("#dsTatCa"),
    locTrangThai: $("#locTrangThai"),
    locDoKho: $("#locDoKho"),
    locChuDe: $("#locChuDe"),

    btnOnTuKho: $("#btnOnTuKho"),
    btnOnChuaThuoc: $("#btnOnChuaThuoc"),

    tepTaiLen: $("#tepTaiLen"),
    btnNhapGop: $("#btnNhapGop"),
    btnNhapThay: $("#btnNhapThay"),
    btnXuatJson: $("#btnXuatJson"),
    btnKhoiPhucMacDinh: $("#btnKhoiPhucMacDinh"),
    btnXoaDuLieu: $("#btnXoaDuLieu"),

    chipChuDe: $("#chipChuDe"),
    chipGoi: $("#chipGoi"),
    dongChiMuc: $("#dongChiMuc"),

    flashcard: $("#flashcard"),
    oTerm: $("#oTerm"),
    oIpa: $("#oIpa"),
    oMeaning: $("#oMeaning"),
    oExample: $("#oExample"),
    oExampleVi: $("#oExampleVi"),

    // PATCH_v2
    btnNghe: $("#btnNghe"),
    btnDung: $("#btnDung"),
    chiBaoDangPhat: $("#chiBaoDangPhat"),
    btnDanhDauKho: $("#btnDanhDauKho"),
    btnTruoc: $("#btnTruoc"),
    btnLat: $("#btnLat"),
    btnTiep: $("#btnTiep"),
    btnTuDong: $("#btnTuDong"),
    oKhoang: $("#oKhoang"),
    lblGiay: $("#lblGiay"),
    anHienNghia: $("#anHienNghia"),
    anHienIpa: $("#anHienIpa"),
    anHienViDu: $("#anHienViDu"),
    btnDaNho: $("#btnDaNho"),
    btnChuaNho: $("#btnChuaNho"),
    btnBoDanhDau: $("#btnBoDanhDau"),
    chonDoKho: $("#chonDoKho"),
    btnCheDoHocChuDe: $("#btnCheDoHocChuDe"),
    btnCheDoHocNgauNhien: $("#btnCheDoHocNgauNhien"),

    thongKeLoc: $("#thongKeLoc"),

    lblTienDoTong: $("#lblTienDoTong"),
    barTong: $("#barTong"),
  };

  // ====== Tải dữ liệu ======
  async function khoiDong(){
    apDungGiaoDien(state.caiDat.giaoDien);

    // Ưu tiên dữ liệu người dùng đã nhập trước đó
    const duLieuDaLuu = taiLocal(KHOA.DU_LIEU, null);
    if (duLieuDaLuu && duLieuDaLuu.packs?.length){
      state.duLieu = duLieuDaLuu;
      thongBao("Đã nạp dữ liệu từ bộ nhớ trình duyệt.", "ok");
    } else {
      state.duLieu = await taiJson("data/default-pack.en-US.json");
      luuLocal(KHOA.DU_LIEU, state.duLieu);
      thongBao("Đã nạp gói dữ liệu mặc định.", "ok");
    }

    napPackTheoCaiDat();
    initTTS();
    ganSuKien();
    veUI();
    // nếu không hỗ trợ TTS thì vô hiệu hóa nút nghe
    if (!state.tts.supported){
      dom.btnNghe.disabled = true;
      dom.btnDung.disabled = true;
      dom.btnNghe.title = "Trình duyệt không hỗ trợ đọc văn bản";
    }
    chuyenMode(state.caiDat.mode, true);
    moHuongDanLanDau();
  }

  function moHuongDanLanDau(){
    const daMo = taiLocal("dnhv_da_mo_huong_dan", false);
    if (!daMo){
      dom.dlgHuongDan.showModal();
      luuLocal("dnhv_da_mo_huong_dan", true);
    }
  }


  // ====== Âm thanh (TTS / audioUrl) ======
  // PATCH_v2
  async function initTTS(){
    state.tts.supported = !!window.speechSynthesis && !!window.SpeechSynthesisUtterance;
    if (!state.tts.supported){
      capNhatTrangThaiPhat(false);
      return;
    }

    const load = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        state.tts.voices = [...voices];
        doDayDanhSachGiong();
      }
    };

    load();
    window.speechSynthesis.onvoiceschanged = load;
    // Retry nhẹ cho Android/Chrome nếu load lần đầu xịt
    if (!state.tts.voices.length) setTimeout(load, 500);
  }

  function doDayDanhSachGiong(){
    if (!dom.chonGiongDoc) return;

    const voices = state.tts.voices || [];
    dom.chonGiongDoc.innerHTML = "";
    if (!voices.length){
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "Không có giọng đọc";
      dom.chonGiongDoc.appendChild(opt);
      return;
    }

    const lang = state.pack?.ngonNguHoc || "en-US";
    const list = voices.slice().sort((a,b) => {
      const aHit = (a.lang === lang) ? 0 : (a.lang.startsWith(lang.split("-")[0]) ? 1 : 2);
      const bHit = (b.lang === lang) ? 0 : (b.lang.startsWith(lang.split("-")[0]) ? 1 : 2);
      return aHit - bHit;
    });

    for (const v of list){
      const opt = document.createElement("option");
      opt.value = v.voiceURI;
      opt.textContent = `${v.name} (${v.lang})`;
      dom.chonGiongDoc.appendChild(opt);
    }

    if (state.caiDat.ttsVoiceURI){
      dom.chonGiongDoc.value = state.caiDat.ttsVoiceURI;
    } else {
      const best = list.find(v => v.lang === lang) || list.find(v => v.lang.startsWith(lang.split("-")[0])) || list[0];
      state.caiDat.ttsVoiceURI = best?.voiceURI || "";
      luuLocal(KHOA.CAI_DAT, state.caiDat);
      dom.chonGiongDoc.value = state.caiDat.ttsVoiceURI;
    }
  }

  function capNhatTrangThaiPhat(isPlaying){
    state.tts.isPlaying = isPlaying;
    dom.btnDung.disabled = !isPlaying;
    dom.btnNghe.setAttribute("aria-pressed", isPlaying ? "true" : "false");
    dom.chiBaoDangPhat.classList.toggle("is-hidden", !isPlaying);
  }

  function dungAm(){
    if (state.tts.audio){
      try{
        state.tts.audio.pause();
        state.tts.audio.currentTime = 0;
      }catch{}
      state.tts.audio = null;
    }
    if (state.tts.supported){
      try{ window.speechSynthesis.cancel(); }catch{}
    }
    capNhatTrangThaiPhat(false);
  }

  function noiVanBan(text, lang){
    if (!state.tts.supported) throw new Error("Trình duyệt không hỗ trợ Speech Synthesis.");
    const voices = state.tts.voices || [];
    if (!voices.length) throw new Error("Không tìm thấy giọng đọc trong trình duyệt.");

    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang || "en-US";
    utt.rate = Number(state.caiDat.ttsRate || 1);
    utt.pitch = Number(state.caiDat.ttsPitch || 1);
    utt.volume = Number(state.caiDat.ttsVolume || 1);

    const v = voices.find(x => x.voiceURI === state.caiDat.ttsVoiceURI) ||
              voices.find(x => x.lang === utt.lang) ||
              voices.find(x => x.lang.startsWith(utt.lang.split("-")[0])) ||
              voices[0];
    if (v) utt.voice = v;

    utt.onstart = () => capNhatTrangThaiPhat(true);
    utt.onend = () => capNhatTrangThaiPhat(false);
    utt.onerror = () => {
      capNhatTrangThaiPhat(false);
      thongBao("Không phát được âm thanh (Speech Synthesis).", "loi");
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
  }

  // PATCH_v2
  // PATCH_v2
  async function phatAmHienTai(){
    const it = itemHienTai(); if(!it) return;
    dungAm(); capNhatTrangThaiPhat(true);

    const play = (url) => new Promise((resolve, reject) => {
      const a = new Audio(url); state.tts.audio = a;
      a.onended = () => { capNhatTrangThaiPhat(false); resolve(); };
      a.onerror = reject; a.play().catch(reject);
    });

    try {
      // 1. Audio có sẵn
      if(it.audioUrl) return await play(it.audioUrl);
      
      // 2. Từ đơn -> Tìm giọng người thật (DictionaryAPI)
      if(!it.term.includes(" ")){
        try {
          const r = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${it.term}`);
          const d = await r.json();
          const src = d[0]?.phonetics?.find(x=>x.audio && x.audio.includes("us.mp3"))?.audio || d[0]?.phonetics?.find(x=>x.audio)?.audio;
          if(src) return await play(src);
        } catch(e){}
      }

      // 3. Youdao TTS (Giọng Mỹ chuẩn, mượt hơn Google)
      await play(`https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(it.term)}&type=2`);
    } catch (e) {
      // 4. Fallback: Giọng trình duyệt
      capNhatTrangThaiPhat(false);
      noiVanBan(it.term, state.pack?.ngonNguHoc || "en-US");
    }
  }


    function napPackTheoCaiDat(){
    const pack = state.duLieu.packs.find(p => p.id === state.caiDat.packId) || state.duLieu.packs[0];
    state.pack = pack;
    state.caiDat.packId = pack.id;
    luuLocal(KHOA.CAI_DAT, state.caiDat);
    xayChiMucPack();
  }

  function xayChiMucPack(){
    const p = state.pack;
    state.index.itemById = new Map(p.items.map(it => [it.id, it]));
    state.index.topicById = new Map(p.topics.map(t => [t.id, t]));

    const byTopic = new Map();
    for (const it of p.items){
      if (!byTopic.has(it.topicId)) byTopic.set(it.topicId, []);
      byTopic.get(it.topicId).push(it.id);
    }
    state.index.itemsByTopic = byTopic;

    // thống kê
    state.stats.tong = p.items.length;
    state.stats.daThuoc = 0;
    state.stats.daThuocTheoChuDe = new Map();
    state.stats.tongTheoChuDe = new Map();
    for (const t of p.topics){
      const ids = byTopic.get(t.id) || [];
      state.stats.tongTheoChuDe.set(t.id, ids.length);
      state.stats.daThuocTheoChuDe.set(t.id, 0);
    }
    for (const it of p.items){
      const td = layTienDo(it.id);
      if (td.status === TRANG_THAI.DA_NHO){
        state.stats.daThuoc++;
        state.stats.daThuocTheoChuDe.set(it.topicId, (state.stats.daThuocTheoChuDe.get(it.topicId)||0)+1);
      }
    }
  }

  function itemTheoId(id){
    return state.index.itemById.get(id) || null;
  }


  // ====== Ràng buộc dữ liệu ======
  function chuanHoaDuLieu(duLieu){
    if (!duLieu || typeof duLieu !== "object") throw new Error("Tệp không phải JSON hợp lệ.");
    if (duLieu.schemaVersion !== 1) throw new Error("schemaVersion không đúng (cần = 1).");
    if (!Array.isArray(duLieu.packs) || duLieu.packs.length === 0) throw new Error("Thiếu danh sách packs.");
    for (const p of duLieu.packs){
      if (!p.id || !p.ten) throw new Error("Mỗi pack cần có id và ten.");
      if (!Array.isArray(p.topics) || !Array.isArray(p.items)) throw new Error("Pack phải có topics và items (mảng).");
      const topicIds = new Set(p.topics.map(t => t.id));
      for (const it of p.items){
        const batBuoc = ["id","topicId","term","meaning_vi","example","example_vi"];
        for (const k of batBuoc){
          if (typeof it[k] !== "string" || it[k].trim() === "") throw new Error(`Mục ${it.id || "(không có id)"} thiếu trường bắt buộc: ${k}`);
        }
        if (!topicIds.has(it.topicId)) throw new Error(`Mục ${it.id} có topicId không tồn tại: ${it.topicId}`);
        if (it.difficulty != null && ![1,2,3].includes(Number(it.difficulty))) throw new Error(`Mục ${it.id} có difficulty không hợp lệ (1-3).`);
        if (it.tags != null && !Array.isArray(it.tags)) throw new Error(`Mục ${it.id} có tags không phải mảng.`);
        if (it.audioUrl != null && typeof it.audioUrl !== "string") throw new Error(`Mục ${it.id} có audioUrl không phải chuỗi.`);
      }
    }
    return duLieu;
  }

  function csvSangDuLieu(csv){
    // Cột khuyến nghị: packId, packTen, topic, topicId, term, ipa, meaning_vi, example, example_vi, pos, tags, difficulty
    const idx = (name) => csv.header.findIndex(h => h.toLowerCase() === name.toLowerCase());
    const iTopic = idx("topic");
    const iTopicId = idx("topicId");
    const iTerm = idx("term");
    const iIpa = idx("ipa");
    const iMean = idx("meaning_vi");
    const iEx = idx("example");
    const iExVi = idx("example_vi");
    if (iTerm < 0 || iMean < 0 || iEx < 0 || iExVi < 0) {
      throw new Error("CSV thiếu cột bắt buộc. Cần: term, meaning_vi, example, example_vi. (topic/topicId khuyến nghị)");
    }

    const packId = "import-1";
    const topicsMap = new Map();
    const items = [];

    for (let r=0;r<csv.rows.length;r++){
      const row = csv.rows[r];
      const topicName = (iTopic >= 0 ? row[iTopic] : "Chưa phân loại") || "Chưa phân loại";
      const topicId = (iTopicId >= 0 ? row[iTopicId] : null) || ("topic-" + slug(topicName));
      if (!topicsMap.has(topicId)){
        topicsMap.set(topicId, { id: topicId, ten: topicName });
      }
      const it = {
        id: `${topicId}-${String(r+1).padStart(3,"0")}`,
        topicId,
        term: (row[iTerm]||"").trim(),
        ipa: (iIpa >= 0 ? (row[iIpa]||"").trim() : ""),
        meaning_vi: (row[iMean]||"").trim(),
        example: (row[iEx]||"").trim(),
        example_vi: (row[iExVi]||"").trim(),
        pos: "",
        tags: [],
        difficulty: 1
      };
      items.push(it);
    }

    return chuanHoaDuLieu({
      schemaVersion: 1,
      packs: [{
        id: packId,
        ten: "Dữ liệu CSV đã nhập",
        moTa: "Tạo tự động từ CSV.",
        ngonNguHoc: "unknown",
        ngonNguGiaiNghia: "vi-VN",
        topics: Array.from(topicsMap.values()),
        items
      }]
    });
  }

  function slug(s){
    return s.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  // ====== Lọc & danh sách ======
  function timKiemTrongItem(it, q){
    if (!q) return true;
    const s = q.toLowerCase();
    const tags = (it.tags||[]).join(" ").toLowerCase();
    return (
      it.term.toLowerCase().includes(s) ||
      it.meaning_vi.toLowerCase().includes(s) ||
      (it.example||"").toLowerCase().includes(s) ||
      tags.includes(s)
    );
  }

  function layTienDo(itemId){
    return state.tienDo.byItem[itemId] || { status: TRANG_THAI.CHUA_DANH_DAU, difficult: false };
  }

  function setTienDo(itemId, patch){
    const cur = layTienDo(itemId);
    const next = { ...cur, ...patch, lastSeen: Date.now() };
    state.tienDo.byItem[itemId] = next;
    luuLocal(KHOA.TIEN_DO, state.tienDo);

    // cập nhật thống kê nếu đổi trạng thái
    if (patch.status && patch.status !== cur.status){
      const it = itemTheoId(itemId);
      if (it){
        const topicId = it.topicId;
        if (cur.status === TRANG_THAI.DA_NHO){
          state.stats.daThuoc = Math.max(0, state.stats.daThuoc - 1);
          state.stats.daThuocTheoChuDe.set(topicId, Math.max(0, (state.stats.daThuocTheoChuDe.get(topicId)||0) - 1));
        }
        if (patch.status === TRANG_THAI.DA_NHO){
          state.stats.daThuoc += 1;
          state.stats.daThuocTheoChuDe.set(topicId, (state.stats.daThuocTheoChuDe.get(topicId)||0) + 1);
        }
      }
    }
  }

  function itemsDaLoc(){
    const p = state.pack;
    const q = state.boLoc.q.trim();
    return p.items.filter(it => {
      if (state.boLoc.topicId !== "tat-ca" && it.topicId !== state.boLoc.topicId) return false;
      if (state.boLoc.difficulty !== "tat-ca" && String(it.difficulty||1) !== String(state.boLoc.difficulty)) return false;
      if (state.boLoc.status !== "tat-ca"){
        const st = layTienDo(it.id).status;
        if (st !== state.boLoc.status) return false;
      }
      if (!timKiemTrongItem(it, q)) return false;
      return true;
    });
  }

  // ====== Học ======
  function taoDanhSachHocTheoChuDe(topicId){
    const list = state.pack.items.filter(it => it.topicId === topicId);
    state.hoc.danhSach = list.map(it => it.id);
    state.hoc.index = 0;
    state.hoc.topicIdDangChon = topicId;
    renderCard();
    if (state.caiDat.auto) phatAmHienTai();
  }

  function taoDanhSachHocNgauNhien(){
    const list = itemsDaLoc();
    renderThongKeLoc();
    const ids = list.map(it => it.id);
    tronMang(ids);
    state.hoc.danhSach = ids;
    state.hoc.index = 0;
    state.hoc.topicIdDangChon = null;
    renderCard();
    if (state.caiDat.auto) phatAmHienTai();
  }

  function taoDanhSachTuKho(){
    const list = state.pack.items.filter(it => layTienDo(it.id).difficult);
    const ids = list.map(it => it.id);
    state.hoc.danhSach = ids;
    state.hoc.index = 0;
    state.hoc.topicIdDangChon = null;
    renderCard();
    if (state.caiDat.auto) phatAmHienTai();
  }

  function taoDanhSachChuaThuoc(){
    const list = state.pack.items.filter(it => layTienDo(it.id).status !== TRANG_THAI.DA_NHO);
    const ids = list.map(it => it.id);
    state.hoc.danhSach = ids;
    state.hoc.index = 0;
    state.hoc.topicIdDangChon = null;
    renderCard();
  }

  function tronMang(a){
    for (let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
  }

  function itemHienTai(){
    const id = state.hoc.danhSach[state.hoc.index];
    return id ? itemTheoId(id) : null;
  }

  function truoc(){
    if (!state.hoc.danhSach.length) return;
    dungAm();
    state.hoc.index = (state.hoc.index - 1 + state.hoc.danhSach.length) % state.hoc.danhSach.length;
    state.hoc.flipped = false;
    renderCard();
  }

  function tiep(){
    if (!state.hoc.danhSach.length) return;
    dungAm();
    state.hoc.index = (state.hoc.index + 1) % state.hoc.danhSach.length;
    state.hoc.flipped = false;
    renderCard();
    if (state.caiDat.auto) phatAmHienTai();
  }

  function lat(){
    state.hoc.flipped = !state.hoc.flipped;
    renderCard();
  }

  function batTatTuDong(force){
    state.caiDat.auto = typeof force === "boolean" ? force : !state.caiDat.auto;
    luuLocal(KHOA.CAI_DAT, state.caiDat);
    if (state.caiDat.auto){
      dongTimer();
      state.autoTimer = setInterval(() => {
        // nếu đang lật mặt trước -> lật; nếu đang mặt sau -> sang thẻ tiếp
        if (!state.hoc.flipped) lat();
        else tiep();
      }, state.caiDat.intervalSec * 1000);
      thongBao(`Đã bật tự động (${state.caiDat.intervalSec}s).`, "ok");
    } else {
      dongTimer();
      thongBao("Đã tắt tự động.", "ok");
    }
    renderAutoUI();
  }

  function dongTimer(){
    if (state.autoTimer){
      clearInterval(state.autoTimer);
      state.autoTimer = null;
    }
  }

  // ====== UI ======
  function veUI(){
    // dropdown pack
    dom.chonGoi.innerHTML = "";
    for (const p of state.duLieu.packs){
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.ten;
      if (p.id === state.caiDat.packId) opt.selected = true;
      dom.chonGoi.appendChild(opt);
    }
    dom.chonGiaoDien.value = state.caiDat.giaoDien;

    // lọc chủ đề
    dom.locChuDe.innerHTML = "";
    const optAll = document.createElement("option");
    optAll.value = "tat-ca";
    optAll.textContent = "Tất cả";
    dom.locChuDe.appendChild(optAll);
    for (const t of state.pack.topics){
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = t.ten;
      dom.locChuDe.appendChild(opt);
    }
    dom.locChuDe.value = state.boLoc.topicId;

    // danh sách chủ đề
    buildChuDeList();
    renderTatCa();
    taoDanhSachHocKhoiTao();
    renderToggles();
    renderTTSUI();
    renderAutoUI();
    renderTienDo();
  }

  function buildChuDeList(){
    dom.dsChuDe.innerHTML = "";
    state.ui.chuDeBtnById = new Map();

    for (const t of state.pack.topics){
      const el = document.createElement("button");
      el.className = "item";
      el.type = "button";
      el.dataset.topicId = t.id;

      const left = document.createElement("span");
      const title = document.createElement("b");
      title.textContent = t.ten;
      const sub = document.createElement("div");
      sub.className = "phu";
      sub.textContent = "0/0 đã nhớ";
      left.appendChild(title);
      left.appendChild(sub);

      const right = document.createElement("span");
      right.className = "phu";
      right.textContent = "0%";

      el.appendChild(left);
      el.appendChild(right);

      el.addEventListener("click", () => {
        state.boLoc.topicId = t.id;
        dom.locChuDe.value = t.id;
        state.caiDat.mode = "chu-de";
        luuLocal(KHOA.CAI_DAT, state.caiDat);
        taoDanhSachHocTheoChuDe(t.id);
        updateChuDeStats();
        renderTatCa();
        thongBao(`Đang học chủ đề: ${t.ten}`, "ok");
      });

      dom.dsChuDe.appendChild(el);
      state.ui.chuDeBtnById.set(t.id, { el, sub, right });
    }
    updateChuDeStats();
  }

  function updateChuDeStats(){
    for (const [topicId, refs] of state.ui.chuDeBtnById.entries()){
      const da = state.stats.daThuocTheoChuDe.get(topicId) || 0;
      const tong = state.stats.tongTheoChuDe.get(topicId) || 0;
      refs.sub.textContent = `${da}/${tong} đã nhớ`;
      refs.right.textContent = `${phanTram(da,tong)}%`;
    }
  }


  function renderThongKeLoc(){
    const all = state.pack.items;
    const q = state.boLoc.q.trim().toLowerCase();
    const topicId = state.boLoc.topicId;
    const diff = state.boLoc.difficulty;

    let scope = all.filter(it => {
      if (topicId !== "tat-ca" && it.topicId !== topicId) return false;
      if (diff !== "tat-ca" && String(it.difficulty||1) !== String(diff)) return false;
      if (q){
        const s = q;
        const tags = (it.tags||[]).join(" ").toLowerCase();
        if (!(it.term.toLowerCase().includes(s) || it.meaning_vi.toLowerCase().includes(s) || (it.example||"").toLowerCase().includes(s) || tags.includes(s))) return false;
      }
      return true;
    });

    let daNho = 0, chuaNho = 0, chuaDD = 0;
    for (const it of scope){
      const st = layTienDo(it.id).status;
      if (st === TRANG_THAI.DA_NHO) daNho++;
      else if (st === TRANG_THAI.CHUA_NHO) chuaNho++;
      else chuaDD++;
    }

    const tong = scope.length;
    dom.thongKeLoc.textContent = [
      `Trong phạm vi lọc (chưa tính trạng thái): ${tong} mục`,
      `• Đã nhớ: ${daNho}`,
      `• Chưa nhớ: ${chuaNho}`,
      `• Chưa đánh dấu: ${chuaDD}`,
    ].join("\n");
  }

  function renderTatCa(){
    const list = itemsDaLoc();
    dom.dsTatCa.innerHTML = "";
    if (!list.length){
      const el = document.createElement("div");
      el.className = "mo-ta";
      el.textContent = "Không có mục nào khớp bộ lọc/tìm kiếm.";
      dom.dsTatCa.appendChild(el);
      return;
    }
    // PATCH_v2
    for (const it of list.slice(0, 260)){
      const td = layTienDo(it.id);
      const el = document.createElement("button");
      el.className = "item";
      el.type = "button";

      const left = document.createElement("span");
      const bTerm = document.createElement("b");
      bTerm.textContent = it.term;
      const divPhu = document.createElement("div");
      divPhu.className = "phu";
      divPhu.textContent = `${it.meaning_vi} • ${nhanTrangThai(td.status)}${td.difficult ? " • ⭐" : ""}`;
      left.append(bTerm, divPhu);

      const right = document.createElement("span");
      right.className = "phu";
      right.textContent = `ĐK ${it.difficulty||1}`;

      el.append(left, right);
      el.onclick = () => {
        state.hoc.danhSach = list.map(x => x.id);
        state.hoc.index = state.hoc.danhSach.indexOf(it.id);
        state.hoc.flipped = false;
        state.hoc.topicIdDangChon = null;
        renderCard();
        thongBao("Đã mở mục từ danh sách.", "ok");
      };
      dom.dsTatCa.appendChild(el);
    }
  }

  function taoDanhSachHocKhoiTao(){
    if (state.caiDat.mode === "tu-kho") taoDanhSachTuKho();
    else if (state.caiDat.mode === "ngau-nhien") taoDanhSachHocNgauNhien();
    else {
      const topicId = state.boLoc.topicId !== "tat-ca" ? state.boLoc.topicId : state.pack.topics[0]?.id;
      if (topicId) taoDanhSachHocTheoChuDe(topicId);
      else renderCard();
    }
  }

  function renderCard(){
    const it = itemHienTai();
    const has = !!it;
    dom.oTerm.textContent = has ? it.term : "Không có dữ liệu";
    dom.oMeaning.textContent = has ? it.meaning_vi : "Hãy nhập dữ liệu ở tab Nhập/Xuất.";
    dom.oExample.textContent = has && state.caiDat.hienViDu ? it.example : "";
    dom.oExampleVi.textContent = has && state.caiDat.hienViDu ? it.example_vi : "";
    dom.oIpa.textContent = has && state.caiDat.hienIpa && it.ipa ? `/${it.ipa}/` : "";

    // chip
    const topic = has ? (state.index.topicById?.get(it.topicId) || null) : null;
    dom.chipChuDe.textContent = topic ? topic.ten : "—";
    dom.chipGoi.textContent = state.pack?.ten || "—";

    // trạng thái & độ khó
    if (has){
      const td = layTienDo(it.id);
            dom.chonDoKho.value = String(it.difficulty||1);
      dom.btnDanhDauKho.setAttribute("aria-pressed", td.difficult ? "true" : "false");
      dom.btnDanhDauKho.textContent = td.difficult ? "⭐ Đã đánh dấu" : "⭐ Từ khó";

      // trạng thái ghi nhớ
      dom.btnDaNho.classList.toggle("nut-phu", td.status !== TRANG_THAI.DA_NHO);
      dom.btnChuaNho.classList.toggle("nut-phu", td.status !== TRANG_THAI.CHUA_NHO);
      dom.btnBoDanhDau.classList.toggle("nut-phu", td.status !== TRANG_THAI.CHUA_DANH_DAU);
    }

    // flip
    dom.flashcard.classList.toggle("is-flipped", state.hoc.flipped);
    const frontHidden = state.hoc.flipped ? "true" : "false";
    const backHidden = state.hoc.flipped ? "false" : "true";
    dom.flashcard.querySelector(".mat.truoc").setAttribute("aria-hidden", frontHidden);
    dom.flashcard.querySelector(".mat.sau").setAttribute("aria-hidden", backHidden);

    // hiển thị nghĩa
    $(".mat.sau .meaning").style.display = state.caiDat.hienNghia ? "block" : "none";

    // chỉ mục
    dom.dongChiMuc.textContent = has ? `${state.hoc.index + 1} / ${state.hoc.danhSach.length}` : "0 / 0";

    // chỉ lưu lastSeen nhẹ (không đổi trạng thái)
    if (has){
      const td = layTienDo(it.id);
      if (!td.lastSeen){
        setTienDo(it.id, { });
      } else {
        // cập nhật lastSeen không đụng thống kê
        state.tienDo.byItem[it.id] = { ...td, lastSeen: Date.now() };
        luuLocal(KHOA.TIEN_DO, state.tienDo);
      }
    }
  }

  function renderTienDo(){
    dom.lblTienDoTong.textContent = `${state.stats.daThuoc}/${state.stats.tong} đã nhớ`;
    const pct = phanTram(state.stats.daThuoc, state.stats.tong);
    dom.barTong.style.width = `${pct}%`;
  }

  function demTienDoChuDe(topicId){
    return {
      tong: state.stats.tongTheoChuDe.get(topicId) || 0,
      daThuoc: state.stats.daThuocTheoChuDe.get(topicId) || 0
    };
  }

  function phanTram(a,b){
    if (!b) return 0;
    return Math.round((a/b)*100);
  }

  // PATCH_v2
  function renderAutoUI(){
    dom.btnTuDong.setAttribute("aria-pressed", state.caiDat.auto ? "true" : "false");
    dom.btnTuDong.textContent = state.caiDat.auto ? "Tự động: BẬT" : "Tự động";
    if (dom.oKhoang) dom.oKhoang.value = String(state.caiDat.intervalSec);
    if (dom.lblGiay) dom.lblGiay.textContent = `${state.caiDat.intervalSec}s`;
  }

  function renderToggles(){
    dom.anHienNghia.checked = state.caiDat.hienNghia;
    dom.anHienIpa.checked = state.caiDat.hienIpa;
    dom.anHienViDu.checked = state.caiDat.hienViDu;
  }

  function renderTTSUI(){
    if (!dom.ttsTocDo) return;
    dom.ttsTocDo.value = String(state.caiDat.ttsRate ?? 1);
    dom.ttsCaoDo.value = String(state.caiDat.ttsPitch ?? 1);
    dom.ttsAmLuong.value = String(state.caiDat.ttsVolume ?? 1);
    dom.lblTtsTocDo.textContent = Number(state.caiDat.ttsRate ?? 1).toFixed(2);
    dom.lblTtsCaoDo.textContent = Number(state.caiDat.ttsPitch ?? 1).toFixed(2);
    dom.lblTtsAmLuong.textContent = Number(state.caiDat.ttsVolume ?? 1).toFixed(2);
    doDayDanhSachGiong();
  }

  function apDungGiaoDien(mode){
    // mode: tu-dong | sang | toi
    if (mode === "sang"){
      document.documentElement.dataset.theme = "sang";
      document.documentElement.style.colorScheme = "light";
    } else if (mode === "toi"){
      document.documentElement.dataset.theme = "toi";
      document.documentElement.style.colorScheme = "dark";
    } else {
      // theo hệ thống
      delete document.documentElement.dataset.theme;
      document.documentElement.style.colorScheme = "";
    }
  }

  function nhanTrangThai(st){
    if (st === TRANG_THAI.DA_NHO) return "Đã nhớ";
    if (st === TRANG_THAI.CHUA_NHO) return "Chưa nhớ";
    return "Chưa đánh dấu";
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, (m) => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[m]));
  }

  // ====== Tab điều hướng ======
  function chuyenTab(name){
    $$(".tab").forEach(btn => {
      const active = btn.dataset.tab === name;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });
    $$("[data-tab-panel]").forEach(p => p.classList.toggle("is-hidden", p.dataset.tabPanel !== name));
  }

  // ====== Mode ======
  function chuyenMode(mode, khoiTao=false){
    state.caiDat.mode = mode;
    luuLocal(KHOA.CAI_DAT, state.caiDat);

    if (mode === "tu-kho") taoDanhSachTuKho();
    else if (mode === "ngau-nhien") taoDanhSachHocNgauNhien();
    else {
      const topicId = state.hoc.topicIdDangChon || (state.boLoc.topicId !== "tat-ca" ? state.boLoc.topicId : state.pack.topics[0]?.id);
      if (topicId) taoDanhSachHocTheoChuDe(topicId);
    }

    if (!khoiTao) thongBao(`Đã chuyển chế độ: ${mode === "chu-de" ? "Học theo chủ đề" : mode === "ngau-nhien" ? "Học ngẫu nhiên" : "Ôn lại từ khó"}`, "ok");
  }

  // ====== Nhập/Xuất ======
  async function docTepNguoiDung(){
    const f = dom.tepTaiLen.files?.[0];
    if (!f) throw new Error("Bạn chưa chọn tệp để tải lên.");
    const ten = f.name.toLowerCase();
    if (ten.endsWith(".json")){
      const text = await f.text();
      let obj;
      try { obj = JSON.parse(text); } catch { throw new Error("JSON lỗi cú pháp."); }
      return chuanHoaDuLieu(obj);
    }
    if (ten.endsWith(".csv")){
      const csv = await taiCsv(f);
      return csvSangDuLieu(csv);
    }
    throw new Error("Định dạng tệp không hỗ trợ. Chỉ nhận .json hoặc .csv.");
  }

  function gopDuLieu(duLieuMoi){
    const cu = state.duLieu;
    const mapPack = new Map(cu.packs.map(p => [p.id, p]));
    for (const pMoi of duLieuMoi.packs){
      if (!mapPack.has(pMoi.id)){
        cu.packs.push(pMoi);
        continue;
      }
      const pCu = mapPack.get(pMoi.id);
      // gộp topics
      const topicMap = new Map(pCu.topics.map(t => [t.id, t]));
      for (const t of pMoi.topics){
        if (!topicMap.has(t.id)) pCu.topics.push(t);
      }
      // gộp items theo id
      const itemMap = new Map(pCu.items.map(it => [it.id, it]));
      for (const it of pMoi.items){
        if (!itemMap.has(it.id)) pCu.items.push(it);
      }
    }
    return cu;
  }

  function thayTheDuLieu(duLieuMoi){
    return duLieuMoi;
  }

  function taiXuongJson(obj, tenFile){
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = tenFile;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }


  // ====== Sự kiện ======
  function ganSuKien(){
    // Tabs
    $$(".tab").forEach(btn => btn.addEventListener("click", () => chuyenTab(btn.dataset.tab)));

    // Search
    dom.oTim.addEventListener("input", debounce(() => {
      state.boLoc.q = dom.oTim.value;
      renderTatCa();
      if (dom.oTim.value.trim()) chuyenTab("tat-ca");
    }, 120));
    dom.btnXoaTim.addEventListener("click", () => {
      dom.oTim.value = "";
      state.boLoc.q = "";
      renderTatCa();
      dom.oTim.focus();
    });

    // Bộ lọc
    dom.locTrangThai.addEventListener("change", () => { state.boLoc.status = dom.locTrangThai.value; renderTatCa(); });
    dom.locDoKho.addEventListener("change", () => { state.boLoc.difficulty = dom.locDoKho.value; renderTatCa(); });
    dom.locChuDe.addEventListener("change", () => { state.boLoc.topicId = dom.locChuDe.value; renderTatCa(); });

    // Flashcard & điều khiển
    dom.flashcard.addEventListener("click", lat);
    dom.btnLat.addEventListener("click", lat);
    dom.btnTruoc.addEventListener("click", truoc);
    dom.btnTiep.addEventListener("click", tiep);

    // PATCH_v2
    dom.btnTuDong.addEventListener("click", () => batTatTuDong());
    if (dom.oKhoang) {
      dom.oKhoang.addEventListener("input", () => {
        state.caiDat.intervalSec = clamp(Number(dom.oKhoang.value || 5), 3, 10);
        if (dom.lblGiay) dom.lblGiay.textContent = `${state.caiDat.intervalSec}s`;
        luuLocal(KHOA.CAI_DAT, state.caiDat);
        if (state.caiDat.auto){
          batTatTuDong(false);
          batTatTuDong(true);
        }
      });
    }

    dom.anHienNghia.addEventListener("change", () => {
      state.caiDat.hienNghia = dom.anHienNghia.checked;
      luuLocal(KHOA.CAI_DAT, state.caiDat);
      renderCard();
    });
    dom.anHienIpa.addEventListener("change", () => {
      state.caiDat.hienIpa = dom.anHienIpa.checked;
      luuLocal(KHOA.CAI_DAT, state.caiDat);
      renderCard();
    });
    dom.anHienViDu.addEventListener("change", () => {
      state.caiDat.hienViDu = dom.anHienViDu.checked;
      luuLocal(KHOA.CAI_DAT, state.caiDat);
      renderCard();
    });

    // Cài đặt giọng đọc
    dom.chonGiongDoc.addEventListener("change", () => {
      state.caiDat.ttsVoiceURI = dom.chonGiongDoc.value;
      luuLocal(KHOA.CAI_DAT, state.caiDat);
    });
    dom.ttsTocDo.addEventListener("input", () => {
      state.caiDat.ttsRate = Number(dom.ttsTocDo.value);
      dom.lblTtsTocDo.textContent = Number(state.caiDat.ttsRate).toFixed(2);
      luuLocal(KHOA.CAI_DAT, state.caiDat);
    });
    dom.ttsCaoDo.addEventListener("input", () => {
      state.caiDat.ttsPitch = Number(dom.ttsCaoDo.value);
      dom.lblTtsCaoDo.textContent = Number(state.caiDat.ttsPitch).toFixed(2);
      luuLocal(KHOA.CAI_DAT, state.caiDat);
    });
    dom.ttsAmLuong.addEventListener("input", () => {
      state.caiDat.ttsVolume = Number(dom.ttsAmLuong.value);
      dom.lblTtsAmLuong.textContent = Number(state.caiDat.ttsVolume).toFixed(2);
      luuLocal(KHOA.CAI_DAT, state.caiDat);
    });


    // Ghi nhớ: Đã nhớ / Chưa nhớ / Bỏ đánh dấu
    dom.btnDaNho.addEventListener("click", () => {
      const it = itemHienTai(); if (!it) return;
      setTienDo(it.id, { status: TRANG_THAI.DA_NHO });
      renderCard(); renderTatCa(); renderTienDo(); updateChuDeStats();
      thongBao("Đã đánh dấu: Đã nhớ.", "ok");
    });
    dom.btnChuaNho.addEventListener("click", () => {
      const it = itemHienTai(); if (!it) return;
      setTienDo(it.id, { status: TRANG_THAI.CHUA_NHO });
      renderCard(); renderTatCa(); renderTienDo(); updateChuDeStats();
      thongBao("Đã đánh dấu: Chưa nhớ.", "ok");
    });
    dom.btnBoDanhDau.addEventListener("click", () => {
      const it = itemHienTai(); if (!it) return;
      setTienDo(it.id, { status: TRANG_THAI.CHUA_DANH_DAU });
      renderCard(); renderTatCa(); renderTienDo(); updateChuDeStats();
      thongBao("Đã bỏ đánh dấu.", "ok");
    });

    dom.btnDanhDauKho.addEventListener("click", () => {
      const it = itemHienTai(); if (!it) return;
      const td = layTienDo(it.id);
      setTienDo(it.id, { difficult: !td.difficult });
      renderCard();
      thongBao(td.difficult ? "Đã bỏ đánh dấu từ khó." : "Đã đánh dấu từ khó.", "ok");
    });

    dom.chonDoKho.addEventListener("change", () => {
      const it = itemHienTai(); if (!it) return;
      it.difficulty = Number(dom.chonDoKho.value);
      luuLocal(KHOA.DU_LIEU, state.duLieu);
      renderCard();
      renderTatCa();
    });

    dom.btnCheDoHocChuDe.addEventListener("click", () => chuyenMode("chu-de"));
    dom.btnCheDoHocNgauNhien.addEventListener("click", () => chuyenMode("ngau-nhien"));

    // Ôn tập
    dom.btnOnTuKho.addEventListener("click", () => { chuyenMode("tu-kho"); chuyenTab("on-tap"); });
    dom.btnOnChuaThuoc.addEventListener("click", () => { state.caiDat.mode = "ngau-nhien"; luuLocal(KHOA.CAI_DAT, state.caiDat); taoDanhSachChuaThuoc(); thongBao("Đang ôn mục chưa thuộc.", "ok"); });

    // Dialogs
    dom.btnCheDo.addEventListener("click", () => dom.dlgCheDo.showModal());
    dom.btnCaiDat.addEventListener("click", () => dom.dlgCaiDat.showModal());
    dom.btnHuongDan.addEventListener("click", () => dom.dlgHuongDan.showModal());

    // Nghe/Dừng
    dom.btnNghe.addEventListener("click", phatAmHienTai);
    dom.btnDung.addEventListener("click", dungAm);

    // Đổi giao diện nhanh (header)
    dom.btnGiaoDienNhanh.addEventListener("click", () => {
      const cur = state.caiDat.giaoDien;
      const next = cur === "toi" ? "sang" : "toi";
      state.caiDat.giaoDien = next;
      luuLocal(KHOA.CAI_DAT, state.caiDat);
      apDungGiaoDien(next);
      dom.chonGiaoDien.value = next;
      thongBao(`Đã chuyển giao diện: ${next === "toi" ? "Tối" : "Sáng"}`, "ok");
    });

    // (Đã xóa các event listener trùng lặp)

    dom.dlgCheDo.addEventListener("close", () => {
      const v = dom.dlgCheDo.returnValue;
      if (v === "cancel") return;
      const mode = $("input[name='mode']:checked", dom.dlgCheDo)?.value || "chu-de";
      chuyenMode(mode);
    });

    dom.dlgCaiDat.addEventListener("close", () => {
      const v = dom.dlgCaiDat.returnValue;
      if (v === "cancel") return;

      state.caiDat.packId = dom.chonGoi.value;
      state.caiDat.giaoDien = dom.chonGiaoDien.value;
      luuLocal(KHOA.CAI_DAT, state.caiDat);
      apDungGiaoDien(state.caiDat.giaoDien);

      dungAm();
      napPackTheoCaiDat();
      veUI();
      thongBao("Đã lưu cài đặt.", "ok");
    });

    // Import/export
    dom.btnNhapGop.addEventListener("click", async () => {
      try {
        const duLieuMoi = await docTepNguoiDung();
        state.duLieu = gopDuLieu(duLieuMoi);
        luuLocal(KHOA.DU_LIEU, state.duLieu);
        napPackTheoCaiDat();
        veUI();
        thongBao("Nhập (gộp) thành công.", "ok");
      } catch (e){
        thongBao(e.message || "Nhập thất bại.", "loi");
      }
    });

    dom.btnNhapThay.addEventListener("click", async () => {
      try {
        const duLieuMoi = await docTepNguoiDung();
        state.duLieu = thayTheDuLieu(duLieuMoi);
        luuLocal(KHOA.DU_LIEU, state.duLieu);
        // reset tiến độ (vì id có thể đổi)
        state.tienDo = { byItem: {}, kho: {} };
        luuLocal(KHOA.TIEN_DO, state.tienDo);
        state.caiDat.packId = state.duLieu.packs[0].id;
        luuLocal(KHOA.CAI_DAT, state.caiDat);

        napPackTheoCaiDat();
        veUI();
        thongBao("Nhập (thay thế) thành công.", "ok");
      } catch (e){
        thongBao(e.message || "Nhập thất bại.", "loi");
      }
    });

    dom.btnXuatJson.addEventListener("click", () => {
      taiXuongJson(state.duLieu, `du-lieu-${new Date().toISOString().slice(0,10)}.json`);
    });

    dom.btnKhoiPhucMacDinh.addEventListener("click", async () => {
      if (!confirm("Bạn chắc chắn muốn khôi phục gói mặc định? (Dữ liệu hiện tại sẽ bị thay thế)")) return;
      try{
        const def = await taiJson("data/default-pack.en-US.json");
        state.duLieu = def;
        luuLocal(KHOA.DU_LIEU, state.duLieu);
        state.tienDo = { byItem: {}, kho: {} };
        luuLocal(KHOA.TIEN_DO, state.tienDo);
        state.caiDat.packId = "en-US";
        luuLocal(KHOA.CAI_DAT, state.caiDat);
        napPackTheoCaiDat();
        veUI();
        thongBao("Đã khôi phục gói mặc định.", "ok");
      } catch(e){
        thongBao(e.message || "Khôi phục thất bại.", "loi");
      }
    });

    dom.btnXoaDuLieu.addEventListener("click", () => {
      if (!confirm("Xóa toàn bộ dữ liệu & tiến độ trên trình duyệt?")) return;
      localStorage.removeItem(KHOA.DU_LIEU);
      localStorage.removeItem(KHOA.TIEN_DO);
      localStorage.removeItem(KHOA.CAI_DAT);
      localStorage.removeItem("dnhv_da_mo_huong_dan");
      thongBao("Đã xóa. Hãy tải lại trang.", "ok");
    });

    // Phím tắt
    window.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement !== dom.oTim){
        e.preventDefault();
        dom.oTim.focus();
        return;
      }
      if (document.activeElement === dom.oTim) return;

      if (e.key === " "){
        e.preventDefault();
        lat();
      } else if (e.key === "ArrowLeft"){
        e.preventDefault();
        truoc();
      } else if (e.key === "ArrowRight"){
        e.preventDefault();
        tiep();
      } else if (e.key.toLowerCase() === "a"){
        e.preventDefault();
        batTatTuDong();
      } else if (e.key.toLowerCase() === "k"){
        e.preventDefault();
        dom.btnDanhDauKho.click();
      } else if (e.key.toLowerCase() === "l"){
        e.preventDefault();
        phatAmHienTai();
      } else if (e.key.toLowerCase() === "s"){
        e.preventDefault();
        dungAm();
      }
    });
  }

  // ====== Bắt đầu ======
  khoiDong().catch(err => {
    console.error(err);
    alert("Không khởi động được ứng dụng. Hãy kiểm tra file dữ liệu.");
  });
})();

// TTS setting events
document.addEventListener("DOMContentLoaded", ()=>{
  const domRoot = document;
});

})();