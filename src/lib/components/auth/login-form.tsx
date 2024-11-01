"use client";

import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LOGIN_MUTATION } from "~/lib/graphql/mutations/auth/login";

export const LoginForm: React.FC = () => {
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

			const accessToken = (
				data as {
					Auth: {
						loginJwt: {
							loginResult: {
								jwtTokens: {
									accessToken: string;
								};
							};
						};
					};
				}
			)?.Auth?.loginJwt?.loginResult?.jwtTokens?.accessToken;

			if (accessToken && typeof accessToken === "string") {
				localStorage.setItem("auth_token", accessToken);
				localStorage.setItem("user_email", formData.email);
				router.replace("/home");
			} else {
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
		<form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
			<div>
				<label
					htmlFor="email"
					className="block text-sm font-medium text-gray-700"
				>
					Email
				</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					value={formData.email}
					onChange={handleChange}
					className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                     focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                     disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none
                     invalid:border-pink-500 invalid:text-pink-600
                     focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
					placeholder="you@example.com"
				/>
			</div>
			<div>
				<label
					htmlFor="password"
					className="block text-sm font-medium text-gray-700"
				>
					Password
				</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					value={formData.password}
					onChange={handleChange}
					className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                     focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                     disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
					placeholder="********"
				/>
			</div>
			{error && <div className="text-sm text-red-600">{error}</div>}
			<button
				type="submit"
				disabled={isLoading}
				className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isLoading ? "Signing in..." : "Sign in"}
			</button>
		</form>
	);
};
