import Dashboard from "./dashboard.js";
import ApiClient from "../helpers/ApiClient.js";

const MyProfile = (function () {
	const client = new ApiClient();

	function init() {
		Dashboard.clearPageContent();
		// client
		// 	.getTrendingMovies()
		// 	.then((res) => {
		// 		Dashboard.renderMovies(res.results);
		// 	})
		// 	.catch((error) => {
		// 		console.error("Error:", error);
		// 	});
	}

	return {
		init,
	};
})();

export default MyProfile;
