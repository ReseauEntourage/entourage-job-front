import React from 'react';
import {
  H2 as Title2,
  H6 as Title6,
  H1 as Title1,
} from 'src/components/utils/Headings';

const meta = {
  title: 'Headings',
  parameters: {
    controls: {
      exclude: /.*/g,
    },
  },
  decorators: [
    (Story, { args }) => {
      return (
        <div>
          <Story />
        </div>
      );
    },
  ],
};

const H1Template = (args) => {
  return (
    <div
      style={{
        height: '200px',
        width: '100%',
        backgroundColor: 'black',
        padding: '20px',
      }}
    >
      <Title1 color="white" title="Very large title" {...args} />
    </div>
  );
};

export const H1 = {
  render: H1Template,
};

const H2Template = (args) => {
  return <Title2 title="Large title" {...args} />;
};

export const H2Default = {
  render: H2Template,
};

export const H2Big = {
  render: H2Template,
  args: {
    type: 'big',
  },
};

export const H2Light = {
  render: H2Template,
  args: {
    type: 'light',
  },
};

const H6Template = () => {
  return <Title6 title="Smallest title" />;
};

export const H6 = {
  render: H6Template,
};

export default meta;
