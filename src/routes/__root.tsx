import type { QueryClient } from "@tanstack/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { AppShell } from "#/components/layout/app-shell";
import { NotFoundPage } from "#/components/routing/route-fallbacks";
import { AppI18nProvider } from "#/lib/i18n";
import {
	currentUserQueryOptions,
	localeQueryOptions,
} from "#/lib/query-options";
import { onThemeChange, resolveInitialTheme } from "#/lib/theme";
import appCss from "../styles.css?url";

interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	loader: async ({ context }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(localeQueryOptions),
			context.queryClient.ensureQueryData(currentUserQueryOptions),
		]);
	},
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{ title: "Hyperwood Trader" },
			{
				name: "description",
				content:
					"Negocie mercados de previsão e acompanhe probabilidades em tempo real na Hyperwood.",
			},
			{ property: "og:site_name", content: "Hyperwood" },
			{ property: "og:type", content: "website" },
			{ property: "og:title", content: "Hyperwood Trader" },
			{
				property: "og:description",
				content:
					"Negocie mercados de previsão e acompanhe probabilidades em tempo real na Hyperwood.",
			},
			{
				property: "og:image",
				content:
					"https://prediction-market-platform-frontend.vercel.app/android-chrome-512x512.png",
			},
			{
				property: "og:image:alt",
				content: "Hyperwood",
			},
			{ name: "twitter:card", content: "summary" },
			{ name: "twitter:title", content: "Hyperwood Trader" },
			{
				name: "twitter:description",
				content:
					"Negocie mercados de previsão e acompanhe probabilidades em tempo real na Hyperwood.",
			},
			{
				name: "twitter:image",
				content:
					"https://prediction-market-platform-frontend.vercel.app/android-chrome-512x512.png",
			},
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "icon", href: "/favicon.ico", sizes: "any" },
			{
				rel: "icon",
				href: "/favicon-16x16.png",
				type: "image/png",
				sizes: "16x16",
			},
			{
				rel: "icon",
				href: "/favicon-32x32.png",
				type: "image/png",
				sizes: "32x32",
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png",
				sizes: "180x180",
			},
			{ rel: "manifest", href: "/manifest.json" },
		],
		scripts: [
			{
				children:
					"try{var t=localStorage.getItem('hw-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}",
			},
		],
	}),
	notFoundComponent: NotFoundPage,
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const { data: localeResult } = useSuspenseQuery(localeQueryOptions);
	const { data: user } = useSuspenseQuery(currentUserQueryOptions);
	const [toastTheme, setToastTheme] = useState<"light" | "dark">("light");

	useEffect(() => {
		setToastTheme(resolveInitialTheme());

		return onThemeChange(() => {
			setToastTheme(resolveInitialTheme());
		});
	}, []);

	return (
		<html lang={localeResult.locale} suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body>
				<AppI18nProvider locale={localeResult.locale}>
					<AppShell user={user} locale={localeResult.locale}>
						{children}
					</AppShell>
				</AppI18nProvider>
				<Toaster
					theme={toastTheme}
					position="top-right"
					richColors
					closeButton
				/>
				<Scripts />
			</body>
		</html>
	);
}
