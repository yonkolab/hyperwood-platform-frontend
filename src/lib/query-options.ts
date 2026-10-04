import { queryOptions } from "@tanstack/react-query";
import {
	getCurrentUser,
	getLocalePreference,
	listApiKeys,
	listSessions,
} from "#/features/auth/server";
import {
	getDeposits,
	getEligibleFundingMethods,
	getWalletBalance,
	getWithdrawals,
} from "#/features/funding/server";
import {
	getDefaultMarketSort,
	getHomePageData,
	getMarketAnnouncements,
	getMarketCandles,
	getMarketComments,
	getMarketDetail,
	getMarketOrderBook,
	getMarkets,
	getMarketTrades,
} from "#/features/markets/server";
import {
	getHistoricalFills,
	getHistoricalOrders,
	getPortfolioExports,
	getPortfolioFills,
	getPortfolioSettlements,
	getPortfolioSummary,
} from "#/features/portfolio/server";

export const localeQueryOptions = queryOptions({
	queryKey: ["shell", "locale"],
	queryFn: () => getLocalePreference(),
});

export const currentUserQueryOptions = queryOptions({
	queryKey: ["auth", "me"],
	queryFn: () => getCurrentUser(),
});

export const marketCategoriesQueryOptions = queryOptions({
	queryKey: ["markets", "categories"],
	queryFn: () =>
		getMarkets({
			data: {
				limit: 12,
				sort: getDefaultMarketSort(),
			},
		}),
});

export const HOME_PAGE_SIZE = 50;

export function homeInfiniteQueryOptions(search: {
	category?: string;
	search?: string;
	tag?: string;
	sort?: string;
	status?: string;
}) {
	const backendSort =
		search.sort === "closing_soon" ||
		search.sort === "highest_volume" ||
		search.sort === "newest"
			? search.sort
			: undefined;
	const backendStatus =
		search.status === "active" || search.status === "settled"
			? search.status
			: undefined;

	return {
		queryKey: ["markets", "home-infinite", search],
		initialPageParam: 0,
		queryFn: ({ pageParam }: { pageParam: number }) =>
			getMarkets({
				data: {
					limit: HOME_PAGE_SIZE,
					offset: pageParam,
					sort: backendSort,
					status: backendStatus,
					category: search.category,
					search: search.search,
					tag: search.tag,
				},
			}),
		getNextPageParam: (lastPage: {
			pagination?: { hasMore?: boolean; offset?: number; limit?: number };
		}) => {
			const p = lastPage.pagination;
			if (!p || !p.hasMore) return undefined;
			return (p.offset ?? 0) + (p.limit ?? HOME_PAGE_SIZE);
		},
	};
}

export function homePageQueryOptions(search: {
	category?: string;
	search?: string;
	tag?: string;
	sort?: string;
	status?: string;
}) {
	const backendSort =
		search.sort === "closing_soon" ||
		search.sort === "highest_volume" ||
		search.sort === "newest"
			? search.sort
			: undefined;
	const backendStatus =
		search.status === "active" || search.status === "settled"
			? search.status
			: undefined;

	return queryOptions({
		queryKey: ["markets", "home", search],
		queryFn: () =>
			getHomePageData({
				data: {
					limit: 100,
					sort: backendSort ?? getDefaultMarketSort(),
					status: backendStatus,
					category: search.category,
					search: search.search,
					tag: search.tag,
				},
			}),
	});
}

export function marketDetailQueryOptions(marketId: string) {
	return queryOptions({
		queryKey: ["markets", marketId, "detail"],
		queryFn: () => getMarketDetail({ data: { marketId } }),
	});
}

export function marketOrderBookQueryOptions(marketId: string) {
	return queryOptions({
		queryKey: ["markets", marketId, "order-book"],
		queryFn: () => getMarketOrderBook({ data: { marketId } }),
	});
}

export function marketTradesQueryOptions(marketId: string) {
	return queryOptions({
		queryKey: ["markets", marketId, "trades"],
		queryFn: () => getMarketTrades({ data: { marketId } }),
	});
}

export function marketAnnouncementsQueryOptions(marketId: string) {
	return queryOptions({
		queryKey: ["markets", marketId, "announcements"],
		queryFn: () => getMarketAnnouncements({ data: { marketId } }),
	});
}

export function marketCommentsQueryOptions(marketId: string) {
	return queryOptions({
		queryKey: ["markets", marketId, "comments"],
		queryFn: () => getMarketComments({ data: { marketId } }),
	});
}

export function marketCandlesQueryOptions(marketId: string) {
	return queryOptions({
		queryKey: ["markets", marketId, "candles"],
		queryFn: () => getMarketCandles({ data: { marketId, interval: "1d" } }),
	});
}

export function portfolioSummaryQueryOptions(currency: string) {
	return queryOptions({
		queryKey: ["portfolio", "summary", currency],
		queryFn: () => getPortfolioSummary({ data: { currency } }),
	});
}

export function portfolioFillsQueryOptions(currency: string) {
	return queryOptions({
		queryKey: ["portfolio", "fills", currency],
		queryFn: () => getPortfolioFills({ data: { currency } }),
	});
}

export function portfolioSettlementsQueryOptions(currency: string) {
	return queryOptions({
		queryKey: ["portfolio", "settlements", currency],
		queryFn: () => getPortfolioSettlements({ data: { currency } }),
	});
}

export function historicalOrdersQueryOptions(currency: string) {
	return queryOptions({
		queryKey: ["portfolio", "history", "orders", currency],
		queryFn: () => getHistoricalOrders({ data: { currency } }),
	});
}

export function historicalFillsQueryOptions(currency: string) {
	return queryOptions({
		queryKey: ["portfolio", "history", "fills", currency],
		queryFn: () => getHistoricalFills({ data: { currency } }),
	});
}

export function portfolioExportsQueryOptions(currency: string) {
	return queryOptions({
		queryKey: ["portfolio", "exports", currency],
		queryFn: () => getPortfolioExports({ data: { currency } }),
	});
}

export function walletBalanceQueryOptions(currency: string) {
	return queryOptions({
		queryKey: ["wallet", "balance", currency],
		queryFn: () => getWalletBalance({ data: { currency } }),
	});
}

export function fundingMethodsQueryOptions(currency: string) {
	return queryOptions({
		queryKey: ["wallet", "methods", currency],
		queryFn: () => getEligibleFundingMethods({ data: { currency } }),
	});
}

export const depositsQueryOptions = queryOptions({
	queryKey: ["wallet", "deposits"],
	queryFn: () => getDeposits(),
});

export const withdrawalsQueryOptions = queryOptions({
	queryKey: ["wallet", "withdrawals"],
	queryFn: () => getWithdrawals(),
});

export const sessionsQueryOptions = queryOptions({
	queryKey: ["security", "sessions"],
	queryFn: () => listSessions(),
});

export const apiKeysQueryOptions = queryOptions({
	queryKey: ["security", "api-keys"],
	queryFn: () => listApiKeys(),
});
