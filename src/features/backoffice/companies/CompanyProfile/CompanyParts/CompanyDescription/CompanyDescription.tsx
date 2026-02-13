import React, { useCallback, useMemo } from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { Text } from '@/src/components/ui';
import { openModal } from '@/src/features/modals/Modal';
import { ProfilePartCard } from '@/src/features/profile/ProfilePartCards/Card/Card/Card';
import {
  StyledDescriptionContainer,
  StyledFallbackContentContainer,
} from './CompanyDescription.styles';
import { ModalEditCompanyDescription } from './ModalEditCompanyDescription/ModalEditCompanyDescription';

export interface ProfileDescriptionProps {
  description: string | null;
  isEditable?: boolean;
  smallCard?: boolean;
}

export const CompanyDescription = ({
  description,
  isEditable = false,
  smallCard = false,
}: ProfileDescriptionProps) => {
  const isCompleted = !!description;

  const openEditModal = useCallback(() => {
    openModal(
      <ModalEditCompanyDescription description={description || null} />
    );
  }, [description]);

  const ctaTitle = useMemo(() => {
    if (isEditable && description) {
      return 'Modifier';
    }
    if (isEditable) {
      return 'Ajouter';
    }
    return null;
  }, [description, isEditable]);

  return (
    <ProfilePartCard
      title="Présentation"
      isCompleted={isCompleted}
      isEditable={isEditable}
      ctaTitle={ctaTitle}
      ctaCallback={openEditModal}
      fallback={{
        content: (
          <StyledFallbackContentContainer>
            <Text weight="semibold">
              Ecrire une courte présentation de votre entreprise
            </Text>
            <Text>
              Ces informations permettent aux candidats de vous connaitre
            </Text>
          </StyledFallbackContentContainer>
        ),
        icon: <SvgIcon name="IlluBulleQuestion" />,
      }}
      smallCard={smallCard}
    >
      {description && (
        <StyledDescriptionContainer>
          <Text>{description}</Text>
        </StyledDescriptionContainer>
      )}
    </ProfilePartCard>
  );
};
