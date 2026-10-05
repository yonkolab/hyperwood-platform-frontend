import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SocialAuthButtons } from "#/components/auth/social-auth-buttons";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { registerUser } from "#/features/auth/server";
import { formatApiError } from "#/lib/api/errors";

const formSchema = z.object({
	email: z.string().email(),
	username: z.string().min(3).max(64).optional(),
	password: z.string().min(10),
});

type FormValues = z.infer<typeof formSchema>;

export const Route = createFileRoute("/register")({
	component: RegisterPage,
});

function RegisterPage() {
	const emailFieldId = "register-email";
	const usernameFieldId = "register-username";
	const passwordFieldId = "register-password";
	const navigate = useNavigate();
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
	});

	const mutation = useMutation({
		mutationFn: async (values: FormValues) => registerUser({ data: values }),
		onSuccess: async () => {
			toast.success(
				"Conta criada com sucesso! Enviamos um link de verificação para o seu e-mail.",
			);
			await navigate({ to: "/verify-email" });
		},
		onError: (error) => {
			toast.error(formatApiError(error));
		},
	});

	return (
		<div className="mx-auto max-w-lg">
			<Card className="p-6">
				<h1 className="font-display text-2xl font-semibold text-foreground">
					Abra sua conta
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
						htmlFor={usernameFieldId}
						className="space-y-2 text-sm text-muted"
					>
						<span>Usuário</span>
						<Input id={usernameFieldId} {...form.register("username")} />
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
						{mutation.isPending ? "Criando..." : "Criar conta"}
					</Button>
				</form>
				<SocialAuthButtons />
			</Card>
		</div>
	);
}
