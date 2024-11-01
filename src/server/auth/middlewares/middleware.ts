// middleware.ts
import { NextResponse } from "next/server";
import { auth } from "..";

export default auth((req) => {
	const isLoggedIn = !!req.auth;
	const isAuthPage = req.nextUrl.pathname.startsWith("/login");

	if (isAuthPage) {
		if (isLoggedIn) {
			return NextResponse.redirect(new URL("/dashboard", req.url));
		}
		return null;
	}

	if (!isLoggedIn) {
		return NextResponse.redirect(new URL("/login", req.url));
	}
	return null;
});
