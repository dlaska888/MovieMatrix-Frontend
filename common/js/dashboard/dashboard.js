import Home from "./home.js";
import Discover from "./discover.js";
import Watched from "./watched.js";
import ApiClient from "../ApiClient.js";
import StringHelper from "../StringHelper.js";

const Dashboard = (function () {
	const client = new ApiClient();
	const pageContent = document.querySelector("#page-content");
	let loading = false;
	let searchTimer = null;

	function init() {
		Home.init();
		initNavButtons();
	}

	function initNavButtons() {
		const buttons = document.querySelectorAll(".nav-btn");
		buttons.forEach((button) => {
			button.addEventListener("click", async (event) => {
				buttons.forEach((b) => b.classList.remove("active"));
				event.target.classList.add("active");
			});
		});

		const homeButton = document.querySelector("#nav-home-btn");
		homeButton.addEventListener("click", () => {
			Home.init();
		});

		const discoverButton = document.querySelector("#nav-discover-btn");
		discoverButton.addEventListener("click", () => {
			Discover.init();
		});

		const watchedButton = document.querySelector("#nav-watched-btn");
		watchedButton.addEventListener("click", () => {
			Watched.init();
		});
	}

	function renderOptionButtons() {
		document.querySelector("#top-options")?.remove();

		let buttonsContainer = document.createElement("div");
		buttonsContainer.innerHTML = `
		<div id="top-options" class="top-options gap-3 px-2 mb-4 hide-scroll">
			<button id="popular" type="button" class="option active">Popular</button>
			<button id="trending" type="button" class="option">Trending</button>
			<button id="top-rated" type="button" class="option">Top Rated</button>
			<button type="button" class="option">Series</button>
			<button type="button" class="option">Horror</button>
    	</div>`;
		buttonsContainer = buttonsContainer.firstElementChild;

		const buttons = buttonsContainer.querySelectorAll(".option");
		buttons.forEach((button) => {
			button.addEventListener("click", async (event) => {
				buttons.forEach((b) => b.classList.remove("active"));
				event.target.classList.add("active");
			});
		});

		const popularButton = buttonsContainer.querySelector("#popular");
		popularButton.addEventListener("click", async () => {
			const movies = await client.getPopularMovies();
			renderMovies(movies.results);
		});

		const trendingButton = buttonsContainer.querySelector("#trending");
		trendingButton.addEventListener("click", async () => {
			const movies = await client.getTrendingMovies();
			renderMovies(movies.results);
		});

		const topRatedButton = buttonsContainer.querySelector("#top-rated");
		topRatedButton.addEventListener("click", async () => {
			const movies = await client.getTopRatedMovies();
			renderMovies(movies.results);
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
			clearTimeout(searchTimer); // Clear the previous timer

			searchTimer = setTimeout(() => {
				search(event.target.value.trim());
			}, 500); // Adjust the delay as needed
		});

		pageContent.appendChild(searchBar);
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
		document.querySelector("#movies-container")?.parentElement.remove();

		let moviesContainerWrapper = document.createElement("div");
		moviesContainerWrapper.innerHTML = `
		<div class="container-fluid d-flex justify-content-center">
			<div id="movies-container" class="row justify-content-center gap-4 gap-md-5 w-100 hide-scroll"></div>
	  	</div>`;
		moviesContainerWrapper = moviesContainerWrapper.firstElementChild;
		const moviesContainer = moviesContainerWrapper.firstElementChild;

		if (!movies || movies.length === 0) {
			moviesContainer.innerHTML = `<div class="col-12 text-center mt-5"><h2>No movies found</h2></div>`;
			pageContent.appendChild(moviesContainerWrapper);
			return;
		}

		movies.forEach(async (movie) => {
			const movieDetails = await client.getMovieDetails(movie.id);
			const watchProviders = await client.getWatchProviders(movie.id);
			if (watchProviders.results.US) {
				movieDetails.watchProviders =
					watchProviders.results.US.buy ??
					watchProviders.results.US.rent ??
					[];
			}
			movieDetails.director = await client.getMovieDirector(movie.id);

			var movieElement = document.createElement("div");
			movieElement.innerHTML = `
			<div class="movie-card col-12 col-md-2 col-lg-4">
			<div class="movie-image">
			<img src="https://image.tmdb.org/t/p/w500${
				movie.poster_path
			}" class="movie-image" alt="Movie Scene">
			</div>
			<div class="info-section d-flex flex-column justify-content-evenly w-100">
			<div class="movie-title">
				<h4>${movie.title}</h4>
			</div>
			<hr>
			<div class="card-info">
				<span class="fs-5">${StringHelper.formatShortDate(
					movie.release_date
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
		</div> 
        `;
			movieElement = movieElement.firstElementChild;
			movieElement.addEventListener("click", () => {
				renderMovieDetails(movieDetails);
			});
			moviesContainer.appendChild(movieElement);
		});
		pageContent.appendChild(moviesContainerWrapper);
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
				renderMovieDetailsWatch(movieDetails.watchProviders)
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
					movieDetails.director.name
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
					alt="Movie Scene">
				</div>
			</div>
		</div>`;
		aboutSection = aboutSection.firstElementChild;
		return aboutSection;
	}

	function renderMovieDetailsWatch(watchProviders) {
		console.log(watchProviders);
		var watchProvidersSection = document.createElement("div");
		watchProvidersSection.classList.add(
			"row",
			"g-5",
			"d-flex",
			"justify-content-center",
			"align-items-center",
			"p-5",
			"m-5"
		);
		watchProviders
			.map((provider) => {
				return `
			<div class="col flex-center">
				<a href="${provider.url}" target="_blank">
					<img src="https://image.tmdb.org/t/p/w500${provider.logo_path}" alt="${provider.provider_name}" class="watch-provider-logo">
				</a>
			</div>
		`;
			})
			.forEach((provider) => {
				watchProvidersSection.innerHTML += provider;
			});
		return watchProvidersSection;
	}

	function clearPageContent() {
		pageContent.innerHTML = "";
	}

	return {
		init,
		renderOptionButtons,
		renderSearchBar,
		renderMovies,
		renderMovieDetails,
		renderMovieDetailsAbout,
		renderMovieDetailsWatch,
		clearPageContent,
	};
})();

export default Dashboard;

Dashboard.init();
