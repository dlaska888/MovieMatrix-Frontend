import MockUserAPI from "../mock/MockUserApi.js";

class ApiClient {
	constructor() {
		this.apiKey = "416e798ec964e2b8b76a4e719640abbb";
		this.baseUrl = "https://api.themoviedb.org/3";
		this.userApi = new MockUserAPI();
	}

	async getPopularMovies(page = 1) {
		const url = `${this.baseUrl}/movie/popular?`;
		return await this.#getResponse(url, page);
	}

	async getTrendingMovies(page = 1) {
		const url = `${this.baseUrl}/trending/movie/week?`;
		return await this.#getResponse(url, page);
	}

	async getTopRatedMovies(page = 1) {
		const url = `${this.baseUrl}/movie/top_rated?`;
		return await this.#getResponse(url, page);
	}

	async getNowPlayingMovies(page = 1) {
		const url = `${this.baseUrl}/movie/now_playing?`;
		return await this.#getResponse(url, page);
	}

	async getUpcomingMovies(page = 1) {
		const url = `${this.baseUrl}/movie/upcoming?`;
		return await this.#getResponse(url, page);
	}

	async getMoviesByGenres(genreIds, page = 1) {
		const url = `${
			this.baseUrl
		}/discover/movie?&with_genres=${genreIds.join("|")}&`;
		return await this.#getResponseWithFilter(url, page);
	}

	async getMovieDetails(movieId, page = 1) {
		const url = `${this.baseUrl}/movie/${movieId}?`;
		return await this.#getResponse(url, page);
	}

	async getMovieDirector(movieId, page = 1) {
		const url = `${this.baseUrl}/movie/${movieId}/credits?`;
		const data = await this.#getResponse(url, page);
		const director = data.crew.find((member) => member.job === "Director");
		return director;
	}

	async getGenreList(page = 1) {
		const url = `${this.baseUrl}/genre/movie/list?`;
		return await this.#getResponse(url, page);
	}

	async getMoviesBySearch(query, page = 1) {
		const url = `${this.baseUrl}/search/movie?&query=${query}&`;
		return await this.#getResponse(url, page);
	}

	async getWatchProviders(movieId, page = 1) {
		const url = `${this.baseUrl}/movie/${movieId}/watch/providers?`;
		return await this.#getResponse(url, page);
	}

	async getMoviesWithPreferences(movieIds, genreIds, page = 1) {
		const genreMovies = (await this.getMoviesByGenres(genreIds, page))
			.results;

		const similarMovies = [];
		for (const id of movieIds) {
			const url = `https://api.themoviedb.org/3/movie/${id}/similar?`;
			const data = await this.#getResponseWithFilter(url, page);
			similarMovies.push(...data.results);
		}

		const allMovies = genreMovies.concat(similarMovies);
		const uniqueMovies = allMovies.filter((movie, index, self) => {
			return index === self.findIndex((m) => movie.id === m.id);
		});

		uniqueMovies.sort((a, b) => b.popularity - a.popularity);

		return uniqueMovies;
	}

	async getMoviesByIds(ids, page = 1) {
		const movies = [];
		for (const id of ids) {
			const url = `${this.baseUrl}/movie/${id}?`;
			const data = await this.#getResponse(url, page);
			movies.push(data);
		}
		return movies;
	}

	async #getResponse(url, page = 1) {
		const user = this.userApi.getCurrentUser();
		const response = await fetch(
			url + `api_key=${this.apiKey}&page=${page}&region=${user.region}`
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	}

	async #getResponseWithFilter(url, page = 1) {
		const data = await this.#getResponse(url, page);
		const user = this.userApi.getCurrentUser();
		const filteredData = data.results.filter(
			(movie) =>
				!user.seenMovies.includes(movie.id) &&
				!user.movies.includes(movie.id) &&
				!user.favouriteMovies.includes(movie.id)
		);

		return { results: filteredData };
	}
}

export default ApiClient;
