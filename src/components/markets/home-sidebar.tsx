import { Link } from "@tanstack/react-router";
import { ChevronRight, Flame } from "lucide-react";
import { Card } from "#/components/ui/card";
import type { HomePageData } from "#/lib/api/home";
import {
	formatCompactNumber,
	formatDateTime,
	formatPriceBps,
} from "#/lib/format";

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
			<Card className="rounded-lg border-edge bg-transparent p-0 shadow-none">
				<div className="rounded-lg border border-edge bg-card p-5">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-semibold text-foreground">
							Últimas notícias
						</h2>
						<ChevronRight className="size-4 text-muted" />
					</div>
					<ol className="mt-5 space-y-5">
						{announcements.map((announcement, index) => (
							<li
								key={announcement.id}
								className="flex items-start justify-between gap-4 border-b border-edge pb-4 last:border-b-0 last:pb-0"
							>
								<div className="flex gap-3">
									<span className="pt-0.5 text-sm text-muted">{index + 1}</span>
									<div className="space-y-1">
										<p className="text-sm font-medium leading-6 text-foreground">
											{announcement.title}
										</p>
										<p className="text-xs text-muted">
											{formatDateTime(announcement.publishedAt)}
										</p>
									</div>
								</div>
								<span className="whitespace-nowrap text-lg font-semibold text-yes">
									{announcement.secondaryValue}
								</span>
							</li>
						))}
					</ol>
				</div>
			</Card>
			<Card className="rounded-lg border-edge bg-transparent p-0 shadow-none">
				<div className="rounded-lg border border-edge bg-card p-5">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-semibold text-foreground">
							Tópicos quentes
						</h2>
						<ChevronRight className="size-4 text-muted" />
					</div>
					<ol className="mt-5 space-y-4">
						{props.data.hotTopics.slice(0, 5).map((topic, index) => (
							<li key={topic.tag}>
								<Link
									to="/"
									search={{ tag: topic.tag }}
									className="flex items-center justify-between rounded-lg px-1 py-1 transition hover:bg-card/70"
								>
									<div className="flex items-center gap-3">
										<span className="text-sm text-muted">{index + 1}</span>
										<span className="text-lg font-medium text-foreground">
											{topic.tag}
										</span>
									</div>
									<div className="flex items-center gap-2 text-sm text-muted">
										<span>{formatCompactNumber(topic.count)}</span>
										<Flame className="size-3.5 text-no" />
									</div>
								</Link>
							</li>
						))}
					</ol>
					<Link
						to="/"
						className="mt-6 flex h-12 items-center justify-center rounded-full border border-edge bg-card text-sm font-medium text-foreground transition hover:border-brand/40"
					>
						Explorar tudo
					</Link>
				</div>
			</Card>
		</div>
	);
}
