import type { Preview } from '@storybook/react-vite'
import '../src/styles.css'
import { withAppProviders } from '../src/components/storybook/providers'

const preview: Preview = {
  decorators: [withAppProviders],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
