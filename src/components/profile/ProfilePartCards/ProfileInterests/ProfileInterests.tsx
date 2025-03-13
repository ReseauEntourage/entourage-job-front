import React, { useCallback } from 'react';
import { IlluCoeurMainsOuvertes } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import { CardTagList } from '../Card/CardTagList/CardTagList';
import { Text } from 'src/components/utils';

export interface ProfileInterestsProps {
  interests?: {
    name: string;
  }[];
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileInterests = ({
  interests = [],
  isEditable = false,
  smallCard = false,
}: ProfileInterestsProps) => {
  const isCompleted = interests.length > 0;

  const editModal = useCallback(() => {}, []);

  const onRemove = useCallback(() => {
    // Get the idx of the language to remove in params
    // console.log('remove skillId', skillId);
  }, []);

  return (
    <ProfilePartCard
      title="Passions"
      isCompleted={isCompleted}
      editCallback={editModal}
      iaGenerated
      isEditable={isEditable}
      smallCard={smallCard}
      fallback={{
        content: <Text>Vous n’avez pas encore renseigné vos passions</Text>,
        icon: <IlluCoeurMainsOuvertes />,
      }}
    >
      <CardTagList
        removeCallback={onRemove}
        items={interests}
        isEditable={isEditable}
      />
    </ProfilePartCard>
  );
};
