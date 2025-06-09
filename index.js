const API_BASE = "https://demo2.z-bit.ee";
const AUTH_TOKEN = "ms0GjkAPDtdcS8J4Q8bgkKJe2FY_NG4_"; 

let taskList;
let addTask;
const tasks = [];

window.addEventListener("load", () => {
    taskList = document.querySelector("#task-list");
    addTask = document.querySelector("#add-task");

    readTasks();

    addTask.addEventListener("click", async () => {
        try {
            const task = await createTask();
            tasks.push(task);
            const taskRow = createTaskRow(task);
            taskList.appendChild(taskRow);
        } catch (error) {
            console.error("Error creating task:", error);
        }
    });
});

async function readTasks() {
    try {
        const response = await fetch(`${API_BASE}/tasks`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${AUTH_TOKEN}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        tasks.length = 0;
        data.forEach((task) => tasks.push(task));

        taskList.innerHTML = "";
        data.forEach((task) => {
            const taskRow = createTaskRow(task);
            taskList.appendChild(taskRow);
        });
    } catch (error) {
        console.error("Error reading tasks:", error);
    }
}

async function createTask() {
    const title = `Task ${tasks.length + 1}`;
    const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({ title, desc: "Something" }),
    });

    if (!res.ok) throw new Error("Failed to create task");

    const data = await res.json();
    return data;
}

async function updateTask(taskId, updatedTask) {
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(updatedTask),
    });

    if (!res.ok) throw new Error("Failed to update task");

    return await res.json();
}

async function deleteTask(taskId) {
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
        },
    });

    if (!res.ok) throw new Error("Failed to delete task");
}

function createTaskRow(task) {
    const taskRow = document.querySelector('[data-template="task-row"]').cloneNode(true);
    taskRow.removeAttribute("data-template");

    const nameInput = taskRow.querySelector("[name='name']");
    nameInput.value = task.title;

    nameInput.addEventListener("blur", async () => {
        const newTitle = nameInput.value.trim();
        if (newTitle && newTitle !== task.title) {
            try {
                await updateTask(task.id, { title: newTitle });
                task.title = newTitle;
            } catch (e) {
                console.error("Failed to update task title:", e);
            }
        }
    });

    const checkbox = taskRow.querySelector("[name='completed']");
    checkbox.checked = task.marked_as_done ?? false;

    checkbox.addEventListener("change", async () => {
        try {
            await updateTask(task.id, { marked_as_done: checkbox.checked });
            task.marked_as_done = checkbox.checked;
        } catch (e) {
            console.error("Failed to update task status:", e);
        }
    });

    const deleteBtn = taskRow.querySelector(".delete-task");
    deleteBtn.addEventListener("click", async () => {
        try {
            await deleteTask(task.id);
            taskList.removeChild(taskRow);
            const index = tasks.findIndex((t) => t.id === task.id);
            if (index > -1) tasks.splice(index, 1);
        } catch (e) {
            console.error("Failed to delete task:", e);
        }
    });

    hydrateAntCheckboxes(taskRow);

    return taskRow;
}

function hydrateAntCheckboxes(element) {
    const wrappers = element.querySelectorAll(".ant-checkbox-wrapper");
    wrappers.forEach((wrapper) => {
        if (wrapper.__hydrated) return;
        wrapper.__hydrated = true;

        const checkbox = wrapper.querySelector(".ant-checkbox");
        const input = wrapper.querySelector(".ant-checkbox-input");

        if (input.checked) checkbox.classList.add("ant-checkbox-checked");
        else checkbox.classList.remove("ant-checkbox-checked");

        input.addEventListener("change", () => {
            checkbox.classList.toggle("ant-checkbox-checked");
        });
    });
}
