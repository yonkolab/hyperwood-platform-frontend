import { zodResolver } from "@hookform/resolvers/zod";
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { updateCurrentUserProfile } from "#/features/auth/server";
import { currentUserQueryOptions } from "#/lib/query-options";

const profileSchema = z.object({
	username: z
		.string()
		.trim()
		.min(3, "O nome de usuário deve ter pelo menos 3 caracteres.")
		.max(64, "O nome de usuário deve ter no máximo 64 caracteres."),
});

export const Route = createFileRoute("/profile")({
	loader: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData(
			currentUserQueryOptions,
		);
		if (!user) throw redirect({ to: "/login" });
	},
	component: ProfilePage,
});

function ProfilePage() {
	const queryClient = useQueryClient();
	const { data: user } = useSuspenseQuery(currentUserQueryOptions);
	if (!user) throw redirect({ to: "/login" });

	const form = useForm<z.infer<typeof profileSchema>>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			username: user.username ?? "",
		},
	});
	const updateMutation = useMutation({
		mutationFn: (values: z.infer<typeof profileSchema>) =>
			updateCurrentUserProfile({ data: values }),
		onSuccess: async ({ user: updatedUser }) => {
			await queryClient.setQueryData(
				currentUserQueryOptions.queryKey,
				updatedUser,
			);
			form.reset({ username: updatedUser.username ?? "" });
			toast.success("Perfil atualizado.");
		},
		onError: (error) => {
			toast.error(
				error.message.includes("username is already in use")
					? "Esse nome de usuário já está em uso."
					: "Não foi possível atualizar seu perfil. Tente novamente.",
			);
		},
	});

	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<header className="space-y-2">
				<h1 className="font-display text-3xl font-semibold text-foreground">
					Perfil
				</h1>
				<p className="text-sm leading-6 text-muted">
					Atualize as informações básicas da sua conta.
				</p>
			</header>
			<Card className="p-5 sm:p-6">
				<form
					className="space-y-5"
					onSubmit={form.handleSubmit((values) =>
						updateMutation.mutate(values),
					)}
				>
					<div className="space-y-2">
						<label
							htmlFor="profile-username"
							className="text-sm font-medium text-foreground"
						>
							Nome de usuário
						</label>
						<Input
							id="profile-username"
							autoComplete="nickname"
							maxLength={64}
							aria-invalid={Boolean(form.formState.errors.username)}
							aria-describedby={
								form.formState.errors.username
									? "profile-username-error"
									: "profile-username-help"
							}
							{...form.register("username")}
						/>
						<p id="profile-username-help" className="text-xs text-muted">
							De 3 a 64 caracteres.
						</p>
						{form.formState.errors.username ? (
							<p id="profile-username-error" className="text-sm text-no">
								{form.formState.errors.username.message}
							</p>
						) : null}
					</div>
					<div className="space-y-2">
						<label
							htmlFor="profile-email"
							className="text-sm font-medium text-foreground"
						>
							E-mail
						</label>
						<Input id="profile-email" value={user.email} readOnly disabled />
						<p className="text-xs text-muted">
							O e-mail é usado para entrar na conta e não pode ser alterado
							aqui.
						</p>
					</div>
					<div className="flex justify-end">
						<Button type="submit" disabled={updateMutation.isPending}>
							{updateMutation.isPending ? "Salvando..." : "Salvar alterações"}
						</Button>
					</div>
				</form>
			</Card>
		</div>
	);
}
