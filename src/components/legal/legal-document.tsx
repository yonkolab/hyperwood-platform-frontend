import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Card } from "#/components/ui/card";

export function LegalDocument(props: {
	title: string;
	description: string;
	children: ReactNode;
}) {
	return (
		<article className="mx-auto max-w-4xl">
			<header className="mb-8">
				<p className="text-sm font-semibold uppercase tracking-wider text-brand">
					Hyperwood · Documentos legais
				</p>
				<h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
					{props.title}
				</h1>
				<p className="mt-3 max-w-3xl text-base leading-7 text-muted">
					{props.description}
				</p>
				<p className="mt-3 text-sm text-muted">
					Última atualização: preencher antes da publicação.
				</p>
			</header>

			<Card className="mb-8 border-amber-500/40 bg-amber-500/5 p-4 sm:p-5">
				<p className="text-sm font-semibold text-foreground">
					Rascunho para revisão jurídica
				</p>
				<p className="mt-1 text-sm leading-6 text-muted">
					Este texto é um ponto de partida informativo, não constitui
					aconselhamento jurídico nem confirma autorização regulatória para
					oferecer mercados com dinheiro ou ativos de valor real. Complete os
					campos entre colchetes e obtenha revisão jurídica especializada no
					Brasil antes de disponibilizar o serviço ou aceitar operações.
				</p>
			</Card>

			<div className="space-y-8 text-sm leading-7 text-muted sm:text-base">
				{props.children}
			</div>

			<nav
				aria-label="Outros documentos legais"
				className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-edge pt-6 text-sm font-medium text-brand"
			>
				<Link
					to="/terms"
					className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
				>
					Termos de uso
				</Link>
				<Link
					to="/privacy"
					className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
				>
					Política de privacidade
				</Link>
			</nav>
		</article>
	);
}

export function LegalSection(props: {
	id: string;
	title: string;
	children: ReactNode;
}) {
	return (
		<section aria-labelledby={props.id}>
			<h2
				id={props.id}
				className="font-display text-xl font-semibold leading-7 text-foreground"
			>
				{props.title}
			</h2>
			<div className="mt-3 space-y-4">{props.children}</div>
		</section>
	);
}
