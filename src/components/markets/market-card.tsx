import { Link } from "@tanstack/react-router";
import { Badge } from "#/components/ui/badge";
import { Card } from "#/components/ui/card";
import type { MarketRecord } from "#/lib/api/types";
import {
	formatCompactNumber,
	formatPriceBps,
	formatRelativeCountdown,
} from "#/lib/format";

export function MarketCard(props: { market: MarketRecord }) {
	const market = props.market;

	return (
		<Link to="/markets/$marketId" params={{ marketId: market.id }}>
			<Card className="flex h-full flex-col gap-4 p-5 transition hover:border-slate-700 hover:bg-slate-950">
				<div className="flex items-start justify-between gap-3">
					<div>
						<p className="text-xs uppercase tracking-[0.22em] text-cyan-300/80">
							{market.event.category}
						</p>
						<h3 className="mt-2 line-clamp-2 text-lg font-semibold text-white">
							{market.title}
						</h3>
					</div>
					<Badge>{market.status}</Badge>
				</div>
				<p className="line-clamp-2 text-sm text-slate-400">
					{market.summary ??
						market.event.summary ??
						"Mercado de previsão ao vivo."}
				</p>
				<div className="mt-auto grid grid-cols-2 gap-3">
					<div className="rounded-2xl bg-emerald-500/10 p-3">
						<p className="text-xs text-emerald-200/70">Sim</p>
						<p className="text-lg font-semibold text-emerald-200">
							{formatPriceBps(market.yesPriceBps)}
						</p>
					</div>
					<div className="rounded-2xl bg-rose-500/10 p-3">
						<p className="text-xs text-rose-200/70">Não</p>
						<p className="text-lg font-semibold text-rose-200">
							{formatPriceBps(market.noPriceBps)}
						</p>
					</div>
				</div>
				<div className="flex items-center justify-between text-xs text-slate-500">
					<span>{formatCompactNumber(market.volumeUsdMinor / 100)}</span>
					<span>
						{market.closesAt
							? formatRelativeCountdown(market.closesAt)
							: "Sem prazo"}
					</span>
				</div>
			</Card>
		</Link>
	);
}
