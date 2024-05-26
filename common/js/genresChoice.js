import ApiClient from "./helpers/ApiClient.js";
import MockUserAPI from "./mock/MockUserApi.js";
import NotificationService from "./helpers/NotificationService.js";

const GenresChoice = (function () {
	const client = new ApiClient();
	const userApi = MockUserAPI.getInstance();
	let selectedGenres = [];

	function init() {
		client
			.getGenreList()
			.then((res) => {
				displayGenres(res.genres);
				userApi.getCurrentUser().genres.forEach((genreId) => {
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

			const user = userApi.getCurrentUser();
			user.genres = selectedGenres;
			userApi.updateUser(user.id, user);

			NotificationService.notify("Genres saved successfully!", "green");
			setTimeout(() => {
				if (user.firstTimeLogin) {
					window.location.href = "moviesChoice.html";
					user.firstTimeLogin = false;
					userApi.updateUser(user.id, user);
				} else {
					window.location.href = "dashboard.html";
				}
			}, 1000);
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

GenresChoice.init();
