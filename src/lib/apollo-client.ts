import {
	ApolloClient,
	createHttpLink,
	from,
	InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors)
		graphQLErrors.forEach(({ message, locations, path }) =>
			console.log(
				`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
			),
		);
	if (networkError) console.log(`[Network error]: ${networkError}`);
});

const API_KEY = process.env.API_KEY;

const apiLink = createHttpLink({
	uri: API_KEY,
	credentials: "include",
});

const client = new ApolloClient({
	link: from([errorLink, apiLink]),
	cache: new InMemoryCache(),
	connectToDevTools: true,
	defaultOptions: {
		watchQuery: {
			fetchPolicy: "network-only",
		},
		query: {
			fetchPolicy: "network-only",
		},
	},
});

export default client;
