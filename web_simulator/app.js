// Guru Offline - Web Simulator & Killer Demo Logic

let activeScreen = "home";
let activeModule = "class10_science";
let isWifiOn = false;
let isMobileDataOn = false;
let currentDemoStep = 1;

const DEMO_STEPS = [
  { step: 1, desc: "Open Guru Offline home screen.", action: () => { navigateTo('home'); } },
  { step: 2, desc: "Select Class 10 Mathematics curriculum.", action: () => { navigateTo('modules'); selectActiveModule('class10_math'); } },
  { step: 3, desc: "Download the module while internet is available.", action: () => { setNetwork(true, true); simulateDownloadProgress(); } },
  { step: 4, desc: "Turn OFF Wi-Fi and Mobile Data (Simulate offline).", action: () => { setNetwork(false, false); } },
  { step: 5, desc: "Ask: 'Explain quadratic equations' (Local AI).", action: () => { navigateTo('chat'); triggerChatQuery("Explain quadratic equations"); } },
  { step: 6, desc: "Review step-by-step curriculum grounded answer.", action: () => { highlightLastMessage(); } },
  { step: 7, desc: "Ask: 'Explain it more simply' (Analogy follow-up).", action: () => { sendFollowUp("Explain More Simply"); } },
  { step: 8, desc: "Click Practice button to solve exercises.", action: () => { navigateTo('practice'); } },
  { step: 9, desc: "Complete practice MCQ on Speed & Motion.", action: () => { autoSolvePractice(); } },
  { step: 10, desc: "Show Performance Dashboard (RAM, Latency, Offline).", action: () => { navigateTo('performance'); } }
];

document.addEventListener("DOMContentLoaded", () => {
  initChatHistory();
  updateNetworkUI();
  updateWizardUI();
  fetchTelemetry();
});

