import React, { ChangeEvent, useState } from 'react';
import { DatePicker } from './DatePicker';

const meta = {
  title: 'DatePicker',
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
            display: 'flex',
            width: 100,
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

const Template = (args) => {
  const [value, setValue] = useState<string>('');

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

export default meta;
