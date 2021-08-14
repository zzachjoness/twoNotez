const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const BodyParser = require("body-parser");
const CookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const connectRedis = require("connect-redis");
const Redis = require("ioredis");
const { __prod__, COOKIE_NAME } = require("./constants");
const { response } = require("express");
const users = require("./queries/users");
const notes = require("./queries/notes");
const { celebrate, Joi, errors, Segments } = require("celebrate");
const { JSONCookie } = require("cookie-parser");

const app = express();
const port = process.env.PORT;

const RedisStore = connectRedis(session);
const redis = new Redis();

app.use(BodyParser.json());
app.use(CookieParser());
app.use(
	express.urlencoded({
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
//app.post("/register", users.register);
app.post(
	"/register",
	celebrate({
		[Segments.BODY]: Joi.object().keys({
			email: Joi.string().required(),
			username: Joi.string().required(),
			password: Joi.string().required(),
		}),
	}),
	users.register
);
//app.post("/login", users.login);
app.post(
	"/login",
	celebrate({
		[Segments.BODY]: Joi.object().keys({
			emailOrUsername: Joi.string().required(),
			password: Joi.string().required(),
		}),
	}),
	users.login
);
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
