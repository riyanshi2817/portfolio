import React from 'react'
import UserCard from './components/UserCard'
import "./App.css"
import "./index.css"
function App() {
  return (
    <div className='container' >
      <UserCard name="Riyanshi Joshi" desc="yoyo" style={{"border-radius":"100px"}} />
      <UserCard name="vidushi Joshi" desc="hello" />
      <UserCard name="bandar" desc="whatsapp" />
    </div>
  )
}

export default App
