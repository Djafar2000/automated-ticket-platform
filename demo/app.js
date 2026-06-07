const STORAGE_KEY = "ticketflow-demo-state-v1";

const defaultState = {
  users: [],
  currentUser: null,
  preferences: {},
  sessions: [],
  alerts: [],
  transactions: [],
  nextTransactionId: 1,
  nextSessionId: 1
};

let state = loadState();

function deepCopy(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return deepCopy(defaultState);
  try {
    return { ...deepCopy(defaultState), ...JSON.parse(raw) };
  } catch {
    return deepCopy(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function $(id) {
  return document.getElementById(id);
}

function getStatusClass(status) {
  const value = (status || "").toLowerCase();
  if (value.includes("success") || value.includes("complete")) return "status-success";
  if (value.includes("pending") || value.includes("queue") || value.includes("attempt") || value.includes("starting") || value.includes("medium")) return "status-warning";
  if (value.includes("error") || value.includes("fail") || value.includes("high")) return "status-error";
  return "status-info";
}

function setView(viewName) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach(v => v.classList.remove("active"));
  $(`view-${viewName}`).classList.add("active");
  document.querySelector(`.nav-link[data-view="${viewName}"]`).classList.add("active");
  if (viewName === "dashboard" && !state.currentUser) {
    setView("login");
    showMessage("login-msg", "Please log in first.", "error");
    return;
  }
  if (viewName === "admin") renderAdmin();
  if (viewName === "dashboard") renderDashboard();
}

function showMessage(id, text, kind = "info") {
  const el = $(id);
  el.textContent = text;
  el.className = `message ${kind}`;
}

function currentUsername() {
  return state.currentUser ? state.currentUser.username : null;
}

function getCurrentUserPreferences() {
  return state.preferences[currentUsername()] || {
    event: "",
    seat: "Standard",
    quantity: "2",
    budget: "",
    accessible: false
  };
}

function registerUser() {
  const username = $("register-username").value.trim();
  const password = $("register-password").value.trim();
  if (!username || !password) {
    showMessage("register-msg", "Username and password are required.", "error");
    return;
  }
  if (state.users.some(u => u.username === username)) {
    showMessage("register-msg", "That username already exists.", "error");
    return;
  }
  const isAdmin = state.users.length === 0;
  state.users.push({ username, password, isAdmin });
  saveState();
  showMessage("register-msg", isAdmin ? "Account created. First user is also admin." : "Account created. You can now log in.", "success");
}

function loginUser() {
  const username = $("login-username").value.trim();
  const password = $("login-password").value.trim();
  const user = state.users.find(u => u.username === username && u.password === password);
  if (!user) {
    showMessage("login-msg", "Invalid username or password.", "error");
    return;
  }
  state.currentUser = { username: user.username, isAdmin: user.isAdmin };
  saveState();
  renderDashboard();
  setView("dashboard");
}

function logoutUser() {
  state.currentUser = null;
  saveState();
  setView("login");
}

function savePreferences() {
  if (!state.currentUser) return;
  state.preferences[currentUsername()] = {
    event: $("pref-event").value.trim(),
    seat: $("pref-seat").value,
    quantity: $("pref-quantity").value,
    budget: $("pref-budget").value.trim(),
    accessible: $("pref-accessible").checked
  };
  saveState();
  showMessage("pref-msg", "Preferences saved successfully.", "success");
  renderDashboard();
}

function buildTicketSearchQuery() {
  const eventName = $("pref-event").value.trim();
  const seatType = $("pref-seat").value;
  const quantity = $("pref-quantity").value;
  const accessible = $("pref-accessible").checked;

  if (!eventName) {
    showMessage("pref-msg", "Enter an event name before searching for tickets.", "error");
    return null;
  }

  return `${eventName} tickets ${seatType} ${quantity} ${accessible ? "accessible disabled" : ""}`.trim();
}

function openSearch(url, label) {
  window.open(url, "_blank", "noopener,noreferrer");
  showMessage("pref-msg", `Opened ${label} search for your ticket request.`, "info");
}

function searchTicketsOnGoogle() {
  if (!state.currentUser) return;
  const query = buildTicketSearchQuery();
  if (!query) return;
  openSearch(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "Google");
}

function searchTicketsOnTicketmaster() {
  if (!state.currentUser) return;
  const query = buildTicketSearchQuery();
  if (!query) return;
  openSearch(`https://www.ticketmaster.com/search?q=${encodeURIComponent(query)}`, "Ticketmaster");
}

function searchTicketsOnStubHub() {
  if (!state.currentUser) return;
  const query = buildTicketSearchQuery();
  if (!query) return;
  openSearch(`https://www.stubhub.com/find/s/?q=${encodeURIComponent(query)}`, "StubHub");
}

function searchTicketsOnSeatGeek() {
  if (!state.currentUser) return;
  const query = buildTicketSearchQuery();
  if (!query) return;
  openSearch(`https://seatgeek.com/search?search=${encodeURIComponent(query)}`, "SeatGeek");
}

function searchAllPlatforms() {
  if (!state.currentUser) return;
  const query = buildTicketSearchQuery();
  if (!query) return;

  const targets = [
    `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    `https://www.ticketmaster.com/search?q=${encodeURIComponent(query)}`,
    `https://www.stubhub.com/find/s/?q=${encodeURIComponent(query)}`,
    `https://seatgeek.com/search?search=${encodeURIComponent(query)}`
  ];

  targets.forEach(url => window.open(url, "_blank", "noopener,noreferrer"));
  showMessage("pref-msg", "Opened ticket searches across all supported platforms.", "info");
}

function buildTimeline(stepIndex) {
  const steps = [
    "Preferences loaded",
    "Session created",
    "Ticket source checked",
    "Queue handled",
    "Outcome recorded"
  ];
  return steps.map((step, index) => {
    if (index < stepIndex) return { text: step, cls: "done" };
    if (index === stepIndex) return { text: step, cls: "current" };
    return { text: step, cls: "" };
  });
}

function addAlert(message, severity = "medium") {
  state.alerts.unshift({
    message,
    severity,
    time: new Date().toLocaleString()
  });
}

function startSession() {
  if (!state.currentUser) return;
  const pref = getCurrentUserPreferences();
  if (!pref.event) {
    showMessage("pref-msg", "Please save an event name before starting a session.", "error");
    return;
  }

  const sessionId = `S-${state.nextSessionId++}`;
  const transactionId = state.nextTransactionId++;
  const startedAt = new Date().toLocaleString();
  const session = {
    sessionId,
    username: currentUsername(),
    event: pref.event,
    seat: pref.seat,
    quantity: pref.quantity,
    budget: pref.budget,
    accessible: !!pref.accessible,
    stage: "Starting",
    startedAt,
    result: "Pending"
  };
  const transaction = {
    id: transactionId,
    username: currentUsername(),
    event: pref.event,
    seat: pref.seat,
    quantity: pref.quantity,
    accessible: !!pref.accessible,
    status: "Pending",
    time: startedAt
  };

  state.sessions.unshift(session);
  state.transactions.unshift(transaction);
  saveState();
  showMessage("pref-msg", "Purchase session started.", "info");
  renderDashboard();

  const stages = [
    "Preferences loaded",
    "Searching supported ticket flow",
    "Queue waiting",
    "Attempting reservation",
    "Success"
  ];

  let index = 0;
  const interval = setInterval(() => {
    session.stage = stages[index];
    if (index === stages.length - 2) {
      addAlert(`Session ${sessionId} required queue handling for ${pref.event}.`, "medium");
    }
    if (index === stages.length - 1) {
      session.result = "Success";
      transaction.status = "Success";
      clearInterval(interval);
    }
    saveState();
    renderDashboard();
    renderAdmin();
    index++;
    if (index >= stages.length) clearInterval(interval);
  }, 900);
}

function renderDashboard() {
  if (!state.currentUser) return;
  const user = currentUsername();
  const pref = getCurrentUserPreferences();
  const userSessions = state.sessions.filter(s => s.username === user);
  const lastSession = userSessions[0];
  const userTransactions = state.transactions.filter(t => t.username === user);

  $("welcome-name").textContent = `Welcome, ${user}`;
  $("stat-user").textContent = user;
  $("stat-session").textContent = lastSession ? lastSession.sessionId : "None";
  $("stat-result").textContent = lastSession ? lastSession.result : "Pending";

  $("pref-event").value = pref.event || "";
  $("pref-seat").value = pref.seat || "Standard";
  $("pref-quantity").value = pref.quantity || "2";
  $("pref-budget").value = pref.budget || "";
  $("pref-accessible").checked = !!pref.accessible;

  const resultBanner = $("result-banner");
  const resultBannerTitle = $("result-banner-title");
  const resultBannerCopy = $("result-banner-copy");
  resultBanner.className = "result-banner";

  if (!lastSession) {
    resultBanner.classList.add("result-pending");
    resultBannerTitle.textContent = "No completed session yet";
    resultBannerCopy.textContent = "Start a purchase session to see the final ticket result clearly highlighted here.";
  } else if ((lastSession.result || "").toLowerCase() === "success") {
    resultBanner.classList.add("result-success");
    resultBannerTitle.textContent = `Tickets found for ${lastSession.event}`;
    resultBannerCopy.textContent = `Final result: ${lastSession.result}. Quantity ${lastSession.quantity}, seat ${lastSession.seat}${lastSession.accessible ? ", accessible options requested" : ""}.`;
  } else {
    resultBanner.classList.add("result-pending");
    resultBannerTitle.textContent = `Session ${lastSession.sessionId} is still running`;
    resultBannerCopy.textContent = `Current status: ${lastSession.stage}. The final outcome will appear here as soon as the session finishes.`;
  }

  $("session-stage").textContent = lastSession ? lastSession.stage : "No active session";
  const timeline = $("timeline");
  timeline.innerHTML = "";
  if (!lastSession) {
    const li = document.createElement("li");
    li.textContent = "Waiting for session start";
    timeline.appendChild(li);
  } else {
    const mapping = {
      "Preferences loaded": 1,
      "Searching supported ticket flow": 2,
      "Queue waiting": 3,
      "Attempting reservation": 4,
      Success: 5
    };
    buildTimeline(mapping[lastSession.stage] || 0).forEach(item => {
      const li = document.createElement("li");
      li.textContent = item.text;
      if (item.cls) li.classList.add(item.cls);
      timeline.appendChild(li);
    });
  }

  const tbody = $("transaction-body");
  tbody.innerHTML = "";
  if (!userTransactions.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty">No transactions yet.</td></tr>`;
  } else {
    userTransactions.forEach(tx => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${tx.id}</td>
        <td>${tx.event}</td>
        <td>${tx.seat}</td>
        <td>${tx.quantity}</td>
        <td><span class="status-pill ${getStatusClass(tx.status)}">${tx.status}</span></td>
        <td>${tx.time}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}

function renderAdmin() {
  $("admin-users").textContent = state.users.length;
  $("admin-sessions").textContent = state.sessions.length;
  $("admin-alerts").textContent = state.alerts.length;

  const sessionList = $("session-list");
  sessionList.innerHTML = "";
  if (!state.sessions.length) {
    sessionList.innerHTML = `<li class="empty">No sessions yet.</li>`;
  } else {
    state.sessions.slice(0, 6).forEach(session => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${session.sessionId} - ${session.username}</strong>
        <div class="meta-line">${session.event}</div>
        <div class="meta-line">
          <span class="status-pill ${getStatusClass(session.stage)}">${session.stage}</span>
          <span class="status-pill ${getStatusClass(session.result)}">${session.result}</span>
        </div>
      `;
      sessionList.appendChild(li);
    });
  }

  const alertList = $("alert-list");
  alertList.innerHTML = "";
  if (!state.alerts.length) {
    alertList.innerHTML = `<li class="empty">No alerts yet.</li>`;
  } else {
    state.alerts.slice(0, 6).forEach(alert => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong><span class="status-pill ${getStatusClass(alert.severity)}">${alert.severity.toUpperCase()}</span></strong>
        <div class="meta-line">${alert.message}</div>
        <div class="meta-line">${alert.time}</div>
      `;
      alertList.appendChild(li);
    });
  }

  const tbody = $("admin-transaction-body");
  tbody.innerHTML = "";
  if (!state.transactions.length) {
    tbody.innerHTML = `<tr><td colspan="4" class="empty">No transactions yet.</td></tr>`;
  } else {
    state.transactions.slice(0, 8).forEach(tx => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${tx.username}</td>
        <td>${tx.event}</td>
        <td><span class="status-pill ${getStatusClass(tx.status)}">${tx.status}</span></td>
        <td>${tx.time}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}

document.querySelectorAll(".nav-link").forEach(button => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

$("register-btn").addEventListener("click", registerUser);
$("login-btn").addEventListener("click", loginUser);
$("logout-btn").addEventListener("click", logoutUser);
$("save-pref-btn").addEventListener("click", savePreferences);
$("search-google-btn").addEventListener("click", searchTicketsOnGoogle);
$("search-ticketmaster-btn").addEventListener("click", searchTicketsOnTicketmaster);
$("search-stubhub-btn").addEventListener("click", searchTicketsOnStubHub);
$("search-seatgeek-btn").addEventListener("click", searchTicketsOnSeatGeek);
$("search-all-btn").addEventListener("click", searchAllPlatforms);
$("start-session-btn").addEventListener("click", startSession);

renderDashboard();
renderAdmin();
setView(state.currentUser ? "dashboard" : "login");
