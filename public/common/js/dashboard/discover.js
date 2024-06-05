import Dashboard from "./dashboard.js";
import MovieListBuilder from "../helpers/MovieListBuilder.js";
import TmdbApiClient from "../api/TmdbApiClient.js";
import UserApiClient from "../api/UserApiClient.js";

const Discover = (function () {
	const userApi = new UserApiClient();
	let tmdbApi = null;


	async function init() {
		const user = await userApi.getCurrentUser();
		tmdbApi = new TmdbApiClient(user);

		const movieListBuilder = new MovieListBuilder(addNowPlayingMovies, 2);

		Dashboard.clearPageContent();
		Dashboard.renderOptionButtons();
		Dashboard.renderSearchBar();

		tmdbApi
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
		tmdbApi
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
