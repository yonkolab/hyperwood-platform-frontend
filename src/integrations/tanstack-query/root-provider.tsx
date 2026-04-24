import { QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";

export function getContext() {
	const queryClient = new QueryClient();

	return {
		queryClient,
	};
}

export default function TanstackQueryProvider(props: { children: ReactNode }) {
	return <>{props.children}</>;
}
