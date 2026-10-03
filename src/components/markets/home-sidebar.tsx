import { Link } from "@tanstack/react-router";
import { ChevronRight, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "#/components/ui/card";
import type { HomePageData } from "#/lib/api/home";
import {
	formatCompactNumber,
	formatDateTime,
	formatPriceBps,
} from "#/lib/format";

const NEWS_ROTATION_MS = 6000;

type NewsItem = {
	id: string;
	title: string;
	publishedAt: string;
	secondaryValue: string;
	marketId: string;
};

function buildNewsItems(data: HomePageData): NewsItem[] {
	if (data.featuredAnnouncements.length > 0) {
		return data.featuredAnnouncements.slice(0, 3).map((announcement) => {
			const relatedMarket = data.marketList.markets.find(
				(market) => market.id === announcement.marketId,
			);

			return {
				id: announcement.id,
				title: announcement.title,
				publishedAt: announcement.publishedAt,
				secondaryValue: relatedMarket
					? formatPriceBps(relatedMarket.yesPriceBps)
					: "Novo",
				marketId: announcement.marketId,
			};
		});
	}

	return data.latestMarkets.slice(0, 3).map((market) => ({
		id: market.id,
		title: market.title,
		publishedAt: market.statusChangedAt,
		secondaryValue: formatPriceBps(market.yesPriceBps),
		marketId: market.id,
	}));
}

function NewsCarousel(props: { items: NewsItem[] }) {
	const [activeIndex, setActiveIndex] = useState(0);
	const items = props.items;

	useEffect(() => {
		if (items.length <= 1) {
			return;
		}

		const timer = window.setInterval(() => {
			setActiveIndex((current) => (current + 1) % items.length);
		}, NEWS_ROTATION_MS);

		return () => window.clearInterval(timer);
	}, [items.length]);

	if (items.length === 0) {
		return (
			<p className="mt-4 text-sm text-muted">Nenhuma notícia por agora.</p>
		);
	}

	const item = items[activeIndex] ?? items[0];

	return (
		<div className="mt-4">
			<div className="min-h-[76px]">
				<Link
					to="/markets/$marketId"
					params={{ marketId: item.marketId }}
					className="block"
				>
					<p className="text-sm font-medium leading-6 text-foreground transition hover:text-brand">
						{item.title}
					</p>
					<div className="mt-2 flex items-center justify-between">
						<span className="text-xs text-muted">
							{formatDateTime(item.publishedAt)}
						</span>
						<span className="text-base font-semibold text-yes">
							{item.secondaryValue}
						</span>
					</div>
				</Link>
			</div>
			{items.length > 1 ? (
				<div className="mt-3 flex items-center justify-end gap-1.5">
					{items.map((entry, index) => (
						<button
							key={entry.id}
							type="button"
							aria-label={`Notícia ${index + 1}`}
							onClick={() => {
								setActiveIndex(index);
							}}
							className={`h-2 rounded-full transition ${
								index === activeIndex
									? "w-6 bg-foreground"
									: "w-2 bg-slate-300 hover:bg-slate-400"
							}`}
						/>
					))}
				</div>
			) : null}
		</div>
	);
}

export function HomeSidebar(props: { data: HomePageData }) {
	const newsItems = buildNewsItems(props.data);

	return (
		<div className="space-y-5">
			<Card className="rounded-lg border-edge bg-transparent p-0 shadow-none">
				<div className="rounded-lg border border-edge bg-card p-5">
					<Link to="/" className="flex items-center justify-between">
						<h2 className="font-display text-xl font-semibold text-foreground transition hover:text-brand">
							Últimas notícias
						</h2>
						<ChevronRight className="size-4 text-muted" />
					</Link>
					<NewsCarousel items={newsItems} />
				</div>
			</Card>
			<Card className="rounded-lg border-edge bg-transparent p-0 shadow-none">
				<div className="rounded-lg border border-edge bg-card p-5">
					<div className="flex items-center justify-between">
						<h2 className="font-display text-xl font-semibold text-foreground">
							Tópicos quentes
						</h2>
						<ChevronRight className="size-4 text-muted" />
					</div>
					<ol className="mt-4 space-y-2">
						{props.data.hotTopics.slice(0, 5).map((topic, index) => (
							<li key={topic.tag}>
								<Link
									to="/"
									search={{ tag: topic.tag }}
									className="flex items-center justify-between rounded-lg px-1 py-1 transition hover:bg-card/70"
								>
									<div className="flex items-center gap-2.5">
										<span className="text-xs text-muted">{index + 1}</span>
										<span className="text-sm font-medium text-foreground">
											{topic.tag}
										</span>
									</div>
									<div className="flex items-center gap-1.5 text-xs text-muted">
										<span>{formatCompactNumber(topic.count)}</span>
										<Flame className="size-3 text-no" />
									</div>
								</Link>
							</li>
						))}
					</ol>
					<Link
						to="/"
						className="mt-4 flex h-10 items-center justify-center rounded-full border border-edge bg-card text-sm font-medium text-foreground transition hover:border-brand/40"
					>
						Explorar tudo
					</Link>
				</div>
			</Card>
		</div>
	);
}
