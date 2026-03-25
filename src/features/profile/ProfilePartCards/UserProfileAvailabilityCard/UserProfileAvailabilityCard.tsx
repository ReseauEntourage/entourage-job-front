import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Card } from '@/src/components/ui';
import { FeedbackModal } from '@/src/features/modals/FeedbackModal/FeedbackModal';
import { openModal } from '@/src/features/modals/Modal';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import {
  CardToggleList,
  SwitchItem,
} from '../Card/CardToggleList/CardToggleList';
import { GA_TAGS } from 'src/constants/tags';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { gaEvent } from 'src/lib/gtag';
import { currentUserActions } from 'src/use-cases/current-user';

export const UserProfileAvailabilityCard = ({
  centerTitle = false,
}: {
  centerTitle?: boolean;
}) => {
  const user = useAuthenticatedUser();
  const dispatch = useDispatch();

  const { updateUserProfile } = useUpdateProfile(user);

  useEffect(() => {
    return () => {
      dispatch(currentUserActions.updateProfileReset());
    };
  }, [dispatch]);

  const cardTitle =
    user.role === UserRoles.CANDIDATE
      ? 'Disponibilité pour recevoir des coups de pouces'
      : 'Disponibilité pour accompagner un candidat';

  const itemName = user.userProfile.isAvailable
    ? 'Je suis disponible'
    : 'Je ne suis pas disponible';

  const onChange = ([updatedItem]: SwitchItem[]) => {
    gaEvent(GA_TAGS.PAGE_DASHBOARD_DISPONIBILITE_CLIC);
    if (!updatedItem.value) {
      openModal(<FeedbackModal />);
    } else {
      updateUserProfile({
        isAvailable: true,
        unavailabilityReason: null,
      });
    }
  };

  return (
    <Card title={cardTitle} centerTitle={centerTitle}>
      <CardToggleList
        items={[{ name: itemName, value: user.userProfile.isAvailable }]}
        isEditable
        onChange={onChange}
      />
    </Card>
  );
};
