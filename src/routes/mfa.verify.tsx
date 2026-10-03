import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { verifyTotpLogin } from "#/features/auth/server";

const formSchema = z.object({
	code: z.string().regex(/^\d{6}$/),
});

export const Route = createFileRoute("/mfa/verify")({
	validateSearch: (search) => ({
		challengeToken:
			typeof search.challengeToken === "string" ? search.challengeToken : "",
	}),
	component: MfaVerifyPage,
});

function MfaVerifyPage() {
	const codeFieldId = "mfa-code";
	const navigate = useNavigate();
	const { challengeToken } = Route.useSearch();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	const mutation = useMutation({
		mutationFn: async (values: z.infer<typeof formSchema>) =>
			verifyTotpLogin({
				data: {
					challengeToken,
					code: values.code,
				},
			}),
		onSuccess: async () => {
			await navigate({ to: "/portfolio" });
		},
		onError: (error) => setErrorMessage(error.message),
	});

	return (
		<div className="mx-auto max-w-md">
			<Card className="p-6">
				<h1 className="font-display text-2xl font-semibold text-foreground">
					Validar MFA
				</h1>
				<form
					className="mt-6 space-y-4"
					onSubmit={form.handleSubmit(async (values) =>
						mutation.mutateAsync(values),
					)}
				>
					<label htmlFor={codeFieldId} className="space-y-2 text-sm text-muted">
						<span>Código</span>
						<Input id={codeFieldId} maxLength={6} {...form.register("code")} />
					</label>
					{errorMessage ? (
						<p className="text-sm text-no">{errorMessage}</p>
					) : null}
					<Button type="submit" className="w-full">
						Confirmar
					</Button>
				</form>
			</Card>
		</div>
	);
}
