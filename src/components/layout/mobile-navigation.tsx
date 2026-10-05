import { Dialog } from "@base-ui/react/dialog";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { Home, Info, Menu, Search, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import type { AppLocale } from "#/env";
import type { User } from "#/lib/api/types";
import type { HomeSearch } from "#/routes/index";
import { SettingsActions } from "./settings-menu";

type MobileNavigationProps = {
	categories: string[];
	locale: AppLocale;
	user: User | null;
	isLoggingOut: boolean;
	onLogout: () => void;
};

export function MobileNavigation(props: MobileNavigationProps) {
	const [sheetOpen, setSheetOpen] = useState(false);
	const [helpVisible, setHelpVisible] = useState(true);
	const router = useRouter();
	const location = useRouterState({ select: (state) => state.location });
	const selectedCategory =
		location.pathname === "/" && typeof location.search.category === "string"
			? location.search.category
			: undefined;
	const isHome = location.pathname === "/";

	function openSearch() {
		const focusSearch = () => {
			document.getElementById("header-mobile-search")?.focus();
			document.querySelector("header")?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		};

		if (isHome) {
			focusSearch();
			return;
		}

		void router.navigate({ to: "/" }).then(() => {
			window.setTimeout(focusSearch, 0);
		});
	}

	return (
		<Dialog.Root open={sheetOpen} onOpenChange={setSheetOpen}>
			{helpVisible ? (
				<div className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-40 flex h-9 items-center justify-center border-t border-edge bg-card px-4 md:hidden">
					<button
						type="button"
						className="flex items-center gap-2 text-xs font-medium text-brand"
						onClick={() => setSheetOpen(true)}
					>
						<Info className="size-3.5" aria-hidden="true" />
						Como funciona
					</button>
					<button
						type="button"
						className="absolute right-3 flex size-8 items-center justify-center text-muted"
						aria-label="Fechar aviso"
						onClick={() => setHelpVisible(false)}
					>
						<X className="size-4" aria-hidden="true" />
					</button>
				</div>
			) : null}
			<nav
				aria-label="Navegação principal"
				className="fixed inset-x-0 bottom-0 z-40 border-t border-edge bg-card/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(13,31,23,0.08)] backdrop-blur md:hidden"
			>
				<div className="mx-auto grid h-14 max-w-lg grid-cols-4">
					<Link
						to="/"
						search={{}}
						aria-current={isHome ? "page" : undefined}
						className={mobileNavItemClass(isHome)}
					>
						<Home className="size-5" aria-hidden="true" />
						<span>Início</span>
					</Link>
					<button
						type="button"
						className={mobileNavItemClass(false)}
						onClick={openSearch}
					>
						<Search className="size-5" aria-hidden="true" />
						<span>Buscar</span>
					</button>
					<Link
						to="/"
						search={{ sort: "highest_volume" } satisfies HomeSearch}
						aria-current={
							isHome && location.search.sort === "highest_volume"
								? "page"
								: undefined
						}
						className={mobileNavItemClass(
							isHome && location.search.sort === "highest_volume",
						)}
					>
						<TrendingUp className="size-5" aria-hidden="true" />
						<span>Em alta</span>
					</Link>
					<Dialog.Trigger
						className={mobileNavItemClass(sheetOpen)}
						aria-label="Mais"
					>
						<Menu className="size-5" aria-hidden="true" />
						<span>Mais</span>
					</Dialog.Trigger>
				</div>
			</nav>

			<Dialog.Portal>
				<Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 md:hidden" />
				<Dialog.Popup className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-2xl border border-edge bg-card pb-[calc(env(safe-area-inset-bottom)+1rem)] text-foreground shadow-2xl transition-transform duration-200 data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full md:hidden">
					<div className="mx-auto flex max-w-lg items-center justify-between px-5 pb-4 pt-3">
						<div className="h-1 w-10 rounded-full bg-edge" aria-hidden="true" />
						<Dialog.Title className="sr-only">Mais opções</Dialog.Title>
						<Dialog.Close
							className="flex size-9 items-center justify-center rounded-full text-muted transition hover:bg-subtle hover:text-foreground"
							aria-label="Fechar menu"
						>
							<X className="size-5" aria-hidden="true" />
						</Dialog.Close>
					</div>

					<div className="mx-auto max-w-lg space-y-5 px-5">
						<section aria-labelledby="mobile-categories-heading">
							<h2
								id="mobile-categories-heading"
								className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted"
							>
								Categorias
							</h2>
							<div className="grid grid-cols-2 gap-2">
								<Link
									to="/"
									search={{}}
									onClick={() => setSheetOpen(false)}
									className={sheetLinkClass(!selectedCategory)}
								>
									Tendências
								</Link>
								{props.categories.map((category) => (
									<Link
										key={category}
										to="/"
										search={{ category }}
										onClick={() => setSheetOpen(false)}
										className={sheetLinkClass(selectedCategory === category)}
									>
										{category}
									</Link>
								))}
							</div>
						</section>

						<section aria-labelledby="mobile-account-heading">
							<h2
								id="mobile-account-heading"
								className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted"
							>
								Conta
							</h2>
							{props.user ? (
								<div className="space-y-1">
									<p className="truncate px-3 py-2 text-sm text-muted">
										{props.user.email}
									</p>
									<Link
										to="/portfolio"
										onClick={() => setSheetOpen(false)}
										className={sheetLinkClass(false)}
									>
										Portfolio
									</Link>
									<Link
										to="/wallet"
										onClick={() => setSheetOpen(false)}
										className={sheetLinkClass(false)}
									>
										Carteira
									</Link>
									<button
										type="button"
										className={`${sheetLinkClass(false)} w-full text-left disabled:opacity-50`}
										disabled={props.isLoggingOut}
										onClick={() => {
											setSheetOpen(false);
											props.onLogout();
										}}
									>
										Sair
									</button>
								</div>
							) : (
								<div className="grid grid-cols-2 gap-2">
									<Link
										to="/login"
										onClick={() => setSheetOpen(false)}
										className={sheetLinkClass(false)}
									>
										Entrar
									</Link>
									<Link
										to="/register"
										onClick={() => setSheetOpen(false)}
										className={sheetLinkClass(false)}
									>
										Cadastre-se
									</Link>
								</div>
							)}
						</section>

						<section aria-labelledby="mobile-preferences-heading">
							<h2
								id="mobile-preferences-heading"
								className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted"
							>
								Preferências e ajuda
							</h2>
							<div className="overflow-hidden rounded-xl border border-edge">
								<SettingsActions
									locale={props.locale}
									isAuthenticated={Boolean(props.user)}
									onAction={() => setSheetOpen(false)}
								/>
							</div>
						</section>
					</div>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

function mobileNavItemClass(active: boolean) {
	return `flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition ${
		active ? "text-brand" : "text-muted hover:text-foreground"
	}`;
}

function sheetLinkClass(active: boolean) {
	return `flex min-h-11 items-center rounded-lg border px-3 py-2 text-sm transition ${
		active
			? "border-brand/20 bg-brand-soft font-semibold text-brand"
			: "border-edge bg-background text-foreground hover:bg-subtle"
	}`;
}
