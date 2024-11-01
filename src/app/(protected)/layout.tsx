import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	try {
		const session = await auth();
		console.log("🚀 ~ session:", session);

		if (!session) {
			redirect("/login");
		}
	} catch (error) {
		console.error("Error in DashboardLayout:", error);
	}

	return (
		<div>
			<header className="border-b">
				<div className="container flex h-16 items-center px-4">
					<div className="flex-1">you are in</div>
				</div>
			</header>
			<main className="container p-4">{children}</main>
		</div>
	);
}
