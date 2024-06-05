import Home from "./home.js";
import Discover from "./discover.js";
import Watched from "./watched.js";
import StringHelper from "../helpers/StringHelper.js";
import UserLocationResolver from "../helpers/UserLocationResolver.js";
import MovieListBuilder from "../helpers/MovieListBuilder.js";
import Favourites from "./favourites.js";
import NotificationService from "../helpers/NotificationService.js";
import MyProfile from "./my-profile.js";
import UserApiClient from "../api/UserApiClient.js";
import TmdbApiClient from "../api/TmdbApiClient.js";

const Dashboard = (function () {
	const userApi = new UserApiClient();
	const userRegionResolver = new UserLocationResolver();
	let tmdbApi = null
	let user = null;

	const pageContent = document.querySelector("#page-content");
	let loading = false;
	let searchTimer = null;

	async function init() {
		user = await userApi.getCurrentUser();
		tmdbApi = new TmdbApiClient(user);
		Home.init();
		initNavButtons();
	}

	function initNavButtons() {
		const buttons = document.querySelectorAll(".nav-btn");
		buttons.forEach((button) => {
			button.addEventListener("click", async (event) => {
				buttons.forEach((b) => b.classList.remove("active"));
				event.target.classList.add("active");
				user = await userApi.getCurrentUser();
			});
		});

		const homeButtons = document.querySelectorAll(".nav-home-btn");
		homeButtons.forEach((button) => {
			button.addEventListener("click", async () => {
				await Home.init();
			});
		});

		const discoverButtons = document.querySelectorAll(".nav-discover-btn");
		discoverButtons.forEach((button) => {
			button.addEventListener("click", async () => {
				await Discover.init();
			});
		});

		const favouritesButtons = document.querySelectorAll(".nav-favourites-btn");
		favouritesButtons.forEach((button) => {
			button.addEventListener("click", async () => {
				await Favourites.init();
			});
		});

		const watchedButtons = document.querySelectorAll(".nav-watched-btn");
		watchedButtons.forEach((button) => {
			button.addEventListener("click", async () => {
				await Watched.init();
			});
		});

		const profileButtons = document.querySelectorAll(".nav-my-profile-btn");
		profileButtons.forEach((button) => {
			button.addEventListener("click", async () => {
				await MyProfile.init();
			});
		});

		const logoutButtons = document.querySelectorAll(".nav-logout-btn");
		logoutButtons.forEach((button) => {
			button.addEventListener("click", async () => {
				await userApi.logout();
				window.location.href = "login.html";
			});
		});
	}

	function renderOptionButtons() {
		document.querySelector("#top-options")?.remove();

		let buttonsContainer = document.createElement("div");
		buttonsContainer.innerHTML = `
		<div id="top-options" class="top-options gap-3 px-2 mb-4 hide-scroll">
			<button id="now-playing" type="button" class="option active">Now playing</button>
			<button id="popular" type="button" class="option">Popular</button>
			<button id="trending" type="button" class="option">Trending</button>
			<button id="top-rated" type="button" class="option">Top Rated</button>
			<button id="upcoming" type="button" class="option">Upcoming</button>
    	</div>`;
		buttonsContainer = buttonsContainer.firstElementChild;

		const buttons = buttonsContainer.querySelectorAll(".option");
		buttons.forEach((button) => {
			button.addEventListener("click", async (event) => {
				buttons.forEach((b) => b.classList.remove("active"));
				event.target.classList.add("active");
			});
		});

		const nowPlayingButton = buttonsContainer.querySelector("#now-playing");
		nowPlayingButton.addEventListener("click", async () => {
			const res = await tmdbApi.getNowPlayingMovies();
			const movieListBuilder = new MovieListBuilder((page) => {
				fetchAndAddMovies(tmdbApi.getNowPlayingMovies(page));
			}, 2);
			renderDiscoverMovies(res.results);
			document
				.querySelector("#movies-container")
				.addEventListener("scroll", () => {
					movieListBuilder.handleScroll();
				});
		});

		const popularButton = buttonsContainer.querySelector("#popular");
		popularButton.addEventListener("click", async () => {
			const res = await tmdbApi.getPopularMovies();
			const movieListBuilder = new MovieListBuilder((page) => {
				fetchAndAddMovies(tmdbApi.getPopularMovies(page));
			}, 2);
			renderDiscoverMovies(res.results);
			document
				.querySelector("#movies-container")
				.addEventListener("scroll", () => {
					movieListBuilder.handleScroll();
				});
		});

		const trendingButton = buttonsContainer.querySelector("#trending");
		trendingButton.addEventListener("click", async () => {
			const res = await tmdbApi.getTrendingMovies();
			const movieListBuilder = new MovieListBuilder((page) => {
				fetchAndAddMovies(tmdbApi.getTrendingMovies(page));
			}, 2);
			renderDiscoverMovies(res.results);
			document
				.querySelector("#movies-container")
				.addEventListener("scroll", () => {
					movieListBuilder.handleScroll();
				});
		});

		const topRatedButton = buttonsContainer.querySelector("#top-rated");
		topRatedButton.addEventListener("click", async () => {
			const res = await tmdbApi.getTopRatedMovies();
			const movieListBuilder = new MovieListBuilder((page) => {
				fetchAndAddMovies(tmdbApi.getTopRatedMovies(page));
			}, 2);
			renderDiscoverMovies(res.results);
			document
				.querySelector("#movies-container")
				.addEventListener("scroll", () => {
					movieListBuilder.handleScroll();
				});
		});

		const upcomingButton = buttonsContainer.querySelector("#upcoming");
		upcomingButton.addEventListener("click", async () => {
			const res = await tmdbApi.getUpcomingMovies();
			const movieListBuilder = new MovieListBuilder((page) => {
				fetchAndAddMovies(tmdbApi.getUpcomingMovies(page));
			}, 2);
			renderDiscoverMovies(res.results);
			document
				.querySelector("#movies-container")
				.addEventListener("scroll", () => {
					movieListBuilder.handleScroll();
				});
		});

		pageContent.appendChild(buttonsContainer);
	}

	function renderSearchBar() {
		document.querySelector(".search_bar")?.remove();

		let searchBar = document.createElement("div");
		searchBar.innerHTML = `
		<div class='search_bar mx-auto pb-4'>
      		<input id="search-bar" name="Search" type="text" placeholder="" />
      		<i class="bi bi-search"></i>
    	</div>`;
		searchBar = searchBar.firstElementChild;

		const input = searchBar.querySelector("#search-bar");

		input.addEventListener("input", (event) => {
			event.preventDefault();
			clearTimeout(searchTimer);
			searchTimer = setTimeout(() => {
				search(event.target.value);
			}, 500);
		});

		pageContent.appendChild(searchBar);
	}

	async function search(query) {
		if (loading) {
			return;
		}

		loading = true;
		query = query.trim();
		try {
			if (!query) {
				const res = await tmdbApi.getPopularMovies();
				const movieListBuilder = new MovieListBuilder((page) => {
					fetchAndAddMovies(tmdbApi.getPopularMovies(page));
				}, 2);
				renderDiscoverMovies(res.results);
				document
					.querySelector("#movies-container")
					.addEventListener("scroll", () => {
						movieListBuilder.handleScroll();
					});
			} else {
				const res = await tmdbApi.getMoviesBySearch(query);
				const movieListBuilder = new MovieListBuilder((page) => {
					fetchAndAddMovies(tmdbApi.getMoviesBySearch(query, page));
				}, 2);
				renderDiscoverMovies(res.results);
				document
					.querySelector("#movies-container")
					.addEventListener("scroll", () => {
						movieListBuilder.handleScroll();
					});
			}
		} finally {
			loading = false; // Re-enable the button after fetch completes
		}
	}

	function fetchAndAddMovies(apiCall) {
		apiCall
			.then((res) => {
				addDiscoverMovies(res.results);
			})
			.catch((error) => {
				console.error("Error:", error);
				renderHomeMovies([]);
			});
	}

	async function renderSettingsButton() {
		let button = document.createElement("div");
		button.innerHTML = `
		<div class="dropup position-absolute bottom-0 end-0 m-4 m-lg-5">
			<button type="button" class="btn btn-success btn-lg dropdown-toggle hide-toggle" data-bs-toggle="dropdown" aria-expanded="false" aria-haspopup="true">
				<i class="fs-1 bi bi-gear"></i>
				<span class="visually-hidden">Add Category</span>
			</button>
			<ul class="dropdown-menu">
				<li>
					<a class="dropdown-item" href="moviesChoice.html">Change movies</a>
					<a class="dropdown-item" href="genresChoice.html">Change genres</a>
				</li>
			</ul>
		</div>`;
		button = button.firstElementChild;
		pageContent.appendChild(button);
	}

	function renderHomeMovies(movies) {
		renderMovies(movies, true, true, false);
	}

	function renderDiscoverMovies(movies) {
		renderMovies(movies, false, false, true);
	}

	function renderWatchedMovies(movies) {
		renderMovies(movies, true, false, false, true);
	}

	function renderFavouriteMovies(movies) {
		renderMovies(movies, true, false, false, false, true);
	}

	function addHomeMovies(movies) {
		addMoviesToContainer(movies, true);
	}

	function addDiscoverMovies(movies) {
		addMoviesToContainer(movies, false, true);
	}

	function renderMovies(
		movies,
		fullscreen = false,
		suggestions = false,
		discover = false,
		watched = false,
		favourites = false
	) {
		document.querySelector("#movies-container")?.parentElement.remove();

		let moviesContainerWrapper = document.createElement("div");
		moviesContainerWrapper.innerHTML = `
		<div class="container-fluid d-flex flex-column align-items-center">
			<div id="movies-container" class="row d-flex justify-content-center gap-4 gap-md-5 w-100 overflow-x-hidden">
				<div class="flex flex-center p-2">
					<span id="loader" class="fs-2 loader"></span>
				</div>
			</div>
	  	</div>`;
		moviesContainerWrapper = moviesContainerWrapper.firstElementChild;
		const moviesContainer = moviesContainerWrapper.firstElementChild;

		if (!movies || movies.length === 0) {
			moviesContainer.innerHTML = `<div class="col col-12 text-center mt-5"><h2>No movies found</h2></div>`;
			pageContent.appendChild(moviesContainerWrapper);
			return;
		}

		movies.forEach(async (movie) => {
			const movieElement = await renderMovie(
				movie,
				suggestions,
				discover,
				watched,
				favourites
			);
			moviesContainer.insertBefore(
				movieElement,
				moviesContainer.lastElementChild
			);
		});

		if (fullscreen) {
			moviesContainer.classList.add("fullscreen");
		}

		pageContent.appendChild(moviesContainerWrapper);
	}

	function addMoviesToContainer(
		movies,
		suggestions = false,
		discover = false,
		watched = false,
		favourites = false
	) {
		const moviesContainer = document.querySelector("#movies-container");
		movies.forEach(async (movie) => {
			const movieEl = await renderMovie(
				movie,
				watched,
				discover,
				suggestions,
				favourites
			);
			moviesContainer.insertBefore(
				movieEl,
				moviesContainer.lastElementChild
			);
		});
	}

	async function removeLoader() {
		document.querySelector("#loader")?.remove();
	}

	async function renderMovie(
		movie,
		suggestions = false,
		discover = false,
		watched = false,
		favourites = false
	) {
		const movieDetails = await tmdbApi.getMovieDetails(movie.id);
		movieDetails.watchProviders = await tmdbApi.getWatchProviders(movie.id);
		movieDetails.director = await tmdbApi.getMovieDirector(movie.id);

		var movieElement = document.createElement("div");
		movieElement.innerHTML = `
			<div class="movie-card col col-12 col-md-2 col-lg-4">
				<div class="movie-image">
					<img src="https://image.tmdb.org/t/p/w500${
						movieDetails.poster_path
					}" class="movie-image" alt="Movie Poster">
				</div>
				<div class="info-section d-flex flex-column justify-content-evenly w-100 h-100">
					<div class="movie-title">
						<h4 class="me-4">${movie.title}</h4>
					</div>
					<hr>
					<div class="card-info">
						<span class="fs-5">${StringHelper.formatShortDate(
							movieDetails.release_date
						)} ‧ ${movieDetails.genres
			.slice(0, 2)
			.map((m) => m.name)
			.join("/")}</span>
						<div class="mt-1">
							<span class="fs-6"><i class="bi bi-star-fill" style="color: #deb522;"></i>
								${movie.vote_average.toFixed(1)}/10
							</span>
						</div>
					</div>
				</div>
				
			</div>`;
		movieElement = movieElement.firstElementChild;

		movieElement.addEventListener("click", () => {
			renderMovieDetails(movieDetails);
		});

		let isFavMovie = user.favouriteMovies.includes(movie.id);

		let favButton = document.createElement("button");
		favButton.innerHTML = `<button class="fav-btn p-0 mx-3 mt-1"><i class="bi bi-star${
			isFavMovie ? "-fill" : ""
		}"></i></button>`;
		favButton = favButton.firstElementChild;

		let watchedButton = document.createElement("button");
		watchedButton.innerHTML = `<button class="close-btn p-0 mx-3 mt-1"><i class="bi bi-x-lg"></i></button>`;
		watchedButton = watchedButton.firstElementChild;

		if (suggestions) {
			favButton.addEventListener("click", async (event) => {
				event.stopPropagation();
				await userApi.addFavouriteMovie(movie.id);
				movieElement.remove();
				NotificationService.notify("Movie added to favourites");
			});
			movieElement.appendChild(favButton);

			watchedButton.addEventListener("click", async (event) => {
				event.stopPropagation();
				await userApi.addSeenMovie(movie.id);
				movieElement.remove();
				NotificationService.notify("Movie added to watched list");
			});
			movieElement.appendChild(watchedButton);
		}

		if (discover) {
			favButton.addEventListener("click", async (event) => {
				event.stopPropagation();
				if (isFavMovie) {
					await userApi.removeFavouriteMovie(movie.id);
					NotificationService.notify(
						"Movie removed from favourites",
						"red"
					);
					favButton.innerHTML = `<i class="bi bi-star
					"></i>`;
					isFavMovie = false;
				} else {
					await userApi.addFavouriteMovie(movie.id);
					NotificationService.notify("Movie added to favourites");
					favButton.innerHTML = `<i class="bi bi-star-fill"></i>`;
					isFavMovie = true;
				}
			});
			movieElement.appendChild(favButton);
		}

		if (watched) {
			watchedButton.addEventListener("click", async (event) => {
				event.stopPropagation();
				await userApi.removeSeenMovie(movie.id);
				movieElement.remove();
				NotificationService.notify(
					"Movie removed from watched list",
					"red"
				);
			});
			watchedButton.style.top = "0";
			movieElement.appendChild(watchedButton);
		}

		if (favourites) {
			favButton.addEventListener("click", async (event) => {
				event.stopPropagation();
				await userApi.removeFavouriteMovie(movie.id);
				movieElement.remove();
				NotificationService.notify(
					"Movie removed from favourites",
					"red"
				);
			});
			movieElement.appendChild(favButton);
		}

		return movieElement;
	}

	function renderMovieDetails(movieDetails) {
		document.querySelector("#movie-details-canvas")?.remove();

		var movieOffcanvas = document.createElement("div");
		movieOffcanvas.innerHTML = `
		<div id="movie-details-canvas" class="offcanvas offcanvas-end w-100" data-bs-backdrop="false" tabindex="-1" id="offcanvasScrolling"
		  aria-labelledby="offcanvasScrollingLabel">
		  <div class="offcanvas-header pb-0">
			<h5 class="offcanvas-title" id="offcanvasScrollingLabel">${
				movieDetails.title
			}</h5>
			<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
		  </div>
		  <div class="offcanvas-body">
			<div class="col px-3">
			  <div class="row d-flex justify-content-center gap-2 mb-4">
				<div class="col flex-center">
				  <button id="about-btn" type="button" class="offcanvas-btn btn btn-outline-secondary btn-lg active">About</button>
				</div>
				<div class="col flex-center">
				  <button id="watch-btn" class="offcanvas-btn btn btn-outline-secondary btn-lg" href="#" role="button">Where to watch
				  </button>
				</div>
				<div class="col d-flex flex-center gap-3">
				  <h2 class="mb-0">${movieDetails.vote_average.toFixed(1)}/10</h2>
				  <i class="bi bi-star-fill text-primary fs-1 mb-1"></i>
				</div>
			  </div>
			  <div id="content-section"></div>
			</div>
		  </div>
		</div>`;
		movieOffcanvas = movieOffcanvas.firstElementChild;
		document.body.appendChild(movieOffcanvas);

		const contentSection = document.querySelector("#content-section");
		contentSection.appendChild(renderMovieDetailsAbout(movieDetails));

		const aboutButton = document.querySelector("#about-btn");
		aboutButton.addEventListener("click", async () => {
			contentSection.innerHTML = "";
			contentSection.appendChild(renderMovieDetailsAbout(movieDetails));
		});

		const watchButton = document.querySelector("#watch-btn");
		watchButton.addEventListener("click", async () => {
			contentSection.innerHTML = "";
			contentSection.appendChild(
				await renderMovieDetailsWatch(movieDetails.watchProviders)
			);
		});

		initOffcanvasButtons();

		var bsOffcanvas = new bootstrap.Offcanvas(movieOffcanvas);
		bsOffcanvas.show();
	}

	function initOffcanvasButtons() {
		const offcanvasButtons = document.querySelectorAll(".offcanvas-btn");
		offcanvasButtons.forEach((button) => {
			button.addEventListener("click", async (event) => {
				offcanvasButtons.forEach((b) => b.classList.remove("active"));
				event.target.classList.add("active");
			});
		});
	}

	function renderMovieDetailsAbout(movieDetails) {
		var aboutSection = document.createElement("div");
		aboutSection.innerHTML = `
		<div class="row d-flex flex-column-reverse flex-xl-row gap-5 flex-center">
			<div class="col col-12 col-xl-6">
				<h2>${movieDetails.title}</h2>
				<p class="text-justify fs-5 my-5">${movieDetails.overview}</p>
				<h4 class="fw-normal"><span class="h3 text-primary">Director&emsp;</span>${
					movieDetails.director?.name ?? "Unknown"
				}
				</h4>
				<h4 class="fw-normal"><span class="h3 text-primary">Released&emsp;</span>
					${StringHelper.formatLongDate(movieDetails.release_date)}
				</h4>
				<h4 class="fw-normal"><span class="h3 text-primary">Genres&emsp;</span>${movieDetails.genres
					.map((genre) => genre.name)
					.join(", ")}
				</h4>
			</div>
			<div class="col col-12 col-xl-5 d-flex justify-content-center">
				<div class="movie-image">
					<img src="https://image.tmdb.org/t/p/w500${
						movieDetails.poster_path
					}" class="img-fluid rounded-3"
					alt="Movie Poster">
				</div>
			</div>
		</div>`;
		aboutSection = aboutSection.firstElementChild;
		return aboutSection;
	}

	async function renderMovieDetailsWatch(watchProviders) {
		const region = await userRegionResolver.getUserRegion();
		const watchForRegion = watchProviders.results[region];

		if (!watchForRegion) {
			const noWatchProvidersElement = document.createElement("div");
			noWatchProvidersElement.innerHTML = `<h2 class="col-12 text-center">No watch providers found in your region</h2>`;
			return noWatchProvidersElement.firstElementChild;
		}

		const watchListConcat = [
			...[
				...(watchForRegion.flatrate !== undefined
					? watchForRegion.flatrate
					: []),
				...(watchForRegion.rent !== undefined
					? watchForRegion.rent
					: []),
				...(watchForRegion.buy !== undefined ? watchForRegion.buy : []),
			].filter(
				(provider, index, self) =>
					self.findIndex(
						(p) => p.provider_name === provider.provider_name
					) === index
			),
		];

		const watchContainer = document.createElement("div");
		watchContainer.classList.add(
			"row",
			"g-5",
			"d-flex",
			"justify-content-center",
			"align-items-center",
			"pt-5"
		);
		watchListConcat
			.map((provider) => {
				return `
			<div class="col flex-center flex-column gap-4">
				<a href="${watchForRegion.link}" target="_blank">
					<img src="https://image.tmdb.org/t/p/w500${provider.logo_path}" alt="${provider.provider_name}" class="watch-provider-logo">
				</a>
				<h5 class="text-center">${provider.provider_name}</h5>

			</div>`;
			})
			.forEach((provider) => {
				watchContainer.innerHTML += provider;
			});
		return watchContainer;
	}

	function clearPageContent() {
		pageContent.innerHTML = "";
	}

	return {
		init,
		renderOptionButtons,
		renderSearchBar,
		renderSettingsButton,
		renderHomeMovies,
		renderDiscoverMovies,
		renderWatchedMovies,
		renderFavouriteMovies,
		renderMovie,
		removeLoader,
		addHomeMovies,
		addDiscoverMovies,
		renderMovieDetails,
		renderMovieDetailsAbout,
		renderMovieDetailsWatch,
		clearPageContent,
	};
})();

export default Dashboard;

const userApi = new UserApiClient();
if (!(await userApi.isUserLoggedIn())) {
	window.location.href = "login.html";
}

await Dashboard.init();
