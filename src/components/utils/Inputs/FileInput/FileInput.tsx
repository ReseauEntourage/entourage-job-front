import React, { ChangeEvent } from 'react';
import { Button } from '../../Button';
import { StyledInputLabel } from '../Inputs.styles';
import { CommonInputProps } from '../Inputs.types';
import { FileType, FileTypes } from 'src/components/forms/FormSchema';
import { FieldErrorMessage } from 'src/components/forms/fields/FieldErrorMessage';
import {
  StyledFileInputGroupForm,
  StyledFileInputWrapper,
  StyledHiddenInput,
} from './FileInput.styles';
import { FilePreviewCV } from './FilePreview';

interface FileInputProps
  extends CommonInputProps<File | null, HTMLInputElement> {
  accept: string;
  fileType: FileType;
}

export function FileInput({
  id,
  name,
  title,
  placeholder,
  value,
  onChange,
  onBlur,
  showLabel = false,
  hidden = false,
  disabled = false,
  error,
  accept,
  inputRef,
  fileType,
}: FileInputProps) {
  const onButtonDownloadClick = () => {
    const input = document.getElementById(id);
    if (input) {
      input.click();
    }
  };

  const removeFileCallback = () => {
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
    onChange(null);
  };

  if (hidden) {
    return null;
  }

  return (
    <StyledFileInputGroupForm disabled={disabled}>
      {showLabel && (
        <StyledInputLabel htmlFor={`form-input-${name}`}>
          {title}
        </StyledInputLabel>
      )}
      <StyledFileInputWrapper>
        {!value && (
          <Button
            style="custom-primary-inverted"
            onClick={onButtonDownloadClick}
          >
            Télécharger
          </Button>
        )}
        {value && (
          <>
            {fileType === FileTypes.CV && (
              <FilePreviewCV
                filename="Votre CV"
                onRemoveFile={removeFileCallback}
                dataTestId="file-input-preview"
              />
            )}
          </>
        )}
        <StyledHiddenInput
          ref={inputRef}
          className={`${value ? '' : 'empty-value'}`}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            if (event.target.files) {
              const [file] = event.target.files;
              return onChange(file);
            }
          }}
          onBlur={onBlur}
          disabled={disabled}
          type="file"
          placeholder={
            (showLabel ? placeholder : placeholder || (title as string)) ||
            'Séléctionner un fichier'
          }
          name={name}
          id={id}
          data-testid={id}
          accept={accept}
        />
        <FieldErrorMessage error={error} />
      </StyledFileInputWrapper>
    </StyledFileInputGroupForm>
  );
}
