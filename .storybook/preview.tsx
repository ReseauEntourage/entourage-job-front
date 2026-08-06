import '../src/styles/dist/css/uikit.entourage.min.css';
import 'react-phone-number-input/style.css';

import { Preview } from '@storybook/react';
import React from 'react';
import { StyleSheetManager } from 'styled-components';
import { shouldForwardProp } from '../src/styles/shouldForwardProp';

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

  decorators: [
    (Story) => (
      <StyleSheetManager shouldForwardProp={shouldForwardProp}>
        <Story />
      </StyleSheetManager>
    ),
  ],
};

export default preview;
