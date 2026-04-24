import i18next from "i18next";
import { useMemo } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import type { AppLocale } from "#/env";
import { messages } from "#/locales/messages";

function createI18n(locale: AppLocale) {
	const instance = i18next.createInstance();

	void instance.use(initReactI18next).init({
		lng: locale,
		fallbackLng: "pt-BR",
		resources: Object.fromEntries(
			Object.entries(messages).map(([key, value]) => [
				key,
				{ translation: value },
			]),
		),
		interpolation: { escapeValue: false },
	});

	return instance;
}

export function AppI18nProvider(props: {
	children: React.ReactNode;
	locale: AppLocale;
}) {
	const instance = useMemo(() => createI18n(props.locale), [props.locale]);

	return <I18nextProvider i18n={instance}>{props.children}</I18nextProvider>;
}

export { useTranslation };
