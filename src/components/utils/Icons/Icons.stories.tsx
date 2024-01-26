import React from 'react';

import { Icons } from './Icons';

const meta = {
  title: 'Icons SVG',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const IconsTemplate = () => {
  return <Icons />;
};

export const IconsSVG = {
  render: IconsTemplate,
};

export default meta;