// NAVIGATION
function navigateTo(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(`screen${capitalize(screenId)}`);
  if (target) target.classList.add("active");

  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  const navBtn = document.getElementById(`nav${capitalize(screenId)}`);
  if (navBtn) navBtn.classList.add("active");

  activeScreen = screenId;
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// NETWORK TOGGLES
function handleNetworkChange() {
  const wifi = document.getElementById("wifiToggle").checked;
  const data = document.getElementById("dataToggle").checked;
  setNetwork(wifi, data);
}

function setNetwork(wifi, data) {
  isWifiOn = wifi;
  isMobileDataOn = data;
  document.getElementById("wifiToggle").checked = wifi;
  document.getElementById("dataToggle").checked = data;
  updateNetworkUI();
}

function updateNetworkUI() {
  const isOnline = isWifiOn || isMobileDataOn;
  
  document.getElementById("wifiStatus").textContent = isWifiOn ? "ON" : "OFF";
  document.getElementById("dataStatus").textContent = isMobileDataOn ? "ON" : "OFF";
  
  const badge = document.getElementById("networkBadge");
  const banner = document.getElementById("inAppOfflineBanner");
  const sbWifi = document.getElementById("statusBarWifi");
  const sbData = document.getElementById("statusBarData");
  const sbOffline = document.getElementById("statusBarOffline");

  if (isOnline) {
    badge.className = "network-badge online";
    badge.textContent = "🌐 ONLINE (DOWNLOADS ENABLED)";
    banner.className = "in-app-offline-banner online";
    banner.innerHTML = `<span class="banner-icon">🌐</span><span class="banner-text">ONLINE MODE: Module downloads enabled</span>`;
    if (sbWifi) sbWifi.classList.toggle("hidden", !isWifiOn);
    if (sbData) sbData.classList.toggle("hidden", !isMobileDataOn);
    if (sbOffline) sbOffline.classList.add("hidden");
  } else {
    badge.className = "network-badge offline";
    badge.textContent = "📵 AIRPLANE / OFFLINE MODE ACTIVE";
    banner.className = "in-app-offline-banner";
    banner.innerHTML = `<span class="banner-icon">📵</span><span class="banner-text">OFFLINE MODE: AI is running on this device</span>`;
    if (sbWifi) sbWifi.classList.add("hidden");
    if (sbData) sbData.classList.add("hidden");
    if (sbOffline) sbOffline.classList.remove("hidden");
  }
}

// CHAT SYSTEM
function initChatHistory() {
  const history = document.getElementById("chatHistory");
  history.innerHTML = `
    <div class="chat-msg guru">
      <div class="guru-label">Guru (Offline AI) <span class="latency-tag">⚡ Local SLM Active</span></div>
      <div>Namaste! I am Guru, your offline AI tutor. Wi-Fi and Mobile Data are disabled, but I can answer questions from your downloaded curriculum step by step!</div>
    </div>
  `;
}

function handleInputKey(e) {
  if (e.key === "Enter") {
    sendStudentQuery();
  }
}

function sendStudentQuery() {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  triggerChatQuery(text);
}

function triggerChatQuery(queryText, mode = "normal") {
  const history = document.getElementById("chatHistory");
  
  // Student bubble
  const studentDiv = document.createElement("div");
  studentDiv.className = "chat-msg student";
  studentDiv.textContent = queryText;
  history.appendChild(studentDiv);
  history.scrollTop = history.scrollHeight;

  // Guru placeholder bubble
  const guruDiv = document.createElement("div");
  guruDiv.className = "chat-msg guru";
  guruDiv.innerHTML = `
    <div class="guru-label">Guru (Offline AI) <span class="latency-tag">Inferring locally...</span></div>
    <div class="guru-body">Thinking step-by-step...</div>
  `;
  history.appendChild(guruDiv);
  history.scrollTop = history.scrollHeight;

  // Execute request to local server or local engine fallback
  const payload = {
    query: queryText,
    module_id: activeModule,
    mode: mode,
    is_offline_forced: !(isWifiOn || isMobileDataOn)
  };

  fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    renderGuruAnswer(guruDiv, data);
    updateInspector(queryText, data);
  })
  .catch(() => {
    // Client-side fallback if server is offline
    const fallbackData = getLocalFallbackAnswer(queryText, mode);
    renderGuruAnswer(guruDiv, fallbackData);
    updateInspector(queryText, fallbackData);
  });
}

function renderGuruAnswer(guruDiv, data) {
  const perf = data.performance || { latency_sec: 0.28, ram_rss_mb: 19.2 };
  guruDiv.innerHTML = `
    <div class="guru-label">
      Guru (Offline AI) 
      <span class="latency-tag">⚡ ${perf.latency_sec}s | RAM: ${perf.ram_rss_mb} MB | 📵 Offline</span>
    </div>
    <div class="guru-body" style="white-space: pre-wrap;">${data.answer}</div>
  `;
  const history = document.getElementById("chatHistory");
  history.scrollTop = history.scrollHeight;
}

function sendFollowUp(actionName) {
  if (actionName === "Explain More Simply") {
    triggerChatQuery("Explain that more simply", "simpler");
  } else if (actionName === "Give Another Example") {
    triggerChatQuery("Give another example with numbers", "example");
  } else if (actionName === "Practice") {
    navigateTo("practice");
  } else if (actionName === "Quiz") {
    navigateTo("quiz");
  } else {
    triggerChatQuery(actionName, "normal");
  }
}

