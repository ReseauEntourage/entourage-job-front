import React from 'react';
import { Button, Text } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { DeleteAccountModal } from '@/src/features/modals/DeleteAccountModal/DeleteAccountModal';
import { openModal } from '@/src/features/modals/Modal';
import { ProfilePartCard } from '../Card/Card/Card';
import {
  StyledButtonContainer,
  StyledIntroduction,
} from './ProfileDeleteAccount.styles';

export interface ProfileDeleteAccountProps {
  smallCard?: boolean;
}

export const ProfileDeleteAccount = ({
  smallCard,
}: ProfileDeleteAccountProps) => {
  const requestDeleteAccount = () => {
    openModal(<DeleteAccountModal />);
  };

  return (
    <ProfilePartCard
      title="Supprimer mon compte"
      smallCard={smallCard}
      isCompleted
      isDefaultOpen={false}
    >
      <StyledIntroduction>
        <LucidIcon name="Ban" size={20} />
        <Text>Je souhaite supprimer mon compte Entourage-Pro</Text>
      </StyledIntroduction>
      <StyledButtonContainer>
        <Button variant="secondary" rounded onClick={requestDeleteAccount}>
          Supprimer
        </Button>
      </StyledButtonContainer>
    </ProfilePartCard>
  );
};
