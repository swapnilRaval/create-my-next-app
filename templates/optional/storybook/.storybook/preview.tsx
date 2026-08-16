import type { Preview } from '@storybook/nextjs';
import { AppProviders } from '../src/providers/app-providers';

const preview: Preview = {
  decorators: [
    (Story) => (
      <AppProviders>
        <Story />
      </AppProviders>
    ),
  ],
};

export default preview;
