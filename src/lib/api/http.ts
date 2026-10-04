import { randomUUID } from "node:crypto";
import { env } from "#/env";
import { ApiError } from "./errors";
import type { ApiErrorResponse } from "./types";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

type BackendRequestOptions = {
	method?: HttpMethod;
	body?: unknown;
	token?: string;
	headers?: HeadersInit;
	idempotencyKey?: string;
};

function buildHeaders(options: BackendRequestOptions): Headers {
	const headers = new Headers(options.headers);
	headers.set("accept", "application/json");

	if (options.body !== undefined) {
		headers.set("content-type", "application/json");
	}

	if (options.token) {
		headers.set("authorization", `Bearer ${options.token}`);
	}

	if (options.idempotencyKey) {
		headers.set("idempotency-key", options.idempotencyKey);
	}

	headers.set("x-request-id", randomUUID());
	return headers;
}

async function parseResponse<T>(response: Response): Promise<T> {
	if (response.ok) {
		if (response.status === 204) {
			return undefined as T;
		}

		return (await response.json()) as T;
	}

	const errorBody = (await response.json().catch(() => ({
		error: "unknown_error",
		message: `request failed with status ${response.status}`,
	}))) as ApiErrorResponse;

	throw new ApiError(response.status, errorBody.error, errorBody.message);
}

export async function requestBackend<T>(
	path: string,
	options: BackendRequestOptions = {},
) {
	const response = await fetch(`${env.VITE_API_BASE_URL}${path}`, {
		method: options.method ?? "GET",
		headers: buildHeaders(options),
		body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
	});

	return parseResponse<T>(response);
}

export function createIdempotencyKey() {
	return randomUUID();
}
