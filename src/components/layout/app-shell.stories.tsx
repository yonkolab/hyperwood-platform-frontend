import type { Meta, StoryObj } from "@storybook/react-vite";
import { sampleUser } from "#/components/storybook/trader-fixtures";
import { AppShell } from "./app-shell";

const meta = {
	title: "Layout/AppShell",
	component: AppShell,
	args: {
		locale: "pt-BR",
		children: (
			<div className="rounded-3xl border border-slate-900 bg-slate-950/60 p-8">
				<h1 className="text-3xl font-semibold text-white">
					Trading shell preview
				</h1>
				<p className="mt-3 max-w-xl text-slate-400">
					Estrutura principal do app trader com navegação, busca e ações de
					conta.
				</p>
			</div>
		),
	},
} satisfies Meta<typeof AppShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SignedOut: Story = {
	args: {
		user: null,
	},
};

export const SignedIn: Story = {
	args: {
		user: sampleUser,
	},
};
