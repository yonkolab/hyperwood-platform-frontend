export type Theme = "light" | "dark";

const STORAGE_KEY = "hw-theme";
const THEME_EVENT = "hw-theme-change";

export function getStoredTheme(): Theme | null {
	if (typeof window === "undefined") {
		return null;
	}

	const stored = window.localStorage.getItem(STORAGE_KEY);

	if (stored === "light" || stored === "dark") {
		return stored;
	}

	return null;
}

export function resolveInitialTheme(): Theme {
	const stored = getStoredTheme();

	if (stored) {
		return stored;
	}

	if (
		typeof window !== "undefined" &&
		window.matchMedia("(prefers-color-scheme: dark)").matches
	) {
		return "dark";
	}

	return "light";
}

export function applyTheme(theme: Theme) {
	if (typeof document === "undefined") {
		return;
	}

	document.documentElement.classList.toggle("dark", theme === "dark");
	window.dispatchEvent(new Event(THEME_EVENT));
}

export function setTheme(theme: Theme) {
	window.localStorage.setItem(STORAGE_KEY, theme);
	applyTheme(theme);
}

export function toggleTheme(): Theme {
	const next: Theme = document.documentElement.classList.contains("dark")
		? "light"
		: "dark";

	setTheme(next);

	return next;
}

export function onThemeChange(callback: () => void): () => void {
	window.addEventListener(THEME_EVENT, callback);

	return () => {
		window.removeEventListener(THEME_EVENT, callback);
	};
}
