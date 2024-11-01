"use client";

import { useAuth } from "~/lib/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isAuthenticated } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated) {
			router.push("/login");
		}
	}, [isAuthenticated, router]);

	if (!isAuthenticated) {
		return null;
	}

	return <>{children}</>;
}
