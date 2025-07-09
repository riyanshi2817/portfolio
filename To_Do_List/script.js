let taskInput = document.getElementById('task');
let addbtn = document.getElementById('addbtn');
let clearbtn = document.getElementById('clearbtn');
let tasklist = document.getElementById('tasklist');

addbtn.addEventListener("click", () => {
    let taskarea = taskInput.value;

    if (taskarea.trim() === "") {
        alert("Please enter a task.");
        return;
    }

    addTaskToDOM(taskarea, false);
    saveTaskToStorage({ text: taskarea, checked: false });
    taskInput.value = "";
});

clearbtn.addEventListener("click", () => {
    tasklist.innerHTML = "";
    localStorage.removeItem("tasks");
});

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addbtn.click();
    }
});

window.addEventListener("DOMContentLoaded", () => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => {
        addTaskToDOM(task.text, task.checked);
    });
});

function addTaskToDOM(taskText, isChecked) {
    let taskItem = document.createElement("div");
    taskItem.className = "taskItem";

    let checkedAttr = isChecked ? "checked" : "";

    taskItem.innerHTML = `
        <input type="checkbox" class="check" ${checkedAttr}>
        <span class="task-content">${taskText}</span>
        <div class="actions">
            <button class="editbtn">Edit</button>
            <button class="deletebtn">Delete</button>
        </div>
    `;

    tasklist.appendChild(taskItem);

    const checkbox = taskItem.querySelector(".check");
    checkbox.addEventListener("change", () => {
        updateTaskCheckStatus(taskText, checkbox.checked);
    });

    taskItem.querySelector(".deletebtn").addEventListener("click", () => {
        taskItem.remove();
        removeTaskFromStorage(taskText);
    });

    const editBtn = taskItem.querySelector(".editbtn");
    editBtn.addEventListener("click", () => {
        const taskSpan = taskItem.querySelector(".task-content");

        if (editBtn.innerText === "Edit") {
            const input = document.createElement("input");
            input.type = "text";
            input.value = taskSpan.innerText;
            input.className = "edit-input";
            taskItem.replaceChild(input, taskSpan);
            editBtn.innerText = "Save";
        } else {
            const inputField = taskItem.querySelector(".edit-input");
            const newSpan = document.createElement("span");
            newSpan.className = "task-content";
            const updatedTask = inputField.value.trim() || "Untitled Task";
            newSpan.innerText = updatedTask;
            taskItem.replaceChild(newSpan, inputField);
            editBtn.innerText = "Edit";
            updateTaskInStorage(taskText, updatedTask);
            taskText = updatedTask;
        }
    });
}

function saveTaskToStorage(taskObj) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(taskObj);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTaskFromStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(t => t.text !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskInStorage(oldText, newText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const index = tasks.findIndex(t => t.text === oldText);
    if (index !== -1) {
        tasks[index].text = newText;
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
}

function updateTaskCheckStatus(taskText, isChecked) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const index = tasks.findIndex(t => t.text === taskText);
    if (index !== -1) {
        tasks[index].checked = isChecked;
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
}