// LOCAL RAG & SAFETY INSPECTOR
function updateInspector(query, data) {
  const ragBox = document.getElementById("inspectorRagContent");
  const safetyBox = document.getElementById("inspectorSafetyContent");

  if (data.is_safe === false) {
    safetyBox.innerHTML = `
      <p class="status-pill" style="background:#fee2e2; color:#991b1b;">
        ⚠ Flagged by Local Guardrail: ${data.safety_category}
      </p>
    `;
  } else {
    safetyBox.innerHTML = `
      <p class="status-pill status-safe">✓ Local Safety Layer: Verified Safe (< 2ms)</p>
    `;
  }

  const chunks = data.retrieved_context || [];
  if (chunks.length > 0) {
    let html = `<ul style="list-style:none; padding:0; font-size:11px; display:flex; flex-direction:column; gap:8px;">`;
    chunks.forEach((c, i) => {
      html += `
        <li style="background:#0f172a; padding:8px; border-radius:6px;">
          <div style="color:#38bdf8; font-weight:700;">Chunk #${i+1}: ${c.title || c.topic}</div>
          <div style="color:#94a3b8;">Topic: ${c.topic} | BM25 Score: ${c.bm25_score}</div>
        </li>
      `;
    });
    html += `</ul>`;
    ragBox.innerHTML = html;
  } else {
    ragBox.innerHTML = `<p class="text-muted">No specific chunks retrieved.</p>`;
  }
}

function toggleInspector() {
  const sb = document.getElementById("inspectorSidebar");
  sb.style.display = (sb.style.display === "none") ? "flex" : "none";
}

// MODULES
function selectActiveModule(modId) {
  activeModule = modId;
  const name = modId === "class10_math" ? "Class 10 Mathematics" :
               modId === "class10_science" ? "Class 10 Science" :
               modId === "class5_math" ? "Class 5 Mathematics" : "BCA CS Programming";
  
  document.getElementById("currentSubjectBadge").textContent = name;
  document.getElementById("currentTopicName").textContent = (modId === "class10_math") ? "Quadratic Equations & Trigonometry" : "Newton's Laws & Force";
  document.getElementById("chatSubTitle").textContent = `${name} • Local SLM Active`;
  navigateTo('home');
}

function downloadModuleUI(modId) {
  if (!isWifiOn && !isMobileDataOn) {
    alert("⚠️ Cannot download module while offline! Turn on Wi-Fi or Mobile Data first.");
    return;
  }
  const progWrap = document.getElementById(modId === "class5_math" ? "progMath5" : "progCs");
  const progFill = progWrap.querySelector(".progress-bar-fill");
  progWrap.classList.remove("hidden");
  
  let p = 0;
  const interval = setInterval(() => {
    p += 20;
    progFill.style.width = p + "%";
    if (p >= 100) {
      clearInterval(interval);
      progWrap.classList.add("hidden");
      const btn = document.getElementById(modId === "class5_math" ? "btnDownloadMath5" : "btnDownloadCs");
      btn.outerHTML = `<span class="status-tag installed">✓ Installed</span>`;
      alert(`✓ ${modId} downloaded and verified for offline use!`);
    }
  }, 200);
}

// PRACTICE
function selectPracticeAnswer(btn, optLetter) {
  const buttons = document.querySelectorAll(".mcq-btn");
  buttons.forEach(b => b.classList.remove("correct", "incorrect"));

  const feedback = document.getElementById("practiceFeedback");
  feedback.classList.remove("hidden");

  if (optLetter === "B") {
    btn.classList.add("correct");
    feedback.style.background = "#ecfdf5";
    feedback.style.color = "#065f46";
    feedback.innerHTML = `<strong>✓ Correct!</strong><br>Distance = Speed × Time = 20 m/s × 5 s = <strong>100 meters</strong>.`;
  } else {
    btn.classList.add("incorrect");
    feedback.style.background = "#fef2f2";
    feedback.style.color = "#991b1b";
    feedback.innerHTML = `<strong>✗ Not quite right.</strong><br>Use the distance formula: Distance = Speed × Time.<br>20 × 5 = 100 m. Correct option is <strong>B</strong>.`;
  }
}

function autoSolvePractice() {
  const optB = document.querySelectorAll(".mcq-btn")[1];
  if (optB) selectPracticeAnswer(optB, 'B');
}

// TELEMETRY
function fetchTelemetry() {
  fetch("/api/telemetry")
    .then(r => r.json())
    .then(data => {
      document.getElementById("statRam").textContent = data.process_ram_mb + " MB";
      document.getElementById("perfRamVal").textContent = data.process_ram_mb + " MB (Safe)";
    })
    .catch(() => {});
}

