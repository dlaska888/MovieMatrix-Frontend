class ApiEndpoints {
    static baseUrl = 'http://localhost:8082/api/v1';
    static register = `${ApiEndpoints.baseUrl}/auth/register`;
    static login = `${ApiEndpoints.baseUrl}/auth/authenticate`;
    static logout = `${ApiEndpoints.baseUrl}/auth/logout`;
    static users = `${ApiEndpoints.baseUrl}/users`;
    static genres = `${ApiEndpoints.baseUrl}/category`;
    static preferenceMovies = `${ApiEndpoints.baseUrl}/moviePreference`;
    static seenMovies = `${ApiEndpoints.baseUrl}/movieSeen`;
    static favouriteMovies = `${ApiEndpoints.baseUrl}/favouriteMovie`;
}

export default ApiEndpoints;