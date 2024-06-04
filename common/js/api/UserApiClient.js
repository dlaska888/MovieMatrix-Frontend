import ApiEndpoints from "./ApiEndpoints.js";
import CookieManager from "../helpers/CookieManager.js";

class UserApiClient {
	async login(email, password) {
		return fetch(`${ApiEndpoints.login}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		})
			.then(async (response) => {
				if (response.ok) {
					return response.json();
				} else if (response.status === 403) {
					throw new Error("Invalid email or password");
				} else {
					throw new Error(
						"Something went wrong. Please try again later."
					);
				}
			})
			.then((data) => {
				CookieManager.setCookie("access_token", data.access_token, 1);
				CookieManager.setCookie("refresh_token", data.access_token, 1);
			});
	}

	async register(username, email, password) {
		return fetch(`${ApiEndpoints.register}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, email, password }),
		})
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else if (response.status === 409) {
					throw new Error("User already exists");
				} else {
					throw new Error(
						"Something went wrong. Please try again later."
					);
				}
			})
			.then((data) => {
				CookieManager.setCookie("access_token", data.access_token, 1);
				CookieManager.setCookie("refresh_token", data.access_token, 1);
			});
	}

	async logout() {
		return fetch(`${ApiEndpoints.logout}`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${CookieManager.getCookie(
					"access_token"
				)}`,
			},
		}).then(() => {
			CookieManager.deleteCookie("access_token");
			CookieManager.deleteCookie("refresh_token");
		});
	}

	async isUserLoggedIn() {
		return this.getCurrentUser()
			.then(() => true)
			.catch(() => false);
	}

	async getCurrentUser() {
		return fetch(`${ApiEndpoints.users}/me`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${CookieManager.getCookie(
					"access_token"
				)}`,
			},
		})
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error(
						"Something went wrong. Please try again later."
					);
				}
			})
			.then(async (user) => {
				const categories = await fetch(`${ApiEndpoints.genres}`, {
					headers: {
						Authorization: `Bearer ${CookieManager.getCookie(
							"access_token"
						)}`,
					},
				}).then((response) => response.json());
				const moviePreferences = await fetch(
					`${ApiEndpoints.preferenceMovies}`,
					{
						headers: {
							Authorization: `Bearer ${CookieManager.getCookie(
								"access_token"
							)}`,
						},
					}
				).then((response) => response.json());
				const seenMovies = await fetch(`${ApiEndpoints.seenMovies}`, {
					headers: {
						Authorization: `Bearer ${CookieManager.getCookie(
							"access_token"
						)}`,
					},
				}).then((response) => response.json());
				const favouriteMovies = await fetch(
					`${ApiEndpoints.favouriteMovies}`,
					{
						headers: {
							Authorization: `Bearer ${CookieManager.getCookie(
								"access_token"
							)}`,
						},
					}
				).then((response) => response.json());

				user.categories = categories.map(
					(category) => category.categoryId
				);
				user.moviePreferences = moviePreferences.map(
					(movie) => movie.movieId
				);
				user.seenMovies = seenMovies.map((movie) => movie.movieId);
				user.favouriteMovies = favouriteMovies.map(
					(movie) => movie.movieId
				);

				return user;
			});
	}

	async updateGenres(genreIds) {
		return fetch(`${ApiEndpoints.genres}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${CookieManager.getCookie(
					"access_token"
				)}`,
			},
			body: JSON.stringify(genreIds),
		}).then((response) => {
			if (!response.ok) {
				throw new Error(
					"Something went wrong. Please try again later."
				);
			}
		});
	}

	async updatePreferenceMovies(movieIds) {
		return fetch(`${ApiEndpoints.preferenceMovies}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${CookieManager.getCookie(
					"access_token"
				)}`,
			},
			body: JSON.stringify(movieIds),
		}).then((response) => {
			if (!response.ok) {
				throw new Error(
					"Something went wrong. Please try again later."
				);
			}
		});
	}

	async addSeenMovie(movieId) {
		return fetch(`${ApiEndpoints.seenMovies}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${CookieManager.getCookie(
					"access_token"
				)}`,
			},
			body: JSON.stringify(movieId),
		}).then((response) => {
			if (!response.ok) {
				throw new Error(
					"Something went wrong. Please try again later."
				);
			}
		});
	}

	async removeSeenMovie(movieId) {
		return fetch(`${ApiEndpoints.seenMovies}/${movieId}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${CookieManager.getCookie(
					"access_token"
				)}`,
			},
		}).then((response) => {
			if (!response.ok) {
				throw new Error(
					"Something went wrong. Please try again later."
				);
			}
		});
	}

	async addFavouriteMovie(movieId) {
		return fetch(`${ApiEndpoints.favouriteMovies}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${CookieManager.getCookie(
					"access_token"
				)}`,
			},
			body: JSON.stringify(movieId),
		}).then((response) => {
			if (!response.ok) {
				throw new Error(
					"Something went wrong. Please try again later."
				);
			}
		});
	}

	async removeFavouriteMovie(movieId) {
		return fetch(`${ApiEndpoints.favouriteMovies}/${movieId}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${CookieManager.getCookie(
					"access_token"
				)}`,
			},
		}).then((response) => {
			if (!response.ok) {
				throw new Error(
					"Something went wrong. Please try again later."
				);
			}
		});
	}

	async changePassword(oldPassword, newPassword, newPasswordConfirm) {
		return fetch(`${ApiEndpoints.users}/change-password`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${CookieManager.getCookie(
					"access_token"
				)}`,
			},
			body: JSON.stringify({
				currentPassword: oldPassword,
				newPassword: newPassword,
				confirmationPassword: newPasswordConfirm,
			}),
		}).then((response) => {
			if (!response.ok) {
				throw new Error(
					"Something went wrong. Please try again later."
				);
			}
		});
	}
}

export default UserApiClient;
