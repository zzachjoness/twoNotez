const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const connectRedis = require("connect-redis");
const Redis = require("ioredis");
const { __prod__, COOKIE_NAME } = require("./constants");
const { response } = require("express");
const users = require("./queries/users");
const notes = require("./queries/notes");

const app = express();
const port = process.env.PORT;
//bodyParser depreciated, need to find change
const jsonParser = bodyParser.json();
// if you run behind a proxy
//app.set("trust proxy", 1);

const RedisStore = connectRedis(session);
const redis = new Redis();

app.use(jsonParser);
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(
	cors({
		origin: [
			"http://127.0.0.1:80",
			"http://localhost",
			`http://127.0.0.1:${port}/`,
			`http://localhost:${port}/`,
		],
		credentials: true,
	})
);

app.use(
	session({
		name: COOKIE_NAME,
		store: new RedisStore({ client: redis, disableTouch: true }),
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
			//httpOnly: true, // if true: prevents client side JS from reading the cookie
			sameSite: "Lax", // csrf
			secure: __prod__, // set false for dev -> if true: only transmit cookie over https
		},
		saveUninitialized: false,
		secret: process.env.COOKIE_SECRET,
		resave: false,
	})
);

app.get("/", (_, res) => {
	res.json({
		info: "Node.js, Express, and Postgres API",
	});
});

// user http
app.post("/register", users.register);
app.post("/login", users.login);
app.get("/me", users.me);
app.get("/logout", users.logout);
// note http
app.post("/createNote", notes.createNote);
app.post("/deleteNote", notes.deleteNote);
app.post("/updateNote", notes.updateNote);
app.get("/getNotes", notes.getNotes);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
