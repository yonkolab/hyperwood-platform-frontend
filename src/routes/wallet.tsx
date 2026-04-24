import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Select } from "#/components/ui/select";
import {
	createDeposit,
	createFundingMethod,
	createWithdrawal,
} from "#/features/funding/server";
import { formatDateTime, formatMoney } from "#/lib/format";
import {
	currentUserQueryOptions,
	depositsQueryOptions,
	fundingMethodsQueryOptions,
	walletBalanceQueryOptions,
	withdrawalsQueryOptions,
} from "#/lib/query-options";

const currency = "BRL";

const addMethodSchema = z.object({
	rail: z.enum(["pix", "wire", "debit_card", "crypto_wallet", "ach", "fps"]),
	displayName: z.string().min(2),
	countryCode: z.string().length(2),
	status: z.enum(["pending_verification", "verified", "disabled"]),
});

const transferSchema = z.object({
	fundingMethodId: z.string().uuid(),
	amountMinor: z.coerce.number().int().positive(),
});

type AddMethodValues = z.output<typeof addMethodSchema>;
type AddMethodInput = z.input<typeof addMethodSchema>;
type TransferValues = z.output<typeof transferSchema>;
type TransferInput = z.input<typeof transferSchema>;

export const Route = createFileRoute("/wallet")({
	loader: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData(
			currentUserQueryOptions,
		);
		if (!user) throw redirect({ to: "/login" });

		await Promise.all([
			context.queryClient.ensureQueryData(walletBalanceQueryOptions(currency)),
			context.queryClient.ensureQueryData(fundingMethodsQueryOptions(currency)),
			context.queryClient.ensureQueryData(depositsQueryOptions),
			context.queryClient.ensureQueryData(withdrawalsQueryOptions),
		]);
	},
	component: WalletPage,
});

function WalletPage() {
	const { data: balance } = useSuspenseQuery(
		walletBalanceQueryOptions(currency),
	);
	const { data: methods } = useSuspenseQuery(
		fundingMethodsQueryOptions(currency),
	);
	const { data: deposits } = useSuspenseQuery(depositsQueryOptions);
	const { data: withdrawals } = useSuspenseQuery(withdrawalsQueryOptions);
	const [message, setMessage] = useState<string | null>(null);

	const methodForm = useForm<AddMethodInput, undefined, AddMethodValues>({
		resolver: zodResolver(addMethodSchema),
		defaultValues: {
			rail: "pix",
			status: "verified",
			countryCode: "BR",
		},
	});

	const transferForm = useForm<TransferInput, undefined, TransferValues>({
		resolver: zodResolver(transferSchema),
	});

	const depositMutation = useMutation({
		mutationFn: async (values: TransferValues) =>
			createDeposit({ data: { ...values, currency } }),
		onSuccess: () => setMessage("Depósito criado com sucesso."),
	});
	const withdrawalMutation = useMutation({
		mutationFn: async (values: TransferValues) =>
			createWithdrawal({ data: { ...values, currency } }),
		onSuccess: () => setMessage("Saque criado com sucesso."),
	});
	const methodMutation = useMutation({
		mutationFn: async (values: AddMethodValues) =>
			createFundingMethod({ data: values }),
		onSuccess: () => setMessage("Método adicionado com sucesso."),
	});

	return (
		<div className="space-y-8">
			<section className="grid gap-4 lg:grid-cols-4">
				<WalletMetric
					label="Disponível"
					value={formatMoney(balance.availableBalanceMinor)}
				/>
				<WalletMetric
					label="Reservado"
					value={formatMoney(balance.reservedBalanceMinor)}
				/>
				<WalletMetric
					label="Colateral"
					value={formatMoney(balance.positionCollateralMinor)}
				/>
				<WalletMetric
					label="Total"
					value={formatMoney(balance.totalBalanceMinor)}
				/>
			</section>
			{message ? <p className="text-sm text-cyan-200">{message}</p> : null}
			<section className="grid gap-6 xl:grid-cols-[320px_1fr_1fr]">
				<Card className="p-5">
					<h2 className="text-lg font-semibold text-white">Adicionar método</h2>
					<form
						className="mt-4 space-y-3"
						onSubmit={methodForm.handleSubmit(async (values) =>
							methodMutation.mutateAsync(values),
						)}
					>
						<Select {...methodForm.register("rail")}>
							<option value="pix">pix</option>
							<option value="wire">wire</option>
							<option value="debit_card">debit_card</option>
							<option value="crypto_wallet">crypto_wallet</option>
						</Select>
						<Input
							placeholder="Nome de exibição"
							{...methodForm.register("displayName")}
						/>
						<Input placeholder="País" {...methodForm.register("countryCode")} />
						<Button type="submit" className="w-full">
							Salvar método
						</Button>
					</form>
				</Card>
				<Card className="p-5">
					<h2 className="text-lg font-semibold text-white">Criar depósito</h2>
					<TransferForm
						methods={methods.fundingMethods}
						form={transferForm}
						submitLabel="Criar depósito"
						onSubmit={async (values) => depositMutation.mutateAsync(values)}
					/>
				</Card>
				<Card className="p-5">
					<h2 className="text-lg font-semibold text-white">Criar saque</h2>
					<TransferForm
						methods={methods.fundingMethods}
						form={transferForm}
						submitLabel="Criar saque"
						onSubmit={async (values) => withdrawalMutation.mutateAsync(values)}
					/>
				</Card>
			</section>
			<section className="grid gap-6 xl:grid-cols-2">
				<Card className="p-5">
					<h2 className="text-xl font-semibold text-white">Depósitos</h2>
					<div className="mt-4 space-y-3">
						{deposits.deposits.map((deposit) => (
							<TransferRow
								key={deposit.id}
								title={deposit.fundingMethod.displayName}
								subtitle={formatDateTime(deposit.requestedAt)}
								amount={formatMoney(deposit.amountMinor)}
								status={deposit.status}
							/>
						))}
					</div>
				</Card>
				<Card className="p-5">
					<h2 className="text-xl font-semibold text-white">Saques</h2>
					<div className="mt-4 space-y-3">
						{withdrawals.withdrawals.map((withdrawal) => (
							<TransferRow
								key={withdrawal.id}
								title={withdrawal.fundingMethod.displayName}
								subtitle={formatDateTime(withdrawal.requestedAt)}
								amount={formatMoney(withdrawal.amountMinor)}
								status={withdrawal.status}
							/>
						))}
					</div>
				</Card>
			</section>
		</div>
	);
}

