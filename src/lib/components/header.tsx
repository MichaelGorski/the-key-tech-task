import client from "../graphql/apollo-client";
import { useRouter } from "next/navigation";

export const Header = () => {
	const email = localStorage.getItem("user_email");
	const router = useRouter();

	const handleLogout = async () => {
		localStorage.removeItem("auth_token");
		localStorage.removeItem("user_email");
		router.replace("/login");
		await client.clearStore();
	};

	return (
		<header className="bg-white shadow">
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<div className="flex items-center space-x-4">
					<span className="text-lg font-medium">Welcome, {email}</span>
				</div>
				<button
					type="button"
					onClick={handleLogout}
					className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
				>
					Logout
				</button>
			</div>
		</header>
	);
};
