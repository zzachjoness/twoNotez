const validateRegister = (options) => {
	if (options.username.length <= 2) {
		return [
			{
				field: "username",
				message: "length must be greater than 2",
			},
		];
	}
	if (options.username.includes("@")) {
		return [
			{
				field: "username",
				message: "cannot includes @",
			},
		];
	}
	if (options.password.length <= 2) {
		return [
			{
				field: "password",
				message: "length must be greater than 2",
			},
		];
	}
	return null;
};

module.exports = {
	validateRegister,
};
