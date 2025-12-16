import React, { useEffect } from "react"
import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom"

const Home = () => {
	const navigate = useNavigate()

	useEffect(() => {
		// If not logged in, redirect to login page
		const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"))

		if (!isLoggedIn) {
			alert("Login First")
			navigate("/login")
		}
	}, [])

	const logout = () => {
		// localStorage.removeItem("user");
		let isLoggedIn = false

		localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn))

		navigate("/")
	}

	return (
		<div className="home">
			<h2>Welcome Home Page!</h2>
			<button onClick={logout}>Logout</button>
		</div>
	)
}

export default Home
