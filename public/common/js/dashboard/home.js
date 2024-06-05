import Dashboard from "./dashboard.js";
import MovieListBuilder from "../helpers/MovieListBuilder.js";
import TmdbApiClient from "../api/TmdbApiClient.js";
import UserApiClient from "../api/UserApiClient.js";

const Home = (function () {
	const userApi = new UserApiClient();
	let tmdbApi = null;
	let user = null;

	async function init() {
		user = await userApi.getCurrentUser();
		tmdbApi = new TmdbApiClient(user);

		const movieListBuilder = new MovieListBuilder(addMovies, 2);

		Dashboard.clearPageContent();
		Dashboard.renderSettingsButton();

		tmdbApi
			.getMoviesWithPreferences(user.moviePreferences, user.categories)
			.then((res) => {
				Dashboard.renderHomeMovies(res);
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

	function addMovies(page) {
		tmdbApi
			.getMoviesWithPreferences(user.moviePreferences, user.categories, page)
			.then((res) => {
				Dashboard.addHomeMovies(res);
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

export default Home;
