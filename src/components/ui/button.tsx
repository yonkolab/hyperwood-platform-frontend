import type { ButtonHTMLAttributes } from "react";
import { cn } from "#/lib/utils";

type ButtonVariant =
	| "primary"
	| "secondary"
	| "ghost"
	| "danger"
	| "positive"
	| "negative";

export function Button({
	className,
	children,
	variant = "primary",
	...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant;
}) {
	return (
		<button
			className={cn(
				"inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
				variant === "primary" &&
					"border-transparent bg-brand text-white hover:bg-brand-hover",
				variant === "secondary" &&
					"border-edge bg-card text-foreground shadow-[0_1px_2px_rgba(13,31,23,0.06)] hover:border-brand/40",
				variant === "ghost" &&
					"border-transparent bg-transparent text-muted hover:bg-subtle hover:text-foreground",
				variant === "danger" &&
					"border-transparent bg-no text-white hover:bg-no/90",
				variant === "positive" &&
					"border-transparent bg-yes text-white hover:bg-yes/90",
				variant === "negative" &&
					"border-transparent bg-no text-white hover:bg-no/90",
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}
