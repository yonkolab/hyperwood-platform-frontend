import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { env } from "#/env";
import { createIdempotencyKey, requestBackend } from "#/lib/api/http";
import type {
	ApiKeyListResponse,
	AuthMeResponse,
	CreateApiKeyResponse,
	LoginMfaChallengeResponse,
	LoginSessionResponse,
	RevokeApiKeyResponse,
	RevokeSessionResponse,
	RotateApiKeyResponse,
	SessionListResponse,
	TotpConfirmResponse,
	TotpSetupResponse,
	User,
	VerificationResponse,
	VerifyEmailResponse,
} from "#/lib/api/types";
import {
	clearStoredSessionToken,
	getStoredLocale,
	getStoredSessionToken,
	setStoredLocale,
	setStoredSessionToken,
} from "#/lib/session/cookies";

const emailSchema = z.object({
	email: z.string().email(),
});

const registerSchema = emailSchema.extend({
	username: z.string().min(3).max(64).optional(),
	password: z.string().min(10),
});

const loginSchema = emailSchema.extend({
	password: z.string().min(1),
});

const verifyEmailSchema = z.object({
	token: z.string().min(1),
});

const verifyTotpSchema = z.object({
	challengeToken: z.string().min(1),
	code: z.string().regex(/^\d{6}$/),
});

const revokeSessionSchema = z.object({
	sessionId: z.string().uuid(),
});

const localeSchema = z.object({
	locale: z.enum(["pt-BR", "en"]),
});

const createApiKeySchema = z.object({
	scopes: z.array(z.string()).min(1),
	code: z
		.string()
		.regex(/^\d{6}$/)
		.optional(),
});

const apiKeyIdSchema = z.object({
	apiKeyId: z.string().uuid(),
	code: z
		.string()
		.regex(/^\d{6}$/)
		.optional(),
});

const confirmTotpSchema = z.object({
	factorId: z.string().uuid(),
	code: z.string().regex(/^\d{6}$/),
});

type LoginResult = LoginSessionResponse | LoginMfaChallengeResponse;

function isLoginSession(result: LoginResult): result is LoginSessionResponse {
	return result.mfaRequired === false;
}

async function getAuthorizationToken() {
	return getStoredSessionToken();
}

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
	async (): Promise<User | null> => {
		const token = await getAuthorizationToken();

		if (!token) {
			return null satisfies User | null;
		}

		try {
			const result = await requestBackend<AuthMeResponse>("/api/v1/auth/me", {
				token,
			});

			return result.user;
		} catch {
			clearStoredSessionToken();
			return null satisfies User | null;
		}
	},
);

export const registerUser = createServerFn({ method: "POST" })
	.inputValidator(registerSchema)
	.handler(
		async ({ data }): Promise<VerificationResponse> =>
			requestBackend<VerificationResponse>("/api/v1/auth/register", {
				method: "POST",
				body: data,
			}),
	);

export const requestEmailVerification = createServerFn({ method: "POST" })
	.inputValidator(emailSchema)
	.handler(
		async ({ data }): Promise<VerificationResponse> =>
			requestBackend<VerificationResponse>(
				"/api/v1/auth/request-email-verification",
				{
					method: "POST",
					body: data,
				},
			),
	);

export const loginUser = createServerFn({ method: "POST" })
	.inputValidator(loginSchema)
	.handler(async ({ data }): Promise<LoginResult> => {
		const result = await requestBackend<LoginResult>("/api/v1/auth/login", {
			method: "POST",
			body: data,
		});

		if (isLoginSession(result)) {
			setStoredSessionToken(result.sessionToken);
		}

		return result;
	});

export const verifyEmail = createServerFn({ method: "POST" })
	.inputValidator(verifyEmailSchema)
	.handler(
		async ({ data }): Promise<VerifyEmailResponse> =>
			requestBackend<VerifyEmailResponse>("/api/v1/auth/verify-email", {
				method: "POST",
				body: data,
			}),
	);

export const verifyTotpLogin = createServerFn({ method: "POST" })
	.inputValidator(verifyTotpSchema)
	.handler(async ({ data }): Promise<LoginSessionResponse> => {
		const result = await requestBackend<LoginSessionResponse>(
			"/api/v1/auth/mfa/totp/verify",
			{
				method: "POST",
				body: data,
			},
		);

		setStoredSessionToken(result.sessionToken);
		return result;
	});

export const logoutUser = createServerFn({ method: "POST" }).handler(
	async (): Promise<{ ok: true }> => {
		const token = await getAuthorizationToken();

		if (token) {
			await requestBackend("/api/v1/auth/sessions/current", {
				method: "DELETE",
				token,
			}).catch(() => undefined);
		}

		clearStoredSessionToken();
		return { ok: true as const };
	},
);

export const listSessions = createServerFn({ method: "GET" }).handler(
	async (): Promise<SessionListResponse> => {
		const token = await getAuthorizationToken();

		if (!token) {
			return { sessions: [] } satisfies SessionListResponse;
		}

		return requestBackend<SessionListResponse>("/api/v1/auth/sessions", {
			token,
		});
	},
);

