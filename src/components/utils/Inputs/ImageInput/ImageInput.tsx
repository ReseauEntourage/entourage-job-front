import React from 'react';
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
      <label id={`${id}-label`} htmlFor={id}>
        <input
          id={id}
          data-testid={id}
          ref={inputRef}
          name={name}
          disabled={disabled}
          type="file"
          accept="image/*"
          onBlur={onBlur}
          onChange={async ({ target }) => {
            const image = await uploadImage(target);
            if (image) {
              const { profileImage, profileImageObjectUrl } = image;
              onChange({
                profileImage,
                profileImageObjectUrl,
              });
            }
          }}
        />
        {children}
      </label>
    </StyledImageInputContainer>
  );
}
