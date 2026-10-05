import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { HistoryPageSkeleton } from "#/components/loading/page-skeletons";
import { Card } from "#/components/ui/card";
import { formatDateTime, formatPriceBps } from "#/lib/format";
import {
	currentUserQueryOptions,
	historicalOrdersQueryOptions,
} from "#/lib/query-options";

const currency = "BRL";

export const Route = createFileRoute("/portfolio/history/orders")({
	loader: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData(
			currentUserQueryOptions,
		);
		if (!user) throw redirect({ to: "/login" });
		await context.queryClient.ensureQueryData(
			historicalOrdersQueryOptions(currency),
		);
	},
	pendingMs: 150,
	pendingComponent: HistoryPageSkeleton,
	component: OrderHistoryPage,
});

function OrderHistoryPage() {
	const { data } = useSuspenseQuery(historicalOrdersQueryOptions(currency));

	return (
		<Card className="p-5">
			<h1 className="font-display text-2xl font-semibold text-foreground">
				Histórico de ordens
			</h1>
			<div className="mt-5 space-y-3">
				{data.orders.map((order) => (
					<div
						key={order.orderId}
						className="grid grid-cols-[1fr_auto_auto_auto] gap-4 rounded-lg border border-edge bg-card/70 px-4 py-4"
					>
						<div>
							<p className="font-medium text-foreground">{order.marketTitle}</p>
							<p className="mt-1 text-sm text-muted">
								{formatDateTime(order.createdAt)}
							</p>
						</div>
						<span className="text-sm text-muted">{order.status}</span>
						<span className="text-sm text-muted">{order.quantity}</span>
						<span className="font-semibold text-brand">
							{formatPriceBps(order.referencePriceBps)}
						</span>
					</div>
				))}
			</div>
		</Card>
	);
}
