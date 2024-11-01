import { gql } from "@apollo/client";
import client from "./apollo-client";

export const testConnection = async () => {
	try {
		const result = await client.query({
			query: gql`
					query TestQuery {
					__typename
					}
      			`,
		});
		console.log("GraphQL connection successful:", result);
		return true;
	} catch (error) {
		console.error("GraphQL connection failed:", error);
		return false;
	}
};