export const revokeSession = createServerFn({ method: "POST" })
	.inputValidator(revokeSessionSchema)
	.handler(async ({ data }): Promise<RevokeSessionResponse> => {
		const token = await getAuthorizationToken();

		if (!token) {
			throw new Error("Missing session token for revokeSession");
		}

		return requestBackend<RevokeSessionResponse>(
			`/api/v1/auth/sessions/${data.sessionId}`,
			{
				method: "DELETE",
				token,
			},
		);
	});

export const setupTotp = createServerFn({ method: "POST" }).handler(
	async (): Promise<TotpSetupResponse> => {
		const token = await getAuthorizationToken();

		if (!token) {
			throw new Error("Missing session token for setupTotp");
		}

		return requestBackend<TotpSetupResponse>("/api/v1/auth/mfa/totp/setup", {
			method: "POST",
			token,
			body: {},
		});
	},
);

export const confirmTotp = createServerFn({ method: "POST" })
	.inputValidator(confirmTotpSchema)
	.handler(async ({ data }): Promise<TotpConfirmResponse> => {
		const token = await getAuthorizationToken();

		if (!token) {
			throw new Error("Missing session token for confirmTotp");
		}

		return requestBackend<TotpConfirmResponse>(
			"/api/v1/auth/mfa/totp/confirm",
			{
				method: "POST",
				token,
				body: data,
			},
		);
	});

async function createMfaAuthorizationToken(code: string | undefined) {
	const token = await getAuthorizationToken();

	if (!token || !code) {
		return undefined;
	}

	const result = await requestBackend<{
		authorizationToken: string;
		expiresAt: string;
		action: "api_keys_manage";
	}>("/api/v1/auth/mfa/totp/authorize", {
		method: "POST",
		token,
		body: {
			action: "api_keys_manage",
			code,
		},
	});

	return result.authorizationToken;
}

export const listApiKeys = createServerFn({ method: "GET" }).handler(
	async (): Promise<ApiKeyListResponse> => {
		const token = await getAuthorizationToken();

		if (!token) {
			return { apiKeys: [] } satisfies ApiKeyListResponse;
		}

		return requestBackend<ApiKeyListResponse>("/api/v1/auth/api-keys", {
			token,
		});
	},
);

export const createApiKey = createServerFn({ method: "POST" })
	.inputValidator(createApiKeySchema)
	.handler(async ({ data }): Promise<CreateApiKeyResponse> => {
		const token = await getAuthorizationToken();

		if (!token) {
			throw new Error("Missing session token for createApiKey");
		}

		const mfaAuthorizationToken = await createMfaAuthorizationToken(data.code);

		return requestBackend<CreateApiKeyResponse>("/api/v1/auth/api-keys", {
			method: "POST",
			token,
			headers: mfaAuthorizationToken
				? { "x-mfa-authorization": mfaAuthorizationToken }
				: undefined,
			body: { scopes: data.scopes },
		});
	});

export const revokeApiKey = createServerFn({ method: "POST" })
	.inputValidator(apiKeyIdSchema)
	.handler(async ({ data }): Promise<RevokeApiKeyResponse> => {
		const token = await getAuthorizationToken();

		if (!token) {
			throw new Error("Missing session token for revokeApiKey");
		}

		const mfaAuthorizationToken = await createMfaAuthorizationToken(data.code);

		return requestBackend<RevokeApiKeyResponse>(
			`/api/v1/auth/api-keys/${data.apiKeyId}`,
			{
				method: "DELETE",
				token,
				headers: mfaAuthorizationToken
					? { "x-mfa-authorization": mfaAuthorizationToken }
					: undefined,
			},
		);
	});

export const rotateApiKey = createServerFn({ method: "POST" })
	.inputValidator(apiKeyIdSchema)
	.handler(async ({ data }): Promise<RotateApiKeyResponse> => {
		const token = await getAuthorizationToken();

		if (!token) {
			throw new Error("Missing session token for rotateApiKey");
		}

		const mfaAuthorizationToken = await createMfaAuthorizationToken(data.code);

		return requestBackend<RotateApiKeyResponse>(
			`/api/v1/auth/api-keys/${data.apiKeyId}/rotate`,
			{
				method: "POST",
				token,
				headers: mfaAuthorizationToken
					? { "x-mfa-authorization": mfaAuthorizationToken }
					: undefined,
				body: {},
			},
		);
	});

export const setLocalePreference = createServerFn({ method: "POST" })
	.inputValidator(localeSchema)
	.handler(async ({ data }): Promise<{ locale: "pt-BR" | "en" }> => {
		setStoredLocale(data.locale);
		return data;
	});

export const getLocalePreference = createServerFn({ method: "GET" }).handler(
	async (): Promise<{ locale: "pt-BR" | "en" }> => ({
		locale: (getStoredLocale() ?? env.VITE_DEFAULT_LOCALE) as "pt-BR" | "en",
	}),
);

export const createOrderIdempotencyKey = createServerFn({
	method: "GET",
}).handler(
	async (): Promise<{ idempotencyKey: string }> => ({
		idempotencyKey: createIdempotencyKey(),
	}),
);
