import React from 'react'
import 'Card.css';
function Card({img,title,desc}) {
  return (
    <div className="container">
        <img className=img src={img} alt="" />
        <h1>{title}</h1>
        <h3>{desc}</h3>
    </div>
  )
}

export default Card
