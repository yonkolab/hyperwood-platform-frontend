import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const SUPPORTED_LOCALES = ["pt-BR", "en"] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const env = createEnv({
	server: {
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
	},
	clientPrefix: "VITE_",
	client: {
		VITE_API_BASE_URL: z.string().url(),
		VITE_APP_TITLE: z.string().min(1).default("Hyperwood"),
		VITE_DEFAULT_LOCALE: z.enum(SUPPORTED_LOCALES).default("pt-BR"),
	},
	runtimeEnv: import.meta.env,
	emptyStringAsUndefined: true,
});
