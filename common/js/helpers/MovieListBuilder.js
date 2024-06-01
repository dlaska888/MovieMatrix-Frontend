class MovieListBuilder {
	constructor(addMoviesFun, startPage = 1) {
		this.addMoviesFun = addMoviesFun;
		this.page = startPage; //first page is init
		this.throttleTimer = false;
	}

	handleScroll() {
		const moviesContainer = document.querySelector("#movies-container");
		this.#throttle(() => {
			const endOfMovies =
				moviesContainer.scrollHeight <=
				moviesContainer.scrollTop + window.innerHeight;

			if (endOfMovies) {
				this.addMoviesFun(this.page);
				this.page += 1;
			}
		}, 1000);
	}

	#throttle(callback, time) {
		if (this.throttleTimer) return;
		this.throttleTimer = true;
		setTimeout(() => {
			callback();
			this.throttleTimer = false;
		}, time);
	}
}

export default MovieListBuilder;
