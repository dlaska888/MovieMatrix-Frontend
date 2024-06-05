import Dashboard from "./dashboard.js";
import UserApiClient from "../api/UserApiClient.js";
import ApiClient from "../api/TmdbApiClient.js";


const Watched = (function () {
	const tmdbApi = new ApiClient();
	const userApi = new UserApiClient();

	async function init() {
		Dashboard.clearPageContent();
		const user = await userApi.getCurrentUser();

		tmdbApi
			.getMoviesByIds(user.seenMovies)
			.then((res) => {
				Dashboard.renderWatchedMovies(res);
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

export default Watched;
