import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildHomePageData } from "#/lib/api/home";
import { requestBackend } from "#/lib/api/http";
import type {
	HistoricalCandle,
	MarketAnnouncement,
	MarketDetail,
	MarketListResponse,
	MarketSort,
	OrderBookSnapshotResponse,
	TradeListResponse,
} from "#/lib/api/types";
import { getStoredSessionToken } from "#/lib/session/cookies";

const marketsQuerySchema = z.object({
	category: z.string().optional(),
	status: z.string().optional(),
	tag: z.string().optional(),
	search: z.string().optional(),
	sort: z.enum(["newest", "closing_soon", "highest_volume"]).optional(),
	limit: z.number().int().positive().max(100).default(24),
	offset: z.number().int().nonnegative().max(10000).optional(),
});

const marketIdSchema = z.object({
	marketId: z.string().uuid(),
});

const candlesSchema = marketIdSchema.extend({
	interval: z.enum(["1h", "1d"]).default("1h"),
});

function createMarketQueryString(data: z.infer<typeof marketsQuerySchema>) {
	const searchParams = new URLSearchParams();

	searchParams.set("limit", String(data.limit));
	if (data.category) searchParams.set("category", data.category);
	if (data.status) searchParams.set("status", data.status);
	if (data.tag) searchParams.set("tag", data.tag);
	if (data.search) searchParams.set("search", data.search);
	if (data.sort) searchParams.set("sort", data.sort);
	if (data.offset !== undefined) searchParams.set("offset", String(data.offset));

	return searchParams.toString();
}

export function getDefaultMarketSort(): MarketSort {
	return "newest";
}

export const getMarkets = createServerFn({ method: "GET" })
	.inputValidator(marketsQuerySchema)
	.handler(async ({ data }): Promise<MarketListResponse> => {
		const query = createMarketQueryString(data);

		return requestBackend<MarketListResponse>(`/api/v1/markets?${query}`);
	});

export const getHomePageData = createServerFn({ method: "GET" })
	.inputValidator(marketsQuerySchema)
	.handler(async ({ data }) => {
		const marketList = await getMarkets({ data });
		const announcementPairs = await Promise.all(
			marketList.markets.slice(0, 6).map(async (market) => {
				const result = await requestBackend<{
					marketId: string;
					announcements: MarketAnnouncement[];
				}>(`/api/v1/markets/${market.id}/announcements`);

				return [market.id, result.announcements] as const;
			}),
		);

		return buildHomePageData(marketList, Object.fromEntries(announcementPairs));
	});

export const getMarketDetail = createServerFn({ method: "GET" })
	.inputValidator(marketIdSchema)
	.handler(async ({ data }): Promise<MarketDetail> => {
		const result = await requestBackend<{ market: MarketDetail }>(
			`/api/v1/markets/${data.marketId}`,
		);

		return result.market;
	});

export const getMarketOrderBook = createServerFn({ method: "GET" })
	.inputValidator(marketIdSchema)
	.handler(
		async ({ data }): Promise<OrderBookSnapshotResponse> =>
			requestBackend<OrderBookSnapshotResponse>(
				`/api/v1/markets/${data.marketId}/order-book`,
			),
	);

export const getMarketTrades = createServerFn({ method: "GET" })
	.inputValidator(marketIdSchema)
	.handler(
		async ({ data }): Promise<TradeListResponse> =>
			requestBackend<TradeListResponse>(
				`/api/v1/markets/${data.marketId}/trades?limit=20`,
			),
	);

export const getMarketAnnouncements = createServerFn({ method: "GET" })
	.inputValidator(marketIdSchema)
	.handler(async ({ data }): Promise<MarketAnnouncement[]> => {
		const result = await requestBackend<{
			marketId: string;
			announcements: MarketAnnouncement[];
		}>(`/api/v1/markets/${data.marketId}/announcements`);

		return result.announcements;
	});

export const getMarketCandles = createServerFn({ method: "GET" })
	.inputValidator(candlesSchema)
	.handler(async ({ data }): Promise<HistoricalCandle[]> => {
		const result = await requestBackend<{
			marketId: string;
			interval: "1h" | "1d";
			candles: HistoricalCandle[];
		}>(`/api/v1/markets/${data.marketId}/candles?interval=${data.interval}`);

		return result.candles;
	});

function getAuthorizationToken() {
	return getStoredSessionToken();
}

export type MarketCommentAuthor = {
	id: string;
	username: string | null;
	email: string;
};

export type MarketCommentNode = {
	id: string;
	marketId: string;
	parentId: string | null;
	body: string;
	depth: number;
	likeCount: number;
	replyCount: number;
	status: string;
	createdAt: string;
	author: MarketCommentAuthor;
	viewer: {
		liked: boolean;
		bookmarked: boolean;
	};
	replies: MarketCommentNode[];
};

type MarketCommentsResponse = {
	marketId: string;
	comments: MarketCommentNode[];
};

const commentActionSchema = z.object({
	commentId: z.string().uuid(),
});

const createCommentSchema = marketIdSchema.extend({
	body: z.string().min(1).max(2000),
	parentId: z.string().uuid().optional(),
});

const reportCommentSchema = commentActionSchema.extend({
	reason: z.string().min(3).max(160),
});

export const getMarketComments = createServerFn({ method: "GET" })
	.inputValidator(marketIdSchema)
	.handler(async ({ data }): Promise<MarketCommentsResponse> => {
		let token: string | undefined;

		try {
			token = getAuthorizationToken();
		} catch {
			token = undefined;
		}

		return requestBackend<MarketCommentsResponse>(
			`/api/v1/markets/${data.marketId}/comments`,
			{ token },
		);
	});

export const createMarketComment = createServerFn({ method: "POST" })
	.inputValidator(createCommentSchema)
	.handler(
		async ({ data }): Promise<{ comment: MarketCommentNode }> =>
			requestBackend<{ comment: MarketCommentNode }>(
				`/api/v1/markets/${data.marketId}/comments`,
				{
					method: "POST",
					body: {
						body: data.body,
						...(data.parentId ? { parentId: data.parentId } : {}),
					},
					token: getAuthorizationToken(),
				},
			),
	);

export const toggleMarketCommentLike = createServerFn({ method: "POST" })
	.inputValidator(commentActionSchema)
	.handler(
		async ({ data }): Promise<{ liked: boolean; likeCount: number }> =>
			requestBackend<{ liked: boolean; likeCount: number }>(
				`/api/v1/comments/${data.commentId}/like`,
				{ method: "POST", token: getAuthorizationToken() },
			),
	);

export const toggleMarketCommentBookmark = createServerFn({ method: "POST" })
	.inputValidator(commentActionSchema)
	.handler(
		async ({ data }): Promise<{ bookmarked: boolean }> =>
			requestBackend<{ bookmarked: boolean }>(
				`/api/v1/comments/${data.commentId}/bookmark`,
				{ method: "POST", token: getAuthorizationToken() },
			),
	);

export const reportMarketComment = createServerFn({ method: "POST" })
	.inputValidator(reportCommentSchema)
	.handler(
		async ({ data }): Promise<{ reported: boolean }> =>
			requestBackend<{ reported: boolean }>(
				`/api/v1/comments/${data.commentId}/report`,
				{
					method: "POST",
					body: { reason: data.reason },
					token: getAuthorizationToken(),
				},
			),
	);
