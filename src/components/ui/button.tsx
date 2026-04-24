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
				"inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
				variant === "primary" &&
					"border-cyan-400/30 bg-cyan-400 text-slate-950 hover:bg-cyan-300",
				variant === "secondary" &&
					"border-slate-800 bg-slate-900 text-slate-100 hover:border-slate-700 hover:bg-slate-800",
				variant === "ghost" &&
					"border-transparent bg-transparent text-slate-300 hover:bg-slate-900",
				variant === "danger" &&
					"border-red-500/30 bg-red-500/15 text-red-200 hover:bg-red-500/20",
				variant === "positive" &&
					"border-emerald-400/20 bg-emerald-400/15 text-emerald-200 hover:bg-emerald-400/20",
				variant === "negative" &&
					"border-rose-400/20 bg-rose-400/15 text-rose-200 hover:bg-rose-400/20",
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}
