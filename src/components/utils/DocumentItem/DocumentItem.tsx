import React from 'react';
import { ButtonIcon, Text } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
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
            icon={<LucidIcon size={15} name="X" color={COLORS.black} />}
            onClick={onRemove}
          />
        )}
      </TitleAndIcon>
    </StyledDocumentItem>
  );
};
