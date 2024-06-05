class UserLocationResolver {
	async getUserRegion() {
		return fetch("https://ipapi.co/json/")
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then((data) => {
				if (data.country_code) {
					return data.country_code;
				} else {
					throw new Error("Country not found in ipapi response");
				}
			})
			.catch(() => "US");
	}
}

export default UserLocationResolver;
