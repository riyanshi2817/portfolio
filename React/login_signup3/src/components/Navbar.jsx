import { Link } from "react-router-dom"
import { navItems } from "./NavItems"


const Navbar = () => {
	return (
		<div>
			<nav>
				<ul style={{display: "flex", listStyle: "none"}}>
					{navItems.map((element, idx) => {
						return (
							<li key={idx}>
								<Link to={element.path}>{element.name}</Link>
							</li>
						)
					})}
				</ul>
			</nav>
		</div>
	)
}

export default Navbar
