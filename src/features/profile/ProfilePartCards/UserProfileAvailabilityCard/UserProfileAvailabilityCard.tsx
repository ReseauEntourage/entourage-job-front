import React, { useEffect } from 'react';
import { Card } from '@/src/components/ui';
import { GA_TAGS } from '@/src/constants/tags';
import { UserRoles } from '@/src/constants/users';
import { FeedbackModal } from '@/src/features/modals/FeedbackModal/FeedbackModal';
import { openModal } from '@/src/features/modals/Modal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserProfile } from '@/src/hooks/current-user/useCurrentUserProfile';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { gaEvent } from '@/src/lib/gtag';
import {
  UPDATE_PROFILE_FIXED_CACHE_KEY,
  useUpdateProfileMutation,
} from '@/src/use-cases/current-user';
import {
  CardToggleList,
  SwitchItem,
} from '../Card/CardToggleList/CardToggleList';

export const UserProfileAvailabilityCard = ({
  centerTitle = false,
}: {
  centerTitle?: boolean;
}) => {
  const user = useAuthenticatedUser();
  const profile = useCurrentUserProfile();

  const { updateUserProfile } = useUpdateProfile(user);

  const [, { reset: resetUpdateProfile }] = useUpdateProfileMutation({
    fixedCacheKey: UPDATE_PROFILE_FIXED_CACHE_KEY,
  });

  useEffect(() => {
    return () => {
      resetUpdateProfile();
    };
  }, [resetUpdateProfile]);

  const cardTitle =
    user.role === UserRoles.CANDIDATE
      ? 'Disponibilité pour recevoir des coups de pouces'
      : 'Disponibilité pour accompagner un candidat';

  const itemName = profile?.isAvailable
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
        items={[{ name: itemName, value: profile?.isAvailable ?? false }]}
        isEditable
        onChange={onChange}
      />
    </Card>
  );
};
