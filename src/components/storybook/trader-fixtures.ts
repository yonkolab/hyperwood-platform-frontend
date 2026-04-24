import type { HomePageData } from "#/lib/api/home";
import type {
	HistoricalCandle,
	MarketDetail,
	MarketRecord,
	OrderBookSnapshotResponse,
	TradeListResponse,
	User,
} from "#/lib/api/types";

const baseEvent = {
	id: "9ae4fa69-9c3c-4f23-9cd8-fab18d577111",
	slug: "bitcoin-hourly-breakout",
	title: "Bitcoin intraday breakout",
	summary:
		"Will Bitcoin hold above the intraday threshold before market close?",
	category: "Crypto",
	startsAt: "2026-04-23T18:00:00.000Z",
	endsAt: "2026-04-24T00:00:00.000Z",
};

export const sampleMarket: MarketRecord = {
	id: "a4a41c8d-f38d-4a90-8f51-a4b46f82a001",
	slug: "bitcoin-up-or-down-apr-23-close",
	title: "Bitcoin fecha acima de US$ 78k hoje?",
	summary:
		"Mercado binário de curto prazo baseado no fechamento intradiário do BTC.",
	status: "active",
	currency: "BRL",
	tags: ["bitcoin", "crypto", "macro"],
	yesPriceBps: 5700,
	noPriceBps: 4300,
	volumeUsdMinor: 9240000,
	opensAt: "2026-04-23T18:00:00.000Z",
	closesAt: "2026-04-23T23:55:00.000Z",
	resolvesAt: "2026-04-24T00:10:00.000Z",
	statusChangedAt: "2026-04-23T20:20:00.000Z",
	createdAt: "2026-04-23T18:00:00.000Z",
	updatedAt: "2026-04-23T20:20:00.000Z",
	event: baseEvent,
};

export const sampleHomeData: HomePageData = {
	marketList: {
		filters: {
			category: null,
			status: "active",
			tag: null,
			search: null,
			sort: "newest",
		},
		categories: ["Crypto", "Politics", "Sports"],
		eventGroups: [
			{
				eventId: baseEvent.id,
				eventSlug: baseEvent.slug,
				eventTitle: baseEvent.title,
				category: baseEvent.category,
				marketIds: [sampleMarket.id],
			},
		],
		markets: [
			sampleMarket,
			{
				...sampleMarket,
				id: "78fe9b80-a36d-4d16-89b0-d657d9e45002",
				slug: "eth-breaks-4k-june",
				title: "ETH rompe US$ 4k até junho?",
				yesPriceBps: 6100,
				noPriceBps: 3900,
				statusChangedAt: "2026-04-23T19:40:00.000Z",
				tags: ["ethereum", "crypto"],
			},
			{
				...sampleMarket,
				id: "7c84a2d8-2af7-44cb-99a2-2c0207b9f003",
				slug: "fed-cuts-before-q4",
				title: "Fed corta juros antes do Q4?",
				yesPriceBps: 4800,
				noPriceBps: 5200,
				event: {
					...baseEvent,
					id: "0ab27c95-036c-4f52-9c8f-0f34bce83003",
					slug: "fed-rate-path",
					title: "Fed rate path",
					category: "Macro",
				},
				tags: ["macro", "fed"],
			},
		],
	},
	heroMarket: sampleMarket,
	latestMarkets: [
		sampleMarket,
		{
			...sampleMarket,
			id: "1e3286c0-c6f6-4634-ae1e-b83ad69f9004",
			slug: "brazil-rate-hike-june",
			title: "Copom sobe juros em junho?",
			event: {
				...baseEvent,
				id: "96e9d4da-9a7e-41b8-b3b3-f226a3c06004",
				slug: "copom-june",
				title: "Copom junho",
				category: "Brazil",
			},
			yesPriceBps: 3600,
			noPriceBps: 6400,
		},
	],
	hotTopics: [
		{ tag: "bitcoin", count: 8 },
		{ tag: "macro", count: 6 },
		{ tag: "ethereum", count: 4 },
		{ tag: "brazil", count: 3 },
	],
	featuredAnnouncements: [
		{
			id: "1df31e10-8c1f-4ba4-8d02-dcaeac1cc010",
			marketId: sampleMarket.id,
			title: "Nova atualização de regra",
			message: "O mercado continuará aceitando ordens até 23:55 BRT.",
			publishedBy: "ops@hyperwood.dev",
			publishedAt: "2026-04-23T20:15:00.000Z",
			createdAt: "2026-04-23T20:15:00.000Z",
		},
	],
};

