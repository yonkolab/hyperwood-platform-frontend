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

export function MarketChart(props: { candles?: HistoricalCandle[] }) {
	const data = (props.candles ?? []).map((candle) => ({
		label: new Date(candle.bucketStart).toLocaleTimeString("pt-BR", {
			hour: "2-digit",
			minute: "2-digit",
		}),
		close: candle.closePriceBps / 100,
	}));

	if (data.length === 0) {
		return (
			<div className="flex h-72 w-full items-center justify-center rounded-lg border border-dashed border-edge bg-subtle">
				<p className="max-w-xs text-center text-sm text-muted">
					Gráfico de candles disponível após o encerramento do mercado.
				</p>
			</div>
		);
	}

	return (
		<div className="h-72 w-full">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={data}>
					<CartesianGrid stroke="rgba(13,31,23,0.08)" vertical={false} />
					<XAxis
						dataKey="label"
						tick={{ fill: "#5c6660", fontSize: 12 }}
						axisLine={false}
						tickLine={false}
					/>
					<YAxis
						tick={{ fill: "#5c6660", fontSize: 12 }}
						axisLine={false}
						tickLine={false}
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: "#ffffff",
							border: "1px solid #e5e9e5",
							borderRadius: 16,
						}}
					/>
					<Line
						type="monotone"
						dataKey="close"
						stroke="#0d382e"
						strokeWidth={3}
						dot={false}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
