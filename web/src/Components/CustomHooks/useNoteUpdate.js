import { useState } from "react";

const useNoteUpdate = (callback) => {
	const initialState = {
		category: "",
		title: "",
		body: "",
		nid: null,
	};
	const [inputs, setInputs] = useState(initialState);
	const handleSubmit = async (event) => {
		if (event) {
			event.prevent_default();
		}
		if (inputs.nid !== null) {
			callback();
		}
		setInputs(initialState);
	};
	const handleInputChange = (event) => {
		event.persist();
		if (inputs.nid === null) {
			setInputs({
				...inputs,
				nid: parseInt(event.target.attributes.type.nodeValue),
			});
		}
		setInputs((inputs) => ({
			...inputs,
			[event.target.name]: event.target.value,
		}));
	};

	return { handleSubmit, handleInputChange, inputs };
};

export default useNoteUpdate;
