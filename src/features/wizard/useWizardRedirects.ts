import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { User } from '@/src/api/types';
import { ReduxRequestEvents } from '@/src/constants';
import { authenticationActions } from '@/src/use-cases/authentication';

interface UseWizardRedirectsParams {
  currentUser: User | null;
  isFetchUserFinished: boolean;
  registrationStepsLength: number;
  isLogoutSucceeded: boolean;
  isOnboardingAlreadyCompleted: boolean;
  updateOnboardingStatus: string;
  skipDashboardRedirectRef: React.MutableRefObject<boolean>;
}

// useWizardRedirects - Centralise les redirections du wizard (/wizard, /login,
// dashboard) pour qu'elles restent lisibles indépendamment des trois phases.
export const useWizardRedirects = ({
  currentUser,
  isFetchUserFinished,
  registrationStepsLength,
  isLogoutSucceeded,
  isOnboardingAlreadyCompleted,
  updateOnboardingStatus,
  skipDashboardRedirectRef,
}: UseWizardRedirectsParams): void => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Retour à la sélection si pas de flow valide (null ou valeur non reconnue).
  // On attend la fin du fetch de l'utilisateur courant : au rechargement direct de
  // /wizard/run, la page monte avant que /current ne réponde et un utilisateur en
  // cours d'onboarding serait sinon renvoyé vers /wizard puis le dashboard.
  useEffect(() => {
    if (!currentUser && isFetchUserFinished && registrationStepsLength === 0) {
      router.replace('/wizard');
    }
  }, [currentUser, isFetchUserFinished, registrationStepsLength, router]);

  // Redirection vers /login après déconnexion depuis le wizard
  useEffect(() => {
    if (isLogoutSucceeded) {
      dispatch(authenticationActions.logoutReset());
      router.push('/login');
    }
  }, [isLogoutSucceeded, router, dispatch]);

  // Redirect to dashboard after onboarding completion (mise à jour explicite
  // via le wizard, ou onboarding déjà COMPLETED côté serveur pour Association
  // / Entreprise-admin). skipDashboardRedirectRef permet à l'étape récap de
  // gérer elle-même la navigation suivante (CTA messagerie/annuaire) sans que
  // cette redirection générique ne l'écrase : les deux déclencheurs doivent
  // partager le même effect, sinon ils se ré-exécutent dans le même commit et
  // l'un des deux consommerait le flag avant que l'autre ne puisse le lire.
  useEffect(() => {
    const onboardingJustCompleted =
      updateOnboardingStatus === ReduxRequestEvents.SUCCEEDED;
    if (onboardingJustCompleted || isOnboardingAlreadyCompleted) {
      if (skipDashboardRedirectRef.current) {
        skipDashboardRedirectRef.current = false;
        return;
      }
      router.push('/backoffice/dashboard');
    }
  }, [
    updateOnboardingStatus,
    isOnboardingAlreadyCompleted,
    router,
    skipDashboardRedirectRef,
  ]);
};
