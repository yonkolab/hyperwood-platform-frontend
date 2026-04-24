import type { Meta, StoryObj } from "@storybook/react-vite";
import { sampleMarket } from "#/components/storybook/trader-fixtures";
import { MarketCard } from "./market-card";

const meta = {
	title: "Markets/MarketCard",
	component: MarketCard,
	args: {
		market: sampleMarket,
	},
} satisfies Meta<typeof MarketCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AwaitingResolution: Story = {
	args: {
		market: {
			...sampleMarket,
			status: "awaiting_resolution",
			yesPriceBps: 10000,
			noPriceBps: 0,
		},
	},
};
