import ApiClient from "../helpers/ApiClient.js";
import Dashboard from "./dashboard.js";

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
