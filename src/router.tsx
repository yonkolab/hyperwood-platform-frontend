import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { GenericRouteSkeleton } from "#/components/loading/page-skeletons";
import {
	NotFoundPage,
	RouteErrorFallback,
} from "#/components/routing/route-fallbacks";
import TanstackQueryProvider, {
	getContext,
} from "./integrations/tanstack-query/root-provider";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const context = getContext();

	const router = createTanStackRouter({
		routeTree,
		context,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		defaultPendingComponent: GenericRouteSkeleton,
		defaultErrorComponent: RouteErrorFallback,
		defaultNotFoundComponent: NotFoundPage,
		Wrap: TanstackQueryProvider,
	});

	setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient });

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
