import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>ToDo List</h1>
      <form>
        <input type='text'/> <button>Save</button>
      </form>
    </>
  )
}

export default App
