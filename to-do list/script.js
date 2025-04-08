let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const text = document.getElementById("task-input").value.trim();
  const date = document.getElementById("task-date").value;
  const time = document.getElementById("task-time").value;
  if (!text || !date || !time) return alert("Please fill all fields!");

  tasks.push({ text, date, time, completed: false });
  saveTasks();
  clearInputs();
  renderTasks();
}

function clearInputs() {
  document.getElementById("task-input").value = "";
  document.getElementById("task-date").value = "";
  document.getElementById("task-time").value = "";
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function getTodayDateStr() {
  return new Date().toISOString().split("T")[0];
}

function getYesterdayDateStr() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
}

function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

function filterTasks(filter) {
  currentFilter = filter;
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById("task-list");
  const searchTerm = document.getElementById("search-input")?.value?.toLowerCase() || "";
  list.innerHTML = "";

  const today = getTodayDateStr();
  const yesterday = getYesterdayDateStr();

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "today" && task.date !== today) return false;
    if (currentFilter === "future" && task.date <= today) return false;
    if (currentFilter === "past" && task.date !== yesterday) return false;
    if (!task.text.toLowerCase().includes(searchTerm)) return false;
    return true;
  });

  if (filteredTasks.length === 0) {
    list.innerHTML = `<li>No matching tasks found.</li>`;
    return;
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <div class="task-info">
        <strong>${task.text}</strong>
        <div class="task-date">🗓️ ${formatDate(task.date)} ⏰ ${task.time}</div>
      </div>
      <div class="actions">
        <button onclick="toggleComplete(${index})">${task.completed ? "Undo" : "Done"}</button>
        <button onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
}

window.onload = renderTasks;
