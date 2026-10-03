import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Card } from "#/components/ui/card";
import { formatMoney, formatPriceBps } from "#/lib/format";
import {
	currentUserQueryOptions,
	portfolioFillsQueryOptions,
	portfolioSettlementsQueryOptions,
	portfolioSummaryQueryOptions,
} from "#/lib/query-options";
import {
	getPrivatePortfolioStreamUrl,
	useSseInvalidation,
} from "#/lib/realtime/use-sse-invalidation";

const currency = "BRL";

export const Route = createFileRoute("/portfolio")({
	loader: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData(
			currentUserQueryOptions,
		);

		if (!user) {
			throw redirect({ to: "/login" });
		}

		await Promise.all([
			context.queryClient.ensureQueryData(
				portfolioSummaryQueryOptions(currency),
			),
			context.queryClient.ensureQueryData(portfolioFillsQueryOptions(currency)),
			context.queryClient.ensureQueryData(
				portfolioSettlementsQueryOptions(currency),
			),
		]);
	},
	component: PortfolioPage,
});

function PortfolioPage() {
	const { data: summary } = useSuspenseQuery(
		portfolioSummaryQueryOptions(currency),
	);
	const { data: fills } = useSuspenseQuery(
		portfolioFillsQueryOptions(currency),
	);
	const { data: settlements } = useSuspenseQuery(
		portfolioSettlementsQueryOptions(currency),
	);

	useSseInvalidation({
		sourceUrl: getPrivatePortfolioStreamUrl(currency),
		eventNames: [
			"account_snapshot",
			"order_updated",
			"balance_updated",
			"transfer_updated",
			"fill_batch",
			"settlement_updated",
		],
		invalidateKeys: [
			["portfolio", "summary", currency],
			["portfolio", "fills", currency],
			["portfolio", "settlements", currency],
			["wallet", "balance", currency],
		],
	});

	return (
		<div className="space-y-8">
			<section className="grid gap-4 lg:grid-cols-4">
				<SummaryCard
					label="Disponível"
					value={formatMoney(summary.cash.availableBalanceMinor)}
				/>
				<SummaryCard
					label="Reservado"
					value={formatMoney(summary.cash.reservedBalanceMinor)}
				/>
				<SummaryCard
					label="Colateral"
					value={formatMoney(summary.cash.positionCollateralMinor)}
				/>
				<SummaryCard
					label="Total"
					value={formatMoney(summary.cash.totalBalanceMinor)}
				/>
			</section>
			<section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
				<Card className="p-5">
					<h2 className="font-display text-xl font-semibold text-foreground">
						Posições abertas
					</h2>
					<div className="mt-4 space-y-3">
						{summary.positions.length === 0 ? (
							<p className="text-sm text-muted">Sem posições abertas.</p>
						) : (
							summary.positions.map((position) => (
								<div
									key={`${position.marketId}-${position.outcome}`}
									className="grid grid-cols-[1fr_auto_auto] gap-4 rounded-lg border border-edge bg-card/70 px-4 py-4"
								>
									<div>
										<p className="font-medium text-foreground">
											{position.marketTitle}
										</p>
										<p className="mt-1 text-sm text-muted">
											{position.outcome}
										</p>
									</div>
									<span className="text-sm text-muted">
										{position.quantity}
									</span>
									<span className="font-semibold text-brand">
										{formatPriceBps(position.averageEntryPriceBps)}
									</span>
								</div>
							))
						)}
					</div>
				</Card>
				<Card className="p-5">
					<h2 className="font-display text-xl font-semibold text-foreground">
						Liquidações recentes
					</h2>
					<div className="mt-4 space-y-3">
						{settlements.settlements.slice(0, 6).map((settlement) => (
							<div
								key={settlement.settlementId}
								className="rounded-lg border border-edge bg-card/70 p-4"
							>
								<p className="font-medium text-foreground">
									{settlement.marketTitle}
								</p>
								<p className="mt-1 text-sm text-muted">{settlement.outcome}</p>
								<p className="mt-3 text-sm font-semibold text-yes">
									{formatMoney(settlement.netPnlMinor)}
								</p>
							</div>
						))}
					</div>
				</Card>
			</section>
			<Card className="p-5">
				<h2 className="font-display text-xl font-semibold text-foreground">
					Fills recentes
				</h2>
				<div className="mt-4 space-y-3">
					{fills.fills.slice(0, 8).map((fill) => (
						<div
							key={fill.tradeId}
							className="grid grid-cols-[1fr_auto_auto] gap-4 rounded-lg border border-edge bg-card/70 px-4 py-4"
						>
							<div>
								<p className="font-medium text-foreground">
									{fill.marketTitle}
								</p>
								<p className="mt-1 text-sm text-muted">
									{fill.side} {fill.outcome}
								</p>
							</div>
							<span className="text-sm text-muted">{fill.quantity}</span>
							<span className="font-semibold text-brand">
								{formatPriceBps(fill.priceBps)}
							</span>
						</div>
					))}
				</div>
			</Card>
		</div>
	);
}

function SummaryCard(props: { label: string; value: string }) {
	return (
		<Card className="p-5">
			<p className="text-xs uppercase tracking-[0.2em] text-muted">
				{props.label}
			</p>
			<p className="mt-3 font-display text-2xl font-semibold text-foreground">
				{props.value}
			</p>
		</Card>
	);
}
