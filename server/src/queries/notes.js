const { Pool } = require("pg");

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
});

const getNotes = async (req, res) => {
	if (!req.session.userID) {
		return res.send({
			errors: [{ field: "me", message: "user not logged in" }],
		});
	}
	try {
		const result = await pool.query("SELECT * FROM notes WHERE uid = $1", [
			req.session.userID,
		]);
		const notes = result.rows;
		return res.status(200).send({ notes });
	} catch (err) {
		return res.send({ error: err });
	}
};

const createNote = async (req, res) => {
	const result = await pool.query(
		`INSERT INTO notes(uid, last_updated) VALUES ($1, (to_timestamp(${Date.now()} / 1000.0))) RETURNING *`,
		[req.session.userID]
	);
	const note = result.rows;
	res.status(200).send({ note });
};

const deleteNote = async (req, res) => {
	const nid = req.body.nid;
	try {
		const result = await pool.query(
			`DELETE FROM notes WHERE nid = ${nid} RETURNING *`
		);
		const notes = result.rows;
		console.log("returning notes: ", notes);
		return res.send({ notes });
	} catch (err) {
		console.log(err);
		return res.send({ error: err });
	}
};

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
			`UPDATE notes SET (category, title, body, last_updated) 
			= ($1, $2, $3, (to_timestamp(${Date.now()} / 1000.0))) 
			WHERE nid = $4 RETURNING *`,
			[category, title, body, nid]
		);
		const note = result.rows;
		return res.status(200).send({ note });
	} catch (err) {
		return res.send({ error: err });
	}
};

module.exports = {
	createNote,
	getNotes,
	deleteNote,
	updateNote,
};
