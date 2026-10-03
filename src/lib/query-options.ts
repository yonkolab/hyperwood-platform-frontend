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

export function homePageQueryOptions(search: {
	category?: string;
	search?: string;
	tag?: string;
}) {
	return queryOptions({
		queryKey: ["markets", "home", search],
		queryFn: () =>
			getHomePageData({
				data: {
					limit: 24,
					sort: getDefaultMarketSort(),
					...search,
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

export function marketCandlesQueryOptions(marketId: string) {
	return queryOptions({
		queryKey: ["markets", marketId, "candles"],
		queryFn: () => getMarketCandles({ data: { marketId, interval: "1h" } }),
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
