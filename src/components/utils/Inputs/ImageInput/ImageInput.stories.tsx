import React, { useState } from 'react';
import PencilIcon from 'assets/icons/pencil.svg';
import { ButtonIcon } from 'src/components/utils/ButtonIcon';
import { ImageInput } from './ImageInput';

const meta = {
  title: 'Image Input',
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
    children: <ButtonIcon icon={<PencilIcon />} />,
  },
};

export default meta;
