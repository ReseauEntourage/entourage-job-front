import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UIkit from 'uikit';
import { useUpdateProfile } from 'src/components/backoffice/parametres/useUpdateProfile';
import { Card } from 'src/components/utils';
import { ToggleWithModal } from 'src/components/utils/Inputs/ToggleWithModal';
import { ReduxRequestEvents } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { CANDIDATE_USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { usePrevious } from 'src/hooks/utils';
import { gaEvent } from 'src/lib/gtag';
import {
  authenticationActions,
  updateProfileSelectors,
} from 'src/use-cases/authentication';
import { isRoleIncluded } from 'src/utils';

export const DashboardAvailabilityCard = () => {
  const user = useAuthenticatedUser();
  const dispatch = useDispatch();
  const updateProfileStatus = useSelector(
    updateProfileSelectors.selectUpdateProfileStatus
  );
  const prevUpdateProfileStatus = usePrevious(updateProfileStatus);

  const { updateUserProfile } = useUpdateProfile(user);

  useEffect(() => {
    if (prevUpdateProfileStatus === ReduxRequestEvents.REQUESTED) {
      if (updateProfileStatus === ReduxRequestEvents.SUCCEEDED) {
        UIkit.notification(
          `La modification de votre disponibilité a bien été enregistrée`,
          'success'
        );
      } else if (updateProfileStatus === ReduxRequestEvents.FAILED) {
        UIkit.notification(
          `Une erreur est survenue lors de la modification de votre disponibilité`,
          'danger'
        );
      }
      dispatch(authenticationActions.updateProfileReset());
    }
  }, [updateProfileStatus, prevUpdateProfileStatus, dispatch]);

  return (
    <Card
      title={
        isRoleIncluded(CANDIDATE_USER_ROLES, user.role)
          ? 'Disponibilité pour recevoir des coups de pouces'
          : 'Disponibilité pour accompagner un candidat'
      }
    >
      <ToggleWithModal
        id="isAvailable"
        title={
          user.userProfile.isAvailable
            ? 'Je suis disponible'
            : 'Je ne suis pas disponible'
        }
        isToggled={user.userProfile.isAvailable}
        onToggle={(isAvailable) => {
          updateUserProfile({ isAvailable });
          gaEvent(GA_TAGS.PAGE_DASHBOARD_DISPONIBILITE_CLIC);
        }}
      />
    </Card>
  );
};
