import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Api } from '@/src/api';
import { Button, LucidIcon } from '@/src/components/ui';
import { H5 } from '@/src/components/ui/Headings';
import { Text } from '@/src/components/ui/Text/Text';
import { useModalContext } from '@/src/features/modals/Modal';
import { PrettyModal } from '@/src/features/modals/PrettyModal/PrettyModal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { AppDispatch } from '@/src/store/store';
import { currentUserActions } from '@/src/use-cases/current-user';
import { updateUserParticipationThunk } from '@/src/use-cases/events';
import {
  onboardingActions,
  selectWebinarSfId,
} from '@/src/use-cases/onboarding';
import { StyledWebinarSelectionContainer } from './OnboardingCompletionModal.styles';
import { WebinarSelection } from './WebinarSelection';

interface OnboardingCompletionModalProps {
  onDone: () => void;
}

export const OnboardingCompletionModal = ({
  onDone,
}: OnboardingCompletionModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const webinarSfId = useSelector(selectWebinarSfId);
  const currentUser = useAuthenticatedUser();
  const { onClose } = useModalContext();
  const [isSkipping, setIsSkipping] = useState(false);

  const handleSubmit = async () => {
    if (webinarSfId) {
      await dispatch(
        updateUserParticipationThunk({
          eventSalesForceId: webinarSfId,
          isParticipating: true,
        })
      ).unwrap();
    }
    onDone();
  };

  const handleSkip = async () => {
    setIsSkipping(true);
    try {
      const skippedAt = new Date().toISOString();
      await Api.putUser(currentUser.id, {
        onboardingWebinarSkippedAt: skippedAt,
      });
      dispatch(
        currentUserActions.updateUserSucceeded({
          user: { onboardingWebinarSkippedAt: skippedAt },
        })
      );
      onDone();
      if (onClose) {
        onClose();
      }
    } finally {
      setIsSkipping(false);
    }
  };

  return (
    <PrettyModal
      id="onboarding-completion"
      title={`Bravo ${currentUser.firstName}, votre profil est prêt !`}
      subtitle="Avant de vous lancer, on aimerait vous accueillir."
      submitBtnTxt="Je réserve ma place"
      icon={<LucidIcon name="PartyPopper" color="white" size={48} />}
      onSubmit={handleSubmit}
      size="medium"
      secondaryAction={
        <Button variant="text" onClick={handleSkip} disabled={isSkipping}>
          Plus tard, depuis mon espace
        </Button>
      }
    >
      <StyledWebinarSelectionContainer>
        <H5 title="Venez à la réunion de bienvenue" noMarginBottom />
        <Text color="darkGray">
          Rencontrez l&apos;équipe, comprenez votre rôle et posez vos questions.
          Choisissez le créneau qui vous arrange&nbsp;!
        </Text>
        <br />
        <WebinarSelection
          webinarSfId={webinarSfId}
          onChange={(value) => {
            dispatch(onboardingActions.setWebinarSfId(value));
          }}
        />
      </StyledWebinarSelectionContainer>
    </PrettyModal>
  );
};
