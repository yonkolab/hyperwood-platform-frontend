import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { HistoricalCandle } from "#/lib/api/types";

const YES_COLOR = "#00a67e";
const NO_COLOR = "#dc2f2f";

export function MarketChart(props: { candles?: HistoricalCandle[] }) {
	const candles = props.candles ?? [];

	if (candles.length === 0) {
		return (
			<div className="flex h-72 w-full items-center justify-center rounded-lg border border-dashed border-edge bg-subtle">
				<p className="max-w-xs text-center text-sm text-muted">
					Sem negociações registradas ainda — o gráfico mostra o preço atual do
					mercado.
				</p>
			</div>
		);
	}

	const sorted = [...candles].sort(
		(left, right) =>
			new Date(left.bucketStart).getTime() -
			new Date(right.bucketStart).getTime(),
	);

	const data = sorted.map((candle, index) => {
		const bucketDate = new Date(candle.bucketStart);
		const previous = index > 0 ? sorted[index - 1] : null;
		const monthChanged =
			!previous ||
			new Date(previous.bucketStart).getUTCMonth() !== bucketDate.getUTCMonth();

		return {
			date: candle.bucketStart,
			yes: round(candle.closePriceBps / 100),
			no: round(100 - candle.closePriceBps / 100),
			volumeYes: candle.volumeYes,
			volumeNo: candle.volumeNo,
			monthLabel: monthChanged ? formatMonthYear(bucketDate) : "",
		};
	});

	const maxBar = Math.max(
		1,
		...data.map((row) => row.volumeYes + row.volumeNo),
	);

	return (
		<div className="rounded-lg border border-edge bg-white p-6 shadow-[0_1px_2px_rgba(13,31,23,0.05)]">
			<div className="h-[420px] w-full">
				<ResponsiveContainer width="100%" height="100%">
					<ComposedChart
						data={data}
						margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
					>
						<CartesianGrid
							stroke="#eef1ee"
							strokeDasharray="3 3"
							vertical={false}
						/>
						<XAxis
							xAxisId="days"
							dataKey="date"
							tickFormatter={(value: string) => formatDayLabel(value)}
							tick={{ fill: "#5c6660", fontSize: 12 }}
							axisLine={{ stroke: "#e5e9e5" }}
							tickLine={false}
							tickMargin={8}
							minTickGap={16}
						/>
						<XAxis
							xAxisId="months"
							dataKey="monthLabel"
							tick={{ fill: "#8a958f", fontSize: 11 }}
							axisLine={false}
							tickLine={false}
							tickMargin={22}
							interval={0}
						/>
						<YAxis
							yAxisId="probability"
							domain={[0, 100]}
							ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
							tickFormatter={(value: number) => `${value}%`}
							tick={{ fill: "#5c6660", fontSize: 12 }}
							axisLine={false}
							tickLine={false}
							width={48}
						/>
						<YAxis yAxisId="volume" domain={[0, maxBar * 5]} hide />
						<Tooltip
							labelFormatter={(value: string) => formatFullDate(value)}
							formatter={(value: number | string, name: string) =>
								name === "Sim" || name === "Não" ? `${value}%` : value
							}
							contentStyle={{
								backgroundColor: "#ffffff",
								border: "1px solid #e5e9e5",
								borderRadius: 10,
								fontSize: 13,
								boxShadow: "0 8px 24px rgba(13,31,23,0.10)",
							}}
							labelStyle={{ fontWeight: 600, color: "#0d1f17" }}
						/>
						<Legend
							verticalAlign="top"
							align="left"
							iconType="circle"
							iconSize={9}
							wrapperStyle={{ fontSize: 13, paddingBottom: 8 }}
						/>
						<Bar
							xAxisId="days"
							yAxisId="volume"
							dataKey="volumeYes"
							name="Volume Sim"
							stackId="volume"
							fill={YES_COLOR}
							opacity={0.22}
							radius={[0, 0, 0, 0]}
						/>
						<Bar
							xAxisId="days"
							yAxisId="volume"
							dataKey="volumeNo"
							name="Volume Não"
							stackId="volume"
							fill={NO_COLOR}
							opacity={0.22}
						/>
						<Line
							xAxisId="days"
							yAxisId="probability"
							type="monotone"
							dataKey="yes"
							name="Sim"
							stroke={YES_COLOR}
							strokeWidth={2.5}
							strokeLinecap="round"
							dot={{ r: 3, strokeWidth: 0, fill: YES_COLOR }}
							activeDot={{ r: 5, strokeWidth: 0 }}
						/>
						<Line
							xAxisId="days"
							yAxisId="probability"
							type="monotone"
							dataKey="no"
							name="Não"
							stroke={NO_COLOR}
							strokeWidth={2.5}
							strokeLinecap="round"
							dot={{ r: 3, strokeWidth: 0, fill: NO_COLOR }}
							activeDot={{ r: 5, strokeWidth: 0 }}
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

function formatDayLabel(isoDate: string) {
	return new Date(isoDate).toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "short",
	});
}

function formatMonthYear(date: Date) {
	const month = date.toLocaleDateString("pt-BR", { month: "short" });
	const year = date.getUTCFullYear();

	return `${month} ${year}`;
}

function formatFullDate(isoDate: string) {
	return new Date(isoDate).toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

function round(value: number) {
	return Math.round(value * 10) / 10;
}
