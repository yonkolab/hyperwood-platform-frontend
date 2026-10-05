import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SecurityPageSkeleton } from "#/components/loading/page-skeletons";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import {
	confirmTotp,
	createApiKey,
	revokeApiKey,
	revokeSession,
	rotateApiKey,
	setupTotp,
} from "#/features/auth/server";
import { formatDateTime } from "#/lib/format";
import {
	apiKeysQueryOptions,
	currentUserQueryOptions,
	sessionsQueryOptions,
} from "#/lib/query-options";

const confirmTotpSchema = z.object({
	factorId: z.string().uuid(),
	code: z.string().regex(/^\d{6}$/),
});

const apiKeySchema = z.object({
	scopes: z.string().min(1),
	code: z
		.string()
		.regex(/^\d{6}$/)
		.optional(),
});

export const Route = createFileRoute("/settings/security")({
	loader: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData(
			currentUserQueryOptions,
		);
		if (!user) throw redirect({ to: "/login" });

		await Promise.all([
			context.queryClient.ensureQueryData(sessionsQueryOptions),
			context.queryClient.ensureQueryData(apiKeysQueryOptions),
		]);
	},
	pendingMs: 150,
	pendingComponent: SecurityPageSkeleton,
	component: SecurityPage,
});

function SecurityPage() {
	const { data: sessions } = useSuspenseQuery(sessionsQueryOptions);
	const { data: apiKeys } = useSuspenseQuery(apiKeysQueryOptions);
	const [totpSetupResult, setTotpSetupResult] = useState<{
		factorId: string;
		secret: string;
		otpauthUri: string;
	} | null>(null);
	const [message, setMessage] = useState<string | null>(null);

	const confirmForm = useForm<z.infer<typeof confirmTotpSchema>>({
		resolver: zodResolver(confirmTotpSchema),
	});
	const apiKeyForm = useForm<z.infer<typeof apiKeySchema>>({
		resolver: zodResolver(apiKeySchema),
		defaultValues: {
			scopes: "account:read",
		},
	});

	const setupMutation = useMutation({
		mutationFn: async () => setupTotp(),
		onSuccess: (result) => {
			setTotpSetupResult(result);
			confirmForm.setValue("factorId", result.factorId);
		},
	});

	const confirmMutation = useMutation({
		mutationFn: async (values: z.infer<typeof confirmTotpSchema>) =>
			confirmTotp({ data: values }),
		onSuccess: () => setMessage("TOTP confirmado com sucesso."),
	});

	const createApiKeyMutation = useMutation({
		mutationFn: async (values: z.infer<typeof apiKeySchema>) =>
			createApiKey({
				data: {
					scopes: values.scopes.split(",").map((scope) => scope.trim()),
					code: values.code,
				},
			}),
		onSuccess: (result) => {
			setMessage(`Nova chave criada: ${result.apiKey}`);
		},
	});

	return (
		<div className="space-y-8">
			{message ? <p className="text-sm text-brand">{message}</p> : null}
			<section className="grid gap-6 xl:grid-cols-[380px_1fr_1fr]">
				<Card className="p-5">
					<h2 className="font-display text-xl font-semibold text-foreground">
						TOTP
					</h2>
					<Button
						className="mt-4 w-full"
						onClick={() => setupMutation.mutate()}
					>
						Iniciar TOTP
					</Button>
					{totpSetupResult ? (
						<div className="mt-4 space-y-2 rounded-lg border border-edge bg-card/70 p-4 text-sm text-muted">
							<p>Secret: {totpSetupResult.secret}</p>
							<p className="break-all text-xs text-muted">
								{totpSetupResult.otpauthUri}
							</p>
						</div>
					) : null}
					<form
						className="mt-4 space-y-3"
						onSubmit={confirmForm.handleSubmit(async (values) =>
							confirmMutation.mutateAsync(values),
						)}
					>
						<Input
							placeholder="Factor ID"
							{...confirmForm.register("factorId")}
						/>
						<Input placeholder="Código" {...confirmForm.register("code")} />
						<Button type="submit" variant="secondary" className="w-full">
							Confirmar TOTP
						</Button>
					</form>
				</Card>
				<Card className="p-5">
					<h2 className="font-display text-xl font-semibold text-foreground">
						Sessões
					</h2>
					<div className="mt-4 space-y-3">
						{sessions.sessions.map((session) => (
							<div
								key={session.id}
								className="rounded-lg border border-edge bg-card/70 px-4 py-4"
							>
								<div className="flex items-center justify-between gap-4">
									<div>
										<p className="font-medium text-foreground">
											{session.userAgent ?? "Desconhecido"}
										</p>
										<p className="mt-1 text-sm text-muted">
											{formatDateTime(session.createdAt)}
										</p>
									</div>
									{!session.current ? (
										<Button
											variant="ghost"
											onClick={() =>
												void revokeSession({ data: { sessionId: session.id } })
											}
										>
											Revogar
										</Button>
									) : (
										<span className="text-xs uppercase tracking-[0.18em] text-brand">
											atual
										</span>
									)}
								</div>
							</div>
						))}
					</div>
				</Card>
				<Card className="p-5">
					<h2 className="font-display text-xl font-semibold text-foreground">
						Chaves de API
					</h2>
					<form
						className="mt-4 space-y-3"
						onSubmit={apiKeyForm.handleSubmit(async (values) =>
							createApiKeyMutation.mutateAsync(values),
						)}
					>
						<Input
							placeholder="Scopes CSV"
							{...apiKeyForm.register("scopes")}
						/>
						<Input
							placeholder="Código MFA (opcional)"
							{...apiKeyForm.register("code")}
						/>
						<Button type="submit" className="w-full">
							Criar chave
						</Button>
					</form>
					<div className="mt-4 space-y-3">
						{apiKeys.apiKeys.map((apiKey) => (
							<div
								key={apiKey.id}
								className="rounded-lg border border-edge bg-card/70 px-4 py-4"
							>
								<div className="flex items-start justify-between gap-4">
									<div>
										<p className="font-medium text-foreground">
											{apiKey.keyPrefix}
										</p>
										<p className="mt-1 text-sm text-muted">
											{apiKey.scopes.join(", ")}
										</p>
									</div>
									<div className="flex gap-2">
										<Button
											variant="ghost"
											onClick={() =>
												void rotateApiKey({ data: { apiKeyId: apiKey.id } })
											}
										>
											Rotacionar
										</Button>
										<Button
											variant="ghost"
											onClick={() =>
												void revokeApiKey({ data: { apiKeyId: apiKey.id } })
											}
										>
											Revogar
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>
				</Card>
			</section>
		</div>
	);
}
