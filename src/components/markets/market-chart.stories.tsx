import type { Meta, StoryObj } from "@storybook/react-vite";
import { sampleCandles } from "#/components/storybook/trader-fixtures";
import { MarketChart } from "./market-chart";

const meta = {
	title: "Markets/MarketChart",
	component: MarketChart,
	args: {
		candles: sampleCandles,
	},
} satisfies Meta<typeof MarketChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
