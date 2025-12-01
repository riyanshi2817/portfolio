import { useState } from 'react'

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask("");
    }
  }

  return (
    <>
      <h1>My Todo List</h1>
      <input
        value={newTask}
        onChange={e => setNewTask(e.target.value)}
        placeholder="Add a new task"
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((task, index) => (
          <li key={index} style={{ textDecoration: task.completed ? "line-through" : "none" }}>
            <span onClick={() => {
              const updatedTasks = [...tasks];
              updatedTasks[index].completed = !updatedTasks[index].completed;
              setTasks(updatedTasks);
            }}>
              {task.text}
            </span>
            <button onClick={() => {
              setTasks(tasks.filter((_, i) => i !== index));
            }}>
              Delete
            </button>
          </li>
        ))}
      </ul>

    </>
  )
}

export default App
