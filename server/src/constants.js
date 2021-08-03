const __prod__ = process.env.NODE_ENV === "production";
const COOKIE_NAME = "qid";

module.exports = {
	__prod__,
	COOKIE_NAME,
};
