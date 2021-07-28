const getNotes = async (callback) => {
	const response = await fetch("http://localhost:8080/getNotes", {
		method: "GET",
		credentials: "include",
	});
	const data = await response.json();
	if (data.notes) {
		callback(data.notes);
	} else {
		console.log("no data");
	}
};

export default getNotes;
