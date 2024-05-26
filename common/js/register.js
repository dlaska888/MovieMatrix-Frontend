import User from "./mock/User.js";
import MockUserAPI from "./mock/MockUserApi.js";
import NotificationService from "./helpers/NotificationService.js";

const userApi = MockUserAPI.getInstance();

const form = document.querySelector("#login-form");
form.addEventListener("submit", (e) => {
	e.preventDefault();
	const user = new User();
	user.email = form.email.value;
	user.password = form.password.value;
	user.username = form.username.value;
	try {
		userApi.createUser(user);
		userApi.login(form.email.value, form.password.value);
		NotificationService.notify("Registered successfully!", "green");
		setTimeout(() => {
			window.location.href = "genresChoice.html";
		}, 1000);
	} catch (error) {
		NotificationService.notify(error.message, "red");
		console.error(error.message);
	}
});
