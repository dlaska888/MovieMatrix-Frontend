import ApiClient from "../ApiClient.js";
import Dashboard from "./dashboard.js";

const userGenres = [28, 10749, 35];

const Watched = (function () {
	const client = new ApiClient();

	function init() {
		Dashboard.clearPageContent();

		client
			.getTrendingMovies()
			.then((res) => {
				Dashboard.renderMovies(res.results);
			})
			.catch((error) => {
				console.error("Error:", error);
			});

	}

	return {
		init,
	};
})();

export default Watched;
