import type { HTMLAttributes } from "react";
import { cn } from "#/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"rounded-3xl border border-slate-800/80 bg-slate-950/75 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur",
				className,
			)}
			{...props}
		/>
	);
}

export function CardTitle({
	className,
	...props
}: HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h3
			className={cn("text-lg font-semibold text-white", className)}
			{...props}
		/>
	);
}
