import React from 'react';
import { Partners } from './Partners';

const meta = {
  title: 'Partials',
  component: Partners,
  decorators: [
    (Story) => {
      return (
        <div>
          <Story />
        </div>
      );
    },
  ],
};

const Template = () => {
  return <Partners />;
};

export const PartialPartners = {
  render: Template,
};

export default meta;
