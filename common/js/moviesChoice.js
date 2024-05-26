import ApiClient from "./helpers/ApiClient.js";
import MockUserAPI from "./mock/MockUserApi.js";
import NotificationService from "./helpers/NotificationService.js";

const MoviesChoice = (function () {
	const client = new ApiClient();
	const userApi = MockUserAPI.getInstance();
	const selectedMovies = [];
	let loading = false;
	let searchTimer = null;

	function init() {
		client
			.getTrendingMovies()
			.then((res) => {
				renderMovies(res.results);
			})
			.catch((error) => {
				console.error("Error:", error);
			});

		initSearch();
		initSaveButton();
	}

	function initSaveButton() {
		const saveButton = document.getElementById("save-btn");
		saveButton.addEventListener("click", () => {
			const user = userApi.getCurrentUser();
			user.movies = selectedMovies;
			user.firstTimeLogin = false;
			userApi.updateUser(user.id, user);
			NotificationService.notify("Genres saved successfully!", "green");
			setTimeout(() => {
				window.location.href = "dashboard.html";
			}, 1000);
		});
	}

	function initSearch() {
		const searchBar = document.getElementById("search-bar");

		searchBar.addEventListener("input", (event) => {
			event.preventDefault();
			clearTimeout(searchTimer); // Clear the previous timer

			searchTimer = setTimeout(() => {
				search(event.target.value);
			}, 500); // Adjust the delay as needed
		});
		searchBar.addEventListener("submit", (e) => {
			e.preventDefault();
		});
	}

	async function search(query) {
		if (loading) {
			return; // Do nothing if the button is disabled
		}

		loading = true; // Disable the button to prevent spamming
		try {
			if (!query) {
				const movies = await client.getTrendingMovies();
				renderMovies(movies.results);
			} else {
				const res = await client.getMoviesBySearch(query);
				renderMovies(res.results);
			}
		} finally {
			loading = false; // Re-enable the button after fetch completes
		}
	}

	function renderMovies(movies) {
		const movieList = document.getElementById("movie-list");
		movieList.innerHTML = ""; // Clear the previous results

		if (!movies || movies.length === 0) {
			movieList.innerHTML = `<div class="col-12 text-center m-2"><h2>No movies found</h2></div>`;
			return;
		}

		movies.forEach((movie) => {
			let movieCard = document.createElement("div");
			movieCard.innerHTML = `
        <div class="col-xxl-3 col-xl-4 col-md-6 mb-4">
            <div class="card">
                <div class="card-body">
                    <p>${movie.title}</p>
                </div>
            </div>
        </div>`;
			movieCard = movieCard.firstElementChild;

			const card = movieCard.querySelector(".card");
			card.style.backgroundImage = `url(https://image.tmdb.org/t/p/w300${movie.poster_path})`;
			card.addEventListener("click", () => {
				if (selectedMovies.includes(movie.id)) {
					card.classList.remove("selected");
					unselectMovie(movie.id);
					return;
				}

				if (selectedMovies.length >= 3) {
					NotificationService.notify(
						"Please select at most 3 movies",
						"red"
					);
					return;
				}

				card.classList.add("selected");
				selectMovie(movie.id);
			});

			movieList.appendChild(movieCard);
		});
	}

	function selectMovie(movieId) {
		selectedMovies.push(movieId);
		document.getElementById("movie-counter").innerHTML =
			selectedMovies.length;
	}

	function unselectMovie(movieId) {
		selectedMovies.splice(selectedMovies.indexOf(movieId), 1);
		document.getElementById("movie-counter").innerHTML =
			selectedMovies.length;
	}

	return {
		init,
	};
})();

export default MoviesChoice;

MoviesChoice.init();
