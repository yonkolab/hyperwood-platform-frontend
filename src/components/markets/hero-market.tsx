import { Link } from "@tanstack/react-router";
import {
	Bookmark,
	Check,
	ChevronLeft,
	ChevronRight,
	Link2,
	Share2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { toast } from "sonner";
import { FlipTimer } from "#/components/markets/flip-timer";
import { ThreadsLogo, XLogo } from "#/components/markets/market-page-actions";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import type { HomePageData } from "#/lib/api/home";
import type { MarketRecord } from "#/lib/api/types";
import { formatCompactNumber, formatPriceBps } from "#/lib/format";

type HeroPulseItem = {
	id: string;
	author: string;
	message: string;
};

const MOCK_AVATARS = [
	"from-yes to-brand",
	"from-amber-400 to-yellow-200",
	"from-yes to-[#7fd8a9]",
	"from-violet-500 to-indigo-300",
];

const MOCK_NAMES = ["Blue31", "lt-aint-much", "ghachu", "Cardenas"];

export function HeroMarket(props: { data: HomePageData; className?: string }) {
	const spotlightMarkets = useMemo(
		() => props.data.marketList.markets.slice(0, 4),
		[props.data.marketList.markets],
	);
	const HERO_AUTOPLAY_MS = 6000;
	const [activeIndex, setActiveIndex] = useState(0);
	const [carouselPaused, setCarouselPaused] = useState(false);
	const market = spotlightMarkets[activeIndex] ?? props.data.heroMarket;
	const chartData = useMemo(
		() => (market ? buildMockHeroSeries(market) : []),
		[market],
	);
	const pulseItems = useMemo(
		() => (market ? buildMockPulseItems(market) : []),
		[market],
	);
	useEffect(() => {
		if (carouselPaused || spotlightMarkets.length <= 1) {
			return;
		}

		const timer = window.setInterval(() => {
			setActiveIndex((current) => (current + 1) % spotlightMarkets.length);
		}, HERO_AUTOPLAY_MS);

		return () => window.clearInterval(timer);
	}, [carouselPaused, spotlightMarkets.length]);

	const [shareOpen, setShareOpen] = useState(false);
	const [favorites, setFavorites] = useState<string[]>(() => {
		if (typeof window === "undefined") {
			return [];
		}

		try {
			return JSON.parse(
				window.localStorage.getItem("hw-favorites") ?? "[]",
			) as string[];
		} catch {
			return [];
		}
	});
	const heroBookmarked = favorites.includes(market?.id ?? "");

	function toggleHeroBookmark(marketId: string) {
		const next = favorites.includes(marketId)
			? favorites.filter((id) => id !== marketId)
			: [...favorites, marketId];

		setFavorites(next);

		try {
			window.localStorage.setItem("hw-favorites", JSON.stringify(next));
			toast.success(
				favorites.includes(marketId)
					? "Removido dos favoritos."
					: "Mercado salvo nos favoritos.",
			);
		} catch {
			toast.error("Não foi possível salvar o favorito.");
		}
	}

	const heroMarketUrl =
		typeof window === "undefined"
			? ""
			: `${window.location.origin}/markets/${market?.id ?? ""}`;

	const eventMarkets = useMemo(() => {
		if (!market) {
			return [];
		}

		const group = props.data.marketList.eventGroups.find(
			(candidate) => candidate.eventId === market.event.id,
		);

		if (!group) {
			return [market];
		}

		const byId = new Map(
			props.data.marketList.markets.map((entry) => [entry.id, entry]),
		);

		const entries = group.marketIds
			.map((id) => byId.get(id))
			.filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

		return entries.length > 0 ? entries : [market];
	}, [market, props.data.marketList]);

	const scrollingPulseItems = useMemo(
		() => [...pulseItems, ...pulseItems],
		[pulseItems],
	);
	if (!market) {
		return (
			<Card className={`p-8 ${props.className ?? ""}`}>
				<p className="text-muted">Nenhum mercado ativo para destacar.</p>
			</Card>
		);
	}

	const previousMarket =
		spotlightMarkets[
			activeIndex === 0 ? spotlightMarkets.length - 1 : activeIndex - 1
		];
	const nextMarket =
		spotlightMarkets[
			activeIndex === spotlightMarkets.length - 1 ? 0 : activeIndex + 1
		];

	return (
		<div className={`space-y-4 ${props.className ?? ""}`}>
			<Card className="overflow-hidden rounded-lg border-edge bg-card p-4 lg:h-[480px] lg:p-5">
				<div className="flex h-full flex-col gap-4">
					<div
						key={activeIndex}
						className="hero-slide-in grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)] lg:items-stretch"
					>
						<div className="flex min-h-0 flex-col">
							<Link
								to="/"
								search={{ category: market.event.category }}
								className="group block"
							>
								<h1 className="font-display mt-1 max-w-3xl text-[1.55rem] font-semibold leading-tight tracking-tight text-foreground lg:text-[1.75rem]">
									{market.title}
								</h1>
							</Link>
							<p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
								Termina em
							</p>
							<FlipTimer compact closesAt={market?.closesAt} className="mt-1" />
							<div className="mt-3 max-h-56 space-y-1.5 overflow-y-auto pr-1">
								{eventMarkets.map((eventMarket) => (
									<Link
										key={eventMarket.id}
										to="/markets/$marketId"
										params={{ marketId: eventMarket.id }}
										className="flex items-center gap-3 rounded-lg border border-transparent px-1.5 py-1.5 transition hover:border-edge hover:bg-card"
									>
										<span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-brand-soft text-[10px] font-bold text-brand">
											{eventMarket.title
												.replace(/[^a-zA-ZÀ-ú0-9 ]/g, "")
												.split(" ")
												.slice(0, 2)
												.map((word) => word[0])
												.join("")
												.toUpperCase()
												.slice(0, 3)}
										</span>
										<span className="min-w-0 flex-1 truncate text-[13px] text-foreground">
											{eventMarket.title}
										</span>
										<span className="text-sm font-semibold tabular-nums text-yes">
											{formatPriceBps(eventMarket.yesPriceBps)}
										</span>
									</Link>
								))}
							</div>

							<div className="hero-comments-mask mt-3 flex-1 overflow-hidden">
								<div className="hero-comments-track space-y-3 pr-2">
									{scrollingPulseItems.map((item, index) => (
										<div
											key={`${item.id}-${index}`}
											className="flex items-start gap-3"
										>
											<div
												className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${MOCK_AVATARS[index % MOCK_AVATARS.length]} text-[10px] font-semibold text-slate-950`}
											>
												{item.author.slice(0, 2).toUpperCase()}
											</div>
											<div className="min-w-0">
												<p className="text-[13px] font-semibold leading-none text-foreground">
													{item.author}
												</p>
												<p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">
													{item.message}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>

						<div className="flex min-h-0 flex-col px-1">
							<div className="mb-4 flex items-center justify-between border-b border-edge pb-2">
								<div className="flex items-center gap-4">
									<span className="flex items-center gap-1.5 text-xs text-foreground">
										<span className="size-2 rounded-full bg-yes" />
										{shortOutcomeLabel(market, true)}
									</span>
									<span className="flex items-center gap-1.5 text-xs text-foreground">
										<span className="size-2 rounded-full bg-no" />
										{shortOutcomeLabel(market, false)}
									</span>
								</div>
								<div className="flex items-center gap-1.5">
									<div className="relative">
										<button
											type="button"
											aria-label="Compartilhar"
											className="flex size-9 items-center justify-center rounded-full text-muted transition hover:bg-subtle hover:text-foreground"
											onClick={() => {
												setShareOpen((value) => !value);
											}}
										>
											<Share2 className="size-5" />
										</button>
										{shareOpen ? (
											<div className="absolute right-0 top-9 z-20 w-40 overflow-hidden rounded-lg border border-edge bg-card py-1 shadow-[0_8px_24px_rgba(13,31,23,0.12)]">
												<a
													href={`https://x.com/intent/post?text=${encodeURIComponent(`${market.title} — Hyperwood`)}&url=${encodeURIComponent(heroMarketUrl)}`}
													target="_blank"
													rel="noreferrer"
													className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground transition hover:bg-subtle"
												>
													<XLogo />X
												</a>
												<a
													href={`https://www.threads.net/intent/post?text=${encodeURIComponent(`${market.title} — Hyperwood ${heroMarketUrl}`)}`}
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
														void navigator.clipboard
															.writeText(heroMarketUrl)
															.then(() => {
																toast.success("Link copiado.");
															})
															.catch(() => {
																toast.error("Não foi possível copiar.");
															});
														setShareOpen(false);
													}}
												>
													<Link2 className="size-4" />
													Copiar link
												</button>
											</div>
										) : null}
									</div>
									<button
										type="button"
										aria-label="Favoritar mercado"
										aria-pressed={heroBookmarked}
										className={`flex size-9 items-center justify-center rounded-full transition hover:bg-subtle ${heroBookmarked ? "text-brand" : "text-muted hover:text-foreground"}`}
										onClick={() => {
											toggleHeroBookmark(market.id);
										}}
									>
										<Bookmark
											className={`size-5 ${heroBookmarked ? "fill-brand" : ""}`}
										/>
									</button>
								</div>
							</div>
							<div className="min-h-0 flex-1">
								<ResponsiveContainer width="100%" height="100%">
									<LineChart
										data={chartData}
										margin={{ left: 0, right: 8, top: 12, bottom: 0 }}
									>
										<CartesianGrid
											stroke="rgba(100,116,139,0.14)"
											vertical={false}
										/>
										<XAxis
											dataKey="label"
											tick={{ fill: "#5c6660", fontSize: 12 }}
											axisLine={false}
											tickLine={false}
										/>
										<YAxis
											domain={[0, 100]}
											orientation="right"
											tickFormatter={(value) => `${value}%`}
											tick={{ fill: "#5c6660", fontSize: 12 }}
											axisLine={false}
											tickLine={false}
										/>
										<Tooltip
											contentStyle={{
												backgroundColor: "#ffffff",
												border: "1px solid #e5e9e5",
												borderRadius: 16,
											}}
											formatter={(value) =>
												typeof value === "number"
													? `${value.toFixed(1)}%`
													: value
											}
										/>
										<Line
											type="monotone"
											dataKey="yes"
											stroke="#00a67e"
											strokeWidth={2.5}
											dot={false}
											activeDot={{ r: 5, fill: "#00a67e" }}
										/>
										<Line
											type="monotone"
											dataKey="no"
											stroke="#dc2f2f"
											strokeWidth={2.5}
											dot={false}
											activeDot={{ r: 5, fill: "#dc2f2f" }}
										/>
									</LineChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between border-t border-edge pt-3 text-[11px] text-muted lg:text-xs">
						<div className="flex items-center gap-3">
							<span className="font-medium text-muted">
								${formatCompactNumber(market.volumeUsdMinor / 100)} Vol
							</span>
							<span className="hidden sm:inline">
								{market.tags.slice(0, 3).join(" · ")}
							</span>
						</div>
						<div className="flex h-7 items-center gap-3">
							<span className="inline-flex items-center gap-2 font-medium text-[#DF0C10]">
								<span className="relative flex size-2 shrink-0 items-center justify-center">
									<span className="absolute inline-flex size-full animate-ping rounded-full bg-[#DF0C10] opacity-70" />
									<span className="relative inline-flex size-2 rounded-full bg-[#DF0C10]" />
								</span>
								AO VIVO
							</span>
							<img
								src="/logo-hyperwood-gray.png"
								alt="Hyperwood"
								className="h-4 w-auto object-contain opacity-80"
							/>
						</div>
					</div>
				</div>
			</Card>

			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div
					className="flex items-center gap-2"
					onMouseEnter={() => {
						setCarouselPaused(true);
					}}
					onMouseLeave={() => {
						setCarouselPaused(false);
					}}
				>
					{spotlightMarkets.map((item, index) => (
						<button
							key={item.id}
							type="button"
							onClick={() => setActiveIndex(index)}
							className={`relative h-2 overflow-hidden rounded-full transition-colors ${
								index === activeIndex
									? "w-6 bg-slate-300"
									: "w-2 bg-slate-300 hover:bg-slate-400"
							}`}
							aria-label={`Destacar mercado ${index + 1}`}
						>
							{index === activeIndex ? (
								<span
									key={activeIndex}
									className="hero-bullet-progress absolute inset-y-0 left-0 rounded-full bg-foreground"
									style={
										{
											"--hero-bullet-state": carouselPaused
												? "paused"
												: "running",
										} as React.CSSProperties
									}
								/>
							) : null}
						</button>
					))}
				</div>
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() =>
							setActiveIndex((current) =>
								current === 0 ? spotlightMarkets.length - 1 : current - 1,
							)
						}
						className="inline-flex items-center gap-2 rounded-full border border-edge bg-card px-4 py-2 text-sm text-muted transition hover:border-brand/40 hover:text-foreground"
					>
						<ChevronLeft className="size-4" />
						<span className="max-w-48 truncate">
							{previousMarket?.event.title ?? "Anterior"}
						</span>
					</button>
					<button
						type="button"
						onClick={() =>
							setActiveIndex((current) =>
								current === spotlightMarkets.length - 1 ? 0 : current + 1,
							)
						}
						className="inline-flex items-center gap-2 rounded-full border border-edge bg-card px-4 py-2 text-sm text-muted transition hover:border-brand/40 hover:text-foreground"
					>
						<span className="max-w-48 truncate">
							{nextMarket?.event.title ?? "Próximo"}
						</span>
						<ChevronRight className="size-4" />
					</button>
				</div>
			</div>
		</div>
	);
}

