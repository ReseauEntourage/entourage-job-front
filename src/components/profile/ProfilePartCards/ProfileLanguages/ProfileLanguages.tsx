import React, { useCallback } from 'react';
import { CardTagList } from '../Card/CardTagList/CardTagList';

export interface ProfileLanguagesProps {
  languages?: {
    name: string;
  }[];
  isEditable?: boolean;
}

export const ProfileLanguages = ({
  languages = [],
  isEditable = false,
}: ProfileLanguagesProps) => {
  const isCompleted = languages.length > 0;

  const editModal = useCallback(() => {}, []);

  const onRemove = useCallback(() => {
    // Get the idx of the language to remove in params
    // console.log('remove skillId', skillId);
  }, []);

  return (
    <CardTagList
      title="Langues parlées"
      isCompleted={isCompleted}
      isEditable={isEditable}
      editCallback={editModal}
      removeCallback={onRemove}
      items={languages}
      iaGenerated
    />
  );
};
