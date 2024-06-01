import ApiClient from "../helpers/ApiClient.js";
import Dashboard from "./dashboard.js";
import MockUserAPI from "../mock/MockUserApi.js";
import MovieListBuilder from "../helpers/MovieListBuilder.js";

const Home = (function () {
	const client = new ApiClient();
	const userApi = new MockUserAPI();
	const user = userApi.getCurrentUser();

	function init() {
		const movieListBuilder = new MovieListBuilder(addMovies, 2);

		Dashboard.clearPageContent();
		Dashboard.renderSettingsButton();

		client
			.getMoviesWithPreferences(user.movies, user.genres)
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
		client
			.getMoviesWithPreferences(user.movies, user.genres, page)
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
