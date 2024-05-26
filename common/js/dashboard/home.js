import ApiClient from "../helpers/ApiClient.js";
import Dashboard from "./dashboard.js";

const userGenres = [28, 10749, 35];

const Home = (function () {
	const client = new ApiClient();

	function init() {
		Dashboard.clearPageContent();

		Dashboard.renderOptionButtons();
		Dashboard.renderSearchBar();

		client
			.getTrendingMovies()
			.then((res) => {
				Dashboard.renderMovies(res.results);
			})
			.catch((error) => {
				console.error("Error:", error);
				Dashboard.renderMovies([]);
			});
	}

	return {
		init,
	};
})();

export default Home;
