import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { Bookmark, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "#/components/ui/navigation-menu";
import type { AppLocale } from "#/env";
import { logoutUser } from "#/features/auth/server";
import type { User } from "#/lib/api/types";
import { marketCategoriesQueryOptions } from "#/lib/query-options";
import { MobileNavigation } from "./mobile-navigation";
import { SettingsMenu } from "./settings-menu";
import { SiteFooter } from "./site-footer";

export function AppShell(props: {
	children: React.ReactNode;
	user: User | null;
	locale: AppLocale;
}) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const location = useRouterState({
		select: (state) => state.location,
	});
	const { data: marketCatalog } = useQuery(marketCategoriesQueryOptions);
	const selectedCategory =
		location.pathname === "/" && typeof location.search.category === "string"
			? location.search.category
			: undefined;
	const logoutMutation = useMutation({
		mutationFn: async () => logoutUser(),
		onSuccess: async () => {
			queryClient.clear();
			await router.invalidate();
			await router.navigate({ to: "/" });
		},
	});

	function submitMobileSearch(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const search = String(formData.get("search") ?? "").trim();
		void router.navigate({
			to: "/",
			search: (previous) => ({
				...previous,
				search: search || undefined,
			}),
		});
	}

	return (
		<div className="flex min-h-screen flex-col bg-background pb-[calc(3.5rem+env(safe-area-inset-bottom))] text-foreground md:pb-0">
			<header className="sticky top-0 z-40 border-b border-edge bg-card/90 backdrop-blur">
				<div className="mx-auto max-w-[1440px] px-4 lg:px-8">
					<div className="flex items-center gap-4 py-3">
						<Link to="/" className="flex shrink-0 items-center">
							<img
								src="/hyperwood-logo.png"
								alt="Hyperwood"
								className="h-8 w-auto"
							/>
						</Link>
						<div className="hidden flex-1 items-center gap-3 rounded-lg border border-edge bg-background px-3 py-2 md:flex">
							<Search className="size-4 text-muted" />
							<Input
								aria-label="search"
								placeholder="Pesquise mercados, temas ou eventos..."
								className="border-none bg-transparent px-0 py-0 focus:ring-0"
							/>
						</div>

						{props.user ? (
							<div className="hidden items-center gap-3 md:flex">
								<Link to="/portfolio">
									<Button>Portfolio</Button>
								</Link>
								<Button
									variant="ghost"
									onClick={() => logoutMutation.mutate()}
									disabled={logoutMutation.isPending}
								>
									Sair
								</Button>
							</div>
						) : (
							<>
								<div className="hidden items-center gap-3 md:flex">
									<Link
										to="/login"
										className="text-sm font-medium text-muted hover:text-foreground"
									>
										Entrar
									</Link>
									<Link to="/register">
										<Button>Cadastre-se</Button>
									</Link>
								</div>
								<Link
									to="/register"
									className="ml-auto rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover md:hidden"
								>
									Cadastre-se
								</Link>
							</>
						)}
						<div className="hidden md:block">
							<SettingsMenu
								locale={props.locale}
								isAuthenticated={Boolean(props.user)}
							/>
						</div>
					</div>
					<div className="scrollbar-none -mx-4 hidden overflow-x-auto px-4 md:block">
						<NavigationMenu className="min-w-max py-1.5">
							<NavigationMenuList>
								<NavigationMenuItem>
									<NavigationMenuLink
										render={<Link to="/" search={{}} />}
										active={!selectedCategory}
									>
										Tendências
									</NavigationMenuLink>
								</NavigationMenuItem>
								{marketCatalog?.categories.map((category) => (
									<NavigationMenuItem key={category}>
										<NavigationMenuLink
											render={<Link to="/" search={{ category }} />}
											active={selectedCategory === category}
										>
											{category}
										</NavigationMenuLink>
									</NavigationMenuItem>
								))}
							</NavigationMenuList>
						</NavigationMenu>
					</div>
					<div className="scrollbar-none -mx-4 overflow-x-auto border-t border-edge/70 px-4 md:hidden">
						<nav
							aria-label="Categorias"
							className="flex min-w-max gap-6 py-2.5"
						>
							<Link
								to="/"
								search={{}}
								aria-current={!selectedCategory ? "page" : undefined}
								className={`text-xs font-semibold transition ${
									!selectedCategory
										? "text-foreground"
										: "text-muted hover:text-foreground"
								}`}
							>
								Tendências
							</Link>
							{marketCatalog?.categories.map((category) => (
								<Link
									key={category}
									to="/"
									search={{ category }}
									aria-current={
										selectedCategory === category ? "page" : undefined
									}
									className={`text-xs font-semibold transition ${
										selectedCategory === category
											? "text-foreground"
											: "text-muted hover:text-foreground"
									}`}
								>
									{category}
								</Link>
							))}
						</nav>
					</div>
					<form
						className="flex items-center gap-2 pb-3 md:hidden"
						onSubmit={submitMobileSearch}
					>
						<div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-subtle px-3 py-2">
							<Search
								className="size-4 shrink-0 text-muted"
								aria-hidden="true"
							/>
							<Input
								id="header-mobile-search"
								name="search"
								aria-label="Pesquisar mercados"
								defaultValue={
									typeof location.search.search === "string"
										? location.search.search
										: ""
								}
								placeholder="Pesquisar mercados..."
								className="min-w-0 border-0 bg-transparent p-0 text-sm focus:ring-0"
							/>
						</div>
						<Button
							type="button"
							variant="ghost"
							className="size-10 shrink-0 p-0"
							aria-label="Filtros"
							onClick={() => {
								document.getElementById("market-filter-toggle")?.click();
							}}
						>
							<SlidersHorizontal className="size-5" aria-hidden="true" />
						</Button>
						<Link
							to={props.user ? "/portfolio" : "/login"}
							className="flex size-10 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-subtle hover:text-foreground"
							aria-label="Portfolio"
						>
							<Bookmark className="size-5" aria-hidden="true" />
						</Link>
					</form>
				</div>
			</header>
			<main className="mx-auto min-h-[60vh] w-full min-w-0 max-w-[1440px] px-4 py-4 md:py-8 lg:px-8">
				{props.children}
			</main>
			<SiteFooter />
			<MobileNavigation
				categories={marketCatalog?.categories ?? []}
				locale={props.locale}
				user={props.user}
				isLoggingOut={logoutMutation.isPending}
				onLogout={() => logoutMutation.mutate()}
			/>
		</div>
	);
}
