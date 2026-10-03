import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { loginUser } from "#/features/auth/server";
import { formatApiError } from "#/lib/api/errors";

const formSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	const emailFieldId = "login-email";
	const passwordFieldId = "login-password";
	const navigate = useNavigate();
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
	});

	const mutation = useMutation({
		mutationFn: async (values: FormValues) => loginUser({ data: values }),
		onSuccess: async (result) => {
			if (result.mfaRequired) {
				await navigate({
					to: "/mfa/verify",
					search: { challengeToken: result.challengeToken },
				});
				return;
			}

			if (result.user.status === "pending_email_verification") {
				toast.warning(
					"Você ainda não verificou seu e-mail. Confira sua caixa de entrada para ativar a conta — ou reenvie o link abaixo.",
				);
				await navigate({ to: "/verify-email" });
				return;
			}

			await navigate({ to: "/portfolio" });
		},
		onError: (error) => {
			toast.error(formatApiError(error));
		},
	});

	return (
		<div className="mx-auto max-w-md">
			<Card className="p-6">
				<h1 className="text-2xl font-semibold text-foreground">
					Entre na sua conta
				</h1>
				<form
					className="mt-6 space-y-4"
					onSubmit={form.handleSubmit(async (values) =>
						mutation.mutateAsync(values),
					)}
				>
					<label
						htmlFor={emailFieldId}
						className="space-y-2 text-sm text-muted"
					>
						<span>E-mail</span>
						<Input id={emailFieldId} type="email" {...form.register("email")} />
					</label>
					<label
						htmlFor={passwordFieldId}
						className="space-y-2 text-sm text-muted"
					>
						<span>Senha</span>
						<Input
							id={passwordFieldId}
							type="password"
							{...form.register("password")}
						/>
					</label>
					<Button
						type="submit"
						className="w-full"
						disabled={mutation.isPending}
					>
						{mutation.isPending ? "Entrando..." : "Entrar"}
					</Button>
				</form>
			</Card>
		</div>
	);
}
