const __prod__ = process.env.NODE_ENV === "production";
const COOKIE_NAME = "qid";
const FORGOT_PASSWORD_PREFIX = "Forgot_Password";

module.exports = {
	__prod__,
	COOKIE_NAME,
};
