import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { createPortfolioExport } from "#/features/portfolio/server";
import { formatDateTime } from "#/lib/format";
import {
	currentUserQueryOptions,
	portfolioExportsQueryOptions,
} from "#/lib/query-options";

const currency = "BRL";

export const Route = createFileRoute("/portfolio/exports")({
	loader: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData(
			currentUserQueryOptions,
		);
		if (!user) throw redirect({ to: "/login" });
		await context.queryClient.ensureQueryData(
			portfolioExportsQueryOptions(currency),
		);
	},
	component: PortfolioExportsPage,
});

function PortfolioExportsPage() {
	const { data } = useSuspenseQuery(portfolioExportsQueryOptions(currency));
	const mutation = useMutation({
		mutationFn: async () => createPortfolioExport({ data: { currency } }),
	});

	return (
		<Card className="p-5">
			<div className="flex items-center justify-between gap-4">
				<div>
					<h1 className="font-display text-2xl font-semibold text-foreground">
						Exportações
					</h1>
					<p className="mt-1 text-sm text-muted">
						Gere um snapshot JSON do histórico da conta.
					</p>
				</div>
				<Button onClick={() => mutation.mutate()}>Criar exportação</Button>
			</div>
			<div className="mt-5 space-y-3">
				{data.exportJobs.map((job) => (
					<div
						key={job.id}
						className="rounded-lg border border-edge bg-card/70 px-4 py-4"
					>
						<p className="font-medium text-foreground">{job.format}</p>
						<p className="mt-1 text-sm text-muted">
							{formatDateTime(job.completedAt)}
						</p>
					</div>
				))}
			</div>
		</Card>
	);
}
