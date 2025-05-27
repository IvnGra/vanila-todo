const STORAGE_KEY = 'todo_tasks';

let tasks = [];
let lastTaskId = 0;

let taskList;
let addTask;

// On page load, initialize and load saved tasks
window.addEventListener('load', () => {
    taskList = document.querySelector('#task-list');
    addTask = document.querySelector('#add-task');

    // Load saved tasks from localStorage or start fresh
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        tasks = JSON.parse(saved);
        if (tasks.length > 0) {
            lastTaskId = Math.max(...tasks.map(t => t.id));
        }
    }

    tasks.forEach(renderTask);

    addTask.addEventListener('click', () => {
        const task = createTask();  // create and push new task
        renderTask(task);           // render new task
        saveTasks();                // save updated list
    });
});

function renderTask(task) {
    const taskRow = createTaskRow(task);
    taskList.appendChild(taskRow);
}

function createTask() {
    lastTaskId++;
    const task = {
        id: lastTaskId,
        name: 'Task ' + lastTaskId,
        completed: false
    };
    tasks.push(task);
    return task;
}

function createTaskRow(task) {
    let taskRow = document.querySelector('[data-template="task-row"]').cloneNode(true);
    taskRow.removeAttribute('data-template');

    const name = taskRow.querySelector("[name='name']");
    name.value = task.name;
    name.addEventListener('input', () => {
        task.name = name.value;
        saveTasks();
    });

    const checkbox = taskRow.querySelector("[name='completed']");
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        saveTasks();
    });

    const deleteButton = taskRow.querySelector('.delete-task');
    deleteButton.addEventListener('click', () => {
        taskList.removeChild(taskRow);
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
    });

    hydrateAntCheckboxes(taskRow);

    return taskRow;
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function hydrateAntCheckboxes(element) {
    const elements = element.querySelectorAll('.ant-checkbox-wrapper');
    for (let i = 0; i < elements.length; i++) {
        let wrapper = elements[i];

        if (wrapper.__hydrated) continue;
        wrapper.__hydrated = true;

        const checkbox = wrapper.querySelector('.ant-checkbox');
        const input = wrapper.querySelector('.ant-checkbox-input');

        if (input.checked) {
            checkbox.classList.add('ant-checkbox-checked');
        } else {
            checkbox.classList.remove('ant-checkbox-checked');
        }
        
        input.addEventListener('change', () => {
            checkbox.classList.toggle('ant-checkbox-checked');
        });
    }
}
