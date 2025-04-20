import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Card from './components/Card'
import Custom from './components/Custom'
import react from './assets/react.svg'
function App() {
  return (
    <div>
      <Card img={react}  title={react}  desc={react} />
    </div>
  )
}

export default App
