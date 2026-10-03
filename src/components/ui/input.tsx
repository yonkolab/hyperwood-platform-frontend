import type { InputHTMLAttributes } from "react";
import { cn } from "#/lib/utils";

export function Input({
	className,
	...props
}: InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input
			className={cn(
				"w-full rounded-lg border border-edge bg-card px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-yes/60 focus:ring-2 focus:ring-yes/15",
				className,
			)}
			{...props}
		/>
	);
}
