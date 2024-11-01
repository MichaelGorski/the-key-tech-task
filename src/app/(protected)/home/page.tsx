"use client";

import { useQuery } from "@apollo/client";
import { GET_CONTENT_NODES } from "~/lib/graphql/queries/get-content-nodes";

export default function HomePage() {
	const { loading, error, data } = useQuery(GET_CONTENT_NODES);

	if (loading)
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
			</div>
		);

	if (error)
		return <div className="text-red-500 p-4">Error: {error.message}</div>;

	const nodes = data?.Admin?.Tree?.GetContentNodes?.edges || [];

	return (
		<div className="container mx-auto p-4">
			<div className="grid gap-4">
				{nodes.map((edge: any, index: number) => (
					<div
						key={index}
						className="p-4 bg-white shadow rounded min-h-[30vh] transition-all hover:shadow-lg"
					>
						<h2 className="text-xl font-medium">
							{edge.node.structureDefinition.title}
						</h2>
					</div>
				))}
			</div>

			<div className="mt-4 text-gray-500">Total nodes: {nodes.length}</div>
		</div>
	);
}
