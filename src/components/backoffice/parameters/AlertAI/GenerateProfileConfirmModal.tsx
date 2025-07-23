import React from 'react';
import { Img } from '@/src/components/utils';
import { StyledContainerMarginY } from '@/src/components/utils/Containers/Containers.styles';
import { useProfileGeneration } from '@/src/hooks';
import { useModalContext } from 'src/components/modals/Modal';
import { ModalConfirm } from 'src/components/modals/Modal/ModalGeneric/ModalConfirm/ModalConfirm';
import { Text } from 'src/components/utils/Text';
import { StyledLoadingContainer } from './AlertAI.styles';

export const GenerateProfileConfirmModal = () => {
  const { onClose } = useModalContext();
  const { generateProfileFromCV, isLoading } = useProfileGeneration({
    onProfileGenerated: () => {
      if (onClose) {
        onClose();
      }
    },
  });

  return (
    <ModalConfirm
      title="Générer mon profil à partir de mon CV"
      text="Vos données du profil vont être écrasées. Voulez-vous continuer ?"
      buttonText="Générer"
      onConfirm={generateProfileFromCV}
      isLoading={isLoading}
      keepOpenOnConfirm
    >
      {isLoading && (
        <StyledLoadingContainer>
          <Img
            src="/static/img/illustrations/cv-ia.gif"
            width={150}
            height={150}
            alt="Chargement en cours"
          />
          <StyledContainerMarginY margin="20px" />
          <Text weight="bold" size="normal" center>
            Patientez quelques secondes ...
          </Text>
        </StyledLoadingContainer>
      )}
    </ModalConfirm>
  );
};
