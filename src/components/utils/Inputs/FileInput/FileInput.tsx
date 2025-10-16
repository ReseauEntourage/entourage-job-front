import React, { ChangeEvent, useState } from 'react';
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
import { FilePreviewLogo } from './FilePreview/FilePreviewLogo';

export interface FileInputProps
  extends CommonInputProps<File | File[] | null, HTMLInputElement> {
  accept: string;
  fileType?: FileType;
  noPreview?: boolean;
  activator?: React.ReactNode;
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
  noPreview = false,
  activator,
}: FileInputProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const onButtonDownloadClick = () => {
    const input = document.getElementById(id);
    if (input) {
      input.click();
    }
  };

  const defaultActivator = (
    <Button variant="secondary" rounded onClick={onButtonDownloadClick}>
      Télécharger
    </Button>
  );

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
        {activator || defaultActivator}
        {!noPreview && value && (
          <>
            {fileType === FileTypes.CV && (
              <FilePreviewCV
                filename="Votre CV"
                onRemoveFile={removeFileCallback}
                dataTestId="file-input-preview"
              />
            )}
            {fileType === FileTypes.LOGO && (
              <FilePreviewLogo
                filename={fileName || 'Votre logo'}
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
              const files = Array.from(event.target.files);
              setFileName(files[0]?.name || null);
              return onChange(files);
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
        {error && <FieldErrorMessage error={error} />}
      </StyledFileInputWrapper>
    </StyledFileInputGroupForm>
  );
}
