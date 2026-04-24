import { Link } from "@tanstack/react-router";
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
	"from-fuchsia-500 to-cyan-400",
	"from-amber-400 to-yellow-200",
	"from-emerald-400 to-lime-300",
	"from-violet-500 to-indigo-300",
];

const MOCK_NAMES = ["Blue31", "lt-aint-much", "ghachu", "Cardenas"];

export function HeroMarket(props: { data: HomePageData }) {
	const spotlightMarkets = useMemo(
		() => props.data.marketList.markets.slice(0, 4),
		[props.data.marketList.markets],
	);
	const [activeIndex, setActiveIndex] = useState(0);
	const [now, setNow] = useState(() => Date.now());
	const market = spotlightMarkets[activeIndex] ?? props.data.heroMarket;
	const chartData = useMemo(
		() => (market ? buildMockHeroSeries(market) : []),
		[market],
	);
	const pulseItems = useMemo(
		() => (market ? buildMockPulseItems(market) : []),
		[market],
	);
	const liveCountdown = useMemo(
		() => formatHeroCountdown(market?.closesAt, now),
		[market?.closesAt, now],
	);

	useEffect(() => {
		const timer = window.setInterval(() => {
			setNow(Date.now());
		}, 1000);

		return () => window.clearInterval(timer);
	}, []);

	if (!market) {
		return (
			<Card className="p-8">
				<p className="text-slate-400">Nenhum mercado ativo para destacar.</p>
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
		<div className="space-y-4">
			<Card className="overflow-hidden rounded-[24px] border-slate-800/80 bg-[#0d141d] p-5 lg:p-6">
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
						<div className="min-w-0">
							<p className="text-sm font-medium text-slate-400">
								{market.event.category} · {market.event.title}
							</p>
							<h1 className="mt-1 max-w-3xl text-3xl font-semibold tracking-tight text-white lg:text-[2.2rem]">
								{market.title}
							</h1>
						</div>
						<div className="text-left lg:text-right">
							<p className="text-sm font-medium text-slate-500">Termina em</p>
							<p className="mt-2 text-3xl font-semibold tabular-nums text-rose-300 lg:text-[2rem]">
								{liveCountdown}
							</p>
						</div>
					</div>

					<div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-stretch">
						<div className="flex min-h-[420px] flex-col">
							<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
								<Button
									variant="positive"
									className="h-14 justify-center rounded-2xl text-base font-semibold"
								>
									<span>{shortOutcomeLabel(market, true)}</span>
								</Button>
								<Button
									variant="negative"
									className="h-14 justify-center rounded-2xl text-base font-semibold"
								>
									<span>{shortOutcomeLabel(market, false)}</span>
								</Button>
							</div>

							<div className="mt-5 flex-1 space-y-4 overflow-hidden rounded-[20px] border border-slate-900 bg-slate-950/60 p-4">
								{pulseItems.map((item, index) => (
									<div key={item.id} className="flex items-start gap-3">
										<div
											className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${MOCK_AVATARS[index % MOCK_AVATARS.length]} text-[10px] font-semibold text-slate-950`}
										>
											{item.author.slice(0, 2).toUpperCase()}
										</div>
										<div className="min-w-0">
											<p className="text-sm font-semibold text-slate-100">
												{item.author}
											</p>
											<p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-400">
												{item.message}
											</p>
										</div>
									</div>
								))}
							</div>

							<p className="mt-4 text-sm text-slate-500">
								${formatCompactNumber(market.volumeUsdMinor / 100)} Vol
							</p>
						</div>

						<div className="rounded-[20px] border border-slate-900 bg-slate-950/60 p-4 lg:p-5">
							<div className="mb-5 grid gap-4 border-b border-slate-900 pb-4 lg:grid-cols-3">
								<div className="flex items-center gap-3">
									<div className="flex size-11 items-center justify-center rounded-2xl bg-amber-400/95 text-sm font-black text-slate-950">
										YES
									</div>
									<div>
										<p className="text-lg font-semibold text-amber-300">
											{formatPriceBps(market.yesPriceBps)}
										</p>
										<p className="text-sm text-slate-400">
											{shortOutcomeLabel(market, true)}
										</p>
									</div>
								</div>
								<div className="text-center">
									<p className="text-lg font-semibold text-white">
										{formatCompactNumber(market.volumeUsdMinor / 100)}
									</p>
									<p className="mt-1 text-sm capitalize text-slate-400">
										mercado {market.status}
									</p>
								</div>
								<div className="flex items-center justify-end gap-3">
									<div className="text-right">
										<p className="text-lg font-semibold text-cyan-300">
											{formatPriceBps(market.noPriceBps)}
										</p>
										<p className="text-sm text-slate-400">
											{shortOutcomeLabel(market, false)}
										</p>
									</div>
									<div className="flex size-11 items-center justify-center rounded-2xl bg-cyan-500/90 text-sm font-black text-slate-950">
										NO
									</div>
								</div>
							</div>

							<div className="h-[308px] w-full">
								<ResponsiveContainer width="100%" height="100%">
									<LineChart data={chartData} margin={{ left: 0, right: 8, top: 12, bottom: 0 }}>
										<CartesianGrid stroke="rgba(100,116,139,0.14)" vertical={false} />
										<XAxis
											dataKey="label"
											tick={{ fill: "#64748b", fontSize: 12 }}
											axisLine={false}
											tickLine={false}
										/>
										<YAxis
											domain={[0, 100]}
											orientation="right"
											tickFormatter={(value) => `${value}%`}
											tick={{ fill: "#64748b", fontSize: 12 }}
											axisLine={false}
											tickLine={false}
										/>
										<Tooltip
											contentStyle={{
												backgroundColor: "#020617",
												border: "1px solid rgba(51,65,85,0.8)",
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
											stroke="#fbbf24"
											strokeWidth={2.5}
											dot={false}
											activeDot={{ r: 5, fill: "#fbbf24" }}
										/>
										<Line
											type="monotone"
											dataKey="no"
											stroke="#38bdf8"
											strokeWidth={2.5}
											dot={false}
											activeDot={{ r: 5, fill: "#38bdf8" }}
										/>
									</LineChart>
								</ResponsiveContainer>
							</div>

							<div className="mt-4 flex items-center justify-between text-sm text-slate-500">
								<span>{market.tags.slice(0, 3).join(" · ")}</span>
								<span>Hyperwood</span>
							</div>
						</div>
					</div>
				</div>
			</Card>

			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-2">
					{spotlightMarkets.map((item, index) => (
						<button
							key={item.id}
							type="button"
							onClick={() => setActiveIndex(index)}
							className={`h-2.5 rounded-full transition ${
								index === activeIndex
									? "w-8 bg-slate-100"
									: "w-2.5 bg-slate-700 hover:bg-slate-500"
							}`}
							aria-label={`Destacar mercado ${index + 1}`}
						/>
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
						className="inline-flex h-12 items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-4 text-sm text-slate-300 transition hover:border-slate-700 hover:text-white"
					>
						<ChevronLeft className="size-4" />
						<span className="max-w-[12rem] truncate">
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
						className="inline-flex h-12 items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-4 text-sm text-slate-300 transition hover:border-slate-700 hover:text-white"
					>
						<span className="max-w-[12rem] truncate">
							{nextMarket?.event.title ?? "Próximo"}
						</span>
						<ChevronRight className="size-4" />
					</button>
					<Link
						to="/markets/$marketId"
						params={{ marketId: market.id }}
						className="inline-flex h-12 items-center rounded-full bg-cyan-500 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
					>
						Ver mercado
					</Link>
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
	const seed = [...market.id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
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

function formatHeroCountdown(value: string | null | undefined, now: number) {
	if (!value) {
		return "—";
	}

	const deltaMs = Math.max(0, new Date(value).getTime() - now);
	const totalSeconds = Math.floor(deltaMs / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	if (hours > 0) {
		return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
	}

	return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
