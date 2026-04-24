import type { SelectHTMLAttributes } from "react";
import { cn } from "#/lib/utils";

export function Select({
	className,
	...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
	return (
		<select
			className={cn(
				"w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20",
				className,
			)}
			{...props}
		/>
	);
}
