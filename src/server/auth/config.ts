import type { DefaultSession, NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import client from "~/lib/graphql/apollo-client";
import { LOGIN_MUTATION } from "~/lib/graphql/mutations/auth/login";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		accessToken?: string;
		user: {
			id: string;
			name: string;
		} & DefaultSession["user"];
	}

	interface User {
		id: string;
		name: string;
		token?: string;
	}
}

declare module "@auth/core/jwt" {
	interface JWT {
		accessToken?: string;
		id?: string;
		name?: string;
	}
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				username: {
					label: "username",
					type: "text",
				},
				password: {
					label: "passord",
					type: "password",
				},
			},
			async authorize(credentials) {
				if (!credentials?.username || !credentials?.password) {
					console.log("Missing credentials");
					return null;
				}

				try {
					const { data } = await client.mutate({
						mutation: LOGIN_MUTATION,
						variables: {
							username: credentials.username,
							password: credentials.password,
						},
					});

					console.log("Login response:", data); // Debug log

					if (data?.loginJwt?.token) {
						// Return the user object
						return {
							id: data.loginJwt.user.username,
							name: data.loginJwt.user.username,
							email: data.loginJwt.user.username, // Optional
							token: data.loginJwt.token,
						};
					}

					console.log("No token in response");
					return null;
				} catch (error) {
					console.error("Authorization error:", error);
					return null;
				}
			},
		}),
	],
	callbacks: {
		async session({ session, token }) {
			// Send properties to the client
			if (token) {
				session.accessToken = token.accessToken;
				session.user.id = token.id as string;
				session.user.name = token.name as string;
			}
			return session;
		},
		async jwt({ token, user }) {
			if (user) {
				token.accessToken = user.token;
				token.id = user.id;
				token.name = user.name;
			}
			return token;
		},
	},
	pages: {
		signIn: "/login",
	},
	session: {
		strategy: "jwt",
		maxAge: 24 * 60 * 60,
	},
	secret: process.env.AUTH_SECRET,
	debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;
