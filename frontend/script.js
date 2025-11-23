// script.js — final, robust
const API = "http://localhost:3000/check";

const messageEl = document.getElementById("message");
const detectBtn = document.getElementById("detectBtn");
const clearBtn = document.getElementById("clearBtn");
const csvInput = document.getElementById("csvInput");
const spinner = document.getElementById("spinner");

const resultBadge = document.getElementById("resultBadge");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");

const historyList = document.getElementById("historyList");
const totalCount = document.getElementById("totalCount");
const spamCount = document.getElementById("spamCount");
const hamCount = document.getElementById("hamCount");

const gaugeFill = document.querySelector('.gauge-fill');
const gaugeValue = document.getElementById('gaugeValue');
const gaugeLabel = document.getElementById('gaugeLabel');
const gaugeWrap = document.querySelector('.gauge-wrap');
const party = document.getElementById('party');

let appHistory = []; // application-level history array (never clash with window.history)
const CIRC = 302;

function debug(...args){ console.debug("[UI]", ...args); }

function setLoading(on){
  if (!spinner || !detectBtn) return;
  if (on){ spinner.classList.remove("hidden"); detectBtn.disabled = true; }
  else { spinner.classList.add("hidden"); detectBtn.disabled = false; }
}

function normalizeLabel(raw){
  if (raw === undefined || raw === null) return "UNKNOWN";
  let s = String(raw).trim().toUpperCase();
  const m = s.match(/\b(SPAM|HAM)\b/);
  if (m) return m[1];
  if (s.includes("SPAM")) return "SPAM";
  if (s.includes("HAM")) return "HAM";
  if (s.includes("ERROR") || s.includes("UNKNOWN") || s === "") return "UNKNOWN";
  return "UNKNOWN";
}

function showResult(kind, raw=""){
  if (!resultBadge || !resultTitle || !resultText) return;
  resultBadge.classList.remove("neutral","ham","spam");
  if (kind === "SPAM"){
    resultBadge.textContent = "SPAM"; resultBadge.classList.add("spam");
    resultTitle.textContent = "Suspicious — likely spam";
    resultText.textContent = raw || "This message appears to be spam.";
  } else if (kind === "HAM"){
    resultBadge.textContent = "SAFE"; resultBadge.classList.add("ham");
    resultTitle.textContent = "Probably safe";
    resultText.textContent = raw || "This message looks safe.";
  } else {
    resultBadge.textContent = "—"; resultBadge.classList.add("neutral");
    resultTitle.textContent = "No result yet";
    resultText.textContent = raw || "Enter a message and click Detect.";
  }
}

function loadHistory(){
  try {
    const raw = localStorage.getItem("spam_history") || "[]";
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("[loadHistory] parse error", err);
    return [];
  }
}

function saveHistory(){
  try { localStorage.setItem("spam_history", JSON.stringify(appHistory)); }
  catch (err) { console.error("[saveHistory] error", err); }
}

function renderHistory(){
  if (!historyList) return;
  appHistory = loadHistory();
  historyList.innerHTML = "";
  appHistory.forEach(it => {
    const msg = (it && it.message) ? String(it.message) : "(invalid entry)";
    const tagText = (it && it.result) ? String(it.result).toUpperCase() : "UNKNOWN";

    const li = document.createElement("li");
    const left = document.createElement("div");
    left.style.maxWidth = "76%";
    left.textContent = `${it.time || ''} • ${msg.length > 80 ? msg.slice(0,80) + "..." : msg}`;

    const tag = document.createElement("div");
    tag.textContent = tagText;
    tag.style.fontWeight = "800";
    tag.style.padding = "6px 8px";
    tag.style.borderRadius = "8px";
    tag.style.minWidth = "64px";
    tag.style.textAlign = "center";

    if (tagText === "SPAM") { tag.style.background = "#ff7b7b"; tag.style.color = "#021420"; }
    else if (tagText === "HAM") { tag.style.background = "#6be3d4"; tag.style.color = "#021420"; }
    else { tag.style.background = "rgba(255,255,255,0.03)"; tag.style.color = "#cfeff6"; }

    li.appendChild(left); li.appendChild(tag);
    historyList.appendChild(li);
  });
}

function updateCounts(){
  const hist = loadHistory();
  const total = hist.length;
  const spam = hist.filter(h => String(h.result || "").trim().toUpperCase() === "SPAM").length;
  const ham  = hist.filter(h => String(h.result || "").trim().toUpperCase() === "HAM").length;

  if (totalCount) totalCount.textContent = total;
  if (spamCount) spamCount.textContent = spam;
  if (hamCount) hamCount.textContent = ham;
  debug("Counts:", { total, spam, ham });
}

