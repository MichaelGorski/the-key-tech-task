"use client";

import { useAuth } from "~/lib/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "~/lib/components/header";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isAuthenticated } = useAuth();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!isAuthenticated) {
			router.replace("/login");
		} else {
			setIsLoading(false);
		}
	}, [isAuthenticated, router]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
			</div>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	return (
		<>
			<Header />
			{children}
		</>
	);
}
