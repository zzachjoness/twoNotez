import { useState } from "react";

const useRegister = (callback) => {
	// check to see if there is any validity to setting an initial state
	const [inputs, setInputs] = useState({
		email: "",
		username: "",
		password: "",
	});
	const handleSubmit = async (event) => {
		if (event) {
			event.preventDefault();
		}
		callback();
	};
	const handleInputChange = (event) => {
		event.persist();
		setInputs((inputs) => ({
			...inputs,
			[event.target.name]: event.target.value,
		}));
	};
	return {
		handleSubmit,
		handleInputChange,
		inputs,
	};
};

export default useRegister;
