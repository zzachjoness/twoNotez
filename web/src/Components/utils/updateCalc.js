const updateCalc = (mins) => {
	if (mins < 5) {
		return " recently";
	} else if (mins < 60) {
		return mins + " minutes ago";
	} else if (mins < 60 * 24) {
		return Math.floor(mins / 60) + " hours ago";
	} else {
		return Math.floor(mins / (60 * 24)) + " days ago";
	}
};

export default updateCalc;
