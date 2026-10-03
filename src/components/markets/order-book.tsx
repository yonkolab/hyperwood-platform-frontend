import { Card, CardTitle } from "#/components/ui/card";
import type {
	OrderBookSnapshotResponse,
	TradeListResponse,
} from "#/lib/api/types";
import { formatDateTime, formatPriceBps } from "#/lib/format";

type BookLevelRow = {
	outcome: "yes" | "no";
	side: "bid" | "ask";
	priceBps: number;
	quantity: number;
};

export function OrderBookPanel(props: {
	orderBook: OrderBookSnapshotResponse;
	trades: TradeListResponse;
}) {
	const levels: BookLevelRow[] = [
		...props.orderBook.books.yes.bids.map((level) => ({
			outcome: "yes" as const,
			side: "bid" as const,
			priceBps: level.priceBps,
			quantity: level.quantity,
		})),
		...props.orderBook.books.yes.asks.map((level) => ({
			outcome: "yes" as const,
			side: "ask" as const,
			priceBps: level.priceBps,
			quantity: level.quantity,
		})),
		...props.orderBook.books.no.bids.map((level) => ({
			outcome: "no" as const,
			side: "bid" as const,
			priceBps: level.priceBps,
			quantity: level.quantity,
		})),
		...props.orderBook.books.no.asks.map((level) => ({
			outcome: "no" as const,
			side: "ask" as const,
			priceBps: level.priceBps,
			quantity: level.quantity,
		})),
	]
		.sort((left, right) => right.priceBps - left.priceBps)
		.slice(0, 8);

	return (
		<div className="grid gap-6 xl:grid-cols-2">
			<Card className="p-5">
				<CardTitle>Livro de ofertas</CardTitle>
				<div className="mt-4 space-y-3">
					{levels.map((level) => (
						<div
							key={`${level.outcome}-${level.side}-${level.priceBps}`}
							className="grid grid-cols-[1fr_auto_auto] gap-3 rounded-lg border border-edge bg-card px-3 py-3 text-sm"
						>
							<span className="capitalize text-foreground">
								{level.side} {level.outcome}
							</span>
							<span className="text-muted">{level.quantity}</span>
							<span className="font-semibold text-brand">
								{formatPriceBps(level.priceBps)}
							</span>
						</div>
					))}
				</div>
			</Card>
			<Card className="p-5">
				<CardTitle>Negócios recentes</CardTitle>
				<div className="mt-4 space-y-3">
					{props.trades.trades.slice(0, 8).map((trade) => (
						<div
							key={trade.id}
							className="grid grid-cols-[auto_1fr_auto] gap-3 rounded-lg border border-edge bg-card px-3 py-3 text-sm"
						>
							<span className="capitalize text-muted">{trade.outcome}</span>
							<span className="text-muted">
								{formatDateTime(trade.executedAt)}
							</span>
							<span className="font-semibold text-foreground">
								{formatPriceBps(trade.priceBps)}
							</span>
						</div>
					))}
				</div>
			</Card>
		</div>
	);
}
