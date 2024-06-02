import ApiClient from "../helpers/ApiClient.js";
import MockUserAPI from "../mock/MockUserApi.js";
import Dashboard from "./dashboard.js";

const Favourites = (function () {
	const client = new ApiClient();
	const userApi = new MockUserAPI();

	function init() {
		Dashboard.clearPageContent();
		const user = userApi.getCurrentUser();

		client
			.getMoviesByIds(user.favouriteMovies)
			.then((res) => {
				Dashboard.renderFavouriteMovies(res);
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

export default Favourites;
