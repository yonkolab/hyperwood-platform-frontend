import type { components } from "./generated";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export type JsonObject = { [key: string]: JsonValue };

export type ApiErrorResponse = components["schemas"]["ErrorResponse"];
export type User = components["schemas"]["User"];
export type MarketRecord = components["schemas"]["MarketRecord"];
export type MarketDetail = Pick<
	components["schemas"]["MarketDetailResponse"]["market"],
	| "id"
	| "slug"
	| "title"
	| "summary"
	| "status"
	| "currency"
	| "tags"
	| "yesPriceBps"
	| "noPriceBps"
	| "volumeUsdMinor"
	| "opensAt"
	| "closesAt"
	| "resolvesAt"
	| "statusChangedAt"
	| "event"
	| "resolutionRules"
	| "resolutionSources"
>;
export type MarketListResponse = components["schemas"]["MarketListResponse"];
export type MarketAnnouncement = components["schemas"]["MarketAnnouncement"];
export type HistoricalCandle = components["schemas"]["HistoricalCandle"] & {
	volumeYes: number;
	volumeNo: number;
};
export type OrderBookSnapshotResponse =
	components["schemas"]["OrderBookSnapshotResponse"];
export type TradeListResponse = components["schemas"]["TradeListResponse"];
export type WalletBalance = components["schemas"]["WalletBalance"];
export type LedgerActivity = Omit<
	components["schemas"]["LedgerActivity"],
	"metadata"
> & {
	metadata: JsonObject;
};
export type PortfolioSummaryResponse = Omit<
	components["schemas"]["PortfolioSummaryResponse"],
	"recentLedgerActivity"
> & {
	recentLedgerActivity: LedgerActivity[];
};
export type FillListResponse = components["schemas"]["FillListResponse"];
export type SettlementListResponse =
	components["schemas"]["SettlementListResponse"];
export type HistoricalOrderListResponse =
	components["schemas"]["HistoricalOrderListResponse"];
export type HistoricalExportJobListResponse =
	components["schemas"]["HistoricalExportJobListResponse"];
export type HistoricalExportJobResponse = Omit<
	components["schemas"]["HistoricalExportJobResponse"],
	never
>;
export type HistoricalExportArtifactResponse = Omit<
	components["schemas"]["HistoricalExportArtifactResponse"],
	"artifact"
> & {
	artifact: JsonObject;
};
export type EligibleFundingMethodsResponse =
	components["schemas"]["EligibleFundingMethodsResponse"];
export type FundingMethod = components["schemas"]["FundingMethod"];
export type DepositListResponse = components["schemas"]["DepositListResponse"];
export type WithdrawalListResponse =
	components["schemas"]["WithdrawalListResponse"];
export type VerificationResponse =
	components["schemas"]["VerificationResponse"];
export type LoginSessionResponse =
	components["schemas"]["LoginSessionResponse"];
export type LoginMfaChallengeResponse =
	components["schemas"]["LoginMfaChallengeResponse"];
export type OAuthProvidersResponse =
	components["schemas"]["OAuthProvidersResponse"];
export type VerifyEmailResponse = components["schemas"]["VerifyEmailResponse"];
export type RequestPasswordResetResponse =
	components["schemas"]["RequestPasswordResetResponse"];
export type ResetPasswordResponse =
	components["schemas"]["ResetPasswordResponse"];
export type SessionListResponse = components["schemas"]["SessionListResponse"];
export type TotpSetupResponse = components["schemas"]["TotpSetupResponse"];
export type TotpConfirmResponse = components["schemas"]["TotpConfirmResponse"];
export type ApiKeyListResponse = components["schemas"]["ApiKeyListResponse"];
export type CreateApiKeyResponse =
	components["schemas"]["CreateApiKeyResponse"];
export type RotateApiKeyResponse =
	components["schemas"]["RotateApiKeyResponse"];
export type AuthMeResponse = components["schemas"]["AuthMeResponse"];
export type MarketCommand = Omit<
	components["schemas"]["MarketCommand"],
	"metadata"
> & {
	metadata: JsonObject;
};
export type CreateOrderResponse = Omit<
	components["schemas"]["CreateOrderResponse"],
	"marketCommand"
> & {
	marketCommand?: MarketCommand;
};
export type FundingMethodResponse = Omit<
	components["schemas"]["FundingMethodResponse"],
	"fundingMethod"
> & {
	fundingMethod: Omit<
		components["schemas"]["FundingMethodResponse"]["fundingMethod"],
		"metadata"
	> & {
		metadata?: JsonObject;
	};
};
export type DepositResponse = components["schemas"]["DepositResponse"];
export type WithdrawalResponse = components["schemas"]["WithdrawalResponse"];
export type RevokeSessionResponse =
	components["schemas"]["RevokeSessionResponse"];
export type RevokeApiKeyResponse =
	components["schemas"]["RevokeApiKeyResponse"];
export type CurrencyCode = components["schemas"]["CurrencyCode"];
export type MarketSort = "newest" | "closing_soon" | "highest_volume";
