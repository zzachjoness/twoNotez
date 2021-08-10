const { validateRegister } = require("../utils/validateRegister");
const argon2 = require("argon2");
const { Pool } = require("pg");
const { verifyPassword } = require("../utils/verifyPassword.js");
//hi;

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
	const text = `INSERT INTO users (username, password, email, date_created) VALUES ($1, $2, $3, (to_timestamp(${Date.now()} / 1000.0))) RETURNING *`;
	const values = [username, hashedPassword, email];
	try {
		const result = await pool.query(text, values);
		const user = result.rows[0];
		req.session.userID = user.uid;
		return res.status(200).send({ user });
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
		} else return res.status(400).send({ error: err });
	}
};

const me = async (req, res) => {
	const userID = req.session.userID;
	if (!userID) {
		return res
			.status(404)
			.send({ errors: [{ field: "me", message: "user not logged in" }] });
	}
	const text = "SELECT email, username, uid FROM users WHERE uid = $1";
	const values = [userID];
	try {
		const result = await pool.query(text, values);
		const user = result.rows[0];
		return res.status(200).send({ user });
	} catch (err) {
		return res.status(400).send({ error: err });
	}
};
const login = async (req, res) => {
	const { emailOrUsername } = req.body;
	const passwordInput = req.body.password;
	const text = emailOrUsername.includes("@")
		? "SELECT email, username, uid, password FROM users WHERE email = $1"
		: "SELECT email, username, uid, password FROM users WHERE username = $1";
	const values = [emailOrUsername];
	try {
		const result = await pool.query(text, values);
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
				return res.status(400).send({
					errors: [
						{ field: "password", message: "password does not match, try again" },
					],
				});
			}
		} catch (err) {
			return res.status(400).send({
				errors: [
					{
						field: "unknown error",
						message: "we are having troubles, try again later",
					},
				],
			});
		}
	} catch (err) {
		return res.status(400).send({
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
