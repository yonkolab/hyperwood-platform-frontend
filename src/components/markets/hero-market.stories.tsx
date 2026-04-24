import type { Meta, StoryObj } from "@storybook/react-vite";
import { sampleHomeData } from "#/components/storybook/trader-fixtures";
import { HeroMarket } from "./hero-market";

const meta = {
	title: "Markets/HeroMarket",
	component: HeroMarket,
	args: {
		data: sampleHomeData,
	},
} satisfies Meta<typeof HeroMarket>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyState: Story = {
	args: {
		data: {
			...sampleHomeData,
			heroMarket: null,
		},
	},
};
