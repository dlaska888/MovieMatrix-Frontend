import ApiClient from "../helpers/ApiClient.js";
import Dashboard from "./dashboard.js";
import MovieListBuilder from "../helpers/MovieListBuilder.js";

const Discover = (function () {
	const client = new ApiClient();

	function init() {
		const movieListBuilder = new MovieListBuilder(addNowPlayingMovies, 2);

		Dashboard.clearPageContent();
		Dashboard.renderOptionButtons();
		Dashboard.renderSearchBar();

		client
			.getNowPlayingMovies()
			.then((res) => {
				Dashboard.renderDiscoverMovies(res.results);
				document
					.querySelector("#movies-container")
					.addEventListener("scroll", () => {
						movieListBuilder.handleScroll();
					});
			})
			.catch((error) => {
				console.error("Error:", error);
				Dashboard.renderHomeMovies([]);
			});
	}

	function addNowPlayingMovies(page) {
		client
			.getTrendingMovies(page)
			.then((res) => {
				Dashboard.addDiscoverMovies(res.results);
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

export default Discover;
