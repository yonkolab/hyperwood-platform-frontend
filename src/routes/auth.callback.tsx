import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Card } from "#/components/ui/card";
import { exchangeOAuthLoginCode } from "#/features/auth/server";
import { formatApiError } from "#/lib/api/errors";

const callbackErrors: Record<string, string> = {
	oauth_account_exists:
		"Já existe uma conta com este e-mail. Entre usando seu método original; por segurança, as contas não são vinculadas automaticamente.",
	oauth_cancelled: "Autenticação cancelada.",
	oauth_email_unverified:
		"Verifique seu e-mail no provedor antes de continuar.",
	oauth_provider_unavailable:
		"Este método de login ainda não está configurado.",
	oauth_state_invalid:
		"A tentativa de login expirou ou já foi usada. Inicie o login novamente.",
};

type OAuthProvider = "google" | "apple";

function isOAuthProvider(value: unknown): value is OAuthProvider {
	return value === "google" || value === "apple";
}

export const Route = createFileRoute("/auth/callback")({
	validateSearch: (search) => ({
		code: typeof search.code === "string" ? search.code : undefined,
		provider: isOAuthProvider(search.provider) ? search.provider : undefined,
		error: typeof search.error === "string" ? search.error : undefined,
	}),
	head: () => ({
		meta: [{ name: "referrer", content: "no-referrer" }],
	}),
	component: OAuthCallbackPage,
});

function OAuthCallbackPage() {
	const { code, error, provider } = Route.useSearch();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const started = useRef(false);

	useEffect(() => {
		if (started.current) return;
		started.current = true;

		const finishLogin = async () => {
			if (error) {
				toast.error(
					callbackErrors[error] ??
						"Não foi possível autenticar com este provedor. Tente novamente.",
				);
				await navigate({ to: "/login", replace: true });
				return;
			}

			if (!code || !provider) {
				toast.error("Retorno de login inválido. Inicie o login novamente.");
				await navigate({ to: "/login", replace: true });
				return;
			}

			try {
				const result = await exchangeOAuthLoginCode({
					data: { provider, code },
				});

				if (result.mfaRequired) {
					await navigate({
						to: "/mfa/verify",
						search: { challengeToken: result.challengeToken },
					});
					return;
				}

				queryClient.setQueryData(["auth", "me"], result.user);
				toast.success(`Bem-vindo, ${result.user.username ?? "trader"}!`);
				await navigate({ to: "/portfolio", replace: true });
			} catch (exchangeError) {
				toast.error(formatApiError(exchangeError));
				await navigate({ to: "/login", replace: true });
			}
		};

		void finishLogin();
	}, [code, error, navigate, provider, queryClient]);

	return (
		<div className="mx-auto max-w-md">
			<Card className="p-6 text-center">
				<h1 className="font-display text-2xl font-semibold text-foreground">
					Concluindo login
				</h1>
				<p className="mt-2 text-sm text-muted">
					Aguarde enquanto validamos sua autenticação.
				</p>
			</Card>
		</div>
	);
}
