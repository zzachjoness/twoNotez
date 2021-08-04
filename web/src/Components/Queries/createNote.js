import getNotes from "./getNotes";
const createNote = async (updateState) => {
	const response = await fetch("http://localhost:8080/createNote", {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		credentials: "include",
		withCredentials: true,
	});
	const data = await response.json();
	console.log(data);
	//need to figure out how to handle data
	getNotes(updateState);
};

export default createNote;
