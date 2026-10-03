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
			<h1 className="text-2xl font-semibold text-foreground">
				Histórico de fills
			</h1>
			<div className="mt-5 space-y-3">
				{data.fills.map((fill) => (
					<div
						key={fill.tradeId}
						className="grid grid-cols-[1fr_auto_auto_auto] gap-4 rounded-lg border border-edge bg-card/70 px-4 py-4"
					>
						<div>
							<p className="font-medium text-foreground">{fill.marketTitle}</p>
							<p className="mt-1 text-sm text-muted">
								{formatDateTime(fill.executedAt)}
							</p>
						</div>
						<span className="text-sm text-muted">{fill.side}</span>
						<span className="text-sm text-muted">{fill.quantity}</span>
						<span className="font-semibold text-brand">
							{formatPriceBps(fill.priceBps)}
						</span>
					</div>
				))}
			</div>
		</Card>
	);
}
