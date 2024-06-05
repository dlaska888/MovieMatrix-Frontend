class StringHelper {
	static formatShortDate(dateString) {
        const options = { year: "numeric", month: "short" };
		const date = new Date(dateString);
        return date.toLocaleDateString("en", options);
	}

    static formatLongDate(dateString) {
        const options = { day: "numeric", month: "long", year: "numeric" };
        const date = new Date(dateString);
        return date.toLocaleDateString("en", options);
    }

}
export default StringHelper;