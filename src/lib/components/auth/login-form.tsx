"use client";

import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LOGIN_MUTATION } from "~/lib/graphql/mutations/auth/login";

export const LoginForm = () => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		email: "editor.staging@example.com",
		password: "HtxbYgJfB1ysRCEDX6b2",
	});

	const [loginMutation] = useMutation(LOGIN_MUTATION);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			const { data } = await loginMutation({
				variables: {
					email: formData.email,
					password: formData.password,
				},
			});

			console.log("Full login response:", data);
			console.log("JWT tokens:", data?.Auth?.loginJwt?.loginResult?.jwtTokens);
			console.log(
				"Access token:",
				data?.Auth?.loginJwt?.loginResult?.jwtTokens?.accessToken,
			);

			const accessToken =
				data?.Auth?.loginJwt?.loginResult?.jwtTokens?.accessToken;

			if (accessToken && typeof accessToken === "string") {
				localStorage.setItem("auth_token", accessToken);
				console.log("Stored token:", localStorage.getItem("auth_token"));
				router.push("/home");
			} else {
				console.error("Invalid token format:", accessToken);
				setError("Invalid credentials");
			}
		} catch (error) {
			console.error("Login error:", error);
			setError("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="sm:col-span-4">
				<label
					htmlFor="email"
					className="block text-sm/6 font-medium text-gray-900"
				>
					Email
				</label>
				<div className="mt-2">
					<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
						<input
							id="email"
							name="email"
							type="email"
							required
							value={formData.email}
							onChange={handleChange}
							className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6"
							placeholder="you@example.com"
						/>
					</div>
				</div>
			</div>
			<div>
				<label htmlFor="password" className="block text-sm font-medium">
					Password
				</label>
				<div className="mt-2">
					<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
						<input
							id="password"
							name="password"
							type="password"
							required
							value={formData.password}
							onChange={handleChange}
							className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6"
							placeholder="******"
						/>
					</div>
				</div>
			</div>
			{error && <div className="text-red-500 text-sm">{error}</div>}
			<button
				type="submit"
				disabled={isLoading}
				className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
			>
				{isLoading ? "Signing in..." : "Sign in"}
			</button>
		</form>
	);
};
