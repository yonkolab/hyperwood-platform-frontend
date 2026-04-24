import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	sampleMarketDetail,
	sampleUser,
} from "#/components/storybook/trader-fixtures";
import { TradeTicket } from "./trade-ticket";

const meta = {
	title: "Markets/TradeTicket",
	component: TradeTicket,
	args: {
		market: sampleMarketDetail,
		user: sampleUser,
	},
} satisfies Meta<typeof TradeTicket>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Authenticated: Story = {};

export const Guest: Story = {
	args: {
		user: null,
	},
};
