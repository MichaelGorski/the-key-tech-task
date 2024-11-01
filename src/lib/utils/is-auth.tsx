export const isAuth = () => {
	const token = localStorage.getItem("auth_token");
	return !!token;
};
