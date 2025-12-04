import { useState } from 'react'
import  Button from './components/Button'
import './App.css'

function App() {
  const  [count, setCount] = useState(0);

  function handleClick(){
    setCount(count+1);
  }
  return(
    <div>
      <Button handleClick={handleClick} text="Click me " >
        <h1>{count}</h1>
       </Button>
      {/* <Card name="Riyanshi Joshi" >
        <h1>Best WEB DEV Course </h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, veniam?</p>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. In, doloremque est.</p>            
      </Card>
      <Card  children="Main ek children hu">
        Hello
      </Card> */}
    </div>
  )
}

export default App
