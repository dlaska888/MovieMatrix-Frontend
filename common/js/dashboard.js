import ApiClient from "./ApiClient.js";

const client = new ApiClient();
const userGenres = [28, 10749, 35];

init();

function init() {
	client
		.getTrendingMovies()
		.then((res) => {
			renderMovies(res.results);
		})
		.catch((error) => {
			console.error("Error:", error);
		});

	initOptionButtons();
}

function initOptionButtons() {
	const buttons = document.querySelectorAll(".option");
	buttons.forEach((button) => {
		button.addEventListener("click", async (event) => {
			buttons.forEach((b) => b.classList.remove("active"));
			event.target.classList.add("active");
		});
	});

	const popularButton = document.querySelector("#popular");
	popularButton.addEventListener("click", async () => {
		const movies = await client.getPopularMovies();
		renderMovies(movies.results);
	});

	const trendingButton = document.querySelector("#trending");
	trendingButton.addEventListener("click", async () => {
		const movies = await client.getTrendingMovies();
		renderMovies(movies.results);
	});

	const topRatedButton = document.querySelector("#top-rated");
	topRatedButton.addEventListener("click", async () => {
		const movies = await client.getTopRatedMovies();
		renderMovies(movies.results);
	});
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

function renderMovies(movies) {
	const moviesContainer = document.querySelector("#movies-container");
	moviesContainer.innerHTML = "";

	movies.forEach(async (movie) => {
		const movieDetails = await client.getMovieDetails(movie.id);
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
            <span>${movie.release_date} ‧ ${movieDetails.genres
			.slice(0, 2)
			.map((m) => m.name)
			.join("/")}</span>
            <br>
            <div style="margin-top: 1rem;">
              <span
                style="background-color: #deb522; color: black; border-radius: 1px; padding: 2px; font-family: 'Amazon Ember Display', sans-serif; font-weight: 1000; font-size: 15px;">IMDb</span><span>
                ${movie.vote_average}/10</span>
              &nbsp;
              <span><i class="bi bi-star-fill" style="color: #deb522;"></i> ${
					movie.popularity
				}/10</span>
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
}

function renderMovieDetails(movieDetails) {
	var movieOffcanvas = document.createElement("div");
	movieOffcanvas.innerHTML = `
		<div id="movie-details-canvas" class="offcanvas offcanvas-end w-100" data-bs-backdrop="false" tabindex="-1" id="offcanvasScrolling"
		  aria-labelledby="offcanvasScrollingLabel">
		  <div class="offcanvas-header">
			<h5 class="offcanvas-title" id="offcanvasScrollingLabel">${
				movieDetails.title
			}</h5>
			<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
		  </div>
		  <div class="offcanvas-body">
			<div class="col px-3">
			  <div class="row d-flex justify-content-center gap-2 mb-5">
				<div class="col flex-center">
				  <button type="button" class="offcanvas-btn btn btn-outline-secondary btn-lg active">About</button>
				</div>
				<div class="col flex-center">
				  <a name="" id="" class="offcanvas-btn btn btn-outline-secondary btn-lg" href="#" role="button">Where to
					watch</a>
				</div>
				<div class="col d-flex flex-center gap-3">
				  <h2 class="mb-0">${movieDetails.vote_average.toFixed(1)}/10</h2>
				  <i class="bi bi-star-fill text-primary fs-1 mb-1"></i>
				</div>
			  </div>
			  <div class="row d-flex flex-column-reverse flex-xl-row gap-5 flex-center">
				<div class="col col-12 col-xl-6">
				  <h2>${movieDetails.title}</h2>
				  <p class="text-justify my-5">${movieDetails.overview}</p>
				  <p><span class="h3 text-primary">Director&emsp;</span>${
						movieDetails.director
					}</p>
				  <p><span class="h3 text-primary">Release date&emsp;</span>${
						movieDetails.release_date
					}</p>
				  <p><span class="h3 text-primary">Genres&emsp;</span>${movieDetails.genres
						.map((genre) => genre.name)
						.join(", ")}</p>
				</div>
				<div class="col col-12 col-xl-5 d-flex justify-content-center">
				  <div class="movie-image">
					<img src="https://image.tmdb.org/t/p/w500${
						movieDetails.poster_path
					}" class="img-fluid rounded-3"
					  alt="Movie Scene">
				  </div>
				</div>
			  </div>
			</div>
		  </div>
		</div>`;
		
	movieOffcanvas = movieOffcanvas.firstElementChild;
	document.querySelector("#movie-details-canvas")?.remove();
	document.body.appendChild(movieOffcanvas);
	
	initOffcanvasButtons();

	var bsOffcanvas = new bootstrap.Offcanvas(movieOffcanvas);
	bsOffcanvas.show();
}
