const API_URL = "https://demo2.z-bit.ee";

function getToken() {
  return localStorage.getItem("access_token") ?? "ms0GjkAPDtdcS8J4Q8bgkKJe2FY_NG4_";
}

async function apigetTasks() {
  const res = await fetch(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return await res.json();
}

async function apiAddTask(title, desc = "") {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ title, desc }),
  });
  if (!res.ok) throw new Error("Failed to add task");
  return await res.json();
}

async function apiupdateTask(id, updates) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return await res.json();
}

async function apideleteTask(id) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to delete task");
}
