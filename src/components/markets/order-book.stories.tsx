import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	sampleOrderBook,
	sampleTrades,
} from "#/components/storybook/trader-fixtures";
import { OrderBookPanel } from "./order-book";

const meta = {
	title: "Markets/OrderBookPanel",
	component: OrderBookPanel,
	args: {
		orderBook: sampleOrderBook,
		trades: sampleTrades,
	},
} satisfies Meta<typeof OrderBookPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