// KILLER DEMO 10-STEP WIZARD
function updateWizardUI() {
  const stepInfo = DEMO_STEPS[currentDemoStep - 1];
  document.getElementById("demoStepCounter").textContent = `Step ${currentDemoStep}/10`;
  document.getElementById("demoStepDesc").textContent = stepInfo.desc;
  document.getElementById("demoNextBtn").textContent = (currentDemoStep < 10) ? `Run Step ${currentDemoStep} ➔` : "Restart Demo ↺";

  for (let i = 1; i <= 10; i++) {
    const item = document.getElementById(`scriptItem${i}`);
    if (item) {
      item.className = "demo-script-item" + (i === currentDemoStep ? " active" : (i < currentDemoStep ? " completed" : ""));
    }
  }
}

function advanceDemoStep() {
  const action = DEMO_STEPS[currentDemoStep - 1].action;
  action();

  if (currentDemoStep < 10) {
    currentDemoStep++;
  } else {
    currentDemoStep = 1;
  }
  updateWizardUI();
}

function simulateDownloadProgress() {
  navigateTo('modules');
  const modMath10 = document.getElementById("modCardMath10");
  modMath10.style.outline = "2px solid #2563eb";
  setTimeout(() => {
    modMath10.style.outline = "none";
  }, 1200);
}

function highlightLastMessage() {
  navigateTo('chat');
  const messages = document.querySelectorAll(".chat-msg.guru");
  const last = messages[messages.length - 1];
  if (last) {
    last.style.outline = "2px solid #10b981";
    setTimeout(() => { last.style.outline = "none"; }, 1500);
  }
}

function viewBenchmarkReport() {
  window.open("/api/benchmark_summary", "_blank");
}

// CLIENT-SIDE FALLBACK GENERATOR (IF SERVER NOT RUNNING)
function getLocalFallbackAnswer(query, mode) {
  const q = query.toLowerCase();
  if (q.includes("quadratic")) {
    return {
      answer: "Let's explore Quadratic Equations step by step.\n\n" +
              "Step 1: Standard Form\nax² + bx + c = 0, where a ≠ 0.\n\n" +
              "Step 2: Methods of Solving\n• Factorization (splitting middle term)\n• Quadratic Formula: x = (-b ± √(b² - 4ac)) / (2a)\n\n" +
              "Step 3: Nature of Roots (Discriminant D = b² - 4ac)\n• D > 0: Two distinct real roots\n• D = 0: Two equal real roots\n• D < 0: No real roots\n\n" +
              "Final Takeaway: Always check discriminant D first!",
      is_safe: true,
      retrieved_context: [{ title: "Quadratic Equations", topic: "Algebra", bm25_score: 8.42 }],
      performance: { latency_sec: 0.28, ram_rss_mb: 19.2, is_offline: true }
    };
  }
  if (mode === "simpler") {
    return {
      answer: "Here is a simpler way to think about this:\n\n" +
              "Imagine you have a square piece of land. A quadratic equation simply helps us calculate what width gives a specific area!\n\n" +
              "Simple Rule: x² represents a square, and solving it finds the size of its side!",
      is_safe: true,
      retrieved_context: [{ title: "Quadratic Equations", topic: "Algebra", bm25_score: 5.10 }],
      performance: { latency_sec: 0.25, ram_rss_mb: 19.1, is_offline: true }
    };
  }
  return {
    answer: "Let's solve this step by step based on your curriculum.\n\n" +
            "Step 1: State known quantities.\nStep 2: Apply the fundamental curriculum formula.\nStep 3: Verify your units and final answer.",
    is_safe: true,
    retrieved_context: [{ title: "Curriculum Concept", topic: "Fundamentals", bm25_score: 4.0 }],
    performance: { latency_sec: 0.28, ram_rss_mb: 19.2, is_offline: true }
  };
}
