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
					<Button
						type="submit"
						className="w-full"
						disabled={verifyMutation.isPending}
					>
						{verifyMutation.isPending
							? "Verificando..."
							: "Confirmar verificação"}
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
					<Button
						type="submit"
						variant="secondary"
						className="w-full"
						disabled={resendMutation.isPending}
					>
						{resendMutation.isPending ? "Enviando..." : "Reenviar verificação"}
					</Button>
				</form>
			</Card>
		</div>
	);
}
