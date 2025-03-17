import React, { useCallback } from 'react';
import { IlluBulleQuestionCheck } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import { CardTagList } from '../Card/CardTagList/CardTagList';
import { Text } from 'src/components/utils';

export interface ProfileLanguagesProps {
  languages?: {
    name: string;
  }[];
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileLanguages = ({
  languages = [],
  isEditable = false,
  smallCard = false,
}: ProfileLanguagesProps) => {
  const isCompleted = languages.length > 0;

  const editModal = useCallback(() => {}, []);

  const onRemove = useCallback(() => {
    // Get the idx of the language to remove in params
    // console.log('remove skillId', skillId);
  }, []);

  if (!isCompleted && !isEditable) {
    return null;
  }

  return (
    <ProfilePartCard
      title="Langues parlées"
      isCompleted={isCompleted}
      ctaCallback={editModal}
      iaGenerated
      isEditable={isEditable}
      smallCard={smallCard}
      fallback={{
        content: (
          <Text>Vous n’avez pas encore renseigné vos langues parlées</Text>
        ),
        icon: <IlluBulleQuestionCheck />,
      }}
    >
      <CardTagList
        removeCallback={onRemove}
        items={languages}
        isEditable={isEditable}
      />
    </ProfilePartCard>
  );
};
