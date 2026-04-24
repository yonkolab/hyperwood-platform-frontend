import type { MarketAnnouncement, MarketListResponse } from "./types";

export type HomePageData = {
	marketList: MarketListResponse;
	heroMarket: MarketListResponse["markets"][number] | null;
	latestMarkets: MarketListResponse["markets"];
	hotTopics: Array<{ tag: string; count: number }>;
	featuredAnnouncements: MarketAnnouncement[];
};

export function buildHomePageData(
	marketList: MarketListResponse,
	announcementsByMarket: Record<string, MarketAnnouncement[]>,
): HomePageData {
	const heroMarket = marketList.markets[0] ?? null;
	const latestMarkets = [...marketList.markets]
		.sort(
			(left, right) =>
				new Date(right.statusChangedAt).getTime() -
				new Date(left.statusChangedAt).getTime(),
		)
		.slice(0, 5);

	const tagCounter = new Map<string, number>();
	for (const market of marketList.markets) {
		for (const tag of market.tags) {
			tagCounter.set(tag, (tagCounter.get(tag) ?? 0) + 1);
		}
	}

	const hotTopics = [...tagCounter.entries()]
		.map(([tag, count]) => ({ tag, count }))
		.sort((left, right) => right.count - left.count)
		.slice(0, 5);

	const featuredAnnouncements = Object.values(announcementsByMarket)
		.flat()
		.sort(
			(left, right) =>
				new Date(right.publishedAt).getTime() -
				new Date(left.publishedAt).getTime(),
		)
		.slice(0, 4);

	return {
		marketList,
		heroMarket,
		latestMarkets,
		hotTopics,
		featuredAnnouncements,
	};
}
