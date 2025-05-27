const API_URL = "https://demo2.z-bit.ee";

export function getToken() {
  return localStorage.getItem("access_token");
}

export async function getTasks() {
  const res = await fetch(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return await res.json();
}

export async function addTask(title, desc = "") {
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

export async function updateTask(id, updates) {
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

export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to delete task");
}