function pushHistory(message, rawLabel){
  appHistory = loadHistory();
  const label = normalizeLabel(rawLabel);
  const entry = { message: String(message || ""), result: label, time: new Date().toLocaleTimeString() };
  appHistory.unshift(entry);
  if (appHistory.length > 10) appHistory = appHistory.slice(0,10);
  saveHistory();
  renderHistory();
  updateCounts();
  debug("Pushed history:", entry);
}

function setGaugePercent(pct){
  pct = Math.max(0, Math.min(100, Math.round(pct)));
  const offset = Math.round(CIRC * (1 - pct / 100));
  if (gaugeFill) gaugeFill.style.strokeDashoffset = offset;
  if (gaugeValue) gaugeValue.textContent = pct + '%';
}

function animateTo(probPercent, label){
  if (!gaugeWrap) return;
  gaugeWrap.classList.remove('spam','ham','neutral');
  if (label === 'SPAM'){ gaugeWrap.classList.add('spam'); if (gaugeLabel) gaugeLabel.textContent = "Spam risk"; }
  else if (label === 'HAM'){ gaugeWrap.classList.add('ham'); if (gaugeLabel) gaugeLabel.textContent = "Safe likelihood"; }
  else { gaugeWrap.classList.add('neutral'); if (gaugeLabel) gaugeLabel.textContent = "No result"; }

  const start = parseInt(gaugeValue && gaugeValue.textContent) || 0;
  const end = Math.max(0, Math.min(100, Math.round(probPercent)));
  const duration = 900, stepTime = 25;
  const steps = Math.ceil(duration / stepTime);
  let currentStep = 0;
  const delta = (end - start) / steps;
  const tick = setInterval(() => {
    currentStep++;
    const val = Math.round(start + delta * currentStep);
    setGaugePercent(val);
    if (currentStep >= steps) {
      clearInterval(tick);
      setGaugePercent(end);
      if (label === 'SPAM') popParty();
    }
  }, stepTime);
}

function popParty(){
  if (!party) return;
  const colors = ['#ff7b7b','#ffd86b','#6be3ff','#6be3d4','#9ff1e6'];
  for (let i=0;i<18;i++){
    const el = document.createElement('div');
    el.className = 'p';
    const size = 6 + Math.random()*12;
    el.style.width = size + 'px';
    el.style.height = (size+4) + 'px';
    el.style.left = (40 + Math.random()*220) + 'px';
    el.style.top = (20 + Math.random()*60) + 'px';
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.transform = `translateY(-10px) rotate(${Math.random()*360}deg)`;
    party.appendChild(el);
    setTimeout(()=>el.remove(), 1300 + Math.random()*600);
  }
}

async function classifyMessage(msg){
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ message: msg })
    });
    const text = await res.text();
    try { return JSON.parse(text); } catch(e) { return { result: "UNKNOWN", raw: text }; }
  } catch (err) {
    console.error("Fetch error:", err);
    return { result: "ERROR", raw: String(err) };
  }
}

// event handlers
if (detectBtn) {
  detectBtn.addEventListener("click", async () => {
    const msg = (messageEl && messageEl.value || "").trim();
    if (!msg) { showResult(null, "Please enter a message."); return; }
    setLoading(true);
    const out = await classifyMessage(msg);
    const normalized = normalizeLabel(out.result || out.raw || "");
    let probPercent = 50;
    if (typeof out.prob === 'number') {
      probPercent = out.prob <= 1 ? Math.round(out.prob * 100) : Math.round(out.prob);
    } else {
      probPercent = (normalized === 'SPAM') ? 88 : (normalized === 'HAM' ? 14 : 50);
    }
    animateTo(probPercent, normalized);
    showResult(normalized, out.raw || out.result || "");
    pushHistory(msg, normalized);
    setLoading(false);
  });
}

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    if (messageEl) messageEl.value = "";
    showResult(null, "Cleared.");
  });
}

if (csvInput) {
  csvInput.addEventListener("change", async (ev) => {
    const file = ev.target.files && ev.target.files[0];
    if (!file) return;
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      alert("Please select a .csv file");
      return;
    }
    setLoading(true);
    const txt = await file.text();
    const lines = txt.split(/\r?\n/).filter(Boolean);
    let start = 0;
    if (lines[0] && (lines[0].toLowerCase().includes("message") || lines[0].toLowerCase().includes("text"))) start = 1;
    for (let i = start; i < lines.length; i++){
      const cols = lines[i].split(',');
      const msg = cols.slice(0).join(',').trim();
      if (!msg) continue;
      const out = await classifyMessage(msg);
      const r = normalizeLabel(out.result || out.raw || "");
      pushHistory(msg, r);
    }
    setLoading(false);
    alert("Batch classification complete (history updated).");
    csvInput.value = "";
  });
}

// init UI on load
(function initUI(){
  appHistory = loadHistory();
  renderHistory();
  updateCounts();
  showResult(null, "Ready");
  setGaugePercent(0);
  debug("[initUI] entries:", appHistory.length);
})();
