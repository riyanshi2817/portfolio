const write = document.querySelector(".out");
const display = document.querySelector(".task-list");
const bt1 = document.querySelector(".btn1");
const bt2 = document.querySelector(".btn2");

bt1.addEventListener("click", addtask)
bt2.addEventListener("click" , clearTasks);

window.addEventListener("DOMContentLoaded", loadTasksFromStorage);

function loadTasksFromStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(taskText => {
        createTaskElement(taskText);
    });
}

function addtask(){
    const task = write.value.trim();

    if(task===""){
        alert("Please enter a task!");
        return;
    }

     createTaskElement(task); 
    saveTaskToLocalStorage(task);
    write.value = "";
}

function clearTasks(){
    display.innerHTML = "";
}

function createTaskElement(task) {
    const taskItem = document.createElement("div");
    taskItem.className = "task-item";
    taskItem.innerText = task;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "remove";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", () => {
        taskItem.remove();
        removeTaskFromLocalStorage(task);
    });

    taskItem.appendChild(deleteBtn);
    display.appendChild(taskItem);
}

function saveTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(taskToRemove) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = tasks.filter(task => task !== taskToRemove);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

