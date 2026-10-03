import type { HTMLAttributes } from "react";
import { cn } from "#/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"rounded-lg border border-edge bg-card shadow-[0_1px_2px_rgba(13,31,23,0.05)]",
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
			className={cn(
				"font-display text-lg font-semibold text-foreground",
				className,
			)}
			{...props}
		/>
	);
}
