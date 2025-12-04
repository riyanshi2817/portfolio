import React from 'react'
import mypic from  '../assets/mypic.jpg'
import "./UserCard.css"
const UserCard = (props) => {
  return (
    <div className='user-container' style={props.style}>
      <h2 id='user-name'>{props.name}</h2>
      <img id='user-img' src={mypic} alt="its me" />
      <p id='user-desc'>{props.desc}</p>
    </div>
  )
}

export default UserCard
