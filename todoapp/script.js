const write = document.querySelector(".out");
const display = document.querySelector(".container");
const bt1 = document.querySelector(".btn1");
const bt2 = document.querySelector(".btn2");
 
bt1.addEventListener("click", addtask)
bt2.addEventListener("click" , clearTasks);


function addtask(){
    const task = write.value.trim();

    if(task===""){
        alert("Please enter a task!");
        return;
    }

   const taskItem = document.createElement("div");
    taskItem.className = "task-item";
    taskItem.innerText = task;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "remove";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", () => {
        taskItem.remove();
    });

    taskItem.appendChild(deleteBtn);

    display.appendChild(taskItem);

    write.value = "";
}

function clearTasks(){
    display.innerHTML = "";
}


