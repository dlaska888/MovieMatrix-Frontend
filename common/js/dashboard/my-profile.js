import Dashboard from "./dashboard.js";
import MockUserAPI from "../mock/MockUserApi.js";
import ApiClient from "../helpers/ApiClient.js";

const MyProfile = (function () {
	const userApi = new MockUserAPI();
	const client = new ApiClient();

	function init() {
		Dashboard.clearPageContent();
		const pageContent = document.querySelector("#page-content");
		let container = document.createElement("div");
		container.innerHTML = `
            <div class="container-fluid d-flex justify-content-center overflow-auto my-profile">
                <div id="container-row" class="row w-100 h-100"></div>
            </div>`;
		container = container.firstElementChild;

		const user = userApi.getCurrentUser();
		container.firstElementChild.appendChild(renderForm(user));
		container.firstElementChild.appendChild(renderPreferences(user));
		pageContent.appendChild(container);
	}

	function renderForm(user) {
		const form = document.createElement("div");
		form.innerHTML = `
            <div class="col col-12 col-xl-4 d-flex flex-column">
            <h2 class="mb-4">My Profile</h2>
            <form style="max-width: 500px; animation: fade-in 1s linear">
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <div class="input-group">
                    <input type="text" class="form-control" id="username" value="${user.username}">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <div class="input-group">
                    <input type="text" class="form-control" id="email" value="${user.email}">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="new-password" class="form-label">New Password</label>
                    <div class="input-group">
                    <input type="password" class="form-control" id="new-password">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="confirm-password" class="form-label">Confirm Password</label>
                    <div class="input-group">
                    <input type="password" class="form-control" id="confirm-password">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary text-white">Save</button>
            </form>
            </div>
            `;

		const newPasswordInput = form.querySelector("#new-password");
		const confirmPasswordInput = form.querySelector("#confirm-password");

		confirmPasswordInput.addEventListener("input", (event) => {
			if (newPasswordInput.value !== confirmPasswordInput.value) {
				confirmPasswordInput.setCustomValidity(
					"Passwords do not match"
				);
			} else {
				confirmPasswordInput.setCustomValidity("");
			}
		});
		return form.firstElementChild;
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

		client.getMoviesByIds(user.movies).then((movies) => {
			movies.forEach(async (movie) => {
				moviesContainer.appendChild(await Dashboard.renderMovie(movie));
			});
		});

		client.getGenreList().then((res) => {
			res.genres.forEach((genre) => {
				if (user.genres.includes(genre.id)) {
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
