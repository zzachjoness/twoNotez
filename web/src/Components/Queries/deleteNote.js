const deleteNote = async (nid) => {
	const response = await fetch("http://localhost:8080/deleteNote", {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		credentials: "include",
		withCredentials: true,
		body: JSON.stringify({ nid: nid }),
	});
	const data = await response.json();
	console.log(data);
	/*if (data.notes) {
			setNotes(data.notes);
			setNoteDeleteID(null);
		}*/
};

export default deleteNote;
