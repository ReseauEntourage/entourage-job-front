import React from 'react';
import { DeleteAccountModal } from 'src/components/modals/DeleteAccountModal/DeleteAccountModal';
import { openModal } from 'src/components/modals/Modal';
import { Button, Card, Text } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { COLORS } from 'src/constants/styles';
import {
  StyledButtonContainer,
  StyledCardContentContainer,
  StyledInfos,
  StyledIntroduction,
} from './DeleteAccountCard.styles';

export const DeleteAccountCard = () => {
  const requestDeleteAccount = () => {
    openModal(<DeleteAccountModal />);
  };

  return (
    <Card title="Supprimer mon compte">
      <StyledCardContentContainer>
        <StyledIntroduction>
          <LucidIcon name="Ban" size={75} color={COLORS.primaryBlue} />
          <StyledInfos>
            <Text weight="bold">
              Vous souhaitez supprimer définitivement votre profil et votre
              compte Entourage Pro ?
            </Text>
            <Text>
              Cette action est irréversible et vous perdrez l&apos;accès à
              toutes les informations de votre compte et toutes les
              conversations.
            </Text>
          </StyledInfos>
        </StyledIntroduction>
        <StyledButtonContainer>
          <Button variant="secondary" rounded onClick={requestDeleteAccount}>
            Supprimer
          </Button>
        </StyledButtonContainer>
      </StyledCardContentContainer>
    </Card>
  );
};
