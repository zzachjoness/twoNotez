const { Pool } = require("pg");

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
});

const getNotes = async (req, res) => {
	const userID = req.session.userID;
	if (!userID) {
		return res.status(400).send({
			errors: [{ field: "me", message: "user not logged in" }],
		});
	}
	const text = "SELECT * FROM notes WHERE uid = $1";
	const values = [userID];
	try {
		const result = await pool.query(text, values);
		const notes = result.rows;
		return res.status(200).send({ notes });
	} catch (err) {
		return res.status(400).send({ error: err });
	}
};

const createNote = async (req, res) => {
	const text = `INSERT INTO notes(uid, last_updated) VALUES ($1, (to_timestamp(${Date.now()} / 1000.0))) RETURNING *`;
	const values = [req.session.userID];
	try {
		const result = await pool.query(text, values);
		const note = result.rows;
		return res.status(200).send({ note });
	} catch (err) {
		return res.status(400).send({ error: err });
	}
};

const deleteNote = async (req, res) => {
	const nid = req.body.nid;
	const text = `DELETE FROM notes WHERE nid = $1 RETURNING *`;
	const values = [nid];
	try {
		const result = pool.query(text, values);
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
	const text = `UPDATE notes SET (category, title, body, last_updated) 
			= ($1, $2, $3, (to_timestamp(${Date.now()} / 1000.0))) 
			WHERE nid = $4 RETURNING *`;
	const values = [category, title, body, nid];
	try {
		const result = await pool.query(text, values);
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
