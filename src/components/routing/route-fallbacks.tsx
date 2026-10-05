import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";

export function RouteErrorFallback({ reset }: ErrorComponentProps) {
	return (
		<div className="mx-auto max-w-xl py-12">
			<Card className="p-8 text-center">
				<h1 className="font-display text-2xl font-semibold text-foreground">
					Não foi possível carregar esta página
				</h1>
				<p className="mt-3 text-sm leading-6 text-muted">
					Tente novamente. Se o problema continuar, volte ao início e tente
					acessar a página outra vez.
				</p>
				<div className="mt-6 flex flex-wrap justify-center gap-3">
					<Button type="button" variant="secondary" onClick={reset}>
						Tentar novamente
					</Button>
					<Link
						to="/"
						className="inline-flex items-center justify-center rounded-lg border border-transparent bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
					>
						Voltar ao início
					</Link>
				</div>
			</Card>
		</div>
	);
}

export function NotFoundPage() {
	return (
		<div className="mx-auto max-w-xl py-12">
			<Card className="p-8 text-center">
				<p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
					Erro 404
				</p>
				<h1 className="mt-2 font-display text-2xl font-semibold text-foreground">
					Página não encontrada
				</h1>
				<p className="mt-3 text-sm leading-6 text-muted">
					O endereço pode estar incorreto ou a página não existe mais.
				</p>
				<Link
					to="/"
					className="mt-6 inline-flex items-center justify-center rounded-lg border border-transparent bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
				>
					Voltar ao início
				</Link>
			</Card>
		</div>
	);
}
