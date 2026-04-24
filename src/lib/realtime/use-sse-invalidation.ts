import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { env } from "#/env";

type UseEventSourceOptions = {
	sourceUrl: string | null;
	eventNames: string[];
	invalidateKeys: Array<readonly unknown[]>;
};

export function useSseInvalidation(options: UseEventSourceOptions) {
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!options.sourceUrl) {
			return;
		}

		const eventSource = new EventSource(options.sourceUrl);

		const invalidate = () => {
			void Promise.all(
				options.invalidateKeys.map((queryKey) =>
					queryClient.invalidateQueries({ queryKey }),
				),
			);
		};

		for (const eventName of options.eventNames) {
			eventSource.addEventListener(eventName, invalidate);
		}

		return () => {
			eventSource.close();
		};
	}, [
		options.eventNames,
		options.invalidateKeys,
		options.sourceUrl,
		queryClient,
	]);
}

export function getPublicMarketStreamUrl(marketId: string) {
	return `${env.VITE_API_BASE_URL}/api/v1/markets/${marketId}/stream`;
}

export function getPrivatePortfolioStreamUrl(currency: string) {
	return `/api/realtime/portfolio?currency=${encodeURIComponent(currency)}`;
}
