import React from 'react';
import { Close, IlluCV } from 'assets/icons/icons';
import { ButtonIcon } from 'src/components/utils/ButtonIcon';
import {
  StyledDeleteIconContainer,
  StyledFileInfosContainer,
  StyledFilename,
} from './FilePreview.styles';

interface FilePreviewCVProps {
  filename: string;
  onRemoveFile: () => void;
  onOpenFile?: () => void;
  dataTestId: string;
}

export function FilePreviewCV({
  filename,
  onRemoveFile,
  onOpenFile,
  dataTestId,
}: FilePreviewCVProps) {
  return (
    <StyledFileInfosContainer>
      <IlluCV width={70} height={70} />
      <StyledFilename onClick={onOpenFile}>{filename}</StyledFilename>
      <StyledDeleteIconContainer onClick={onRemoveFile}>
        <ButtonIcon
          icon={<Close width={10} height={10} />}
          dataTestId={`${dataTestId}-cv-delete`}
        />
      </StyledDeleteIconContainer>
    </StyledFileInfosContainer>
  );
}
