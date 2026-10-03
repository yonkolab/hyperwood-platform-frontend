import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MarketChart } from "#/components/markets/market-chart";
import { MarketComments } from "#/components/markets/market-comments";
import { OrderBookPanel } from "#/components/markets/order-book";
import { TradeTicket } from "#/components/markets/trade-ticket";
import { Badge } from "#/components/ui/badge";
import { Card } from "#/components/ui/card";
import {
	formatDateTime,
	formatPriceBps,
	formatRelativeCountdown,
} from "#/lib/format";
import {
	currentUserQueryOptions,
	marketAnnouncementsQueryOptions,
	marketCandlesQueryOptions,
	marketDetailQueryOptions,
	marketOrderBookQueryOptions,
	marketTradesQueryOptions,
} from "#/lib/query-options";
import {
	getPublicMarketStreamUrl,
	useSseInvalidation,
} from "#/lib/realtime/use-sse-invalidation";

export const Route = createFileRoute("/markets/$marketId")({
	loader: async ({ context, params }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(
				marketDetailQueryOptions(params.marketId),
			),
			context.queryClient.ensureQueryData(
				marketOrderBookQueryOptions(params.marketId),
			),
			context.queryClient.ensureQueryData(
				marketTradesQueryOptions(params.marketId),
			),
			context.queryClient.ensureQueryData(
				marketAnnouncementsQueryOptions(params.marketId),
			),
			context.queryClient.ensureQueryData(currentUserQueryOptions),
		]);
	},
	component: MarketDetailPage,
});

function MarketDetailPage() {
	const { marketId } = Route.useParams();
	const { data: market } = useSuspenseQuery(marketDetailQueryOptions(marketId));
	const { data: orderBook } = useSuspenseQuery(
		marketOrderBookQueryOptions(marketId),
	);
	const { data: trades } = useSuspenseQuery(marketTradesQueryOptions(marketId));
	const isArchived =
		market.status === "settled" ||
		market.status === "voided" ||
		market.status === "cancelled";
	const { data: candles } = useQuery({
		...marketCandlesQueryOptions(marketId),
		enabled: isArchived,
	});
	const { data: announcements } = useSuspenseQuery(
		marketAnnouncementsQueryOptions(marketId),
	);
	const { data: user } = useSuspenseQuery(currentUserQueryOptions);

	useSseInvalidation({
		sourceUrl: getPublicMarketStreamUrl(marketId),
		eventNames: [
			"snapshot",
			"order_book_updated",
			"trade_batch",
			"status_changed",
			"announcement_published",
		],
		invalidateKeys: [
			["markets", marketId, "detail"],
			["markets", marketId, "order-book"],
			["markets", marketId, "trades"],
			["markets", marketId, "candles"],
			["markets", marketId, "announcements"],
			["markets", "home"],
		],
	});

	return (
		<div className="space-y-8">
			<Card className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-7">
				<div className="space-y-5">
					<div className="flex flex-wrap items-start justify-between gap-4">
						<div className="space-y-3">
							<Badge>{market.event.category}</Badge>
							<h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground lg:text-5xl">
								{market.title}
							</h1>
							<p className="max-w-3xl text-sm leading-6 text-muted">
								{market.summary ??
									"Mercado de previsão com liquidez em tempo real."}
							</p>
						</div>
						<div className="rounded-lg border border-edge bg-card px-4 py-3 text-right">
							<p className="text-xs uppercase tracking-[0.24em] text-muted">
								Fecha em
							</p>
							<p className="mt-2 text-2xl font-semibold text-no">
								{market.closesAt
									? formatRelativeCountdown(market.closesAt)
									: "—"}
							</p>
						</div>
					</div>
					<div className="grid gap-3 sm:grid-cols-3">
						<MetricCard
							label="Preço sim"
							value={formatPriceBps(market.yesPriceBps)}
							tone="positive"
						/>
						<MetricCard
							label="Preço não"
							value={formatPriceBps(market.noPriceBps)}
							tone="negative"
						/>
						<MetricCard label="Status" value={market.status} />
					</div>
					<MarketChart candles={candles} />
				</div>
				<TradeTicket market={market} user={user} />
			</Card>
			<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
				<Card className="p-5">
					<h2 className="text-xl font-semibold text-foreground">
						Regras de resolução
					</h2>
					<p className="mt-4 text-sm leading-6 text-muted">
						{market.resolutionRules}
					</p>
					<h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-muted">
						Fontes
					</h3>
					<ul className="mt-3 space-y-2 text-sm text-brand">
						{market.resolutionSources.map((source) => (
							<li key={source}>
								<a href={source} target="_blank" rel="noreferrer">
									{source}
								</a>
							</li>
						))}
					</ul>
				</Card>
				<Card className="p-5">
					<h2 className="text-xl font-semibold text-foreground">Anúncios</h2>
					<div className="mt-4 space-y-4">
						{announcements.length === 0 ? (
							<p className="text-sm text-muted">Nenhum anúncio publicado.</p>
						) : (
							announcements.map((announcement) => (
								<div
									key={announcement.id}
									className="rounded-lg border border-edge bg-card p-4"
								>
									<p className="text-sm font-semibold text-foreground">
										{announcement.title}
									</p>
									<p className="mt-2 text-sm text-muted">
										{announcement.message}
									</p>
									<p className="mt-3 text-xs text-muted">
										{formatDateTime(announcement.publishedAt)}
									</p>
								</div>
							))
						)}
					</div>
				</Card>
			</div>
			<OrderBookPanel orderBook={orderBook} trades={trades} />
			<MarketComments marketId={marketId} user={user} />
		</div>
	);
}

function MetricCard(props: {
	label: string;
	value: string;
	tone?: "default" | "positive" | "negative";
}) {
	return (
		<div
			className={[
				"rounded-lg border p-4",
				props.tone === "positive"
					? "border-yes/25 bg-yes-soft"
					: props.tone === "negative"
						? "border-rose-500/20 bg-no-soft"
						: "border-edge bg-card/70",
			].join(" ")}
		>
			<p className="text-xs uppercase tracking-[0.2em] text-muted">
				{props.label}
			</p>
			<p className="mt-3 text-2xl font-semibold text-foreground">
				{props.value}
			</p>
		</div>
	);
}
