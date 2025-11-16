const API = "http://localhost:3000";
let authToken = localStorage.getItem("authToken");

// THEME MODE
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
};

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// LOGIN
async function login() {
  let password = document.getElementById("passwordInput").value;

  let res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  });

  let data = await res.json();

  if (data.token) {
    authToken = data.token;
    localStorage.setItem("authToken", authToken);
    document.getElementById("loginStatus").innerText = "Login successful!";
  } else {
    document.getElementById("loginStatus").innerText = "Password incorrect!";
  }
}

// LOAD TASKS
async function loadTasks() {
  let res = await fetch(`${API}/tasks`);
  let tasks = await res.json();

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let doneCount = 0;

  tasks.forEach(task => {
    if (task.done) doneCount++;

    let li = document.createElement("li");
    li.className = "task " + (task.done ? "done" : "");

    li.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""} 
        onchange="toggleDone('${task.id}', this.checked)">
      <span class="text">${task.text}</span>
      <button onclick="editTask('${task.id}', '${task.text}')"><i class="fa fa-edit"></i></button>
      <button onclick="deleteTask('${task.id}')"><i class="fa fa-trash"></i></button>
    `;
    
    list.appendChild(li);
  });

  updateProgress(tasks.length, doneCount);
}

// UPDATE PROGRESS
function updateProgress(total, done) {
  document.getElementById("progressText").innerText = `${done} of ${total} tasks done`;
  let percent = total === 0 ? 0 : (done / total) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

// ADD TASK
async function addTask() {
  let text = document.getElementById("taskInput").value;
  if (!text) return alert("Enter task");

  await fetch(`${API}/tasks`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "x-auth-token": authToken
    },
    body: JSON.stringify({ text })
  });

  document.getElementById("taskInput").value = "";
  loadTasks();
}

// TOGGLE DONE
async function toggleDone(id, done) {
  await fetch(`${API}/tasks/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "x-auth-token": authToken
    },
    body: JSON.stringify({ done })
  });
  loadTasks();
}

// EDIT TASK
async function editTask(id, oldText) {
  let newText = prompt("Edit task", oldText);
  if (!newText) return;

  await fetch(`${API}/tasks/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "x-auth-token": authToken
    },
    body: JSON.stringify({ text: newText })
  });

  loadTasks();
}

// DELETE
async function deleteTask(id) {
  if (!confirm("Delete task?")) return;

  await fetch(`${API}/tasks/${id}`, {
    method: "DELETE",
    headers: { "x-auth-token": authToken }
  });

  loadTasks();
}

loadTasks();
