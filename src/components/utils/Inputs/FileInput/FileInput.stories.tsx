import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { FileTypes } from 'src/components/forms/FormSchema';
import { FileInput, FileInputProps } from './FileInput';

const FileInputConfigured = ({ fileType, accept }: FileInputProps) => {
  const [file, setFile] = React.useState<File | null>(null);
  return (
    <FileInput
      accept={accept}
      fileType={fileType}
      id="file-input-storybook"
      name="cv"
      value={file}
      onChange={(value) => {
        if (Array.isArray(value)) {
          setFile(value[0]);
        } else {
          setFile(value);
        }
      }}
    />
  );
};

const meta = {
  title: 'FileInput',
  render: FileInputConfigured,
} satisfies Meta<typeof FileInput>;

export default meta;
type Story = StoryObj<typeof FileInput>;

export const Cv: Story = {
  args: {
    fileType: FileTypes.CV,
    accept: '.pdf',
  },
};
