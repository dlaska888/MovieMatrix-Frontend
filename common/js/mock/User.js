class User {
    id;
    email;
    password;
    username;
    seenMovies = [];
    favouriteMovies = [];
    movies = [];
    genres = [];
    region = "US";
    firstTimeLogin = true;
}

export default User;