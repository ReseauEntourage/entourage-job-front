import { useDispatch, useSelector } from 'react-redux';
import { Api } from '@/src/api';
import { EventType } from '@/src/constants/events';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { AppDispatch } from '@/src/store/store';
import { currentUserActions } from '@/src/use-cases/current-user';
import { updateUserParticipationThunk } from '@/src/use-cases/events/events.thunks';
import {
  onboardingActions,
  selectNoDateSelected,
  selectWebinarSfId,
} from '@/src/use-cases/onboarding';
import { StyledOnboardingStepContainer } from '../../onboarding.styles';
import { OnboardingStep } from '../../onboarding.types';
import { Content } from './Content/Content';

export const useOnboardingStepWebinar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const webinarSfId = useSelector(selectWebinarSfId);
  const noDateSelected = useSelector(selectNoDateSelected);
  const currentUser = useAuthenticatedUser();

  const fetchRegisteredWebinarEvents = async () => {
    const { data } = await Api.getAllEvents({
      eventTypes: [EventType.WELCOME_SESSION],
      limit: 50,
      offset: 0,
      departmentIds: [],
      isParticipating: true,
      includePastEvents: true,
    });
    return data;
  };

  const onboardingStepWebinar = {
    summary: {
      title: "S'inscrire à une réunion de bienvenue",
      description:
        "Découvrez le programme, rencontrez l'équipe, posez vos questions",
      duration: '~1 minute',
    },
    title: "S'inscrire à une réunion de bienvenue",
    smallTitle: 'Réunion de bienvenue',
    description:
      "Cette réunion vous permettra de comprendre votre rôle, rencontrer l'équipe et poser toutes vos questions.",
    content: (
      <StyledOnboardingStepContainer>
        <Content
          webinarSfId={webinarSfId}
          onChange={(value) => {
            dispatch(onboardingActions.setWebinarSfId(value));
          }}
          noDateSelected={noDateSelected}
          onNoDateChange={(value) => {
            dispatch(onboardingActions.setNoDateSelected(value));
          }}
        />
      </StyledOnboardingStepContainer>
    ),
    isStepCompleted: async () => {
      if (currentUser?.onboardingWebinarSkippedAt) {
        return true;
      }
      const events = await fetchRegisteredWebinarEvents();
      return events.length > 0;
    },
    incrementationIsAllowed: async () => true, // Always allow incrementation; validation is done in onSubmit
    onSubmit: async () => {
      if (noDateSelected) {
        const skippedAt = new Date().toISOString();
        await Api.putUser(currentUser.id, {
          onboardingWebinarSkippedAt: skippedAt,
        });
        dispatch(
          currentUserActions.updateUserSucceeded({
            user: { onboardingWebinarSkippedAt: skippedAt },
          })
        );
        return true;
      }
      if (!webinarSfId) {
        dispatch(
          onboardingActions.setFormErrorMessage(
            "Veuillez sélectionner une date ou indiquer qu'aucune date ne vous convient."
          )
        );
        return false;
      }
      try {
        await dispatch(
          updateUserParticipationThunk({
            eventSalesForceId: webinarSfId,
            isParticipating: true,
          })
        ).unwrap();
        return true;
      } catch (e) {
        console.error(e);
        dispatch(
          onboardingActions.setFormErrorMessage(
            "Erreur lors de l'inscription au webinaire."
          )
        );
        return false;
      }
    },
    confirmationStep: noDateSelected
      ? undefined
      : {
          title: 'Votre place est réservée !',
          subtitle:
            'Vous recevrez un email de confirmation avec le lien pour rejoindre le webinaire.',
          submitBtnTxt: "Passer à l'étape suivante",
          id: 'webinar-confirmation',
        },
  } as OnboardingStep;

  return { onboardingStepWebinar };
};
