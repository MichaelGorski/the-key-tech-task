import { LoginForm } from "~/lib/components/auth/login-form";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function LoginPage() {
	const session = await auth();
	console.log("🚀 ~ LoginPage ~ session:", session);

	if (session) {
		redirect("/main");
	}

	return (
		<section className="flex min-h-screen flex-col items-center justify-center">
			<LoginForm />
		</section>
	);
}
