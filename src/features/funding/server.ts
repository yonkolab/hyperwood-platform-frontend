import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requestBackend } from "#/lib/api/http";
import type {
	DepositListResponse,
	DepositResponse,
	EligibleFundingMethodsResponse,
	FundingMethodResponse,
	WalletBalance,
	WithdrawalListResponse,
	WithdrawalResponse,
} from "#/lib/api/types";
import { getStoredSessionToken } from "#/lib/session/cookies";

const currencySchema = z.object({
	currency: z.string().default("BRL"),
});

const fundingMethodCreateSchema = z.object({
	rail: z.enum(["ach", "fps", "pix", "wire", "debit_card", "crypto_wallet"]),
	status: z.enum(["pending_verification", "verified", "disabled"]),
	displayName: z.string().min(2),
	countryCode: z.string().min(2).max(2),
	provider: z.string().optional(),
	providerReference: z.string().optional(),
	last4: z.string().length(4).optional(),
});

const transferSchema = z.object({
	fundingMethodId: z.string().uuid(),
	amountMinor: z.number().int().positive(),
	currency: z.string().default("BRL"),
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

export const getEligibleFundingMethods = createServerFn({ method: "GET" })
	.inputValidator(currencySchema)
	.handler(
		async ({ data }): Promise<EligibleFundingMethodsResponse> =>
			requestBackend<EligibleFundingMethodsResponse>(
				`/api/v1/funding/methods?currency=${data.currency}`,
				{ token: getTokenOrThrow() },
			),
	);

export const getWalletBalance = createServerFn({ method: "GET" })
	.inputValidator(currencySchema)
	.handler(async ({ data }): Promise<WalletBalance> => {
		const result = await requestBackend<{ walletBalance: WalletBalance }>(
			`/api/v1/wallet/balance?currency=${data.currency}`,
			{ token: getTokenOrThrow() },
		);

		return result.walletBalance;
	});

export const getDeposits = createServerFn({ method: "GET" }).handler(
	async (): Promise<DepositListResponse> =>
		requestBackend<DepositListResponse>("/api/v1/funding/deposits", {
			token: getTokenOrThrow(),
		}),
);

export const getWithdrawals = createServerFn({ method: "GET" }).handler(
	async (): Promise<WithdrawalListResponse> =>
		requestBackend<WithdrawalListResponse>("/api/v1/funding/withdrawals", {
			token: getTokenOrThrow(),
		}),
);

export const createFundingMethod = createServerFn({ method: "POST" })
	.inputValidator(fundingMethodCreateSchema)
	.handler(
		async ({ data }): Promise<FundingMethodResponse> =>
			toSerializable(
				await requestBackend<FundingMethodResponse>("/api/v1/funding/methods", {
					method: "POST",
					token: getTokenOrThrow(),
					body: data,
				}),
			),
	);

export const createDeposit = createServerFn({ method: "POST" })
	.inputValidator(transferSchema)
	.handler(
		async ({ data }): Promise<DepositResponse> =>
			requestBackend<DepositResponse>("/api/v1/funding/deposits", {
				method: "POST",
				token: getTokenOrThrow(),
				body: data,
			}),
	);

export const createWithdrawal = createServerFn({ method: "POST" })
	.inputValidator(transferSchema)
	.handler(
		async ({ data }): Promise<WithdrawalResponse> =>
			requestBackend<WithdrawalResponse>("/api/v1/funding/withdrawals", {
				method: "POST",
				token: getTokenOrThrow(),
				body: data,
			}),
	);
