import ApiClient from "./ApiClient.js";

const client = new ApiClient();
const userGenres = [28, 10749, 35];
let loading = false;
let searchTimer = null;

init();

function init() {
	client
		.getTrendingMovies()
		.then((res) => {
			displayMovies(res.results);
		})
		.catch((error) => {
			console.error("Error:", error);
		});

	initSearch();
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
		const res = await client.getMoviesBySearch(query);
		displayMovies(res.results);
	} finally {
		loading = false; // Re-enable the button after fetch completes
	}
}

function displayMovies(movies) {
	const movieList = document.getElementById("movie-list");
	movieList.innerHTML = ""; // Clear the previous results

	movies.forEach((movie) => {
		let movieCard = document.createElement("div");
		movieCard.innerHTML = `
        <div class="col-xl-3 col-lg-4 col-md-6 mb-4">
            <div class="card">
                <div class="card-body">
                    <p>${movie.title}</p>
                </div>
            </div>
        </div>`;
		movieCard = movieCard.firstElementChild;

		const card = movieCard.querySelector(".card");
		card.style.backgroundImage = `url(https://image.tmdb.org/t/p/w300${movie.poster_path})`;

		movieList.appendChild(movieCard);
	});
}
