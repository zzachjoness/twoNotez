import React, { useContext } from "react";
import {
	Navbar,
	Nav,
	NavDropdown,
	Form,
	FormControl,
	Button,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useHistory } from "react-router-dom";
import UserContext from "./Context/UserContext";
import FetchContext from "./Context/FetchContext";
import "../bootstrap/customNav.css";

const NavigationBar = (props) => {
	const { fetching } = useContext(FetchContext);
	const { user, setUser } = useContext(UserContext);
	const history = useHistory();
	let body = null;

	const logout = async () => {
		const response = await fetch("http://localhost:8080/logout", {
			method: "GET",
			credentials: "include",
		});
		const data = await response.json();
		if (data) {
			setUser(null);
		}
		history.push("/");
	};

	if (fetching) {
		body = null;
	} else if (user === null) {
		body = (
			<>
				<Nav className="mr-auto">
					<LinkContainer to="/login">
						<Nav.Link to="/login">Login</Nav.Link>
					</LinkContainer>
					<LinkContainer to="/register">
						<Nav.Link>Register</Nav.Link>
					</LinkContainer>
					<NavDropdown title="About" id="nav-dropdown">
						<NavDropdown.Item href="/about">Developer</NavDropdown.Item>
						<NavDropdown.Item href="/notes/2">Version History</NavDropdown.Item>
						<NavDropdown.Item href="/notes/3">More Cool Stuff</NavDropdown.Item>
					</NavDropdown>
				</Nav>
			</>
		);
	} else {
		body = (
			<>
				<Nav className="mr-auto">
					<Nav.Item className="text-primary">
						<LinkContainer to="/me">
							<Nav.Link>{user.username.toUpperCase()}</Nav.Link>
						</LinkContainer>
					</Nav.Item>
					<Nav.Item>
						<LinkContainer to="/">
							<Nav.Link
								onSelect={() => {
									logout();
								}}
							>
								Logout
							</Nav.Link>
						</LinkContainer>
					</Nav.Item>
				</Nav>
				<Form inline>
					<FormControl
						type="text"
						placeholder="Search by category"
						className="mr-sm-2"
					/>
					<Button variant="outline-info">Search</Button>
				</Form>
			</>
		);
	}
	return (
		<Navbar className="nav" fixed="top" bg="dark" variant="dark" sticky="top">
			<Navbar.Brand className="ml-3" href="/">
				twoNOTEZ
			</Navbar.Brand>
			{body}
		</Navbar>
	);
};

export default NavigationBar;
