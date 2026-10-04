import { useInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { EventCard } from "#/components/markets/event-card";
import { HeroMarket } from "#/components/markets/hero-market";
import { HomeSidebar } from "#/components/markets/home-sidebar";
import { MarketFilters } from "#/components/markets/market-filters";
import type { MarketRecord } from "#/lib/api/types";
import {
	homeInfiniteQueryOptions,
	homePageQueryOptions,
} from "#/lib/query-options";

export type HomeSearch = {
	category?: string;
	search?: string;
	tag?: string;
	sort?: string;
	status?: string;
	period?: string;
	hideSports?: boolean;
	hideCrypto?: boolean;
	hideEarnings?: boolean;
};

export const Route = createFileRoute("/")({
	validateSearch: (search): HomeSearch => ({
		category: typeof search.category === "string" ? search.category : undefined,
		search: typeof search.search === "string" ? search.search : undefined,
		tag: typeof search.tag === "string" ? search.tag : undefined,
		sort: typeof search.sort === "string" ? search.sort : undefined,
		status: typeof search.status === "string" ? search.status : undefined,
		period: typeof search.period === "string" ? search.period : undefined,
		hideSports:
			search.hideSports === true || search.hideSports === "true"
				? true
				: undefined,
		hideCrypto:
			search.hideCrypto === true || search.hideCrypto === "true"
				? true
				: undefined,
		hideEarnings:
			search.hideEarnings === true || search.hideEarnings === "true"
				? true
				: undefined,
	}),
	loaderDeps: ({ search }) => search,
	loader: async ({ context, deps }) => {
		await context.queryClient.ensureQueryData(homePageQueryOptions(deps));
		await context.queryClient.prefetchInfiniteQuery(
			homeInfiniteQueryOptions(deps),
		);
	},
	component: HomePage,
});

function HomePage() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: "/" });
	const infinite = useInfiniteQuery(homeInfiniteQueryOptions(search));
	const data = infinite.data?.pages[0] ?? null;

	const handleFilterChange = (next: Partial<HomeSearch>) => {
		void navigate({
			search: (previous: HomeSearch) => ({
				...previous,
				...next,
			}),
		});
	};

	const allMarkets = useMemo(() => {
		return infinite.data?.pages.flatMap((page) => page.markets) ?? [];
	}, [infinite.data]);

	const visibleMarkets = useMemo(() => {
		return applyClientFilters(allMarkets, search);
	}, [allMarkets, search]);

	const marketById = useMemo(
		() => new Map(allMarkets.map((market) => [market.id, market])),
		[allMarkets],
	);

	const visibleEvents = useMemo(() => {
		return buildAccumulatedEventGroups(visibleMarkets);
	}, [visibleMarkets]);

	const hasMore = infinite.hasNextPage ?? false;

	const sidebarData = useMemo(() => {
		if (!data) return null;

		const tagCounter = new Map<string, number>();
		for (const market of allMarkets) {
			for (const tag of market.tags) {
				tagCounter.set(tag, (tagCounter.get(tag) ?? 0) + 1);
			}
		}

		return {
			marketList: data,
			heroMarket: allMarkets[0] ?? null,
			latestMarkets: [...allMarkets]
				.sort(
					(a, b) =>
						new Date(b.statusChangedAt).getTime() -
						new Date(a.statusChangedAt).getTime(),
				)
				.slice(0, 5),
			hotTopics: [...tagCounter.entries()]
				.map(([tag, count]) => ({ tag, count }))
				.sort((a, b) => b.count - a.count)
				.slice(0, 5),
			featuredAnnouncements: [] as never[],
		} as never;
	}, [data, allMarkets]);

	return (
		<div className="space-y-10">
			<section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
				{sidebarData ? (
					<>
						<HeroMarket data={sidebarData} />
						<HomeSidebar data={sidebarData} />
					</>
				) : null}
			</section>
			<section className="space-y-5">
				<MarketFilters
					categories={data?.categories ?? []}
					search={search}
					onChange={handleFilterChange}
				/>
				<div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-4">
					{visibleMarkets.length === 0 ? (
						<p className="col-span-full py-16 text-center text-sm text-muted">
							Nada encontrado com esses filtros — ajuste a busca ou limpe.
						</p>
					) : (
						visibleEvents.map((event) => (
							<EventCard
								key={event.eventId}
								event={event}
								markets={event.marketIds
									.map((id) => marketById.get(id))
									.filter((m): m is NonNullable<typeof m> => Boolean(m))}
							/>
						))
					)}
				</div>
				{hasMore ? (
					<div className="flex justify-center pt-4">
						<button
							type="button"
							className="rounded-lg border border-edge bg-card px-6 py-3 text-sm font-medium text-foreground transition hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-50"
							disabled={infinite.isFetchingNextPage}
							onClick={() => {
								void infinite.fetchNextPage();
							}}
						>
							{infinite.isFetchingNextPage ? "Carregando..." : "Mostrar mais"}
						</button>
					</div>
				) : null}
			</section>
		</div>
	);
}

function applyClientFilters(
	markets: MarketRecord[],
	search: HomeSearch,
): MarketRecord[] {
	let filtered = markets;

	if (search.hideSports) {
		filtered = filtered.filter(
			(market) => market.event.category !== "Esportes",
		);
	}

	if (search.hideCrypto) {
		filtered = filtered.filter((market) => !market.tags.includes("cripto"));
	}

	if (search.hideEarnings) {
		filtered = filtered.filter((market) => !market.tags.includes("earnings"));
	}

	if (search.period && search.period !== "all") {
		const now = Date.now();
		const horizonsMs: Record<string, number> = {
			daily: 24 * 60 * 60 * 1000,
			weekly: 7 * 24 * 60 * 60 * 1000,
			monthly: 30 * 24 * 60 * 60 * 1000,
		};
		const horizon = horizonsMs[search.period];

		if (horizon) {
			filtered = filtered.filter((market) => {
				if (!market.closesAt) {
					return false;
				}

				const closeAt = new Date(market.closesAt).getTime();

				return closeAt >= now && closeAt <= now + horizon;
			});
		}
	}

	if (search.sort === "competitive") {
		filtered = [...filtered].sort(
			(left, right) =>
				Math.abs(left.yesPriceBps - 5000) - Math.abs(right.yesPriceBps - 5000),
		);
	}

	return filtered;
}

function buildAccumulatedEventGroups(markets: MarketRecord[]) {
	const groups = new Map<
		string,
		{
			eventId: string;
			eventSlug: string;
			eventTitle: string;
			category: string;
			marketIds: string[];
		}
	>();

	for (const market of markets) {
		const existing = groups.get(market.event.id);

		if (existing) {
			if (!existing.marketIds.includes(market.id)) {
				existing.marketIds.push(market.id);
			}
			continue;
		}

		groups.set(market.event.id, {
			eventId: market.event.id,
			eventSlug: market.event.slug,
			eventTitle: market.event.title,
			category: market.event.category,
			marketIds: [market.id],
		});
	}

	return Array.from(groups.values());
}
