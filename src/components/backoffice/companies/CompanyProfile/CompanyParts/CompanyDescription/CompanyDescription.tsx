import React, { useCallback, useMemo } from 'react';
import { openModal } from '@/src/components/modals/Modal';
import { ProfilePartCard } from '@/src/components/profile/ProfilePartCards/Card/Card/Card';
import { IlluBulleQuestion } from 'assets/icons/icons';
import { Text } from 'src/components/utils';
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
    return openModal(
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
      //     iaGenerated
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
        icon: <IlluBulleQuestion />,
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
