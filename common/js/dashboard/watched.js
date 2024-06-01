import ApiClient from "../helpers/ApiClient.js";
import MockUserAPI from "../mock/MockUserApi.js";
import Dashboard from "./dashboard.js";

const Watched = (function () {
	const client = new ApiClient();
	const userApi = new MockUserAPI();

	function init() {
		Dashboard.clearPageContent();
		const user = userApi.getCurrentUser();

		client
			.getMoviesByIds(user.seenMovies)
			.then((res) => {
				Dashboard.renderWatchedMovies(res);
				Dashboard.removeLoader();
			})
			.catch((error) => {
				console.error("Error:", error);
				Dashboard.renderHomeMovies([]);
			});
	}

	return {
		init,
	};
})();

export default Watched;
