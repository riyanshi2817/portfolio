import { useState } from 'react'
import './App.css'
import Search from './components/Search'

function App() {
  const [count, setcount] = useState(0)
  console.log(count)
  return (
    <>
      <Search/>    
      <button onClick={()=>count}></button>
    </>
  )
}

export default App
