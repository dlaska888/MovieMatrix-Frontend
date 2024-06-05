import NotificationService from "./helpers/NotificationService.js";
import MovieListBuilder from "./helpers/MovieListBuilder.js";
import TmdbApiClient from "./api/TmdbApiClient.js";
import UserApiClient from "./api/UserApiClient.js";

const MoviesChoice = (function () {
	const userApi = new UserApiClient();
	let tmdbApi = null;
	let selectedMovieIds = [];
	let loading = false;
	let searchTimer = null;

	async function init() {
		if (!(await userApi.isUserLoggedIn())) {
			window.location.href = "login.html";
			return;
		}

		const user = await userApi.getCurrentUser();
		tmdbApi = new TmdbApiClient(user);

		this.selectedMoviesIds = user.moviePreferences;

		tmdbApi
			.getMoviesByGenres(user.categories)
			.then(async (res) => {
				const selectedMovies = await tmdbApi.getMoviesByIds(
					user.moviePreferences
				);
				renderMovies(selectedMovies.concat(res.results));
				selectedMovies.forEach((movie) => {
					selectMovie(movie.id);
				});
				const movieListBuilder = new MovieListBuilder((page) => {
					fetchAndAddMovies(
						tmdbApi.getMoviesByGenres(user.categories, page)
					);
				}, 2);
				document
					.querySelector("#movies-container")
					.addEventListener("scroll", () => {
						movieListBuilder.handleScroll();
					});
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
			userApi
				.updatePreferenceMovies(selectedMovieIds)
				.then(() => {
					NotificationService.notify(
						"Genres saved successfully!",
						"green"
					);
					setTimeout(() => {
						window.location.href = "dashboard.html";
					}, 1000);
				})
				.catch((error) => {
					console.error("Error:", error);
					NotificationService.notify(
						"An error occurred. Please try again later.",
						"red"
					);
				});
		});
	}

	function initSearch() {
		const searchBar = document.getElementById("search-bar");

		searchBar.addEventListener("input", (event) => {
			event.preventDefault();
			clearTimeout(searchTimer);
			searchTimer = setTimeout(() => {
				search(event.target.value);
			}, 500);
		});

		searchBar.addEventListener("submit", (e) => {
			e.preventDefault();
		});
	}

	async function search(query) {
		if (loading) return;

		loading = true;
		query = query.trim();
		clearMovies();

		try {
			const user = await userApi.getCurrentUser();
			const selectedMovies = await tmdbApi.getMoviesByIds(
				selectedMovieIds
			);
			const movieContainer = document.querySelector("#movies-container");
			movieContainer.replaceWith(movieContainer.cloneNode(true));

			let res;
			if (!query) {
				res = await tmdbApi.getMoviesByGenres(user.categories);
				renderMovies(selectedMovies.concat(res.results));
				selectedMovies.forEach((movie) => {
					selectMovie(movie.id);
				});
			} else {
				res = await tmdbApi.getMoviesBySearch(query);
				renderMovies(res.results);
			}

			const movieListBuilder = new MovieListBuilder((page) => {
				if (!query) {
					fetchAndAddMovies(tmdbApi.getPopularMovies(page));
				} else {
					fetchAndAddMovies(tmdbApi.getMoviesBySearch(query, page));
				}
			}, 2);

			document
				.querySelector("#movies-container")
				.addEventListener("scroll", () => {
					movieListBuilder.handleScroll();
				});
		} finally {
			loading = false;
		}
	}

	function fetchAndAddMovies(apiCall) {
		
		apiCall
			.then((res) => {
				if (res.results.length === 0) {
					document.querySelector("#loader").classList.add("d-none");
					console.log("sdfasdf")
					return;
				}
				renderMovies(res.results);
			})
			.catch((error) => {
				console.error("Error:", error);
				renderMovies([]);
			});
	}

	function clearMovies() {
		const movieList = document.getElementById("movie-list");
		movieList.innerHTML = "";
	}

	function renderMovies(movies) {
		const movieList = document.getElementById("movie-list");

		if (!movies || movies.length === 0) {
			movieList.innerHTML = `<div class="col-12 text-center m-2"><h2>No movies found</h2></div>`;
			return;
		}

		movies.forEach((movie) => {
			let movieCard = document.createElement("div");
			movieCard.innerHTML = `
			<div class="col col-xxl-3 col-xl-4 col-md-6 mb-4">
				<div id="card-${movie.id}" class="card">
					<div class="card-body">
						<p>${movie.title}</p>
					</div>
				</div>
			</div>`;
			movieCard = movieCard.firstElementChild;

			const card = movieCard.querySelector(".card");
			card.style.backgroundImage = `url(https://image.tmdb.org/t/p/w300${movie.poster_path})`;
			card.addEventListener("click", () => {
				if (selectedMovieIds.includes(movie.id)) {
					unselectMovie(movie.id);
					return;
				}

				if (selectedMovieIds.length >= 5) {
					NotificationService.notify(
						"Please select at most 5 movies",
						"red"
					);
					return;
				}

				selectMovie(movie.id);
			});

			movieList.appendChild(movieCard);
		});
	}

	function selectMovie(movieId) {
		if (!selectedMovieIds.includes(movieId)) {
			selectedMovieIds.push(movieId);
		}
		document.getElementById(`card-${movieId}`).classList.add("selected");
		document.getElementById("movie-counter").innerHTML =
			selectedMovieIds.length;
	}

	function unselectMovie(movieId) {
		selectedMovieIds.splice(selectedMovieIds.indexOf(movieId), 1);
		document.getElementById(`card-${movieId}`).classList.remove("selected");
		document.getElementById("movie-counter").innerHTML =
			selectedMovieIds.length;
	}

	return {
		init,
	};
})();

export default MoviesChoice;

await MoviesChoice.init();
