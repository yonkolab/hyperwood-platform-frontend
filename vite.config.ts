import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nitro } from "nitro/vite";

const isStorybook =
	process.env.STORYBOOK === "true" ||
	process.env.npm_lifecycle_event === "storybook" ||
	process.env.npm_lifecycle_event === "build-storybook";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: isStorybook
		? [tailwindcss(), viteReact()]
		: [devtools(), tailwindcss(), tanstackStart(), nitro(), viteReact()],
});

export default config;
