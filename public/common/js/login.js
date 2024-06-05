import NotificationService from "./helpers/NotificationService.js";
import UserApiClient from "./api/UserApiClient.js";

const apiClient = new UserApiClient();

const form = document.querySelector("#login-form");
form.addEventListener("submit", async (e) => {
	e.preventDefault();
	const email = form.email.value;
	const password = form.password.value;
	await apiClient
		.login(email, password)
		.then(() => {
			NotificationService.notify("Logged in successfully!", "green");
			setTimeout(() => {
				window.location.href = "dashboard.html";
			}, 1000);
		})
		.catch((error) => {
			NotificationService.notify(error.message, "red");
			console.error(error.message);
		});
});
