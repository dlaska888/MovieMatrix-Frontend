import NotificationService from "./helpers/NotificationService.js";
import UserApiClient from "./api/UserApiClient.js";

const apiClient = new UserApiClient();

const form = document.querySelector("#login-form");
form.addEventListener("submit", async (e) => {
	e.preventDefault();
	const username = form.username.value;
	const email = form.email.value;
	const password = form.password.value;
	await apiClient
		.register(username, email, password)
		.then(() => {
			NotificationService.notify("Registered successfully!", "green");
			setTimeout(() => {
				window.location.href = "genresChoice.html";
			}, 1000);
		})
		.catch((error) => {
			NotificationService.notify(error.message, "red");
			console.error(error.message);
		});
});
