import React from 'react';
import { FileInput } from '../FileInput';
import { CommonInputProps } from '../Inputs.types';
import { useUploadImage } from 'src/hooks/useUploadImage';
import { StyledImageInputContainer } from './ImageInput.styles';

interface ImageInputProps
  extends Omit<
    CommonInputProps<
      {
        profileImage: Blob;
        profileImageObjectUrl: string;
      },
      HTMLInputElement
    >,
    'title' | 'value'
  > {
  onChange: ({
    profileImage,
    profileImageObjectUrl,
  }: {
    profileImage: Blob;
    profileImageObjectUrl: string;
  }) => void;
  children?: React.ReactNode;
}

export function ImageInput({
  id,
  name,
  onChange,
  onBlur,
  hidden = false,
  disabled = false,
  inputRef,
  children,
}: ImageInputProps) {
  const uploadImage = useUploadImage();

  if (hidden) {
    return null;
  }

  return (
    <StyledImageInputContainer>
      <FileInput
        id={id}
        data-testid={id}
        name={name}
        inputRef={inputRef}
        accept="image/*"
        value={[]}
        onChange={async (files: File | File[] | null) => {
          if (!files) {
            return;
          }
          if (!Array.isArray(files)) {
            files = [files];
          }
          const image = await uploadImage(files[0]);
          if (image) {
            const { profileImage, profileImageObjectUrl } = image;
            onChange({
              profileImage,
              profileImageObjectUrl,
            });
          }
        }}
        onBlur={onBlur}
        disabled={disabled}
        activator={children}
      />
    </StyledImageInputContainer>
  );
}
