import type { SelectHTMLAttributes } from "react";
import { cn } from "#/lib/utils";

export function Select({
	className,
	...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
	return (
		<select
			className={cn(
				"w-full rounded-lg border border-edge bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-yes/60 focus:ring-2 focus:ring-yes/15",
				className,
			)}
			{...props}
		/>
	);
}
