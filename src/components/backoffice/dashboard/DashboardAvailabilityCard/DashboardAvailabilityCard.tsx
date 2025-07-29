import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { FeedbackModal } from 'src/components/modals/FeedbackModal/FeedbackModal';
import { openModal } from 'src/components/modals/Modal';
import { Card } from 'src/components/utils';
import { ToggleWithModal } from 'src/components/utils/Inputs/ToggleWithModal';
import { GA_TAGS } from 'src/constants/tags';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { gaEvent } from 'src/lib/gtag';
import { currentUserActions } from 'src/use-cases/current-user';

export const DashboardAvailabilityCard = () => {
  const user = useAuthenticatedUser();
  const dispatch = useDispatch();

  const { updateUserProfile } = useUpdateProfile(user);

  useEffect(() => {
    return () => {
      dispatch(currentUserActions.updateProfileReset());
    };
  }, [dispatch]);

  const onToggle = (newIsAvailable: boolean) => {
    gaEvent(GA_TAGS.PAGE_DASHBOARD_DISPONIBILITE_CLIC);
    if (newIsAvailable === false) {
      openModal(<FeedbackModal />);
    } else {
      updateUserProfile({
        isAvailable: true,
        unavailabilityReason: null,
      });
    }
  };

  return (
    <Card
      title={
        user.role === UserRoles.CANDIDATE
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
        onToggle={onToggle}
      />
    </Card>
  );
};
