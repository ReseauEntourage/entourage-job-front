import React, { useState } from 'react';
import { DatePicker } from './DatePicker';

const meta = {
  component: DatePicker,
  parameters: {
    controls: {
      exclude: /.*/g,
    },
  },
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            width: 500,
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

const Template = (args) => {
  const [value, setValue] = useState<string>(args.initialValue ?? '');

  return (
    <DatePicker
      {...args}
      onChange={(updatedValue) => {
        setValue(updatedValue);
      }}
      value={value}
    />
  );
};

export const Default = {
  render: Template,
  args: {
    title: "Date d'embauche",
  },
};

export const Filled = {
  render: Template,
  args: {
    title: 'Date de naissance',
    initialValue: '1987-03-14',
  },
};

export const WithError = {
  render: Template,
  args: {
    title: 'Date de naissance',
    initialValue: '31/02/1990',
    error: {
      type: 'validate',
      message: "Cette date n'existe pas. Vérifiez le jour et le mois.",
    },
  },
};

export const Disabled = {
  render: Template,
  args: {
    title: 'Date de naissance',
    initialValue: '1987-03-14',
    disabled: true,
  },
};

export default meta;
