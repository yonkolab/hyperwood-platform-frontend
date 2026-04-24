import type { StorybookConfig } from '@storybook/react-vite'
import { fileURLToPath } from "node:url"

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    const { default: tailwindcss } = await import('@tailwindcss/vite')
    config.plugins = config.plugins || []
    config.plugins.push(tailwindcss())
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "#/features/auth/server": fileURLToPath(
        new URL("../src/components/storybook/mocks/auth-server.ts", import.meta.url),
      ),
      "#/features/orders/server": fileURLToPath(
        new URL("../src/components/storybook/mocks/orders-server.ts", import.meta.url),
      ),
    }
    return config
  },
}
export default config
