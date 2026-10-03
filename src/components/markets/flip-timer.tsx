import { useEffect, useState } from "react";

type TimeUnit = {
	label: string;
	value: number;
};

function buildUnits(remainingMs: number): TimeUnit[] {
	const totalMinutes = Math.floor(remainingMs / 60_000);
	const days = Math.floor(totalMinutes / 1440);
	const hours = Math.floor((totalMinutes % 1440) / 60);
	const minutes = totalMinutes % 60;

	return [
		{ label: "day", value: days },
		{ label: "hrs", value: hours },
		{ label: "mins", value: minutes },
	];
}

export function FlipTimer(props: {
	closesAt: string | null | undefined;
	className?: string;
	compact?: boolean;
}) {
	const [now, setNow] = useState(() => Date.now());

	useEffect(() => {
		const timer = window.setInterval(() => {
			setNow(Date.now());
		}, 1000);

		return () => {
			window.clearInterval(timer);
		};
	}, []);

	const closesAt = props.closesAt ? new Date(props.closesAt) : null;
	const remainingMs = closesAt ? Math.max(0, closesAt.getTime() - now) : 0;
	const units = buildUnits(remainingMs);

	return (
		<div
			className={`flex items-start ${
				props.compact ? "gap-2" : "gap-3"
			} ${props.className ?? ""}`}
			role="timer"
			aria-label="Tempo restante para o mercado encerrar"
		>
			{units.map((unit) => (
				<div key={unit.label} className="flex flex-col items-center gap-1">
					<div className="flex gap-1">
						{String(unit.value)
							.padStart(2, "0")
							.split("")
							.map((digit, index) => (
								<span
									key={`${index}-${digit}`}
									className={`flip-digit flex items-center justify-center rounded-md border border-edge bg-card font-bold tabular-nums text-foreground shadow-[0_1px_2px_rgba(13,31,23,0.08)] ${
										props.compact
											? "h-8 w-6 text-sm"
											: "h-11 w-8 rounded-lg text-xl"
									}`}
								>
									{digit}
								</span>
							))}
					</div>
					<span
						className={`font-semibold uppercase tracking-[0.18em] text-muted ${
							props.compact ? "text-[8px]" : "text-[10px]"
						}`}
					>
						{unit.label}
					</span>
				</div>
			))}
		</div>
	);
}
