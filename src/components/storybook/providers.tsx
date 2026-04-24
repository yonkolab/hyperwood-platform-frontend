import type { Decorator } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	RouterContextProvider,
} from "@tanstack/react-router";
import * as React from "react";
import { AppI18nProvider } from "#/lib/i18n";

const rootRoute = createRootRoute({
	component: () => <Outlet />,
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: () => null,
});

const loginRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/login",
	component: () => null,
});

const registerRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/register",
	component: () => null,
});

const portfolioRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/portfolio",
	component: () => null,
});

const walletRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/wallet",
	component: () => null,
});

const securityRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/settings/security",
	component: () => null,
});

const marketRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/markets/$marketId",
	component: () => null,
});

const routeTree = rootRoute.addChildren([
	indexRoute,
	loginRoute,
	registerRoute,
	portfolioRoute,
	walletRoute,
	securityRoute,
	marketRoute,
]);

function createStoryRouter() {
	return createRouter({
		routeTree,
		history: createMemoryHistory({ initialEntries: ["/"] }),
	});
}

function StoryProviders(props: { children: React.ReactNode }) {
	const queryClient = React.useMemo(() => new QueryClient(), []);
	const router = React.useMemo(() => createStoryRouter(), []);

	return (
		<QueryClientProvider client={queryClient}>
			<RouterContextProvider router={router}>
				<AppI18nProvider locale="pt-BR">{props.children}</AppI18nProvider>
			</RouterContextProvider>
		</QueryClientProvider>
	);
}

export const withAppProviders: Decorator = (Story) => (
	<StoryProviders>
		<div className="min-h-screen bg-[#0a0f16] p-6 text-slate-100">
			<Story />
		</div>
	</StoryProviders>
);
