import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { COLORS } from 'src/constants/styles';
import { H1, H2, H3, H4, H5, H6 } from '.';

type headingStoryProps = React.ComponentProps<
  typeof H1 | typeof H2 | typeof H3 | typeof H4 | typeof H5 | typeof H6
>;

const basiArgTypes = {
  color: {
    options: [COLORS.primaryOrange, 'black'],
    control: { type: 'select' },
  },
  weight: {
    options: ['regular', 'bold'],
    control: { type: 'select' },
  },
  center: {
    control: { type: 'boolean' },
  },
};

const variantArgType = {
  options: ['big', undefined],
  control: { type: 'select' },
};

const meta = {
  title: 'Headings',
  argTypes: basiArgTypes,
} satisfies Meta<headingStoryProps>;

export default meta;

export const h1: StoryObj<typeof H1> = {
  args: {
    title: 'Very large title',
    color: COLORS.primaryOrange,
    weight: 'bold',
    center: false,
  },
  render: (args) => <H1 {...args} />,
};

export const h2: StoryObj<typeof H2> = {
  args: {
    title: 'Large title',
    color: COLORS.primaryOrange,
    weight: 'bold',
    variant: undefined,
    center: false,
  },
  render: (args) => <H2 {...args} />,
};
h2.argTypes = { ...basiArgTypes, variant: variantArgType };

export const h3: StoryObj<typeof H3> = {
  args: {
    title: 'Medium title',
    color: COLORS.primaryOrange,
    weight: 'bold',
    center: false,
  },
  render: (args) => <H3 {...args} />,
};

export const h4: StoryObj<typeof H4> = {
  args: {
    title: 'Medium small title',
    color: COLORS.primaryOrange,
    weight: 'bold',
    center: false,
  },
  render: (args) => <H4 {...args} />,
};

export const h5: StoryObj<typeof H5> = {
  args: {
    title: 'Small title',
    color: COLORS.primaryOrange,
    weight: 'bold',
    center: false,
  },
  render: (args) => <H5 {...args} />,
};

export const h6: StoryObj<typeof H6> = {
  args: {
    title: 'Very small title',
    color: 'primaryOrange',
    weight: 'bold',
    center: false,
  },
  render: (args) => <H6 {...args} />,
};
