import { describe, expect, it } from "vitest";
import { sampleHomeData } from "#/components/storybook/trader-fixtures";
import { buildHomePageData } from "./home";

describe("buildHomePageData", () => {
	it("derives the hero, latest markets, and hot topics from the market list", () => {
		if (!sampleHomeData.heroMarket) {
			throw new Error("Expected hero market fixture");
		}

		const result = buildHomePageData(sampleHomeData.marketList, {
			[sampleHomeData.heroMarket.id]: sampleHomeData.featuredAnnouncements,
		});

		expect(result.heroMarket?.id).toBe(
			sampleHomeData.marketList.markets[0]?.id,
		);
		expect(result.latestMarkets.length).toBeGreaterThan(0);
		expect(result.hotTopics[0]?.tag).toBe("crypto");
		expect(result.featuredAnnouncements[0]?.title).toBe(
			"Nova atualização de regra",
		);
	});
});
