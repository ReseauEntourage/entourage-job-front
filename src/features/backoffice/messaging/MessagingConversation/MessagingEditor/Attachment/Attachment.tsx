import React from 'react';
import { Text } from '@/src/components/ui';
import { ButtonIcon } from '@/src/components/ui/Button/ButtonIcon';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { COLORS } from '@/src/constants/styles';
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
