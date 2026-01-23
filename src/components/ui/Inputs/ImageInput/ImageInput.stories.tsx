import React, { useState } from 'react';
import { ButtonIcon } from '../../Button';
import { LucidIcon } from '../../Icons/LucidIcon';
import { ImageInput } from './ImageInput';

const meta = {
  component: ImageInput,
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
  const [value, setValue] = useState<{
    profileImage: Blob;
    profileImageObjectUrl: string;
  }>(
    {} as {
      profileImage: Blob;
      profileImageObjectUrl: string;
    }
  );

  return (
    <ImageInput
      {...args}
      id="image-input-stories"
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
    children: 'Upload an image',
  },
};

export const Icon = {
  render: Template,
  args: {
    children: <ButtonIcon icon={<LucidIcon name="Pencil" />} />,
  },
};

export default meta;
