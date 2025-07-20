import { useState } from 'react'
import ProfileCard from './components/ProfileCard';
import './App.css';
import img2 from './assets/img2.jpg'; 

function App() {
  return (
     <div className="App">
      <ProfileCard
        name="Riyanshi Joshi"
        email="riyanshijoshi8@gmail.com"
        job=" Developer"
        img= {img2}
        instagram="https://instagram.com/"
        linkedln="https://twitter.com/"
      />
    </div>
  );
}

export default App;
 