import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Api } from '@/src/api';
import { EventType } from '@/src/constants/events';
import { UserRoles } from '@/src/constants/users';
import {
  WizardStep,
  WizardStepId,
} from '@/src/features/wizard/shell/wizard.types';
import { AppDispatch } from '@/src/store/store';
import {
  currentUserActions,
  selectCurrentUser,
} from '@/src/use-cases/current-user';
import { updateUserParticipationThunk } from '@/src/use-cases/events';
import {
  onboardingActions,
  selectWebinarSfId,
} from '@/src/use-cases/onboarding';
import { Content } from './Content';

interface UseOnboardingStepWebinarProps {
  userRole: UserRoles | undefined;
  requestAdvance: (stepId: WizardStepId) => void;
}

export const useOnboardingStepWebinar = ({
  userRole,
  requestAdvance,
}: UseOnboardingStepWebinarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const webinarSfId = useSelector(selectWebinarSfId);
  const currentUser = useSelector(selectCurrentUser);
  const [isSkipping, setIsSkipping] = useState(false);

  const skipWebinar = useCallback(async () => {
    if (!currentUser) {
      return;
    }
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
      requestAdvance('webinar');
    } finally {
      setIsSkipping(false);
    }
  }, [currentUser, dispatch, requestAdvance]);

  const isCandidate = userRole === UserRoles.CANDIDATE;
  const title = isCandidate
    ? "Dernière chose avant de découvrir vos coachs : on vous invite à la réunion de bienvenue (visio 1h). Vous y rencontrez l'équipe et d'autres candidats."
    : "Dernière chose avant de découvrir vos candidats : on vous invite à la réunion de bienvenue (visio 1h). Vous y rencontrez l'équipe et d'autres coachs.";

  const onboardingStepWebinar: WizardStep = {
    id: 'webinar',
    hideGenericStepHeader: undefined,
    summary: {
      title: 'Réunion de bienvenue',
      description: 'Choisissez votre créneau pour la réunion de bienvenue',
      duration: '~1 minute',
    },
    title,
    description: null,
    buttonLabel: 'Je réserve ma place',
    isNextEnabled: !!webinarSfId,
    content: (
      <Content
        webinarSfId={webinarSfId}
        onWebinarSfIdChange={(value) => {
          dispatch(onboardingActions.setWebinarSfId(value));
        }}
        onSkip={skipWebinar}
        isSkipping={isSkipping}
      />
    ),
    onSubmit: async () => {
      if (webinarSfId) {
        await dispatch(
          updateUserParticipationThunk({
            eventSalesForceId: webinarSfId,
            isParticipating: true,
          })
        ).unwrap();
      }
      return true;
    },
    isStepCompleted: async () => {
      if (currentUser?.onboardingWebinarSkippedAt) {
        return true;
      }
      const response = await Api.getAllEvents({
        eventTypes: [EventType.WELCOME_SESSION, EventType.COFFEE_SESSION],
        isParticipating: true,
        limit: 1,
        offset: 0,
        departmentIds: [],
      });
      return response.data.length > 0;
    },
    section: 'formation',
  };

  return { onboardingStepWebinar };
};
