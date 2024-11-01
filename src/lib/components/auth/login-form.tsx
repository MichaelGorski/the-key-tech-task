"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const LoginForm = () => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);

		setIsLoading(true);
		setError(null);

		try {
			const result = await signIn("credentials", {
				username: data.get("username"),
				password: data.get("password"),
				redirect: false,
			});
			console.log("🚀 ~ handleSubmit ~ result:", result);

			if (result?.error) {
				setError("Invalid credentials");
			} else if (result?.ok) {
				router.push("/dashboard");
				router.refresh();
			}
		} catch (error) {
			setError("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<h2 className="text-center text-3xl font-extrabold">Sign in</h2>
			{error && (
				<div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
			)}
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="sm:col-span-4">
					<label
						htmlFor="username"
						className="block text-sm/6 font-medium text-gray-900"
					>
						Username
					</label>
					<div className="mt-2">
						<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
							<input
								id="username"
								name="username"
								type="text"
								required
								className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6"
								placeholder="janesmith"
								value="editor.staging@example.com"
								onChange={(e) => console.log(e.target.value)}
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
								className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6"
								placeholder="******"
								value="HtxbYgJfB1ysRCEDX6b2"
								onChange={(e) => console.log(e.target.value)}
							/>
						</div>
					</div>
				</div>
				<button
					type="submit"
					className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
				>
					Sign in
				</button>
			</form>
		</>
	);
};
