import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "#/components/ui/button";
import { Card, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Select } from "#/components/ui/select";
import { placeOrder } from "#/features/orders/server";
import type { MarketDetail, User } from "#/lib/api/types";
import { formatPriceBps } from "#/lib/format";

const orderSchema = z.object({
	outcome: z.enum(["yes", "no"]),
	side: z.enum(["buy", "sell"]),
	type: z.enum(["market", "limit"]),
	quantity: z.coerce.number().int().positive(),
	limitPriceBps: z.coerce.number().int().min(1).max(9999).optional(),
});

type OrderFormInput = z.input<typeof orderSchema>;
type OrderFormValues = z.output<typeof orderSchema>;

export function TradeTicket(props: {
	market: MarketDetail;
	user: User | null;
}) {
	const sideFieldId = "trade-side";
	const typeFieldId = "trade-type";
	const quantityFieldId = "trade-quantity";
	const limitPriceFieldId = "trade-limit-price";
	const queryClient = useQueryClient();
	const form = useForm<OrderFormInput, undefined, OrderFormValues>({
		resolver: zodResolver(orderSchema),
		defaultValues: {
			outcome: "yes",
			side: "buy",
			type: "market",
			quantity: 10,
			limitPriceBps: props.market.yesPriceBps,
		},
	});

	const watchedOutcome = form.watch("outcome");
	const watchedType = form.watch("type");
	const referencePrice =
		watchedOutcome === "yes"
			? props.market.yesPriceBps
			: props.market.noPriceBps;

	const estimatedValue = useMemo(() => {
		const quantity = Number(form.watch("quantity") ?? 0);
		const price =
			watchedType === "limit"
				? Number(form.watch("limitPriceBps") ?? referencePrice)
				: referencePrice;
		return (quantity * price) / 100;
	}, [form, referencePrice, watchedType]);

	const mutation = useMutation({
		mutationFn: async (values: OrderFormValues) =>
			placeOrder({
				data: {
					marketId: props.market.id,
					...values,
					...(values.type === "limit"
						? { limitPriceBps: values.limitPriceBps ?? referencePrice }
						: {}),
				},
			}),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["portfolio"] }),
				queryClient.invalidateQueries({
					queryKey: ["markets", props.market.id],
				}),
			]);
			form.reset({
				outcome: watchedOutcome,
				side: "buy",
				type: "market",
				quantity: 10,
				limitPriceBps: referencePrice,
			});
		},
	});

	if (!props.user) {
		return (
			<Card className="p-5">
				<CardTitle>Boleta</CardTitle>
				<p className="mt-4 text-sm text-slate-400">
					Faça login para enviar ordens neste mercado.
				</p>
			</Card>
		);
	}

	return (
		<Card className="p-5">
			<CardTitle>Boleta</CardTitle>
			<form
				className="mt-5 space-y-4"
				onSubmit={form.handleSubmit(async (values) =>
					mutation.mutateAsync(values),
				)}
			>
				<div className="grid grid-cols-2 gap-3">
					<Button
						type="button"
						variant={watchedOutcome === "yes" ? "positive" : "secondary"}
						onClick={() => form.setValue("outcome", "yes")}
					>
						Comprar sim
					</Button>
					<Button
						type="button"
						variant={watchedOutcome === "no" ? "negative" : "secondary"}
						onClick={() => form.setValue("outcome", "no")}
					>
						Comprar não
					</Button>
				</div>
				<div className="grid gap-4 sm:grid-cols-2">
					<label
						htmlFor={sideFieldId}
						className="space-y-2 text-sm text-slate-400"
					>
						<span>Lado</span>
						<Select id={sideFieldId} {...form.register("side")}>
							<option value="buy">buy</option>
							<option value="sell">sell</option>
						</Select>
					</label>
					<label
						htmlFor={typeFieldId}
						className="space-y-2 text-sm text-slate-400"
					>
						<span>Tipo</span>
						<Select id={typeFieldId} {...form.register("type")}>
							<option value="market">market</option>
							<option value="limit">limit</option>
						</Select>
					</label>
				</div>
				<label
					htmlFor={quantityFieldId}
					className="space-y-2 text-sm text-slate-400"
				>
					<span>Quantidade</span>
					<Input
						id={quantityFieldId}
						type="number"
						min={1}
						{...form.register("quantity")}
					/>
				</label>
				{watchedType === "limit" ? (
					<label
						htmlFor={limitPriceFieldId}
						className="space-y-2 text-sm text-slate-400"
					>
						<span>Preço limite (bps)</span>
						<Input
							id={limitPriceFieldId}
							type="number"
							min={1}
							max={9999}
							{...form.register("limitPriceBps")}
						/>
					</label>
				) : null}
				<div className="rounded-2xl border border-slate-900 bg-slate-950/70 p-4 text-sm text-slate-300">
					<div className="flex items-center justify-between">
						<span>Preço de referência</span>
						<span className="font-semibold text-white">
							{formatPriceBps(referencePrice)}
						</span>
					</div>
					<div className="mt-2 flex items-center justify-between">
						<span>Valor estimado</span>
						<span className="font-semibold text-cyan-300">
							{estimatedValue.toFixed(2)}
						</span>
					</div>
				</div>
				{mutation.error ? (
					<p className="text-sm text-rose-300">{mutation.error.message}</p>
				) : null}
				<Button type="submit" className="w-full" disabled={mutation.isPending}>
					{mutation.isPending ? "Enviando..." : "Enviar ordem"}
				</Button>
			</form>
		</Card>
	);
}
