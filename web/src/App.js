import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import NavigationBar from "./Components/NavigationBar";
import RegisterUser from "./Pages/RegisterUser";
import LoginUser from "./Pages/LoginUser";
import Home from "./Pages/Home";
import UserContext from "./Components/Context/UserContext";
import FetchContext from "./Components/Context/FetchContext";

const App = () => {
	const [user, setUser] = useState(null);
	const [fetching, setFetching] = useState(true);

	const findMe = async () => {
		const response = await fetch("http://localhost:8080/me", {
			method: "GET",
			credentials: "include",
		});
		const data = await response.json();
		if (data.user) {
			setUser(data.user);
		}
		setFetching(false);
	};

	useEffect(() => {
		findMe();
	}, []);

	return (
		<Router>
			<UserContext.Provider value={{ user, setUser }}>
				<FetchContext.Provider value={{ fetching, setFetching }}>
					<NavigationBar />
					<Route path="/" exact component={Home} />
					<Route path="/login" exact component={LoginUser} />
					<Route path="/register" exact component={RegisterUser} />
				</FetchContext.Provider>
			</UserContext.Provider>
		</Router>
	);
};

export default App;
