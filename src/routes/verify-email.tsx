import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
	createFileRoute,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { requestEmailVerification, verifyEmail } from "#/features/auth/server";
import { formatApiError } from "#/lib/api/errors";

const verifySchema = z.object({
	token: z.string().min(1),
});

const resendSchema = z.object({
	email: z.string().email(),
});

const verifySearchSchema = z.object({
	token: z.string().optional(),
});

export const Route = createFileRoute("/verify-email")({
	validateSearch: verifySearchSchema,
	component: VerifyEmailPage,
});

function VerifyEmailPage() {
	const tokenFieldId = "verify-email-token";
	const resendEmailFieldId = "verify-email-resend";
	const navigate = useNavigate();
	const search = useSearch({ from: "/verify-email" });
	const hasTokenFromLink = Boolean(search.token);

	const verifyForm = useForm<z.infer<typeof verifySchema>>({
		resolver: zodResolver(verifySchema),
		defaultValues: { token: search.token ?? "" },
	});
	const resendForm = useForm<z.infer<typeof resendSchema>>({
		resolver: zodResolver(resendSchema),
	});

	useEffect(() => {
		if (search.token) {
			verifyForm.setValue("token", search.token);
		}
	}, [search.token, verifyForm]);

	const verifyMutation = useMutation({
		mutationFn: async (values: z.infer<typeof verifySchema>) =>
			verifyEmail({ data: values }),
		onSuccess: async () => {
			toast.success("E-mail verificado com sucesso! Agora você pode entrar.");
			await navigate({ to: "/login" });
		},
		onError: (error) => {
			toast.error(formatApiError(error));
		},
	});

	const resendMutation = useMutation({
		mutationFn: async (values: z.infer<typeof resendSchema>) =>
			requestEmailVerification({ data: values }),
		onSuccess: () => {
			toast.success(
				"Enviamos um novo link de verificação. Confira sua caixa de entrada.",
			);
		},
		onError: (error) => {
			toast.error(formatApiError(error));
		},
	});

	return (
		<div className="mx-auto max-w-lg">
			<Card className="p-6">
				<h1 className="text-2xl font-semibold text-foreground">
					Verificar e-mail
				</h1>
				<p className="mt-2 text-sm leading-6 text-muted">
					{hasTokenFromLink
						? "Chegou aqui pelo link do e-mail? O token já está preenchido — basta confirmar."
						: "Cole abaixo o token que você recebeu por e-mail para ativar sua conta."}
				</p>

				<form
					className="mt-6 space-y-4"
					onSubmit={verifyForm.handleSubmit(async (values) =>
						verifyMutation.mutateAsync(values),
					)}
				>
					<label
						htmlFor={tokenFieldId}
						className="space-y-2 text-sm text-muted"
					>
						<span>Token de verificação</span>
						<Input
							id={tokenFieldId}
							className="font-mono text-xs"
							{...verifyForm.register("token")}
						/>
					</label>
					<Button
						type="submit"
						className="w-full"
						disabled={verifyMutation.isPending}
					>
						{verifyMutation.isPending ? "Verificando..." : "Ativar conta"}
					</Button>
				</form>

				<div className="my-6 flex items-center gap-3">
					<span className="h-px flex-1 bg-edge" />
					<span className="text-xs uppercase tracking-widest text-slate-500">
						Não recebeu o e-mail?
					</span>
					<span className="h-px flex-1 bg-edge" />
				</div>

				<form
					className="flex flex-col gap-3 sm:flex-row sm:items-end"
					onSubmit={resendForm.handleSubmit(async (values) =>
						resendMutation.mutateAsync(values),
					)}
				>
					<label
						htmlFor={resendEmailFieldId}
						className="flex-1 space-y-2 text-sm text-muted"
					>
						<span>Seu e-mail</span>
						<Input
							id={resendEmailFieldId}
							type="email"
							placeholder="voce@email.com"
							{...resendForm.register("email")}
						/>
					</label>
					<Button
						type="submit"
						variant="secondary"
						disabled={resendMutation.isPending}
					>
						{resendMutation.isPending ? "Enviando..." : "Reenviar link"}
					</Button>
				</form>
			</Card>
		</div>
	);
}
