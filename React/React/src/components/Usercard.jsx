import React from 'react'
import mypic from '../assets/mypic.jpg'
import "./Usercard.css"

const Usercard = (props) => {
  return (
    <div className='user-container'>
      <p id='user-name'>{props.name}</p>
      <img id="user-img" src={mypic} alt="riyanshi" ></img>
      <p id='user-desc'>{props.desc}</p>
    </div>
  )
}

export default Usercard
