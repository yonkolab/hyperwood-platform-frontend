import type { HTMLAttributes } from "react";
import { cn } from "#/lib/utils";

export function SectionHeading({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"flex items-center justify-between gap-3 border-b border-slate-900 pb-4",
				className,
			)}
			{...props}
		/>
	);
}
