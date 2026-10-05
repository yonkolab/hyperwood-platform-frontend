import { Link, useRouter } from "@tanstack/react-router";
import {
	BookOpen,
	CircleDot,
	Gauge,
	HelpCircle,
	Languages,
	type LucideIcon,
	Moon,
	ScrollText,
	Sun,
	UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "#/components/ui/button";
import type { AppLocale } from "#/env";
import { setLocalePreference } from "#/features/auth/server";
import { resolveInitialTheme, toggleTheme } from "#/lib/theme";

type MenuItem = {
	label: string;
	icon: LucideIcon;
	action?: () => void | Promise<void>;
	href?: string;
	divider?: boolean;
};

export function SettingsActions(props: {
	locale: AppLocale;
	onAction?: () => void;
	isAuthenticated?: boolean;
}) {
	const [theme, setThemeState] = useState<"light" | "dark">("light");
	const router = useRouter();

	useEffect(() => {
		setThemeState(resolveInitialTheme());
	}, []);

	async function handleLocaleChange() {
		const nextLocale: AppLocale = props.locale === "pt-BR" ? "en" : "pt-BR";
		await setLocalePreference({ data: { locale: nextLocale } });
		await router.invalidate();
		props.onAction?.();
	}

	function handleThemeToggle() {
		setThemeState(toggleTheme());
		props.onAction?.();
	}

	const items: MenuItem[] = [
		{
			label: theme === "dark" ? "Tema claro" : "Tema escuro",
			icon: theme === "dark" ? Sun : Moon,
			action: handleThemeToggle,
		},
		{
			label: `Idioma: ${props.locale === "pt-BR" ? "Português" : "English"}`,
			icon: Languages,
			action: handleLocaleChange,
		},
		{ label: "divider1", icon: HelpCircle, divider: true },
		{ label: "Accuracy", icon: Gauge, href: "#" },
		{ label: "Documentation", icon: BookOpen, href: "#" },
		{ label: "Status", icon: CircleDot, href: "#" },
		{ label: "Help Center", icon: HelpCircle, href: "#" },
		{ label: "Terms of Use", icon: ScrollText, href: "#" },
	];

	return (
		<>
			{props.isAuthenticated ? (
				<Link
					to="/profile"
					className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-foreground transition hover:bg-subtle"
					onClick={() => props.onAction?.()}
				>
					<UserRound className="size-4 text-muted" />
					Profile
				</Link>
			) : null}
			{items.map((item) =>
				item.divider ? (
					<div key={item.label} className="my-1 border-t border-edge" />
				) : item.action ? (
					<button
						key={item.label}
						type="button"
						className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-foreground transition hover:bg-subtle"
						onClick={() => {
							void item.action?.();
						}}
					>
						<item.icon className="size-4 text-muted" />
						{item.label}
					</button>
				) : (
					<button
						key={item.label}
						type="button"
						className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-foreground transition hover:bg-subtle"
						onClick={() => props.onAction?.()}
					>
						<item.icon className="size-4 text-muted" />
						{item.label}
					</button>
				),
			)}
		</>
	);
}

export function SettingsMenu(props: {
	locale: AppLocale;
	isAuthenticated: boolean;
}) {
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) {
			return;
		}

		function handlePointerDown(event: PointerEvent) {
			if (
				event.target instanceof Node &&
				!menuRef.current?.contains(event.target)
			) {
				setOpen(false);
			}
		}

		document.addEventListener("pointerdown", handlePointerDown);
		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
		};
	}, [open]);

	return (
		<div ref={menuRef} className="relative">
			<Button
				variant="ghost"
				type="button"
				aria-label="Menu de configurações"
				aria-expanded={open}
				onClick={() => {
					setOpen((value) => !value);
				}}
			>
				<svg
					viewBox="0 0 24 24"
					className="size-5"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<line x1="4" x2="20" y1="6" y2="6" />
					<line x1="4" x2="20" y1="12" y2="12" />
					<line x1="4" x2="20" y1="18" y2="18" />
				</svg>
			</Button>
			{open ? (
				<>
					<button
						type="button"
						aria-label="Fechar menu"
						className="fixed inset-0 z-10 cursor-default"
						onClick={() => {
							setOpen(false);
						}}
					/>
					<div className="absolute right-0 top-11 z-20 w-56 overflow-hidden rounded-lg border border-edge bg-card py-1 shadow-[0_8px_24px_rgba(13,31,23,0.14)]">
						<SettingsActions
							locale={props.locale}
							isAuthenticated={props.isAuthenticated}
							onAction={() => setOpen(false)}
						/>
					</div>
				</>
			) : null}
		</div>
	);
}
