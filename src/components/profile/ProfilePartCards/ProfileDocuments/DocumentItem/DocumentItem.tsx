import React from 'react';
import { IlluCV, IlluDossierCandidat, IlluLinkedIn } from 'assets/icons/icons';
import { ButtonIcon, Text } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { COLORS } from 'src/constants/styles';
import { StyledDocumentItem, TitleAndIcon } from './DocumentItem.styles';

export interface DocumentItemProps {
  type: 'LinkedIn' | 'CVPerso' | 'CVPro';
  onRemove?: () => void;
  onClick: () => void;
}

const ICON_MAP = {
  LinkedIn: <IlluLinkedIn width={48} height={48} />,
  CVPerso: <IlluDossierCandidat width={48} height={48} />,
  CVPro: <IlluCV width={48} height={48} />,
};

const NAME_MAP = {
  LinkedIn: 'Mon profil LinkedIn',
  CVPerso: 'Mon CV perso',
  CVPro: 'Mon CV publique',
};

export const DocumentItem = ({
  type,
  onRemove,
  onClick,
}: DocumentItemProps) => {
  return (
    <StyledDocumentItem>
      <div onClick={onClick}>{ICON_MAP[type]}</div>
      <TitleAndIcon>
        <Text variant="underline" onClick={onClick}>
          {NAME_MAP[type]}
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
