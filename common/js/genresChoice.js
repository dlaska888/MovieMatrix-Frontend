import ApiClient from "./ApiClient.js";

const client = new ApiClient();
const userGenres = [28, 10749, 35];

init();

function init() {
	client
		.getGenreList()
		.then((res) => {
			displayGenres(res.genres);
		})
		.catch((error) => {
			console.error("Error:", error);
		});
}

function displayGenres(genres) {
    console.log (genres);
	const genreList = document.getElementById("genre-list");
	genreList.innerHTML = ""; // Clear the previous results

	genres.forEach((genre) => {
		let genreCard = document.createElement("div");
		genreCard.innerHTML = `
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card">
                <div class="card-body">
                    <p>${genre.name}</p>
                </div>
            </div>
        </div>`;
		genreCard = genreCard.firstElementChild;
		genreList.appendChild(genreCard);
	});
}
