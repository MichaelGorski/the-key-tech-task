"use client";

import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { ApolloProvider } from "@apollo/client";
import client from "~/lib/graphql/apollo-client";
import { AuthProvider } from "~/lib/context/auth-context";

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${GeistSans.variable}`}>
			<body>
				<AuthProvider>
					<ApolloProvider client={client}>{children}</ApolloProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
