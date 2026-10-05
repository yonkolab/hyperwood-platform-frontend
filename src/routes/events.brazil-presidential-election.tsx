import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Card } from "#/components/ui/card";
import { formatPriceBps } from "#/lib/format";
import {
	electionEventQueryOptions,
	marketDetailQueryOptions,
} from "#/lib/query-options";

const EVENT_SLUG = "eleicoes-brasil-2026";
const ACTIVE_CANDIDATE_SLUGS = new Set([
	"eleicoes-2026-flavio-eleito",
	"eleicoes-2026-lula-reeleito",
]);
const RESOLVED_CANDIDATE_PREFIX = "eleicoes-brasil-2026-outcome-";

export const Route = createFileRoute("/events/brazil-presidential-election")({
	loader: async ({ context }) => {
		const eventData = await context.queryClient.ensureQueryData(
			electionEventQueryOptions(EVENT_SLUG),
		);
		const activeMarket = eventData.markets.find((market) =>
			ACTIVE_CANDIDATE_SLUGS.has(market.slug),
		);

		if (!activeMarket) {
			throw new Error("Mercados ativos da eleição não encontrados.");
		}

		await context.queryClient.ensureQueryData(
			marketDetailQueryOptions(activeMarket.id),
		);
	},
	component: BrazilPresidentialElectionPage,
});

