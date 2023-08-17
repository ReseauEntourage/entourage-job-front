import React from 'react';
import {
  H1 as Title1,
  H2 as Title2,
  H3 as Title3,
  H4 as Title4,
  H5 as Title5,
  H6 as Title6,
} from '.';

const meta = {
  title: 'Headings',
  parameters: {
    controls: {
      exclude: /.*/g,
    },
  },
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

const H3Template = () => {
  return <Title3 title="Smallest title" />;
};

export const H3 = {
  render: H3Template,
};

const H4Template = () => {
  return <Title4 title="Smallest title" />;
};

export const H4 = {
  render: H4Template,
};

const H5Template = () => {
  return <Title5 title="Smallest title" />;
};

export const H5 = {
  render: H5Template,
};

const H6Template = () => {
  return <Title6 title="Smallest title" />;
};

export const H6 = {
  render: H6Template,
};

export default meta;
