import { useState } from "react";

const useLogin = (callback) => {
	const [inputs, setInputs] = useState({
		emailOrUsername: "",
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

export default useLogin;
