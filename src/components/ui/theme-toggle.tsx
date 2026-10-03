import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "#/components/ui/button";
import { resolveInitialTheme, toggleTheme } from "#/lib/theme";

export function ThemeToggle() {
	const [theme, setThemeState] = useState<"light" | "dark">("light");

	useEffect(() => {
		setThemeState(resolveInitialTheme());
	}, []);

	return (
		<Button
			variant="ghost"
			size="icon"
			aria-label={
				theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"
			}
			onClick={() => {
				setThemeState(toggleTheme());
			}}
		>
			{theme === "dark" ? (
				<Sun className="size-4" />
			) : (
				<Moon className="size-4" />
			)}
		</Button>
	);
}
