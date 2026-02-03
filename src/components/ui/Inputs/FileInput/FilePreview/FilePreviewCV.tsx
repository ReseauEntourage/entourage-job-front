import React from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { Text, TextSize } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { ButtonIcon } from '../../../Button';
import {
  StyledDeleteIconContainer,
  StyledFileInfosContainer,
} from './FilePreview.styles';

interface FilePreviewCVProps {
  filename: string;
  onRemoveFile: () => void;
  onOpenFile?: () => void;
  dataTestId: string;
  size?: number;
  textSize?: TextSize;
}

export function FilePreviewCV({
  filename,
  onRemoveFile,
  onOpenFile,
  dataTestId,
  size = 70,
  textSize = 'normal',
}: FilePreviewCVProps) {
  return (
    <StyledFileInfosContainer>
      <SvgIcon name="IlluCV" width={size} height={size} />
      <Text size={textSize} onClick={onOpenFile}>
        {filename}
      </Text>
      <StyledDeleteIconContainer onClick={onRemoveFile}>
        <ButtonIcon
          icon={<LucidIcon name="X" size={15} />}
          dataTestId={`${dataTestId}-cv-delete`}
          size="small"
        />
      </StyledDeleteIconContainer>
    </StyledFileInfosContainer>
  );
}
