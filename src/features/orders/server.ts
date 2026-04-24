import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createIdempotencyKey, requestBackend } from "#/lib/api/http";
import type { CreateOrderResponse } from "#/lib/api/types";
import { getStoredSessionToken } from "#/lib/session/cookies";

const createOrderSchema = z.object({
	marketId: z.string().uuid(),
	type: z.enum(["limit", "market"]),
	side: z.enum(["buy", "sell"]),
	outcome: z.enum(["yes", "no"]),
	quantity: z.number().int().positive(),
	limitPriceBps: z.number().int().min(1).max(9999).optional(),
});

function toSerializable<T>(value: T): T {
	return JSON.parse(JSON.stringify(value)) as T;
}

export const placeOrder = createServerFn({ method: "POST" })
	.inputValidator(createOrderSchema)
	.handler(async ({ data }): Promise<CreateOrderResponse> => {
		const token = getStoredSessionToken();

		if (!token) {
			throw new Error("Missing authenticated session token");
		}

		return toSerializable(
			await requestBackend<CreateOrderResponse>("/api/v1/orders", {
				method: "POST",
				token,
				idempotencyKey: createIdempotencyKey(),
				body: {
					...data,
					selfTradePrevention: "decrement_and_cancel",
				},
			}),
		);
	});
