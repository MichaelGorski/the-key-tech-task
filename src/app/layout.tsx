"use client";

import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { ApolloProvider } from "@apollo/client";
import client from "~/lib/apollo-client";

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${GeistSans.variable}`}>
			<body>
				<ApolloProvider client={client}>{children}</ApolloProvider>
			</body>
		</html>
	);
}
