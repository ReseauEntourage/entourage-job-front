import React from 'react';
import { IlluCV } from 'assets/icons/icons';
import { ButtonIcon } from '../../../Button';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
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
          icon={<LucidIcon name="X" size={15} />}
          dataTestId={`${dataTestId}-cv-delete`}
        />
      </StyledDeleteIconContainer>
    </StyledFileInfosContainer>
  );
}
