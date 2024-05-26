class ApiClient {
	constructor() {
		this.apiKey = "416e798ec964e2b8b76a4e719640abbb";
		this.baseUrl = "https://api.themoviedb.org/3";
	}

	async getPopularMovies() {
		const url = `${this.baseUrl}/movie/popular?api_key=${this.apiKey}`;
		return await this.#getResponse(url);
	}

	async getTrendingMovies() {
		const url = `${this.baseUrl}/trending/movie/week?api_key=${this.apiKey}`;
		return await this.#getResponse(url);
	}

	async getTopRatedMovies() {
		const url = `${this.baseUrl}/movie/top_rated?api_key=${this.apiKey}`;
		return await this.#getResponse(url);
	}

	async getMoviesByGenres(genreId) {
		const url = `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreId.join(",")}`;
		return await this.#getResponse(url);
	}

	async getMovieDetails(movieId) {
		const url = `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}`;
		return await this.#getResponse(url);
	}

	async getMovieDirector(movieId) {
		const url = `${this.baseUrl}/movie/${movieId}/credits?api_key=${this.apiKey}`;
		const data = await this.#getResponse(url);
		const director = data.crew.find((member) => member.job === "Director");
		return director;
	}

	async getGenreList() {
		const url = `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}`;
		return await this.#getResponse(url);
	}

	async getMoviesBySearch(query) {
		const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${query}`;
		return await this.#getResponse(url);
	}

	async getWatchProviders(movieId) {
		const url = `${this.baseUrl}/movie/${movieId}/watch/providers?api_key=${this.apiKey}`;
		return await this.#getResponse(url);
	}

	async getMoviesWithPreferences(movieIds, genreIds) {
		if (movieIds.length === 0) {
			return (await this.getMoviesByGenres(genreIds)).results;
		}

		const similarMovies = [];
		for (const id of movieIds) {
			const url = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${this.apiKey}`;
			const data = await this.#getResponse(url);
			similarMovies.push(...data.results);
		}

		const uniqueMovies = similarMovies.filter((movie, index, self) => {
			return index === self.findIndex((m) => (
				movie.id === m.id
			));
		});

		uniqueMovies.sort((a, b) => b.popularity - a.popularity);

		return uniqueMovies;
	}

	async getMoviesByIds(ids) {
		const movies = [];
		for (const id of ids) {
			const url = `${this.baseUrl}/movie/${id}?api_key=${this.apiKey}`;
			const data = await this.#getResponse(url);
			movies.push(data);
		}
		return movies;
	}

	async #getResponse(url) {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	}
}

export default ApiClient;
