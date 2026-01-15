import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/src/store/store';
import { updateUserParticipationThunk } from '@/src/use-cases/events/events.thunks';
import {
  onboardingActions,
  selectWebinarSfId,
} from '@/src/use-cases/onboarding';
import { StyledOnboardingStepContainer } from '../../onboarding.styles';
import { OnboardingStep } from '../../onboarding.types';
import { Content } from './Content';

export const useOnboardingStepWebinar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const webinarSfId = useSelector(selectWebinarSfId);

  const onboardingStepWebinar = {
    summary: {
      title: 'S’inscrire au Webinaire de bienvenue',
      description:
        "Découvrez le programme, rencontrez l'équipe, posez vos questions en direct",
      duration: '~1 minute',
    },
    title: 'Webinaire de bienvenue',
    smallTitle: 'S’inscrire au Webinaire de bienvenue',
    description:
      "Ce webinaire vous permettra de comprendre votre rôle, rencontrer l'équipe et poser toutes vos questions en direct.",
    content: (
      <StyledOnboardingStepContainer>
        <Content
          webinarSfId={webinarSfId}
          onChange={(value) => {
            dispatch(onboardingActions.setWebinarSfId(value));
          }}
        />
      </StyledOnboardingStepContainer>
    ),
    onSubmit: async () => {
      if (!webinarSfId) {
        dispatch(
          onboardingActions.setFormErrorMessage(
            'Veuillez sélectionner une date pour le webinaire afin de pouvoir passer à l’étape suivante.'
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
    confirmationStep: {
      title: 'Votre place est réservée !',
      subtitle:
        'Vous recevrez un email de confirmation avec le lien pour rejoindre le webinaire.',
      submitBtnTxt: 'Continuer vers l’étape suivante',
    },
  } as OnboardingStep;

  return { onboardingStepWebinar };
};
