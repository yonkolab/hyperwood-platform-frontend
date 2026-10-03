import type { CurrencyCode } from "./api/types";

export function formatMoney(
	amountMinor: number,
	currency: CurrencyCode = "BRL",
	locale = "pt-BR",
) {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
		maximumFractionDigits: 2,
	}).format(amountMinor / 100);
}

export function formatPriceBps(priceBps: number, locale = "pt-BR") {
	return `${new Intl.NumberFormat(locale, {
		maximumFractionDigits: 1,
	}).format(priceBps / 100)}%`;
}

export function formatCompactNumber(value: number, locale = "pt-BR") {
	return new Intl.NumberFormat(locale, {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(value);
}

export function formatDateTime(value: string, locale = "pt-BR") {
	return new Intl.DateTimeFormat(locale, {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(value));
}

export function formatRelativeCountdown(value: string) {
	const delta = new Date(value).getTime() - Date.now();
	const minutes = Math.max(0, Math.floor(delta / 60000));

	if (minutes < 60) {
		return `${minutes}m`;
	}

	const hours = Math.floor(minutes / 60);

	if (hours < 24) {
		const restMinutes = minutes % 60;
		return `${hours}h ${restMinutes}m`;
	}

	const days = Math.floor(hours / 24);
	const restHours = hours % 24;

	if (restHours > 0 && days < 7) {
		return `${days}d ${restHours}h`;
	}

	return `${days}d`;
}
