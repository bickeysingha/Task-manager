
const API = "https://task-manager-24ux.onrender.com";

let authToken = localStorage.getItem("authToken");
let currentUser = localStorage.getItem("username") || null;

const taskListEl = document.getElementById("taskList");

// THEME
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
};
if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");

// NOTIFICATIONS
if ("Notification" in window) {
  Notification.requestPermission();
}

function showNotification(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

// AUTH HELPERS
function setLoginStatus(msg, isError = false) {
  const el = document.getElementById("loginStatus");
  el.textContent = msg;
  el.style.color = isError ? "red" : "green";
}

async function register() {
  const username = document.getElementById("usernameInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();
  if (!username || !password) return setLoginStatus("Enter username and password", true);

  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (data.success) {
    setLoginStatus("Registered successfully. Now login.");
  } else {
    setLoginStatus(data.error || "Register failed", true);
  }
}

async function login() {
  const username = document.getElementById("usernameInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();
  if (!username || !password) return setLoginStatus("Enter username and password", true);

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (data.token) {
    authToken = data.token;
    currentUser = data.username;
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("username", currentUser);
    setLoginStatus(`Logged in as ${currentUser}`);
    loadTasks();
  } else {
    setLoginStatus(data.error || "Login failed", true);
  }
}

// TASKS

async function loadTasks() {
  if (!authToken) {
    setLoginStatus("Login to see your tasks.", true);
    taskListEl.innerHTML = "";
    updateProgress(0, 0);
    return;
  }

  const res = await fetch(`${API}/tasks`, {
    headers: { "x-auth-token": authToken },
  });
  const tasks = await res.json();
  renderTasks(tasks);
  scheduleReminders(tasks);
}

function renderTasks(tasks) {
  taskListEl.innerHTML = "";
  let doneCount = 0;

  tasks.sort((a, b) => (a.order || 0) - (b.order || 0));

  tasks.forEach((task) => {
    if (task.done) doneCount++;

    const li = document.createElement("li");
    li.className = "task " + (task.done ? "done" : "");
    li.draggable = true;
    li.dataset.id = task.id;

    li.addEventListener("dragstart", dragStart);
    li.addEventListener("dragover", dragOver);
    li.addEventListener("drop", dropped);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.onchange = () => toggleDone(task.id, checkbox.checked);

    const textSpan = document.createElement("span");
    textSpan.className = "text";
    textSpan.textContent = task.text;

    const meta = document.createElement("small");
    meta.style.marginLeft = "10px";
    if (task.dueDate) {
      const d = new Date(task.dueDate);
      meta.textContent = "Due: " + d.toLocaleString();
      if (!task.done && d < new Date()) {
        li.style.border = "1px solid red";
      }
    }

    const editBtn = document.createElement("button");
    editBtn.innerHTML = '<i class="fa fa-edit"></i>';
    editBtn.onclick = () => editTask(task.id, task.text);

    const delBtn = document.createElement("button");
    delBtn.innerHTML = '<i class="fa fa-trash"></i>';
    delBtn.onclick = () => deleteTask(task.id);

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(meta);
    li.appendChild(editBtn);
    li.appendChild(delBtn);

    taskListEl.appendChild(li);
  });

  updateProgress(tasks.length, doneCount);
}

function updateProgress(total, done) {
  document.getElementById("progressText").innerText = `${done} of ${total} tasks done`;
  const percent = total === 0 ? 0 : (done / total) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

async function addTask() {
  if (!authToken) return alert("Login first");
  const text = document.getElementById("taskInput").value.trim();
  const due = document.getElementById("dueInput").value;
  if (!text) return alert("Enter task");

  await fetch(`${API}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": authToken,
    },
    body: JSON.stringify({ text, dueDate: due || null }),
  });

  document.getElementById("taskInput").value = "";
  document.getElementById("dueInput").value = "";
  loadTasks();
}

async function toggleDone(id, done) {
  if (!authToken) return alert("Login first");
  await fetch(`${API}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": authToken,
    },
    body: JSON.stringify({ done }),
  });
  loadTasks();
}

async function editTask(id, oldText) {
  if (!authToken) return alert("Login first");
  const newText = prompt("Edit task", oldText);
  if (!newText) return;

  await fetch(`${API}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": authToken,
    },
    body: JSON.stringify({ text: newText }),
  });
  loadTasks();
}

async function deleteTask(id) {
  if (!authToken) return alert("Login first");
  if (!confirm("Delete this task?")) return;

  await fetch(`${API}/tasks/${id}`, {
    method: "DELETE",
    headers: { "x-auth-token": authToken },
  });
  loadTasks();
}

// DRAG & DROP SORTING

let dragSrcEl = null;

function dragStart(e) {
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = "move";
}

function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

async function dropped(e) {
  e.preventDefault();
  if (dragSrcEl === this) return;

  const items = Array.from(taskListEl.children);
  const srcIndex = items.indexOf(dragSrcEl);
  const destIndex = items.indexOf(this);

  if (srcIndex < 0 || destIndex < 0) return;

  if (srcIndex < destIndex) {
    taskListEl.insertBefore(dragSrcEl, this.nextSibling);
  } else {
    taskListEl.insertBefore(dragSrcEl, this);
  }

  await saveOrder();
}

async function saveOrder() {
  const items = Array.from(taskListEl.children);
  const updates = items.map((li, index) => ({
    id: li.dataset.id,
    order: index + 1,
  }));

  for (const u of updates) {
    await fetch(`${API}/tasks/${u.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": authToken,
      },
      body: JSON.stringify({ order: u.order }),
    });
  }
  loadTasks();
}

// Local reminders: fire notification a bit before due time (only while tab is open)
function scheduleReminders(tasks) {
  const now = Date.now();
  tasks.forEach((t) => {
    if (!t.dueDate || t.done) return;
    const dueTime = new Date(t.dueDate).getTime();
    const diff = dueTime - now;
    if (diff > 0 && diff < 10 * 60 * 1000) { // within 10 min
      showNotification("Task Reminder", `${t.text} is due soon (${new Date(t.dueDate).toLocaleString()})`);
    }
  });
}

// Init
if (authToken && currentUser) {
  setLoginStatus(`Logged in as ${currentUser}`);
}
loadTasks();
