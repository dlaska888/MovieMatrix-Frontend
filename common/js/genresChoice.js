import NotificationService from "./helpers/NotificationService.js";
import TmdbApiClient from "./api/TmdbApiClient.js";
import UserApiClient from "./api/UserApiClient.js";

const GenresChoice = (function () {
	const userApi = new UserApiClient();
	let tmdbApi = null;
	let selectedGenres = [];

	async function init() {
		if (!await userApi.isUserLoggedIn()) {
			window.location.href = "login.html";
			return;
		}

		const user = await userApi.getCurrentUser();
		tmdbApi = new TmdbApiClient(user);
		tmdbApi
			.getGenreList()
			.then((res) => {
				displayGenres(res.genres);
				user.categories.forEach((genreId) => {
					selectGenre(genreId);
				});
			})
			.catch((error) => {
				console.error("Error:", error);
			});

		initSaveButton();
	}

	function initSaveButton() {
		const saveButton = document.getElementById("save-btn");
		saveButton.addEventListener("click", () => {
			if (selectedGenres.length === 0) {
				NotificationService.notify(
					"Please select at least one genre",
					"red"
				);
				return;
			}

			userApi
				.updateGenres(selectedGenres)
				.then(() => {
					NotificationService.notify(
						"Genres saved successfully!",
						"green"
					);
					setTimeout(() => {
						window.location.href = "moviesChoice.html";
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

	function displayGenres(genres) {
		const genreList = document.getElementById("genre-list");
		genreList.innerHTML = "";

		genres.forEach((genre) => {
			let genreCard = document.createElement("div");
			genreCard.innerHTML = `
			<div class="col-xxl-3 col-xl-4 col-sm-6 mb-4">
				<div id="card-${genre.id}" class="card">
					<div class="card-body">
						<p>${genre.name}</p>
					</div>
				</div>
			</div>`;
			genreCard = genreCard.firstElementChild;
			genreCard.addEventListener("click", () => {
				if (selectedGenres.includes(genre.id)) {
					unselectGenre(genre.id);
					return;
				}

				if (selectedGenres.length >= 3) {
					NotificationService.notify(
						"Please select at most 3 genres",
						"red"
					);
					return;
				}

				selectGenre(genre.id);
			});

			const path = `../../common/assets/img/genres`;
			genreCard.firstElementChild.style.backgroundImage = `url(${path}/${genre.id}.jpg), url(${path}/${genre.id}.png), url(${path}/${genre.id}.webp), url(${path}/${genre.id}.jpeg), url(${path}/default.jpg)`;

			genreList.appendChild(genreCard);
		});
	}

	function selectGenre(genreId) {
		selectedGenres.push(genreId);
		document.getElementById(`card-${genreId}`).classList.add("selected");
		document.getElementById("genre-counter").innerHTML =
			selectedGenres.length;
	}

	function unselectGenre(genreId) {
		selectedGenres.splice(selectedGenres.indexOf(genreId), 1);
		document.getElementById(`card-${genreId}`).classList.remove("selected");
		document.getElementById("genre-counter").innerHTML =
			selectedGenres.length;
	}

	return {
		init,
	};
})();

export default GenresChoice;

await GenresChoice.init();
