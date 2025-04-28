import React from 'react';
import { COLORS } from '@/src/constants/styles';
import { Text } from 'src/components/utils';
import { ButtonIcon } from 'src/components/utils/Button/ButtonIcon';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { StyledButtonContent, StyledChip } from './Attachment.styles';

export interface AttachmentProps {
  attachment: {
    name: string;
  };
  onClose: () => void;
}

export const Attachment = ({ attachment, onClose }: AttachmentProps) => {
  return (
    <StyledChip size="small" disabled>
      <StyledButtonContent>
        <LucidIcon name="Paperclip" size={15} />
        <Text size="small">{attachment.name}</Text>
        {onClose && (
          <ButtonIcon
            color={COLORS.white}
            icon={<LucidIcon name="X" size={15} />}
            onClick={() => {
              onClose();
            }}
          />
        )}
      </StyledButtonContent>
    </StyledChip>
  );
};
