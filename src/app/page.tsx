"use client";

import { useEffect } from "react";
import { testConnection } from "~/lib/graphql/healthcheck-query";

export default function HomePage() {
	useEffect(() => {
		testConnection().then((success) => {
			console.log("Connection test:", success ? "successful" : "failed");
		});
	}, []);

	return (
		<main className="flex min-h-screen flex-col items-center justify-center">
			<div>
				<h1>Hello World</h1>
			</div>
		</main>
	);
}
