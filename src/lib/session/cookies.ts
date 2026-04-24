import {
	deleteCookie,
	getCookie,
	setCookie,
} from "@tanstack/react-start/server";
import type { SerializeOptions } from "cookie";
import { env } from "#/env";

export const SESSION_COOKIE_NAME = "hw_trader_session";
export const LOCALE_COOKIE_NAME = "hw_trader_locale";

function getSharedCookieOptions(): SerializeOptions {
	return {
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		secure: env.NODE_ENV === "production",
	};
}

export function getStoredSessionToken() {
	return getCookie(SESSION_COOKIE_NAME);
}

export function setStoredSessionToken(token: string) {
	setCookie(SESSION_COOKIE_NAME, token, getSharedCookieOptions());
}

export function clearStoredSessionToken() {
	deleteCookie(SESSION_COOKIE_NAME, getSharedCookieOptions());
}

export function getStoredLocale() {
	return getCookie(LOCALE_COOKIE_NAME);
}

export function setStoredLocale(locale: string) {
	setCookie(LOCALE_COOKIE_NAME, locale, {
		...getSharedCookieOptions(),
		httpOnly: false,
		maxAge: 60 * 60 * 24 * 365,
	});
}
