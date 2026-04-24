import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Card } from "#/components/ui/card";
import { formatDateTime, formatPriceBps } from "#/lib/format";
import {
	currentUserQueryOptions,
	historicalFillsQueryOptions,
} from "#/lib/query-options";

const currency = "BRL";

export const Route = createFileRoute("/portfolio/history/fills")({
	loader: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData(
			currentUserQueryOptions,
		);
		if (!user) throw redirect({ to: "/login" });
		await context.queryClient.ensureQueryData(
			historicalFillsQueryOptions(currency),
		);
	},
	component: FillHistoryPage,
});

function FillHistoryPage() {
	const { data } = useSuspenseQuery(historicalFillsQueryOptions(currency));

	return (
		<Card className="p-5">
			<h1 className="text-2xl font-semibold text-white">Histórico de fills</h1>
			<div className="mt-5 space-y-3">
				{data.fills.map((fill) => (
					<div
						key={fill.tradeId}
						className="grid grid-cols-[1fr_auto_auto_auto] gap-4 rounded-2xl border border-slate-900 bg-slate-950/70 px-4 py-4"
					>
						<div>
							<p className="font-medium text-white">{fill.marketTitle}</p>
							<p className="mt-1 text-sm text-slate-500">
								{formatDateTime(fill.executedAt)}
							</p>
						</div>
						<span className="text-sm text-slate-300">{fill.side}</span>
						<span className="text-sm text-slate-300">{fill.quantity}</span>
						<span className="font-semibold text-cyan-300">
							{formatPriceBps(fill.priceBps)}
						</span>
					</div>
				))}
			</div>
		</Card>
	);
}
