import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MarketChart } from "#/components/markets/market-chart";
import {
	countComments,
	MarketComments,
} from "#/components/markets/market-comments";
import { MarketPageActions } from "#/components/markets/market-page-actions";
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
	marketCommentsQueryOptions,
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
	const { data: candles } = useQuery(marketCandlesQueryOptions(marketId));
	const { data: commentsData } = useQuery(marketCommentsQueryOptions(marketId));
	const commentCount = countComments(commentsData?.comments ?? []);
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
		<div className="space-y-6">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div className="min-w-0 max-w-3xl space-y-2">
					<Badge>{market.event.category}</Badge>
					<h1 className="font-display text-2xl font-semibold leading-tight tracking-tight text-foreground lg:text-4xl">
						{market.title}
					</h1>
					<p className="text-sm leading-6 text-muted">
						{market.summary ??
							"Mercado de previsão com liquidez em tempo real."}
					</p>
				</div>
				<MarketPageActions
					market={market}
					commentCount={commentCount}
					candles={candles}
				/>
			</div>

			<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
				<div className="min-w-0 space-y-6">
					<MarketChart candles={candles} />
					<OrderBookPanel orderBook={orderBook} trades={trades} />
					<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
						<Card className="p-5">
							<h2 className="font-display text-xl font-semibold text-foreground">
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
							<h2 className="font-display text-xl font-semibold text-foreground">
								Anúncios
							</h2>
							<div className="mt-4 space-y-4">
								{announcements.length === 0 ? (
									<p className="text-sm text-muted">
										Nenhum anúncio publicado.
									</p>
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
					<div id="market-comments">
						<MarketComments marketId={marketId} user={user} />
					</div>
				</div>

				<div className="space-y-4 self-start xl:sticky xl:top-[116px]">
					<Card className="p-5">
						<div className="grid grid-cols-2 gap-3">
							<div className="rounded-lg bg-yes-soft p-3">
								<p className="text-xs font-medium text-yes">Sim</p>
								<p className="text-2xl font-bold text-yes">
									{formatPriceBps(market.yesPriceBps)}
								</p>
							</div>
							<div className="rounded-lg bg-no-soft p-3">
								<p className="text-xs font-medium text-no">Não</p>
								<p className="text-2xl font-bold text-no">
									{formatPriceBps(market.noPriceBps)}
								</p>
							</div>
						</div>
						<div className="mt-4 flex items-center justify-between border-t border-edge pt-4 text-sm">
							<span className="text-muted">Fecha em</span>
							<span className="font-semibold text-foreground">
								{market.closesAt
									? formatRelativeCountdown(market.closesAt)
									: "—"}
							</span>
						</div>
						<div className="mt-2 flex items-center justify-between text-sm">
							<span className="text-muted">Status</span>
							<span className="font-medium capitalize text-foreground">
								{market.status}
							</span>
						</div>
					</Card>
					<TradeTicket market={market} user={user} />
				</div>
			</div>
		</div>
	);
}
