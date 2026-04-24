import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { requestEmailVerification, verifyEmail } from "#/features/auth/server";

const verifySchema = z.object({
	token: z.string().min(1),
});

const resendSchema = z.object({
	email: z.string().email(),
});

export const Route = createFileRoute("/verify-email")({
	component: VerifyEmailPage,
});

function VerifyEmailPage() {
	const tokenFieldId = "verify-email-token";
	const resendEmailFieldId = "verify-email-resend";
	const [message, setMessage] = useState<string | null>(null);
	const verifyForm = useForm<z.infer<typeof verifySchema>>({
		resolver: zodResolver(verifySchema),
	});
	const resendForm = useForm<z.infer<typeof resendSchema>>({
		resolver: zodResolver(resendSchema),
	});

	const verifyMutation = useMutation({
		mutationFn: async (values: z.infer<typeof verifySchema>) =>
			verifyEmail({ data: values }),
		onSuccess: () => {
			setMessage("E-mail verificado com sucesso.");
		},
	});

	const resendMutation = useMutation({
		mutationFn: async (values: z.infer<typeof resendSchema>) =>
			requestEmailVerification({ data: values }),
		onSuccess: (result) => {
			setMessage(`Reenvio criado com status ${result.delivery.status}.`);
		},
	});

	return (
		<div className="grid gap-6 lg:grid-cols-2">
			<Card className="p-6">
				<h1 className="text-2xl font-semibold text-white">Verificar e-mail</h1>
				<form
					className="mt-6 space-y-4"
					onSubmit={verifyForm.handleSubmit(async (values) =>
						verifyMutation.mutateAsync(values),
					)}
				>
					<label
						htmlFor={tokenFieldId}
						className="space-y-2 text-sm text-slate-400"
					>
						<span>Token</span>
						<Input id={tokenFieldId} {...verifyForm.register("token")} />
					</label>
					<Button type="submit" className="w-full">
						Confirmar verificação
					</Button>
				</form>
			</Card>
			<Card className="p-6">
				<h2 className="text-2xl font-semibold text-white">Reenviar desafio</h2>
				<form
					className="mt-6 space-y-4"
					onSubmit={resendForm.handleSubmit(async (values) =>
						resendMutation.mutateAsync(values),
					)}
				>
					<label
						htmlFor={resendEmailFieldId}
						className="space-y-2 text-sm text-slate-400"
					>
						<span>E-mail</span>
						<Input
							id={resendEmailFieldId}
							type="email"
							{...resendForm.register("email")}
						/>
					</label>
					<Button type="submit" variant="secondary" className="w-full">
						Reenviar verificação
					</Button>
				</form>
				{message ? (
					<p className="mt-4 text-sm text-cyan-200">{message}</p>
				) : null}
			</Card>
		</div>
	);
}
