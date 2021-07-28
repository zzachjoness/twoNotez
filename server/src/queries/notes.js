const { Pool } = require("pg");

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
});

const getNotes = (req, res) => {
	if (!req.session.userID) {
		return res.send({
			errors: [{ field: "me", message: "user not logged in" }],
		});
	}
	// alter try/catch
	pool.query(
		"SELECT * FROM notes WHERE uid = $1",
		[req.session.userID],
		(error, result) => {
			const notes = result.rows;
			res.status(200).send({ notes });
		}
	);
};

const createNote = async (req, res) => {
	const result = await pool.query(
		`INSERT INTO notes(uid, last_updated) VALUES ($1, (to_timestamp(${Date.now()} / 1000.0))) RETURNING *`,
		[req.session.userID]
	);
	const note = result.rows;
	res.status(200).send({ note });
};

//add deleteNote in React
const deleteNote = async (req, res) => {};

const updateNote = async (req, res) => {
	const { category, title, body, nid } = req.body;
	let noteStatement = "";
	let valueStatement = "";
	for (const key in req.body) {
		if (req.body[key] !== "" && key !== "nid") {
			noteStatement = noteStatement + key + ", ";
			valueStatement = valueStatement + `'${req.body[key]}', `;
		}
	}
	try {
		const result = await pool.query(
			`UPDATE notes SET (${noteStatement}last_updated) 
			= (${valueStatement}(to_timestamp(${Date.now()} / 1000.0))) 
			WHERE nid = ${nid} RETURNING *`
		);
		const note = result.rows;
		return res.status(200).send({ note });
	} catch (err) {
		//adjust error statement in res.send
		return res.send("error");
	}
};

module.exports = {
	createNote,
	getNotes,
	deleteNote,
	updateNote,
};
