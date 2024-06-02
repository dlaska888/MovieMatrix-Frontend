import ApiClient from "./helpers/ApiClient.js";
import MockUserAPI from "./mock/MockUserApi.js";
import NotificationService from "./helpers/NotificationService.js";
import MovieListBuilder from "./helpers/MovieListBuilder.js";

const MoviesChoice = (function () {
	const client = new ApiClient();
	const userApi = MockUserAPI.getInstance();
	let selectedMoviesIds = [];
	let loading = false;
	let searchTimer = null;

	function init() {
		const user = userApi.getCurrentUser();
		if (!user) {
			window.location.href = "login.html";
			return;
		}

		this.selectedMoviesIds = user.movies;

		client
			.getMoviesByGenres(user.genres)
			.then(async (res) => {
				const selectedMovies = await client.getMoviesByIds(user.movies);
				renderMovies(selectedMovies.concat(res.results));
				selectedMovies.forEach((movie) => {
					selectMovie(movie.id);
				});
				const movieListBuilder = new MovieListBuilder((page) => {
					fetchAndAddMovies(client.getMoviesByGenres(user.genres, page));
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
			const user = userApi.getCurrentUser();
			user.movies = selectedMoviesIds;
			userApi.updateUser(user.id, user);

			NotificationService.notify("Movies saved successfully!", "green");
			setTimeout(() => {
				window.location.href = "dashboard.html";
			}, 1000);
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
		if (loading) {
			return;
		}

		loading = true;
		query = query.trim();
		clearMovies();
		try {
			const user = userApi.getCurrentUser();
			const selectedMovies = await client.getMoviesByIds(
				selectedMoviesIds
			);

			if (!query) {
				const res = await client.getMoviesByGenres(user.genres);
				renderMovies(selectedMovies.concat(res.results));
				selectedMovies.forEach((movie) => {
					selectMovie(movie.id);
				});
				const movieListBuilder = new MovieListBuilder((page) => {
					fetchAndAddMovies(client.getPopularMovies(page));
				}, 2);
				document
					.querySelector("#movie-list")
					.addEventListener("scroll", () => {
						movieListBuilder.handleScroll();
					});
			} else {
				const res = await client.getMoviesBySearch(query);
				renderMovies(res.results);
				res.results.forEach((movie) => {
					if (selectedMoviesIds.includes(movie.id)) {
						selectMovie(movie.id);
					}
				});
			}
		} finally {
			loading = false;
		}
	}

	function fetchAndAddMovies(apiCall) {
		apiCall
			.then((res) => {
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
				if (selectedMoviesIds.includes(movie.id)) {
					unselectMovie(movie.id);
					return;
				}

				if (selectedMoviesIds.length >= 5) {
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
		if (!selectedMoviesIds.includes(movieId)) {
			selectedMoviesIds.push(movieId);
		}
		document.getElementById(`card-${movieId}`).classList.add("selected");
		document.getElementById("movie-counter").innerHTML =
			selectedMoviesIds.length;
	}

	function unselectMovie(movieId) {
		selectedMoviesIds.splice(selectedMoviesIds.indexOf(movieId), 1);
		document.getElementById(`card-${movieId}`).classList.remove("selected");
		document.getElementById("movie-counter").innerHTML =
			selectedMoviesIds.length;
	}

	return {
		init,
	};
})();

export default MoviesChoice;

MoviesChoice.init();
