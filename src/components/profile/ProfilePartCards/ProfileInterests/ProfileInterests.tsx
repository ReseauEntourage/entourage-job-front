import React, { useCallback } from 'react';
import { Interest } from '@/src/api/types';
import { openModal } from '@/src/components/modals/Modal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { IlluCoeurMainsOuvertes } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import { CardTagList } from '../Card/CardTagList/CardTagList';
import { Text } from 'src/components/utils';
import { ProfileInterestsModalEdit } from './ProfileInterestsModalEdit';

export interface ProfileInterestsProps {
  interests?: Interest[];
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileInterests = ({
  interests = [],
  isEditable = false,
  smallCard = false,
}: ProfileInterestsProps) => {
  const user = useAuthenticatedUser();
  const { updateUserProfile } = useUpdateProfile(user);
  const isCompleted = interests.length > 0;

  const openEditModal = useCallback(() => {
    openModal(
      <ProfileInterestsModalEdit
        dispatchOnSubmit={(fields) => {
          updateUserProfile({
            interests: fields.interests.map((interest, order) => ({
              name: interest.value,
              order,
            })),
          });
        }}
        interests={interests}
      />
    );
  }, [interests, updateUserProfile]);

  const onRemove = useCallback(() => {
    // Get the idx of the language to remove in params
    // console.log('remove skillId', skillId);
  }, []);

  if (!isCompleted && !isEditable) {
    return null;
  }

  return (
    <ProfilePartCard
      title="Centres d'intérêt"
      isCompleted={isCompleted}
      ctaCallback={isEditable ? openEditModal : undefined}
      // iaGenerated
      isEditable={isEditable}
      smallCard={smallCard}
      fallback={{
        content: (
          <Text>
            Vous n’avez pas encore renseigné vos centres d&apos;intérêt
          </Text>
        ),
        icon: <IlluCoeurMainsOuvertes />,
      }}
    >
      <CardTagList
        removeCallback={onRemove}
        items={interests.map((interest) => ({
          id: interest.id,
          name: interest.name,
        }))}
        isEditable={false}
      />
    </ProfilePartCard>
  );
};
