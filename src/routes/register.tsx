import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { registerUser } from "#/features/auth/server";

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
	const [deliveryMessage, setDeliveryMessage] = useState<string | null>(null);
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
	});

	const mutation = useMutation({
		mutationFn: async (values: FormValues) => registerUser({ data: values }),
		onSuccess: (result) => {
			const token = result.verificationChallenge.token
				? ` Token dev: ${result.verificationChallenge.token}.`
				: "";
			setDeliveryMessage(`Entrega: ${result.delivery.status}.${token}`);
		},
	});

	return (
		<div className="mx-auto max-w-lg">
			<Card className="p-6">
				<h1 className="text-2xl font-semibold text-white">Abra sua conta</h1>
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
						htmlFor={usernameFieldId}
						className="space-y-2 text-sm text-slate-400"
					>
						<span>Usuário</span>
						<Input id={usernameFieldId} {...form.register("username")} />
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
					{deliveryMessage ? (
						<p className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-sm text-cyan-200">
							{deliveryMessage}{" "}
							<Link to="/verify-email" className="underline">
								Verificar agora
							</Link>
						</p>
					) : null}
					{mutation.error ? (
						<p className="text-sm text-rose-300">{mutation.error.message}</p>
					) : null}
					<Button
						type="submit"
						className="w-full"
						disabled={mutation.isPending}
					>
						{mutation.isPending ? "Criando..." : "Criar conta"}
					</Button>
				</form>
			</Card>
		</div>
	);
}
