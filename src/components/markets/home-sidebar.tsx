import { Link } from "@tanstack/react-router";
import { ChevronRight, Flame } from "lucide-react";
import { Card } from "#/components/ui/card";
import type { HomePageData } from "#/lib/api/home";
import { formatCompactNumber, formatDateTime, formatPriceBps } from "#/lib/format";

export function HomeSidebar(props: { data: HomePageData }) {
	const announcements =
		props.data.featuredAnnouncements.length > 0
			? props.data.featuredAnnouncements.slice(0, 3).map((announcement) => {
					const relatedMarket = props.data.marketList.markets.find(
						(market) => market.id === announcement.marketId,
					);

					return {
						id: announcement.id,
						title: announcement.title,
						publishedAt: announcement.publishedAt,
						secondaryValue: relatedMarket
							? formatPriceBps(relatedMarket.yesPriceBps)
							: "Novo",
					};
				})
			: props.data.latestMarkets.slice(0, 3).map((market) => ({
					id: market.id,
					title: market.title,
					publishedAt: market.statusChangedAt,
					secondaryValue: formatPriceBps(market.yesPriceBps),
				}));

	return (
		<div className="space-y-5">
			<Card className="rounded-[28px] border-slate-900 bg-transparent p-0 shadow-none">
				<div className="rounded-[28px] border border-slate-900 bg-[#0c121a] p-5">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-semibold text-white">Últimas notícias</h2>
						<ChevronRight className="size-4 text-slate-500" />
					</div>
					<ol className="mt-5 space-y-5">
						{announcements.map((announcement, index) => (
							<li
								key={announcement.id}
								className="flex items-start justify-between gap-4 border-b border-slate-900 pb-4 last:border-b-0 last:pb-0"
							>
								<div className="flex gap-3">
									<span className="pt-0.5 text-sm text-slate-500">
										{index + 1}
									</span>
									<div className="space-y-1">
										<p className="text-sm font-medium leading-6 text-slate-100">
											{announcement.title}
										</p>
										<p className="text-xs text-slate-500">
											{formatDateTime(announcement.publishedAt)}
										</p>
									</div>
								</div>
								<span className="whitespace-nowrap text-lg font-semibold text-emerald-300">
									{announcement.secondaryValue}
								</span>
							</li>
						))}
					</ol>
				</div>
			</Card>
			<Card className="rounded-[28px] border-slate-900 bg-transparent p-0 shadow-none">
				<div className="rounded-[28px] border border-slate-900 bg-[#0c121a] p-5">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-semibold text-white">Tópicos quentes</h2>
						<ChevronRight className="size-4 text-slate-500" />
					</div>
					<ol className="mt-5 space-y-4">
						{props.data.hotTopics.slice(0, 5).map((topic, index) => (
							<li key={topic.tag}>
								<Link
									to="/"
									search={{ tag: topic.tag }}
									className="flex items-center justify-between rounded-2xl px-1 py-1 transition hover:bg-slate-950/70"
								>
									<div className="flex items-center gap-3">
										<span className="text-sm text-slate-500">{index + 1}</span>
										<span className="text-lg font-medium text-slate-100">
											{topic.tag}
										</span>
									</div>
									<div className="flex items-center gap-2 text-sm text-slate-500">
										<span>{formatCompactNumber(topic.count)}</span>
										<Flame className="size-3.5 text-rose-400" />
									</div>
								</Link>
							</li>
						))}
					</ol>
					<Link
						to="/"
						className="mt-6 flex h-12 items-center justify-center rounded-full border border-slate-800 bg-slate-950 text-sm font-medium text-white transition hover:border-slate-700"
					>
						Explorar tudo
					</Link>
				</div>
			</Card>
		</div>
	);
}
