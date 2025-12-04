import React from 'react'


function Navbar() {
    const contStyles = {
        display : "flex",
        backgroundColor : "red",
        border : "2px solid black"
    }
  return (
    <>
      <div className="container" style={contStyles} >
        <div className="box">Home</div>
        <div className="box">About</div>
        <div className="box">Contact</div>
        <div className="box">Login</div>
      </div>
    </>
  )
}

export default Navbar
