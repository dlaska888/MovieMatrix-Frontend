import User from "./mock/User.js";
import MockUserAPI from "./mock/MockUserApi.js";
import NotificationService from "./helpers/NotificationService.js";

const userApi = MockUserAPI.getInstance();

const form = document.querySelector("#login-form");
form.addEventListener("submit", (e) => {
	e.preventDefault();
	try {
		if (!userApi.login(form.email.value, form.password.value)) {
			throw new Error("Invalid email or password");
		}
		NotificationService.notify("Logged in successfully!", "green");
		setTimeout(() => {
			window.location.href = "dashboard.html";
		}, 1000);
	} catch (error) {
		NotificationService.notify(error.message, "red");
		console.error(error.message);
	}
});
