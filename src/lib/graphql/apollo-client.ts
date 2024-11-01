import {
	ApolloClient,
	createHttpLink,
	from,
	gql,
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

const httpLink = createHttpLink({
	uri: "https://staging.api.constellation.academy/api/graphql",
	credentials: "include",
});

const authLink = setContext((_, { headers }) => {
	const token =
		typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
	console.log("Using token:", JSON.stringify(token, null, Infinity)); // Debug log

	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const client = new ApolloClient({
	link: from([errorLink, authLink, httpLink]),
	cache: new InMemoryCache(),
	defaultOptions: {
		watchQuery: {
			fetchPolicy: "network-only",
		},
		query: {
			fetchPolicy: "network-only",
		},
	},
});

// const SCHEMA_QUERY = gql`
//   query SchemaTypes {
//     __type(name: "JwtLoginInformation") {
//       name
//       fields {
//         name
//         type {
//           name
//           kind
//         }
//       }
//     }
//     __type(name: "LoginResultExtension") {
//       name
//       fields {
//         name
//         type {
//           name
//           kind
//         }
//       }
//     }
//   }
// `;

// client
// 	.query({
// 		query: SCHEMA_QUERY,
// 	})
// 	.then((result) => {
// 		console.log("JwtLoginInformation fields:", result.data.__type);
// 	})
// 	.catch((error) => {
// 		console.error("Schema error:", error);
// 	});

const SCHEMA_QUERY = gql`
  query SchemaTypes {
    __type(name: "TreeNodesConnection") {
      name
      fields {
        name
        type {
          name
          kind
        }
      }
    }
  }
`;

// Add to your Apollo client file
client
	.query({
		query: SCHEMA_QUERY,
	})
	.then((result) => {
		console.log("TreeNodesConnection fields:", result.data.__type.fields);
	})
	.catch((error) => {
		console.error("Schema error:", error);
	});

export default client;
