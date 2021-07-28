import React, { useContext } from "react";
import PublicHome from "./PublicHome";
import UserHome from "./UserHome";
import UserContext from "../Components/Context/UserContext";

const Home = (props) => {
	let displayHome;
	const { user } = useContext(UserContext);

	if (props.fetching) {
		displayHome = <div>loading...</div>;
	} else if (user === null) {
		displayHome = <PublicHome />;
	} else {
		displayHome = <UserHome />;
	}

	return <>{displayHome}</>;
};

export default Home;
