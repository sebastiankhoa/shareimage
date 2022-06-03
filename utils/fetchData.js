export const fetchToken = () => {
	const token =
		localStorage.getItem("accessToken") !== "undefined" ? JSON.parse(localStorage.getItem("accessToken")) : localStorage.clear();
	return token;
};

export const fetchUser = () => {
	const user = localStorage.getItem("user") !== "undefined" ? JSON.parse(localStorage.getItem("user")) : localStorage.clear();
	return user;
};
