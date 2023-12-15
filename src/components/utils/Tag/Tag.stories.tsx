import React from 'react';
import { Tag as TagComponent } from './Tag';

const meta = {
  title: 'Tag',
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

const TagRender = () => {
  return <TagComponent content="hello" />;
};

export const tag = {
  render: TagRender,
};

export default meta;
