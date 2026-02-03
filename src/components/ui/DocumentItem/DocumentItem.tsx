import React from 'react';
import { ButtonIcon, Text } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { COLORS } from 'src/constants/styles';
import { StyledDocumentItem, TitleAndIcon } from './DocumentItem.styles';

export interface DocumentItemProps {
  name: string;
  icon: React.ReactNode;
  onRemove?: () => void;
  onClick: () => void;
}

export const DocumentItem = ({
  name,
  icon,
  onRemove,
  onClick,
}: DocumentItemProps) => {
  return (
    <StyledDocumentItem>
      <div onClick={onClick}>{icon}</div>
      <TitleAndIcon>
        <Text variant="underline" onClick={onClick}>
          {name}
        </Text>
        {onRemove && (
          <ButtonIcon
            icon={<LucidIcon name="X" />}
            color={COLORS.darkGray}
            onClick={onRemove}
          />
        )}
      </TitleAndIcon>
    </StyledDocumentItem>
  );
};
