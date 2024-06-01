class User {
    id;
    email;
    password;
    username;
    seenMovies = [];
    movies = [];
    genres = [];
    photoUrl;
    firstTimeLogin = true;
}

export default User;