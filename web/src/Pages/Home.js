import React, { useContext } from "react";
import PublicHome from "./PublicHome";
import UserHome from "./UserHome";
import UserContext from "../Components/Context/UserContext";
import FetchContext from "../Components/Context/FetchContext";

const Home = (props) => {
	let displayHome;
	const { user } = useContext(UserContext);
	const { fetching } = useContext(FetchContext);

	if (fetching) {
		displayHome = <div>loading...</div>;
	} else if (user === null) {
		displayHome = <PublicHome />;
	} else {
		displayHome = <UserHome />;
	}

	return <>{displayHome}</>;
};

export default Home;
