import Dashboard from "./dashboard.js";
import UserApiClient from "../api/UserApiClient.js";
import ApiClient from "../api/TmdbApiClient.js";

const Favourites = (function () {
	const client = new ApiClient();
	const userApi = new UserApiClient();

	async function init() {
		Dashboard.clearPageContent();
		const user = await userApi.getCurrentUser();

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
