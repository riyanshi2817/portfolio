import React from 'react'
import { useState } from 'react'
import './Todo.css';

function Todo() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (task.trim() !== "") {
      const newTask = { text: task, completed: false };
      setTasks([...tasks, newTask]);
      setTask("");
    }
  };

  const deleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const toggleComplete = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  return (
    <div>
      <h2>To-do List</h2>
      <input
        type="text"
        placeholder="Enter a task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <button onClick={addTask}> Add Task </button>

      <ul>
        {tasks.map((item, index) => (
          <li
            key={index}
            onClick={() => toggleComplete(index)}
            style={{
              textDecoration: item.completed ? "line-through" : "none",
              cursor: "pointer",
            }}
            >
            {item.text}
            <button onClick={(e) => {e.stopPropagation(); deleteTask(index);}}>Delete Task</button>
          </li>
        ))}
      </ul>

    </div>

  );
};

export default Todo;
