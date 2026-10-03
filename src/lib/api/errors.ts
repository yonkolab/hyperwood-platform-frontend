import { ApiError } from "./http";

const friendlyMessages: Record<string, string> = {
	conflict: "E-mail ou usuário já cadastrado.",
	invalid_credentials: "E-mail ou senha incorretos.",
	replayed_api_request: "Requisição repetida detectada. Tente novamente.",
	rate_limit_exceeded:
		"Muitas tentativas. Aguarde alguns instantes e tente de novo.",
	email_not_verified: "Verifique seu e-mail antes de entrar.",
	invalid_verification_token: "Link de verificação inválido ou expirado.",
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
