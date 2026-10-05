export class ApiError extends Error {
	constructor(
		readonly status: number,
		readonly code: string,
		message: string,
	) {
		super(message);
		this.name = "ApiError";
	}
}

const friendlyMessages: Record<string, string> = {
	conflict: "E-mail ou usuário já cadastrado.",
	invalid_credentials: "E-mail ou senha incorretos.",
	replayed_api_request: "Requisição repetida detectada. Tente novamente.",
	rate_limit_exceeded:
		"Muitas tentativas. Aguarde alguns instantes e tente de novo.",
	email_not_verified: "Verifique seu e-mail antes de entrar.",
	invalid_verification_token: "Link de verificação inválido ou expirado.",
	oauth_account_exists:
		"Já existe uma conta com este e-mail. Entre usando seu método original; por segurança, as contas não são vinculadas automaticamente.",
	oauth_cancelled: "Autenticação cancelada.",
	oauth_email_unverified:
		"Verifique seu e-mail no provedor antes de continuar.",
	oauth_provider_unavailable:
		"Este método de login ainda não está configurado.",
	oauth_state_invalid:
		"A tentativa de login expirou ou já foi usada. Inicie o login novamente.",
};

export function formatApiError(error: unknown): string {
	if (error instanceof ApiError) {
		if (friendlyMessages[error.code]) {
			return friendlyMessages[error.code];
		}

		if (error.code === "invalid_request") {
			return "Dados inválidos. Confira os campos e tente novamente.";
		}

		if (error.status >= 500) {
			return "Erro interno do servidor. Tente novamente em instantes.";
		}

		return error.message;
	}

	if (error instanceof Error && error.message) {
		return error.message;
	}

	return "Algo deu errado. Tente novamente.";
}
