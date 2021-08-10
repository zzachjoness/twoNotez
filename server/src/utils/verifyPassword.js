const argon2 = require("argon2");

const verifyPassword = async (hashedPassword, passwordInput, user, userIn) => {
	try {
		if (await argon2.verify(hashedPassword, passwordInput)) {
			console.log("we have a match");
			// need to impliment req.session.userID = userIn.uid;
			// return will need to have catch or if statement in users.js
			return user;
		} else {
			return {
				errors: [
					{ field: "password", message: "password does not match, try again" },
				],
			};
		}
	} catch (err) {
		return {
			errors: [
				{
					field: "unknown error",
					message: "we are having troubles, try again later",
				},
			],
		};
	}
};

module.exports = {
	verifyPassword,
};
