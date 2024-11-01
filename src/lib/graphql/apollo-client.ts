import {
	ApolloClient,
	createHttpLink,
	from,
	InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

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

const authLink = setContext(async (_, { headers }) => {
	return {
		headers: {
			...headers,
			// authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const apiLink = createHttpLink({
	uri: API_KEY,
	credentials: "include",
});

const client = new ApolloClient({
	link: authLink.concat(from([errorLink, apiLink])),
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
