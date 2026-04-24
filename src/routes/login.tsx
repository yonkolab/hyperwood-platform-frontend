import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { loginUser } from "#/features/auth/server";

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
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

			await navigate({ to: "/portfolio" });
		},
		onError: (error) => {
			setErrorMessage(error.message);
		},
	});

	return (
		<div className="mx-auto max-w-md">
			<Card className="p-6">
				<h1 className="text-2xl font-semibold text-white">
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
						className="space-y-2 text-sm text-slate-400"
					>
						<span>E-mail</span>
						<Input id={emailFieldId} type="email" {...form.register("email")} />
					</label>
					<label
						htmlFor={passwordFieldId}
						className="space-y-2 text-sm text-slate-400"
					>
						<span>Senha</span>
						<Input
							id={passwordFieldId}
							type="password"
							{...form.register("password")}
						/>
					</label>
					{errorMessage ? (
						<p className="text-sm text-rose-300">{errorMessage}</p>
					) : null}
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
