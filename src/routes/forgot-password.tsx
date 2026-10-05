import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { requestPasswordReset } from "#/features/auth/server";
import { formatApiError } from "#/lib/api/errors";

const requestSchema = z.object({
	email: z.string().email("Informe um e-mail válido."),
});

export const Route = createFileRoute("/forgot-password")({
	component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
	const [requested, setRequested] = useState(false);
	const form = useForm<z.infer<typeof requestSchema>>({
		resolver: zodResolver(requestSchema),
	});
	const mutation = useMutation({
		mutationFn: (values: z.infer<typeof requestSchema>) =>
			requestPasswordReset({ data: values }),
		onSuccess: () => setRequested(true),
		onError: (error) =>
			form.setError("root", { message: formatApiError(error) }),
	});

	return (
		<div className="mx-auto max-w-md">
			<Card className="p-6">
				<h1 className="font-display text-2xl font-semibold text-foreground">
					Recuperar senha
				</h1>
				{requested ? (
					<div className="mt-4 space-y-4">
						<output className="text-sm leading-6 text-muted">
							Se houver uma conta elegível para este e-mail, enviaremos
							instruções para redefinir a senha. Confira sua caixa de entrada.
						</output>
						<Link
							to="/login"
							className="inline-flex min-h-11 items-center justify-center rounded-lg border border-edge bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
						>
							Voltar para entrar
						</Link>
					</div>
				) : (
					<>
						<p className="mt-2 text-sm leading-6 text-muted">
							Informe o e-mail da sua conta e enviaremos um link para criar uma
							nova senha.
						</p>
						<form
							className="mt-6 space-y-4"
							onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
						>
							<div className="space-y-2">
								<label
									htmlFor="forgot-password-email"
									className="text-sm font-medium text-foreground"
								>
									E-mail
								</label>
								<Input
									id="forgot-password-email"
									type="email"
									autoComplete="email"
									aria-invalid={Boolean(form.formState.errors.email)}
									{...form.register("email")}
								/>
								{form.formState.errors.email ? (
									<p className="text-sm text-no">
										{form.formState.errors.email.message}
									</p>
								) : null}
							</div>
							{form.formState.errors.root ? (
								<p role="alert" className="text-sm text-no">
									{form.formState.errors.root.message}
								</p>
							) : null}
							<Button
								type="submit"
								className="w-full"
								disabled={mutation.isPending}
							>
								{mutation.isPending
									? "Enviando..."
									: "Enviar link de recuperação"}
							</Button>
						</form>
						<Link
							to="/login"
							className="mt-5 inline-block text-sm font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
						>
							Voltar para entrar
						</Link>
					</>
				)}
			</Card>
		</div>
	);
}
