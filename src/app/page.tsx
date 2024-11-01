"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
	const router = useRouter();

	return (
		<main className="flex min-h-screen flex-col items-center justify-center">
			<div>
				<h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
					Coding Task The-Key-Tech
				</h1>
				<p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl xl:px-48 dark:text-gray-400">
					By Michael Sathya Gorski
				</p>
				{/* 
					todo: add login button to route login form
				 */}
				<button
					type="button"
					onClick={() => router.push("/login")}
					className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
				>
					Start
				</button>
			</div>
		</main>
	);
}
