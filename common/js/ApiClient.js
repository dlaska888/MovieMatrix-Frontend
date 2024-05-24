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

	async getMoviesByGenre(genreId) {
		const url = `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}`;
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

	async getWatchedMovies() {
		const url = `${this.baseUrl}/account/1/rated/movies?api_key=${this.apiKey}`;
		return await this.#getResponse(url);
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

// // Usage example
// const apiKey = '416e798ec964e2b8b76a4e719640abbb';
// const client = new ApiClient(apiKey);

// // Get the latest movies
// client.getLatestMovies()
//     .then(movies => {
//         console.log('Latest movies:', movies);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });

// // Get the trending movies
// client.getTrendingMovies()
//     .then(movies => {
//         console.log('Trending movies:', movies);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });

// // Get movies by genre
// const genreId = 28; // Action genre
// client.getMoviesByGenre(genreId)
//     .then(movies => {
//         console.log('Action movies:', movies);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
