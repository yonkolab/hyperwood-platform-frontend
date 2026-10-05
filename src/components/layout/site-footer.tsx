import { Link } from "@tanstack/react-router";
import { Github, Twitter } from "lucide-react";

const CATEGORIES = [
	{ label: "Política", href: "/?category=Política" },
	{ label: "Esportes", href: "/?category=Esportes" },
	{ label: "Economia", href: "/?category=Economia" },
	{ label: "Entretenimento", href: "/?category=Entretenimento" },
	{ label: "Internacional", href: "/?category=Internacional" },
	{ label: "Tecnologia", href: "/?category=Tecnologia" },
	{ label: "Clima", href: "/?category=Clima" },
];

const HYPERWOOD_LINKS = [
	{ label: "Rewards", href: "#" },
	{ label: "APIs", href: "#" },
	{ label: "Leaderboard", href: "#" },
	{ label: "Institucional", href: "#" },
	{ label: "Accuracy", href: "#" },
	{ label: "Brand", href: "#" },
	{ label: "Activity", href: "#" },
	{ label: "Press", href: "#" },
];

const SUPPORT_LINKS = [
	{ label: "Central de ajuda", href: "#" },
	{ label: "Como funciona", href: "#" },
	{ label: "Taxas", href: "#" },
	{ label: "Termos de uso", href: "/terms" },
	{ label: "Privacidade", href: "/privacy" },
];

function FooterSection(props: {
	title: string;
	links: { label: string; href: string }[];
}) {
	return (
		<div>
			<h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
				{props.title}
			</h3>
			<ul className="mt-4 space-y-2.5">
				{props.links.map((link) => (
					<li key={link.label}>
						<Link
							to={link.href}
							className="text-sm text-muted transition hover:text-foreground"
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export function SiteFooter() {
	return (
		<footer className="mt-auto border-t border-edge bg-card/50">
			<div className="mx-auto max-w-[1440px] px-4 py-12 lg:px-8">
				<div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,1fr))]">
					<div className="space-y-4">
						<img
							src="/hyperwood-logo.png"
							alt="Hyperwood"
							className="h-8 w-auto"
						/>
						<p className="max-w-xs text-sm leading-6 text-muted">
							Plataforma de mercados de previsão. Negocie no futuro dos eventos
							que importam.
						</p>
						<div className="flex items-center gap-3 pt-2">
							<a
								href="https://x.com/hyperwood"
								target="_blank"
								rel="noreferrer"
								aria-label="X (Twitter)"
								className="flex size-9 items-center justify-center rounded-full border border-edge text-muted transition hover:border-brand/40 hover:text-foreground"
							>
								<Twitter className="size-4" />
							</a>
							<a
								href="https://github.com/yonkolab/hyperwood"
								target="_blank"
								rel="noreferrer"
								aria-label="GitHub"
								className="flex size-9 items-center justify-center rounded-full border border-edge text-muted transition hover:border-brand/40 hover:text-foreground"
							>
								<Github className="size-4" />
							</a>
						</div>
					</div>

					<FooterSection title="Categorias" links={CATEGORIES} />
					<FooterSection title="Hyperwood" links={HYPERWOOD_LINKS} />
					<FooterSection title="Suporte" links={SUPPORT_LINKS} />
				</div>

				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-edge pt-8 text-xs text-muted sm:flex-row">
					<span>© 2026 Hyperwood. Todos os direitos reservados.</span>
					<span className="text-center sm:text-right">
						Trading envolve risco. Operações são de sua responsabilidade.
					</span>
				</div>
			</div>
		</footer>
	);
}
