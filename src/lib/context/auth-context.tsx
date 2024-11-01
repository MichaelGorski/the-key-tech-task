"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import client from "~/lib/graphql/apollo-client";
import { LoadingSpinner } from "../components/spinners/loading-spinnter";

interface AuthContextType {
	token: string | null;
	username: string | null;
	login: (token: string, username: string) => void;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setToken] = useState<string | null>(null);
	const [username, setUsername] = useState<string | null>(null);
	const [isInitialized, setIsInitialized] = useState<boolean>(false);
	const router = useRouter();

	useEffect(() => {
		const storedToken = localStorage.getItem("auth_token");
		const storedUsername = localStorage.getItem("username");
		if (storedToken) {
			setToken(storedToken);
			setUsername(storedUsername);
		}
		setIsInitialized(true);
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

	if (!isInitialized) {
		return <LoadingSpinner />;
	}

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
