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
		],
		links: [{ rel: "stylesheet", href: appCss }],
		scripts: [
			{
				children:
					"try{var t=localStorage.getItem('hw-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}",
			},
		],
	}),
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
