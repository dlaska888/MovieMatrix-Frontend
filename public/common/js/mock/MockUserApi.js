class MockUserAPI {
	static #users = [];
	static #currentUser = null;
	static instance = null;

	constructor() {
		if (MockUserAPI.instance) {
			throw new Error(
				"MockUserAPI is a singleton class, use getInstance() method instead"
			);
		}

		const storedUsers = localStorage.getItem("users");
		const storedCurrentUser = localStorage.getItem("currentUser");
		if (storedUsers) {
			MockUserAPI.#users = JSON.parse(storedUsers);
			MockUserAPI.#currentUser = JSON.parse(storedCurrentUser);
		}
	}

	static getInstance() {
		if (!MockUserAPI.instance) {
			MockUserAPI.instance = new MockUserAPI();
		}
		return MockUserAPI.instance;
	}

	login(email, password) {
		const user = this.getUser(email);

		if (user && user.password === password) {
			MockUserAPI.#currentUser = user;
			this.#saveToLocalStorage();
			return true;
		}

		return false;
	}

	logout() {
		MockUserAPI.#currentUser = null;
		this.#saveToLocalStorage();
	}

	getCurrentUser() {
		return MockUserAPI.#currentUser;
	}

	getAllUsers() {
		return MockUserAPI.#users;
	}

	getUser(identifier) {
		return MockUserAPI.#users.find(
			(user) => user.username === identifier || user.email === identifier
		);
	}

	createUser(user) {
		if (this.getUser(user.email) || this.getUser(user.username)) {
			throw new Error("User already exists");
		}
		user.id = MockUserAPI.#users.length + 1;
		MockUserAPI.#users.push(user);
		this.#saveToLocalStorage();
	}

	updateUser(id, updatedUser) {
		const index = MockUserAPI.#users.findIndex((user) => user.id === id);
		if (index === -1) {
			throw new Error("User not found");
		}
		MockUserAPI.#users[index] = updatedUser;
		this.#saveToLocalStorage();
	}

	deleteUser(id) {
		const index = MockUserAPI.#users.findIndex((user) => user.id === id);
		if (index === -1) {
			throw new Error("User not found");
		}
		MockUserAPI.#users.splice(index, 1);
		this.#saveToLocalStorage();
	}

	#saveToLocalStorage() {
		localStorage.setItem("users", JSON.stringify(MockUserAPI.#users));
		localStorage.setItem(
			"currentUser",
			JSON.stringify(MockUserAPI.#currentUser)
		);
	}
}

export default MockUserAPI;
