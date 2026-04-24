import { useRouter } from "@tanstack/react-router";
import { Languages } from "lucide-react";
import { Button } from "#/components/ui/button";
import type { AppLocale } from "#/env";
import { setLocalePreference } from "#/features/auth/server";

export function LocaleSwitcher(props: { locale: AppLocale }) {
	const router = useRouter();

	async function handleLocaleChange() {
		const nextLocale: AppLocale = props.locale === "pt-BR" ? "en" : "pt-BR";
		await setLocalePreference({ data: { locale: nextLocale } });
		await router.invalidate();
	}

	return (
		<Button variant="ghost" onClick={handleLocaleChange} className="gap-2 px-3">
			<Languages className="size-4" />
			{props.locale}
		</Button>
	);
}