function shortOutcomeLabel(market: MarketRecord, yes: boolean) {
	const primaryTag = market.tags[0];
	if (primaryTag) {
		return yes ? primaryTag : "contrário";
	}

	return yes ? "Sim" : "Não";
}

function buildMockPulseItems(market: MarketRecord): HeroPulseItem[] {
	return MOCK_NAMES.map((author, index) => ({
		id: `${market.id}-pulse-${index}`,
		author,
		message:
			index === 0
				? `Fluxo está concentrado em ${shortOutcomeLabel(market, true).toLowerCase()} depois da última perna do mercado.`
				: index === 1
					? `A assimetria aqui está em ${formatPriceBps(market.yesPriceBps)} vs ${formatPriceBps(market.noPriceBps)}.`
					: index === 2
						? `${market.title} continua reagindo ao tema ${market.event.title}.`
						: `Volume já passou de ${formatCompactNumber(market.volumeUsdMinor / 100)} e ainda tem janela para squeeze.`,
	}));
}

function buildMockHeroSeries(market: MarketRecord) {
	const seed = [...market.id].reduce(
		(sum, char) => sum + char.charCodeAt(0),
		0,
	);
	const baseYes = market.yesPriceBps / 100;
	const points = Array.from({ length: 12 }, (_, index) => {
		const wave = Math.sin((seed + index) / 2.7) * 4.6;
		const drift = (index - 6) * 0.45;
		const adjustment = ((seed % 13) - 6) * 0.12;
		const yes = clampProbability(baseYes + wave + drift + adjustment, 3, 97);
		return {
			label: `${String(index * 2).padStart(2, "0")}:00`,
			yes,
			no: Number((100 - yes).toFixed(1)),
		};
	});

	points[points.length - 1] = {
		...points[points.length - 1],
		yes: Number(baseYes.toFixed(1)),
		no: Number((100 - baseYes).toFixed(1)),
	};

	return points;
}

function clampProbability(value: number, min: number, max: number) {
	return Number(Math.min(max, Math.max(min, value)).toFixed(1));
}