function BrazilPresidentialElectionPage() {
	const { data } = useSuspenseQuery(electionEventQueryOptions(EVENT_SLUG));
	const candidateMarkets = data.markets.filter(
		(market) =>
			ACTIVE_CANDIDATE_SLUGS.has(market.slug) ||
			market.slug.startsWith(RESOLVED_CANDIDATE_PREFIX),
	);
	const activeMarkets = candidateMarkets
		.filter((market) => market.status === "active")
		.sort((left, right) => right.yesPriceBps - left.yesPriceBps);
	const resolvedMarkets = candidateMarkets
		.filter((market) => market.status === "settled")
		.sort((left, right) => left.title.localeCompare(right.title, "pt-BR"));
	const relatedMarkets = data.markets.filter(
		(market) =>
			!ACTIVE_CANDIDATE_SLUGS.has(market.slug) &&
			!market.slug.startsWith(RESOLVED_CANDIDATE_PREFIX),
	);
	const { data: rulesMarket } = useSuspenseQuery(
		marketDetailQueryOptions(activeMarkets[0]?.id ?? candidateMarkets[0].id),
	);
	const eventSummary =
		data.markets[0]?.event.summary ??
		"Mercado para acompanhar a eleição presidencial brasileira de 2026.";

	return (
		<div className="mx-auto max-w-5xl space-y-8">
			<header className="space-y-3">
				<Link to="/" className="text-sm font-medium text-brand hover:underline">
					← Todos os mercados
				</Link>
				<p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
					{data.event.category}
				</p>
				<h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
					{data.event.eventTitle}
				</h1>
				<p className="max-w-3xl text-sm leading-6 text-muted">{eventSummary}</p>
				<p className="text-xs leading-5 text-muted">
					As cotações dos contratos ativos foram copiadas da Polymarket em
					5/10/2026 e são apenas um snapshot de referência. Resultados marcados
					como resolvidos também espelham o status daquele mercado externo; isso
					não significa que a eleição tenha um vencedor definitivo.
				</p>
			</header>

			<section aria-labelledby="candidate-outcomes">
				<div className="mb-4 flex flex-wrap items-end justify-between gap-3">
					<div>
						<h2
							id="candidate-outcomes"
							className="font-display text-2xl font-semibold text-foreground"
						>
							Quem vence a eleição?
						</h2>
						<p className="mt-1 text-sm text-muted">
							Cotações de referência dos contratos individuais de cada
							candidato.
						</p>
					</div>
					<span className="text-sm text-muted">
						{activeMarkets.length} em negociação
					</span>
				</div>

				<div className="grid gap-3 sm:grid-cols-2">
					{activeMarkets.map((market) => (
						<Link
							key={market.id}
							to="/markets/$marketId"
							params={{ marketId: market.id }}
							className="group"
						>
							<Card className="flex h-full items-center justify-between gap-4 border-edge p-5 transition hover:border-brand/40 hover:bg-subtle">
								<div className="min-w-0">
									<p className="truncate font-semibold text-foreground">
										{market.title}
									</p>
									<p className="mt-1 text-xs font-medium text-brand">
										Em negociação · Sim
									</p>
								</div>
								<div className="flex shrink-0 items-center gap-2">
									<span className="text-2xl font-bold tabular-nums text-foreground">
										{formatPriceBps(market.yesPriceBps)}
									</span>
									<ArrowUpRight className="size-4 text-muted transition group-hover:text-brand" />
								</div>
							</Card>
						</Link>
					))}
				</div>
			</section>

			{resolvedMarkets.length > 0 ? (
				<details className="group rounded-xl border border-edge bg-card">
					<summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 [&::-webkit-details-marker]:hidden">
						<span>
							<span className="block font-semibold text-foreground">
								Resultados resolvidos ({resolvedMarkets.length})
							</span>
							<span className="mt-1 block text-sm text-muted">
								Recolhido por padrão · resultados espelhados da Polymarket
							</span>
						</span>
						<ChevronDown className="size-5 shrink-0 text-muted transition group-open:rotate-180" />
					</summary>
					<ol className="divide-y divide-edge border-t border-edge">
						{resolvedMarkets.map((market) => (
							<li key={market.id}>
								<Link
									to="/markets/$marketId"
									params={{ marketId: market.id }}
									className="flex items-center justify-between gap-3 px-5 py-3 transition hover:bg-subtle"
								>
									<span className="min-w-0 truncate text-sm font-medium text-foreground">
										{market.title}
									</span>
									<span
										className={`shrink-0 rounded px-2 py-1 text-xs font-bold uppercase ${
											market.yesPriceBps === 0
												? "bg-no-soft text-no"
												: "bg-yes-soft text-yes"
										}`}
									>
										{market.yesPriceBps === 0 ? "Não" : "Sim"}
									</span>
								</Link>
							</li>
						))}
					</ol>
				</details>
			) : null}

			<Card className="space-y-3 border-edge p-5">
				<h2 className="font-display text-xl font-semibold text-foreground">
					Regras de resolução
				</h2>
				<p className="text-sm leading-6 text-muted">
					{rulesMarket.resolutionRules}
				</p>
				<p className="text-sm text-muted">
					Fontes:{" "}
					<a
						className="font-medium text-brand hover:underline"
						href="https://polymarket.com/event/brazil-presidential-election"
						target="_blank"
						rel="noreferrer"
					>
						Polymarket
					</a>{" "}
					e{" "}
					<a
						className="font-medium text-brand hover:underline"
						href="https://resultados.tse.jus.br"
						target="_blank"
						rel="noreferrer"
					>
						TSE
					</a>
					.
				</p>
			</Card>

			{relatedMarkets.length > 0 ? (
				<section aria-labelledby="related-election-markets">
					<h2
						id="related-election-markets"
						className="mb-3 font-display text-xl font-semibold text-foreground"
					>
						Mercados relacionados
					</h2>
					<div className="divide-y divide-edge rounded-xl border border-edge bg-card">
						{relatedMarkets.map((market) => (
							<Link
								key={market.id}
								to="/markets/$marketId"
								params={{ marketId: market.id }}
								className="flex items-center justify-between gap-3 p-4 transition hover:bg-subtle"
							>
								<span className="min-w-0 truncate text-sm font-medium text-foreground">
									{market.title}
								</span>
								<span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
									{formatPriceBps(market.yesPriceBps)}
								</span>
							</Link>
						))}
					</div>
				</section>
			) : null}
		</div>
	);
}
