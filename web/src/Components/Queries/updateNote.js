const updateNote = async () => {
	const response = await fetch("http://localhost:8080/updateNote", {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		credentials: "include",
		withCredentials: true,
		body: JSON.stringify(/*inputs*/),
	});
	const data = await response.json();
	console.log(data);
};

export default updateNote;
