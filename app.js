const ADD_TASK_URL = "";
const GET_TASKS_URL = "";

async function loadTasks() {
    let res = await fetch(GET_TASKS_URL);
    let data = await res.json();
    
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    data.tasks.forEach(t => {
        let li = document.createElement("li");
        li.textContent = t.text;
        taskList.appendChild(li);
    });
}

async function addTask() {
    let input = document.getElementById("taskInput");
    if (input.value.trim() === "") return;

    await fetch(ADD_TASK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input.value })
    });

    input.value = "";
    loadTasks();
}

loadTasks();
