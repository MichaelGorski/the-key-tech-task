"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import client from "../graphql/apollo-client";

interface AuthContextType {
	token: string | null;
	login: (token: string) => void;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setToken] = useState<string | null>(null);
	const [username, setUsername] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const storedToken = localStorage.getItem("auth_token");
		const storedUsername = localStorage.getItem("username");
		if (storedToken) {
			setToken(storedToken);
			setUsername(storedUsername);
		}
	}, []);

	useEffect(() => {
		const storedToken = localStorage.getItem("auth_token");
		if (storedToken) {
			setToken(storedToken);
		}
	}, []);

	const login = (newToken: string, newUsername: string) => {
		localStorage.setItem("auth_token", newToken);
		localStorage.setItem("username", newUsername);
		setToken(newToken);
		setUsername(newUsername);
	};

	const logout = async () => {
		localStorage.removeItem("auth_token");
		localStorage.removeItem("username");
		setToken(null);
		setUsername(null);
		await client.clearStore();
		router.replace("/login");
	};

	return (
		<AuthContext.Provider
			value={{
				token,
				username,
				login,
				logout,
				isAuthenticated: !!token,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
