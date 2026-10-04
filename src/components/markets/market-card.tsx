import { Link } from "@tanstack/react-router";
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
			<Card className="flex h-full flex-col gap-4 p-5 transition hover:border-brand/30 hover:shadow-[0_2px_12px_rgba(13,56,46,0.08)]">
				<div className="flex items-start justify-between gap-3">
					<div>
						<p className="text-xs font-medium uppercase tracking-widest text-brand/70">
							{market.event.category}
						</p>
						<h3 className="mt-2 line-clamp-2 text-lg font-semibold text-foreground">
							{market.title}
						</h3>
					</div>
				</div>
				<p className="line-clamp-2 text-sm text-muted">
					{market.summary ??
						market.event.summary ??
						"Mercado de previsão ao vivo."}
				</p>
				<div className="mt-auto grid grid-cols-2 gap-3">
					<div className="rounded-md bg-yes-soft p-3">
						<p className="text-xs font-medium text-yes">Sim</p>
						<p className="text-lg font-bold text-yes">
							{formatPriceBps(market.yesPriceBps)}
						</p>
					</div>
					<div className="rounded-md bg-no-soft p-3">
						<p className="text-xs font-medium text-no">Não</p>
						<p className="text-lg font-bold text-no">
							{formatPriceBps(market.noPriceBps)}
						</p>
					</div>
				</div>
				<div className="flex items-center justify-between text-xs text-muted">
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
