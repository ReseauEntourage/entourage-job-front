import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Api } from '@/src/api';
import { EventType } from '@/src/constants/events';
import { UserRoles } from '@/src/constants/users';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { AppDispatch, store } from '@/src/store/store';
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
  triggerAdvance: () => void;
}

export const useOnboardingStepWebinar = ({
  userRole,
  triggerAdvance,
}: UseOnboardingStepWebinarProps) => {
  const getState = () => store.getState() as any;
  const dispatch = useDispatch<AppDispatch>();
  const webinarSfId = useSelector(selectWebinarSfId);
  const [isSkipping, setIsSkipping] = useState(false);

  const skipWebinar = useCallback(async () => {
    const currentUser = selectCurrentUser(getState());
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
      triggerAdvance();
    } finally {
      setIsSkipping(false);
    }
  }, [dispatch, triggerAdvance]);

  const isCandidate = userRole === UserRoles.CANDIDATE;
  const title = isCandidate
    ? "Dernière chose avant de découvrir vos coachs : on vous invite à la réunion de bienvenue (visio 1h). Vous y rencontrez l'équipe et d'autres candidats."
    : "Dernière chose avant de découvrir vos candidats : on vous invite à la réunion de bienvenue (visio 1h). Vous y rencontrez l'équipe et d'autres coachs.";

  const onboardingStepWebinar = {
    summary: {
      title: 'Réunion de bienvenue',
      description: 'Choisissez votre créneau pour la réunion de bienvenue',
      duration: '~1 minute',
    },
    title,
    smallTitle: 'Webinaire',
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
      const sfId = selectWebinarSfId(getState());
      if (sfId) {
        await dispatch(
          updateUserParticipationThunk({
            eventSalesForceId: sfId,
            isParticipating: true,
          })
        ).unwrap();
      }
      return true;
    },
    isStepCompleted: async () => {
      const currentUser = selectCurrentUser(getState());
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
  } as WizardStep;

  return { onboardingStepWebinar };
};