function WalletMetric(props: { label: string; value: string }) {
	return (
		<Card className="p-5">
			<p className="text-xs uppercase tracking-[0.2em] text-slate-500">
				{props.label}
			</p>
			<p className="mt-3 text-2xl font-semibold text-white">{props.value}</p>
		</Card>
	);
}

function TransferForm(props: {
	methods: Array<{ id: string; displayName: string }>;
	form: ReturnType<typeof useForm<TransferInput, undefined, TransferValues>>;
	submitLabel: string;
	onSubmit: (values: TransferValues) => Promise<unknown>;
}) {
	return (
		<form
			className="mt-4 space-y-3"
			onSubmit={props.form.handleSubmit(props.onSubmit)}
		>
			<Select {...props.form.register("fundingMethodId")}>
				<option value="">Selecione um método</option>
				{props.methods.map((method) => (
					<option key={method.id} value={method.id}>
						{method.displayName}
					</option>
				))}
			</Select>
			<Input
				type="number"
				placeholder="Valor em centavos"
				{...props.form.register("amountMinor")}
			/>
			<Button type="submit" className="w-full">
				{props.submitLabel}
			</Button>
		</form>
	);
}

function TransferRow(props: {
	title: string;
	subtitle: string;
	amount: string;
	status: string;
}) {
	return (
		<div className="rounded-2xl border border-slate-900 bg-slate-950/70 px-4 py-4">
			<div className="flex items-center justify-between gap-4">
				<div>
					<p className="font-medium text-white">{props.title}</p>
					<p className="mt-1 text-sm text-slate-500">{props.subtitle}</p>
				</div>
				<div className="text-right">
					<p className="font-semibold text-cyan-300">{props.amount}</p>
					<p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
						{props.status}
					</p>
				</div>
			</div>
		</div>
	);
}
