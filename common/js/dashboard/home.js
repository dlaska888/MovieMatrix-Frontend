import ApiClient from "../helpers/ApiClient.js";
import Dashboard from "./dashboard.js";
import MockUserAPI from "../mock/MockUserApi.js";

const Home = (function () {
	const client = new ApiClient();
	const userApi = new MockUserAPI();
	const user = userApi.getCurrentUser();

	function init() {
		Dashboard.clearPageContent();

		Dashboard.renderOptionButtons();
		Dashboard.renderSearchBar();
		Dashboard.renderSettingsButton();


		client
			.getMoviesWithPreferences(user.movies, user.genres)
			.then((res) => {
				Dashboard.renderMovies(res);
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
