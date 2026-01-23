import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Card } from './Card';

const meta = {
  component: Card,
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            width: 300,
          }}
        >
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple = {
  args: {
    title: 'This is a simple card',
    children: (
      <ul>
        <li>Example</li>
        <li>Example</li>
        <li>Example</li>
        <li>Example</li>
        <li>Example</li>
      </ul>
    ),
  },
} satisfies Story;

export const Closed = {
  args: {
    title: 'This is a closed card',
    isMobileClosable: true,
    children: (
      <ul>
        <li>Example</li>
        <li>Example</li>
        <li>Example</li>
        <li>Example</li>
        <li>Example</li>
      </ul>
    ),
  },
} satisfies Story;
export const Edition = {
  args: {
    title: 'This is an edit card',
    isLoading: false,
    editCallback: () => null,
    children: (
      <ul>
        <li>Example</li>
        <li>Example</li>
        <li>Example</li>
        <li>Example</li>
        <li>Example</li>
      </ul>
    ),
  },
} satisfies Story;
export const Loading = {
  args: {
    title: 'This is a loading card',
    isLoading: true,
    children: (
      <ul>
        <li>Example</li>
        <li>Example</li>
        <li>Example</li>
        <li>Example</li>
        <li>Example</li>
      </ul>
    ),
  },
} satisfies Story;
