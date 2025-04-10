import 'src/styles/dist/css/uikit.entourage.min.css';
import 'react-phone-number-input/style.css';

import { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  tags: ['autodocs'],
};

export default preview;
