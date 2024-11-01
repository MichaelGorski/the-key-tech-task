"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
	token: string | null;
	login: (token: string) => void;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setToken] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const storedToken = localStorage.getItem("auth_token");
		if (storedToken) {
			setToken(storedToken);
		}
	}, []);

	const login = (newToken: string) => {
		localStorage.setItem("auth_token", newToken);
		setToken(newToken);
	};

	const logout = () => {
		localStorage.removeItem("auth_token");
		setToken(null);
		router.push("/login");
	};

	return (
		<AuthContext.Provider
			value={{
				token,
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
