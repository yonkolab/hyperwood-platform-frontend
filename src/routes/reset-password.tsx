import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
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
import { resetPassword } from "#/features/auth/server";
import { formatApiError } from "#/lib/api/errors";

const resetSchema = z
	.object({
		token: z.string().min(1, "Informe o token recebido por e-mail."),
		password: z
			.string()
			.min(10, "A senha deve ter pelo menos 10 caracteres.")
			.max(128, "A senha deve ter no máximo 128 caracteres."),
		confirmPassword: z.string().min(1, "Confirme sua nova senha."),
	})
	.refine((values) => values.password === values.confirmPassword, {
		message: "As senhas não coincidem.",
		path: ["confirmPassword"],
	});

const resetSearchSchema = z.object({
	token: z.string().optional(),
});

export const Route = createFileRoute("/reset-password")({
	validateSearch: resetSearchSchema,
	component: ResetPasswordPage,
});

function ResetPasswordPage() {
	const search = useSearch({ from: "/reset-password" });
	const navigate = useNavigate();
	const form = useForm<z.infer<typeof resetSchema>>({
		resolver: zodResolver(resetSchema),
		defaultValues: {
			token: search.token ?? "",
			password: "",
			confirmPassword: "",
		},
	});
	const mutation = useMutation({
		mutationFn: ({ token, password }: z.infer<typeof resetSchema>) =>
			resetPassword({ data: { token, password } }),
		onSuccess: async () => {
			toast.success("Senha redefinida. Entre com sua nova senha.");
			await navigate({ to: "/login" });
		},
		onError: (error) => {
			form.setError("root", { message: formatApiError(error) });
		},
	});

	useEffect(() => {
		if (search.token) {
			form.setValue("token", search.token);
		}
	}, [form, search.token]);

	return (
		<div className="mx-auto max-w-md">
			<Card className="p-6">
				<h1 className="font-display text-2xl font-semibold text-foreground">
					Criar nova senha
				</h1>
				<p className="mt-2 text-sm leading-6 text-muted">
					Escolha uma senha com pelo menos 10 caracteres.
				</p>
				<form
					className="mt-6 space-y-4"
					onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
				>
					{search.token ? (
						<input type="hidden" {...form.register("token")} />
					) : (
						<div className="space-y-2">
							<label
								htmlFor="reset-password-token"
								className="text-sm font-medium text-foreground"
							>
								Token recebido por e-mail
							</label>
							<Input
								id="reset-password-token"
								autoComplete="one-time-code"
								aria-invalid={Boolean(form.formState.errors.token)}
								{...form.register("token")}
							/>
							{form.formState.errors.token ? (
								<p className="text-sm text-no">
									{form.formState.errors.token.message}
								</p>
							) : null}
						</div>
					)}
					<div className="space-y-2">
						<label
							htmlFor="reset-password-new"
							className="text-sm font-medium text-foreground"
						>
							Nova senha
						</label>
						<Input
							id="reset-password-new"
							type="password"
							autoComplete="new-password"
							maxLength={128}
							aria-invalid={Boolean(form.formState.errors.password)}
							{...form.register("password")}
						/>
						{form.formState.errors.password ? (
							<p className="text-sm text-no">
								{form.formState.errors.password.message}
							</p>
						) : null}
					</div>
					<div className="space-y-2">
						<label
							htmlFor="reset-password-confirm"
							className="text-sm font-medium text-foreground"
						>
							Confirmar nova senha
						</label>
						<Input
							id="reset-password-confirm"
							type="password"
							autoComplete="new-password"
							maxLength={128}
							aria-invalid={Boolean(form.formState.errors.confirmPassword)}
							{...form.register("confirmPassword")}
						/>
						{form.formState.errors.confirmPassword ? (
							<p className="text-sm text-no">
								{form.formState.errors.confirmPassword.message}
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
						{mutation.isPending ? "Salvando..." : "Redefinir senha"}
					</Button>
				</form>
				<Link
					to="/login"
					className="mt-5 inline-block text-sm font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
				>
					Voltar para entrar
				</Link>
			</Card>
		</div>
	);
}
