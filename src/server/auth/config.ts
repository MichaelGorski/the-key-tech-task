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
		} & DefaultSession["user"];
	}

	interface User {
		id?: string;
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
					label: "password",
					type: "password",
				},
			},
			async authorize(credentials) {
				if (!credentials?.username || !credentials?.password) {
					throw new Error("Missing credentials");
				}

				try {
					const { data } = await client.mutate({
						mutation: LOGIN_MUTATION,
						variables: {
							username: credentials.username,
							password: credentials.password,
						},
					});

					type LoginResponse = {
						data?: {
							loginJwt?: {
								token: string;
							};
						};
					};

					if (!(data as LoginResponse)?.data?.loginJwt?.token) {
						throw new Error("Invalid credentials - No token received");
					}

					const loginData = (
						(data as LoginResponse).data as {
							loginJwt: { user: { username: string }; token: string };
						}
					).loginJwt;

					return {
						id: loginData.user.username,
						name: loginData.user.username,
						email: loginData.user.username,
						token: loginData.token,
					};
				} catch (error) {
					console.error("Authorization error:", error);
					throw new Error(
						error instanceof Error ? error.message : "Authentication failed",
					);
				}
			},
		}),
	],
	callbacks: {
		async session({ session, token }) {
			if (token) {
				session.accessToken = token.accessToken;
				session.user.id = token.id ?? "";
				session.user.name = token.name ?? "";
			}
			return session;
		},
		async jwt({ token, user }) {
			if (user) {
				token.accessToken = user.token;
				token.id = user.id;
				token.name = user.name ?? undefined;
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
	logger: {
		error: (error: Error) => {
			console.error(error);
		},
		warn: (code) => {
			console.warn(code);
		},
		debug: (code, metadata) => {
			console.log(code, metadata);
		},
	},
} satisfies NextAuthConfig;
