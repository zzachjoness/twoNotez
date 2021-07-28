const { validateRegister } = require("../utils/validateRegister");
const argon2 = require("argon2");
const { Pool } = require("pg");

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
});

const register = async (req, res) => {
	const { email, username, password } = req.body;
	const errors = validateRegister(req.body);
	if (errors) {
		return res.send({ errors });
	}
	const hashedPassword = await argon2.hash(password);
	let user;
	try {
		const result = await pool.query(
			`INSERT INTO users (username, password, email, date_created) VALUES ($1, $2, $3, (to_timestamp(${Date.now()} / 1000.0))) RETURNING *`,
			[username, hashedPassword, email]
		);
		user = result.rows[0];
	} catch (err) {
		if (err.code === "23505") {
			return res.send({
				errors: [
					{
						field: "username",
						message: "user already exists",
					},
				],
			});
		}
	}
	//this should be included in the try section with return statement
	req.session.userID = user.uid;
	res.status(200).send({ user });
};

const me = (req, res) => {
	if (!req.session.userID) {
		return res.send({ errors: [{ field: "me", message: "user not logged in" }] });
	}
	pool.query(
		"SELECT email, username, uid FROM users WHERE uid = $1",
		[req.session.userID],
		//[username], to add back in for prod
		//alter try/catch
		async (error, results) => {
			const user = results.rows[0];
			res.status(200).send({ user });
		}
	);
};
const login = async (req, res) => {
	let loginMethod = "";
	const { emailOrUsername } = req.body;
	const passwordInput = req.body.password;
	emailOrUsername.includes("@")
		? (loginMethod = "email")
		: (loginMethod = "username");
	try {
		const result = await pool.query(
			`SELECT email, username, uid, password FROM users WHERE ${loginMethod} = $1`,
			[emailOrUsername]
		);
		const userIn = result.rows[0];
		const user = {
			email: userIn.email,
			username: userIn.username,
			uid: userIn.uid,
		};
		const hashedPassword = userIn.password;
		try {
			if (await argon2.verify(hashedPassword, passwordInput)) {
				req.session.userID = userIn.uid;
				return res.status(200).send({ user });
			} else {
				return res.send({
					errors: [
						{ field: "password", message: "password does not match, try again" },
					],
				});
			}
		} catch (err) {
			return res.send({
				errors: [
					{
						field: "unknown error",
						message: "we are having troubles, try again later",
					},
				],
			});
		}
	} catch (err) {
		return res.send({
			errors: [
				{ field: "emailOrUsername", message: "user cannot be found, try again" },
			],
		});
	}
};
const logout = (req, res) => {
	req.session.destroy((err) => {
		res
			.clearCookie("qid")
			.send({ note: [{ field: "cookies", message: "cookie removed" }] });
	});
};

module.exports = {
	register,
	me,
	logout,
	login,
};
