import {
	Check,
	Download,
	History,
	Link2,
	MessageSquare,
	Share2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import type { HistoricalCandle, MarketDetail } from "#/lib/api/types";

function XLogo() {
	return (
		<svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
		</svg>
	);
}

function ThreadsLogo() {
	return (
		<svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
			<path d="M17.16 11.406a7.3 7.3 0 0 0-.319-1.518 6.1 6.1 0 0 0-5.55-4.052 6.16 6.16 0 0 0-5.455 3.386A6.24 6.24 0 0 0 12 16.886a6.16 6.16 0 0 0 5.285-3.005c.266.977.271 1.94.014 2.772a4.7 4.7 0 0 1-1.284 2.106c-1.197 1.156-2.988 1.737-5.32 1.737-5.36 0-7.972-3.36-7.972-8.452a8.34 8.34 0 0 1 2.326-5.786A8.14 8.14 0 0 1 10.4 4.035a8.3 8.3 0 0 1 5.835 2.224l1.316-1.442A10.06 10.06 0 0 0 10.4 1.99a10.22 10.22 0 0 0-7.17 2.937A10.36 10.36 0 0 0 .3 10.044C.3 16.32 3.944 20.5 10.695 20.5c2.93 0 5.313-.8 6.914-2.348a6.7 6.7 0 0 0 1.834-3.006 8.4 8.4 0 0 0 .28-2.9 8 8 0 0 0-.16-1.06 8 8 0 0 0-.196-.84zm-1.665 1.802A4.39 4.39 0 0 1 12 14.883a4.34 4.34 0 0 1-3.668-6.662A4.35 4.35 0 0 1 11.9 6.34a4.39 4.39 0 0 1 4.38 4.386 5 5 0 0 1-.08.87 4.2 4.2 0 0 1-.685 1.612z" />
		</svg>
	);
}

export function MarketPageActions(props: {
	market: MarketDetail;
	commentCount: number;
	candles: HistoricalCandle[] | undefined;
}) {
	const [shareOpen, setShareOpen] = useState(false);
	const [copied, setCopied] = useState(false);
	const marketUrl =
		typeof window === "undefined"
			? ""
			: `${window.location.origin}/markets/${props.market.id}`;
	const shareText = `${props.market.title} — Hyperwood`;

	function scrollToComments() {
		document
			.getElementById("market-comments")
			?.scrollIntoView({ behavior: "smooth", block: "start" });
	}

	function downloadPriceHistory() {
		const candles = props.candles ?? [];

		if (candles.length === 0) {
			toast.error("Sem histórico de preços para exportar ainda.");
			return;
		}

		const header =
			"bucket_start,bucket_end,open_bps,high_bps,low_bps,close_bps,volume,volume_yes,volume_no,trades";
		const rows = candles.map((candle) =>
			[
				candle.bucketStart,
				candle.bucketEnd,
				candle.openPriceBps,
				candle.highPriceBps,
				candle.lowPriceBps,
				candle.closePriceBps,
				candle.volume,
				candle.volumeYes,
				candle.volumeNo,
				candle.tradeCount,
			].join(","),
		);
		const blob = new Blob([[header, ...rows].join("\n")], {
			type: "text/csv;charset=utf-8",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");

		link.href = url;
		link.download = `${props.market.slug}-price-history.csv`;
		link.click();
		URL.revokeObjectURL(url);
		toast.success("Histórico de preços exportado.");
	}

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(marketUrl);
			setCopied(true);
			toast.success("Link copiado.");
			setTimeout(() => {
				setCopied(false);
			}, 2000);
		} catch {
			toast.error("Não foi possível copiar o link.");
		}
	}

	return (
		<div className="flex items-center gap-1">
			<Button
				variant="ghost"
				size="icon"
				disabled
				title="Histórico de preços — em breve"
				aria-label="Histórico de preços (em breve)"
			>
				<History className="size-4" />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				title="Comentários"
				aria-label="Comentários"
				onClick={scrollToComments}
			>
				<MessageSquare className="size-4" />
				{props.commentCount > 0 ? (
					<span className="text-xs font-semibold text-muted">
						{props.commentCount}
					</span>
				) : null}
			</Button>
			<div className="relative">
				<Button
					variant="ghost"
					size="icon"
					title="Compartilhar"
					aria-label="Compartilhar"
					onClick={() => {
						setShareOpen((value) => !value);
					}}
				>
					<Share2 className="size-4" />
				</Button>
				{shareOpen ? (
					<div className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-lg border border-edge bg-card py-1 shadow-[0_8px_24px_rgba(13,31,23,0.12)]">
						<a
							href={`https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(marketUrl)}`}
							target="_blank"
							rel="noreferrer"
							className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground transition hover:bg-subtle"
						>
							<XLogo />X
						</a>
						<a
							href={`https://www.threads.net/intent/post?text=${encodeURIComponent(`${shareText} ${marketUrl}`)}`}
							target="_blank"
							rel="noreferrer"
							className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground transition hover:bg-subtle"
						>
							<ThreadsLogo />
							Threads
						</a>
						<button
							type="button"
							className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-foreground transition hover:bg-subtle"
							onClick={() => {
								void copyLink();
								setShareOpen(false);
							}}
						>
							{copied ? (
								<Check className="size-4" />
							) : (
								<Link2 className="size-4" />
							)}
							Copiar link
						</button>
					</div>
				) : null}
			</div>
			<Button
				variant="ghost"
				size="icon"
				title="Baixar histórico de preços"
				aria-label="Baixar histórico de preços"
				onClick={downloadPriceHistory}
			>
				<Download className="size-4" />
			</Button>
		</div>
	);
}
