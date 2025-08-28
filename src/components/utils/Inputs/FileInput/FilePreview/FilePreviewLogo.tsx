import React from 'react';
import { ButtonIcon } from '../../../Button';
import { Text, TextSize } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import {
  StyledDeleteIconContainer,
  StyledFileInfosContainer,
} from './FilePreview.styles';

interface FilePreviewLogoProps {
  filename: string;
  onRemoveFile: () => void;
  onOpenFile?: () => void;
  dataTestId: string;
  size?: number;
  textSize?: TextSize;
}

export function FilePreviewLogo({
  filename,
  onRemoveFile,
  onOpenFile,
  dataTestId,
  size = 20,
  textSize = 'normal',
}: FilePreviewLogoProps) {
  return (
    <StyledFileInfosContainer>
      <LucidIcon name="File" size={size} />
      <Text size={textSize} onClick={onOpenFile}>
        {filename}
      </Text>
      <StyledDeleteIconContainer onClick={onRemoveFile}>
        <ButtonIcon
          icon={<LucidIcon name="X" size={15} />}
          dataTestId={`${dataTestId}-logo-delete`}
        />
      </StyledDeleteIconContainer>
    </StyledFileInfosContainer>
  );
}
