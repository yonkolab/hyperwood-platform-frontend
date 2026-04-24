import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { HistoricalCandle } from "#/lib/api/types";

export function MarketChart(props: { candles: HistoricalCandle[] }) {
	const data = props.candles.map((candle) => ({
		label: new Date(candle.bucketStart).toLocaleTimeString("pt-BR", {
			hour: "2-digit",
			minute: "2-digit",
		}),
		close: candle.closePriceBps / 100,
	}));

	return (
		<div className="h-72 w-full">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={data}>
					<CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
					<XAxis
						dataKey="label"
						tick={{ fill: "#64748b", fontSize: 12 }}
						axisLine={false}
						tickLine={false}
					/>
					<YAxis
						tick={{ fill: "#64748b", fontSize: 12 }}
						axisLine={false}
						tickLine={false}
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: "#020617",
							border: "1px solid rgba(51,65,85,0.8)",
							borderRadius: 16,
						}}
					/>
					<Line
						type="monotone"
						dataKey="close"
						stroke="#22d3ee"
						strokeWidth={3}
						dot={false}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
