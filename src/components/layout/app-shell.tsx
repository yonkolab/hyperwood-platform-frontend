import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { Menu, Search } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { ThemeToggle } from "#/components/ui/theme-toggle";
import type { AppLocale } from "#/env";
import { logoutUser } from "#/features/auth/server";
import type { User } from "#/lib/api/types";
import { marketCategoriesQueryOptions } from "#/lib/query-options";
import { LocaleSwitcher } from "./locale-switcher";

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

	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="sticky top-0 z-40 border-b border-edge bg-card/90 backdrop-blur">
				<div className="mx-auto max-w-7xl px-4 lg:px-8">
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

						<LocaleSwitcher locale={props.locale} />
						<ThemeToggle />
						{props.user ? (
							<div className="hidden items-center gap-3 md:flex">
								<span className="text-sm text-muted">{props.user.email}</span>
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
						)}
						<Button variant="ghost" className="md:hidden">
							<Menu className="size-4" />
						</Button>
					</div>
					<div className="scrollbar-none -mx-4 overflow-x-auto px-4">
						<nav className="flex min-w-max items-center gap-6 py-2.5 text-sm">
							<Link
								to="/"
								search={{}}
								className={`whitespace-nowrap transition ${
									!selectedCategory
										? "font-semibold text-foreground"
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
									className={`whitespace-nowrap transition ${
										selectedCategory === category
											? "font-semibold text-foreground"
											: "text-muted hover:text-foreground"
									}`}
								>
									{category}
								</Link>
							))}
						</nav>
					</div>
				</div>
			</header>
			<main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
				{props.children}
			</main>
		</div>
	);
}
