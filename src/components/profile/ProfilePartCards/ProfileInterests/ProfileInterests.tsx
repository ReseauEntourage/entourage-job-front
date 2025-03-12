import React, { useCallback } from 'react';
import { CardTagList } from '../Card/CardTagList/CardTagList';

export interface ProfileInterestsProps {
  interests?: {
    name: string;
  }[];
  isEditable?: boolean;
}

export const ProfileInterests = ({
  interests = [],
  isEditable = false,
}: ProfileInterestsProps) => {
  const isCompleted = interests.length > 0;

  const editModal = useCallback(() => {}, []);

  const onRemove = useCallback(() => {
    // Get the idx of the language to remove in params
    // console.log('remove skillId', skillId);
  }, []);

  return (
    <CardTagList
      title="Passions"
      isCompleted={isCompleted}
      isEditable={isEditable}
      editCallback={editModal}
      removeCallback={onRemove}
      items={interests}
      iaGenerated
    />
  );
};
