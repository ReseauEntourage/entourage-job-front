import React from 'react';
import { Spinner as SpinnerComponent } from './Spinner';

const meta = {
  title: 'Spinner',
  parameters: {
    controls: {
      exclude: /.*/g,
    },
  },
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const SpinnerRender = () => {
  return <SpinnerComponent />;
};

export const Spinner = {
  render: SpinnerRender,
};

export default meta;
