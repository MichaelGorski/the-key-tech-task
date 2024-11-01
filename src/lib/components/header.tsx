"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import client from "../graphql/apollo-client";

export const Header = () => {
	const [email, setEmail] = useState<string | null>(null);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const router = useRouter();

	useEffect(() => {
		setEmail(localStorage.getItem("user_email"));
	}, []);

	const handleLogout = async () => {
		localStorage.removeItem("auth_token");
		localStorage.removeItem("user_email");
		router.replace("/login");
		await client.clearStore();
	};

	return (
		<header className="border-b border-gray-200 bg-white">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<span className="text-sm text-gray-600 truncate max-w-[200px]">
						Welcome, {email}
					</span>
					<div className="flex items-center space-x-4">
						<button
							type="button"
							onClick={handleLogout}
							className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors hidden sm:block"
						>
							Logout
						</button>
						<button
							type="button"
							className="sm:hidden focus:outline-none"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							aria-expanded={isMenuOpen}
							aria-controls="mobile-menu"
						>
							<span className="sr-only">Open main menu</span>
							{isMenuOpen ? (
								<svg
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									role="img"
									aria-label="Close menu"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							) : (
								<svg
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									role="img"
									aria-label="Close menu"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							)}
						</button>
					</div>
				</div>
			</div>
			{isMenuOpen && (
				<div
					id="mobile-menu"
					className="sm:hidden border-t border-gray-200 py-4"
				>
					<div className="container mx-auto px-4 flex flex-col items-start space-y-4">
						<button
							type="button"
							onClick={handleLogout}
							className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
						>
							Logout
						</button>
					</div>
				</div>
			)}
		</header>
	);
};
