const getNotes = async (callback) => {
	const response = await fetch("http://localhost:8080/getNotes", {
		method: "GET",
		credentials: "include",
	});
	const data = await response.json();
	console.log(data);
	if (data.notes) {
		callback(data.notes);
		console.log(data.notes);
	} else {
		// needs edit
		console.log("no data");
	}
};

export default getNotes;
