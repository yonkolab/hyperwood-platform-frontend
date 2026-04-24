import { createFileRoute } from "@tanstack/react-router";
import { env } from "#/env";
import { getStoredSessionToken } from "#/lib/session/cookies";

export const Route = createFileRoute("/api/realtime/portfolio")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const token = getStoredSessionToken();

				if (!token) {
					return new Response("unauthorized", { status: 401 });
				}

				const url = new URL(request.url);
				const currency = url.searchParams.get("currency") ?? "BRL";
				const upstream = await fetch(
					`${env.VITE_API_BASE_URL}/api/v1/portfolio/stream?currency=${encodeURIComponent(currency)}`,
					{
						headers: {
							authorization: `Bearer ${token}`,
							accept: "text/event-stream",
						},
					},
				);

				return new Response(upstream.body, {
					status: upstream.status,
					headers: {
						"content-type": "text/event-stream; charset=utf-8",
						"cache-control": "no-cache, no-transform",
						connection: "keep-alive",
					},
				});
			},
		},
	},
});
