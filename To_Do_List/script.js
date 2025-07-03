let taskInput = document.getElementById('task');
let addbtn = document.getElementById('addbtn');
let clearbtn = document.getElementById('clearbtn');
let tasklist = document.getElementById('tasklist');

addbtn.addEventListener("click", () => {
    let taskarea = taskInput.value;

    if(taskarea.trim() === ""){
        alert("Please enter a task.");
        return;
    }

    let taskItem = document.createElement("div");
    taskItem.className = "taskItem";

    taskItem.innerHTML= `<span class="task-content">${taskarea}</span>
    <div class="actions">
    <button class="editbtn">Edit</button>
    <button class="deletebtn">Delete</button>
    </div>
    `;

    tasklist.appendChild(taskItem);

    taskInput.value = "";

    taskItem.querySelector(".deletebtn").addEventListener("click", () => {
        taskItem.remove();
    });

    const editBtn = taskItem.querySelector(".editbtn");
    const taskSpan = taskItem.querySelector(".task-content");

     editBtn.addEventListener("click", () => {
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
            newSpan.innerText = inputField.value.trim() || "Untitled Task";
            taskItem.replaceChild(newSpan, inputField);
            editBtn.innerText = "Edit";
        }
    });

});

clearbtn.addEventListener("click", () => {
    tasklist.innerHTML = "";
});

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addbtn.click(); 
    }
});




