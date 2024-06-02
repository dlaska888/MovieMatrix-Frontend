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
    photoUrl;
    firstTimeLogin = true;
}

export default User;