export const sampleMarketDetail: MarketDetail = {
	id: sampleMarket.id,
	slug: sampleMarket.slug,
	title: sampleMarket.title,
	summary: sampleMarket.summary,
	status: sampleMarket.status,
	currency: sampleMarket.currency,
	tags: sampleMarket.tags,
	yesPriceBps: sampleMarket.yesPriceBps,
	noPriceBps: sampleMarket.noPriceBps,
	volumeUsdMinor: sampleMarket.volumeUsdMinor,
	opensAt: sampleMarket.opensAt,
	closesAt: sampleMarket.closesAt,
	resolvesAt: sampleMarket.resolvesAt,
	statusChangedAt: sampleMarket.statusChangedAt,
	event: sampleMarket.event,
	resolutionRules:
		"Resolve para SIM se o BTC/USD em Coinbase estiver acima de 78.000 às 23:59 UTC.",
	resolutionSources: ["Coinbase BTC/USD", "CoinMarketCap BTC"],
};

export const sampleCandles: HistoricalCandle[] = [
	{
		bucketStart: "2026-04-23T19:00:00.000Z",
		bucketEnd: "2026-04-23T20:00:00.000Z",
		openPriceBps: 5200,
		highPriceBps: 5800,
		lowPriceBps: 5000,
		closePriceBps: 5600,
		volume: 210,
		tradeCount: 18,
	},
	{
		bucketStart: "2026-04-23T20:00:00.000Z",
		bucketEnd: "2026-04-23T21:00:00.000Z",
		openPriceBps: 5600,
		highPriceBps: 6000,
		lowPriceBps: 5400,
		closePriceBps: 5700,
		volume: 164,
		tradeCount: 12,
	},
	{
		bucketStart: "2026-04-23T21:00:00.000Z",
		bucketEnd: "2026-04-23T22:00:00.000Z",
		openPriceBps: 5700,
		highPriceBps: 5900,
		lowPriceBps: 5500,
		closePriceBps: 5650,
		volume: 138,
		tradeCount: 10,
	},
];

export const sampleOrderBook: OrderBookSnapshotResponse = {
	marketId: sampleMarket.id,
	snapshot: {
		asOf: "2026-04-23T20:21:00.000Z",
		sequence: 182,
		sequenceToken: "seq_182",
		totalPriceLevels: 8,
	},
	books: {
		yes: {
			bestBidPriceBps: 5650,
			bestAskPriceBps: 5720,
			bids: [
				{ priceBps: 5650, quantity: 34, orderCount: 4 },
				{ priceBps: 5600, quantity: 57, orderCount: 6 },
			],
			asks: [
				{ priceBps: 5720, quantity: 28, orderCount: 5 },
				{ priceBps: 5780, quantity: 42, orderCount: 7 },
			],
		},
		no: {
			bestBidPriceBps: 4250,
			bestAskPriceBps: 4320,
			bids: [
				{ priceBps: 4250, quantity: 40, orderCount: 4 },
				{ priceBps: 4200, quantity: 53, orderCount: 6 },
			],
			asks: [
				{ priceBps: 4320, quantity: 31, orderCount: 5 },
				{ priceBps: 4380, quantity: 25, orderCount: 3 },
			],
		},
	},
};

export const sampleTrades: TradeListResponse = {
	marketId: sampleMarket.id,
	trades: [
		{
			id: "trade-1",
			marketId: sampleMarket.id,
			makerOrderId: "maker-1",
			takerOrderId: "taker-1",
			outcome: "yes",
			priceBps: 5680,
			quantity: 12,
			makerRemainingQuantity: 8,
			takerRemainingQuantity: 0,
			executedAt: "2026-04-23T20:15:00.000Z",
		},
		{
			id: "trade-2",
			marketId: sampleMarket.id,
			makerOrderId: "maker-2",
			takerOrderId: "taker-2",
			outcome: "no",
			priceBps: 4310,
			quantity: 7,
			makerRemainingQuantity: 13,
			takerRemainingQuantity: 0,
			executedAt: "2026-04-23T20:16:30.000Z",
		},
	],
};

export const sampleUser: User = {
	id: "3c5a6e84-e7dd-4a9f-bcb9-cbc3be257005",
	email: "trader@hyperwood.dev",
	username: "leandro",
	status: "active",
	region: "BR",
	kycStatus: "approved",
	createdAt: "2026-04-01T12:00:00.000Z",
	updatedAt: "2026-04-23T20:00:00.000Z",
};
