import { useQuery } from "@tanstack/react-query";
import { Apple } from "lucide-react";
import { env } from "#/env";
import { getOAuthProviders } from "#/features/auth/server";

const providerNames = {
	google: "Google",
	apple: "Apple",
} as const;

function GoogleMark() {
	return (
		<svg aria-hidden="true" className="size-5" viewBox="0 0 48 48" fill="none">
			<path
				fill="#4285F4"
				d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5h6.6c3.9-3.6 6.1-8.8 6.1-14.9Z"
			/>
			<path
				fill="#34A853"
				d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2A20 20 0 0 0 24 44Z"
			/>
			<path
				fill="#FBBC05"
				d="M12.6 27.8a12 12 0 0 1 0-7.6V15H5.8a20 20 0 0 0 0 17.9l6.8-5.1Z"
			/>
			<path
				fill="#EA4335"
				d="M24 11.8c3 0 5.6 1 7.7 3.1l5.8-5.8C34 5.8 29.5 4 24 4A20 20 0 0 0 5.8 15l6.8 5.2c1.6-4.9 6.1-8.4 11.4-8.4Z"
			/>
		</svg>
	);
}

export function SocialAuthButtons() {
	const providers = useQuery({
		queryKey: ["auth", "oauth-providers"],
		queryFn: () => getOAuthProviders(),
		staleTime: 5 * 60 * 1000,
	});

	const enabledProviders = providers.data?.providers;

	return (
		<div className="mt-6">
			<div className="relative mb-4">
				<div className="absolute inset-0 flex items-center" aria-hidden="true">
					<div className="w-full border-t border-edge" />
				</div>
				<p className="relative mx-auto w-fit bg-card px-3 text-sm text-muted">
					ou continue com
				</p>
			</div>
			<div className="grid gap-3">
				{(["google", "apple"] as const).map((provider) => {
					const isEnabled = enabledProviders?.[provider] === true;
					const authorizationUrl = `${env.VITE_API_BASE_URL.replace(/\/$/, "")}/api/v1/auth/oauth/${provider}/authorize`;

					return (
						<button
							key={provider}
							type="button"
							disabled={!isEnabled}
							onClick={() => window.location.assign(authorizationUrl)}
							className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-edge bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-brand/40 hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-50"
						>
							{provider === "google" ? (
								<GoogleMark />
							) : (
								<Apple aria-hidden="true" className="size-5" />
							)}
							<span>Continuar com {providerNames[provider]}</span>
						</button>
					);
				})}
			</div>
			{providers.isError || providers.isPending ? (
				<output className="mt-3 block text-center text-xs text-muted">
					Login social indisponível: conecte e configure a API para ativar.
				</output>
			) : null}
		</div>
	);
}
