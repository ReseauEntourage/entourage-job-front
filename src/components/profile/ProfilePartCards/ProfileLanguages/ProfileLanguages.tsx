import React, { useCallback } from 'react';
import { IlluBulleQuestionCheck } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import { CardTagList } from '../Card/CardTagList/CardTagList';
import { Language } from 'src/api/types';
import { Text } from 'src/components/utils';
import { LANGUAGES_LEVELS } from 'src/constants';

export interface ProfileLanguagesProps {
  languages?: Language[];
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
      //      iaGenerated
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
        items={languages.map((language) => {
          const languageLevel = language.userProfileLanguages.level;
          const completeLevel = LANGUAGES_LEVELS.find(
            (level) => level.value === languageLevel
          );
          return {
            id: language.id,
            name: `${language.name} (${completeLevel?.text})`,
          };
        })}
        isEditable={isEditable}
      />
    </ProfilePartCard>
  );
};
