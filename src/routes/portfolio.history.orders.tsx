import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
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
	component: OrderHistoryPage,
});

function OrderHistoryPage() {
	const { data } = useSuspenseQuery(historicalOrdersQueryOptions(currency));

	return (
		<Card className="p-5">
			<h1 className="text-2xl font-semibold text-white">Histórico de ordens</h1>
			<div className="mt-5 space-y-3">
				{data.orders.map((order) => (
					<div
						key={order.orderId}
						className="grid grid-cols-[1fr_auto_auto_auto] gap-4 rounded-2xl border border-slate-900 bg-slate-950/70 px-4 py-4"
					>
						<div>
							<p className="font-medium text-white">{order.marketTitle}</p>
							<p className="mt-1 text-sm text-slate-500">
								{formatDateTime(order.createdAt)}
							</p>
						</div>
						<span className="text-sm text-slate-300">{order.status}</span>
						<span className="text-sm text-slate-300">{order.quantity}</span>
						<span className="font-semibold text-cyan-300">
							{formatPriceBps(order.referencePriceBps)}
						</span>
					</div>
				))}
			</div>
		</Card>
	);
}
