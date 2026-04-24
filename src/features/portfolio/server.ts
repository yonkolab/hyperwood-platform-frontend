import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requestBackend } from "#/lib/api/http";
import type {
	FillListResponse,
	HistoricalExportArtifactResponse,
	HistoricalExportJobListResponse,
	HistoricalExportJobResponse,
	HistoricalOrderListResponse,
	PortfolioSummaryResponse,
	SettlementListResponse,
} from "#/lib/api/types";
import { getStoredSessionToken } from "#/lib/session/cookies";

const currencySchema = z.object({
	currency: z.string().default("BRL"),
});

const exportIdSchema = z.object({
	exportJobId: z.string().uuid(),
});

function getTokenOrThrow() {
	const token = getStoredSessionToken();

	if (!token) {
		throw new Error("Missing authenticated session token");
	}

	return token;
}

function toSerializable<T>(value: T): T {
	return JSON.parse(JSON.stringify(value)) as T;
}

export const getPortfolioSummary = createServerFn({ method: "GET" })
	.inputValidator(currencySchema)
	.handler(
		async ({ data }): Promise<PortfolioSummaryResponse> =>
			toSerializable(
				await requestBackend<PortfolioSummaryResponse>(
					`/api/v1/portfolio?currency=${data.currency}`,
					{ token: getTokenOrThrow() },
				),
			),
	);

export const getPortfolioFills = createServerFn({ method: "GET" })
	.inputValidator(currencySchema)
	.handler(
		async ({ data }): Promise<FillListResponse> =>
			requestBackend<FillListResponse>(
				`/api/v1/portfolio/fills?currency=${data.currency}`,
				{ token: getTokenOrThrow() },
			),
	);

export const getPortfolioSettlements = createServerFn({ method: "GET" })
	.inputValidator(currencySchema)
	.handler(
		async ({ data }): Promise<SettlementListResponse> =>
			requestBackend<SettlementListResponse>(
				`/api/v1/portfolio/settlements?currency=${data.currency}`,
				{ token: getTokenOrThrow() },
			),
	);

export const getHistoricalOrders = createServerFn({ method: "GET" })
	.inputValidator(currencySchema)
	.handler(
		async ({ data }): Promise<HistoricalOrderListResponse> =>
			requestBackend<HistoricalOrderListResponse>(
				`/api/v1/historical/portfolio/orders?currency=${data.currency}`,
				{ token: getTokenOrThrow() },
			),
	);

export const getHistoricalFills = createServerFn({ method: "GET" })
	.inputValidator(currencySchema)
	.handler(
		async ({ data }): Promise<FillListResponse> =>
			requestBackend<FillListResponse>(
				`/api/v1/historical/portfolio/fills?currency=${data.currency}`,
				{ token: getTokenOrThrow() },
			),
	);

export const getPortfolioExports = createServerFn({ method: "GET" })
	.inputValidator(currencySchema)
	.handler(
		async ({ data }): Promise<HistoricalExportJobListResponse> =>
			requestBackend<HistoricalExportJobListResponse>(
				`/api/v1/portfolio/exports?currency=${data.currency}`,
				{ token: getTokenOrThrow() },
			),
	);

export const createPortfolioExport = createServerFn({ method: "POST" })
	.inputValidator(currencySchema)
	.handler(
		async ({ data }): Promise<HistoricalExportJobResponse> =>
			toSerializable(
				await requestBackend<HistoricalExportJobResponse>(
					"/api/v1/portfolio/exports",
					{
						method: "POST",
						token: getTokenOrThrow(),
						body: data,
					},
				),
			),
	);

export const getPortfolioExportArtifact = createServerFn({ method: "GET" })
	.inputValidator(exportIdSchema)
	.handler(
		async ({ data }): Promise<HistoricalExportArtifactResponse> =>
			toSerializable(
				await requestBackend<HistoricalExportArtifactResponse>(
					`/api/v1/portfolio/exports/${data.exportJobId}`,
					{ token: getTokenOrThrow() },
				),
			),
	);
