import TmdbApiClient from "../api/TmdbApiClient.js";
import UserApiClient from "../api/UserApiClient.js";
import NotificationService from "../helpers/NotificationService.js";
import Dashboard from "./dashboard.js";

const MyProfile = (function () {
	const userApi = new UserApiClient();
	let tmdbApi = null;

	async function init() {
		const user = await userApi.getCurrentUser();
		tmdbApi = new TmdbApiClient(user);

		Dashboard.clearPageContent();
		const pageContent = document.querySelector("#page-content");
		let container = document.createElement("div");
		container.innerHTML = `
            <div class="container-fluid d-flex justify-content-center overflow-auto my-profile">
                <div id="container-row" class="row w-100 h-100"></div>
            </div>`;
		container = container.firstElementChild;

		userApi.getCurrentUser().then((user) => {
			container.firstElementChild.appendChild(renderForm(user));
			container.firstElementChild.appendChild(renderPreferences(user));
			pageContent.appendChild(container);
		});
	}

	function renderForm(user) {
		const form = document.createElement("div");
		form.innerHTML = `
            <div class="col col-12 col-xl-4 d-flex flex-column">
            <h2 class="mb-4">My Profile</h2>
			<h4 class="mb-4">${user.username}</h4>
            <form style="max-width: 500px; animation: fade-in 1s linear">
				<div class="mb-3">
                    <label for="newPassword" class="form-label">New Password</label>
                    <div class="input-group">
                    <input type="password" class="form-control" id="newPassword" required>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="confirmPassword" class="form-label">Confirm Password</label>
                    <div class="input-group">
                    <input type="password" class="form-control" id="confirmPassword" required>
                    </div>
                </div>
				<div class="mb-3">
                    <label for="oldPassword" class="form-label">Old Password</label>
                    <div class="input-group">
                    <input type="password" class="form-control" id="oldPassword" required>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary text-white">Save</button>
            </form>
            </div>
            `;

		// const confirmPasswordInput = form.querySelector("#confirm-password");

		// confirmPasswordInput.addEventListener("input", (event) => {
		// 	const newPasswordInput = form.querySelector("#newPassword");
		// 	if (newPasswordInput.value !== event.target.value) {
		// 		confirmPasswordInput.setCustomValidity(
		// 			"Passwords do not match"
		// 		);
		// 	} else {
		// 		confirmPasswordInput.setCustomValidity("");
		// 	}
		// });

		form.querySelector("form").addEventListener("submit", saveForm);

		return form.firstElementChild;
	}

	function saveForm(event) {
		event.preventDefault();

		if (event.target.newPassword.value !== event.target.confirmPassword.value) {
			NotificationService.notify("Passwords do not match", "red");
			return;
		}
		
		userApi
			.changePassword(
				event.target.oldPassword.value,
				event.target.newPassword.value,
				event.target.confirmPassword.value
			)
			.then(() => {
				NotificationService.notify("Password changed successfully", "green");
			})
			.catch((error) => {
				NotificationService.notify("Invalid password", "red");
			});
	}

	function renderPreferences(user) {
		const preferenceContainer = document.createElement("div");
		preferenceContainer.className =
			"col col-12 col-xl-8 d-flex flex-column gap-5 overflow-auto no-overflow-mobile pb-4";
		preferenceContainer.style.maxHeight = "95vh";
		preferenceContainer.innerHTML = `
            <h2>My Preferences</h2>
            <div class="d-flex flex-column">
                <div class="d-flex justify-content-between mb-3">
                    <h3>Genres</h3>
                    <a href="/genresChoice.html" class="btn btn-primary text-white">Edit</a>
                </div>
                <div id="preference-genres-container" class="row justify-content-evenly gap-3"></div>
            </div>
            <div class="d-flex flex-column">
                <div class="d-flex justify-content-between mb-3">
                    <h3>Movies</h3>
                    <a href="/moviesChoice.html" class="btn btn-primary text-white">Edit</a>
                </div>
                <div id="preference-movies-container" class="row justify-content-center gap-5"></div>
            </div>
        `;
		const moviesContainer = preferenceContainer.querySelector(
			"#preference-movies-container"
		);
		const genresContainer = preferenceContainer.querySelector(
			"#preference-genres-container"
		);

		tmdbApi.getMoviesByIds(user.moviePreferences).then((movies) => {
			movies.forEach(async (movie) => {
				moviesContainer.appendChild(await Dashboard.renderMovie(movie));
			});
		});

		tmdbApi.getGenreList().then((res) => {
			res.genres.forEach((genre) => {
				if (user.categories.includes(genre.id)) {
					genresContainer.appendChild(renderGenre(genre));
				}
			});
		});

		return preferenceContainer;
	}

	function renderGenre(genre) {
		let genreCard = document.createElement("div");
		genreCard.innerHTML = `
			<div class="col col-xxl-3 col-xl-4 col-md-5 col-sm-7 col-9">
				<div id="card-${genre.id}" class="card">
					<div class="card-body">
						<p>${genre.name}</p>
					</div>
				</div>
			</div>`;
		genreCard = genreCard.firstElementChild;

		const path = `/common/assets/img/genres`;
		genreCard.firstElementChild.style.backgroundImage = `url(${path}/${genre.id}.jpg), url(${path}/${genre.id}.png), url(${path}/${genre.id}.webp), url(${path}/${genre.id}.jpeg), url(${path}/default.jpg)`;

		return genreCard;
	}

	return {
		init,
	};
})();

export default MyProfile;
