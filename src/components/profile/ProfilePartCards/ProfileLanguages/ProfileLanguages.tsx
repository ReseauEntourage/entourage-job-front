import React, { useCallback } from 'react';
import { openModal } from '@/src/components/modals/Modal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { IlluBulleQuestionCheck } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import { CardTagList } from '../Card/CardTagList/CardTagList';
import { UserProfileLanguage } from 'src/api/types';
import { Text } from 'src/components/utils';
import { LANGUAGES_LEVELS } from 'src/constants';
import { ProfileLanguagesModalEdit } from './ProfileLanguagesModalEdit';

export interface ProfileLanguagesProps {
  userProfileLanguages?: UserProfileLanguage[];
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileLanguages = ({
  userProfileLanguages = [],
  isEditable = false,
  smallCard = false,
}: ProfileLanguagesProps) => {
  const user = useAuthenticatedUser();
  const { updateUserProfile } = useUpdateProfile(user);
  const isCompleted = userProfileLanguages.length > 0;

  const openEditModal = useCallback(() => {
    openModal(
      <ProfileLanguagesModalEdit
        dispatchOnSubmit={(fields) => {
          updateUserProfile({
            userProfileLanguages: fields.languages.map((language) => ({
              languageId: language.value,
            })) as UserProfileLanguage[],
          });
        }}
        userProfileLanguages={userProfileLanguages}
      />
    );
  }, [updateUserProfile, userProfileLanguages]);

  if (!isEditable && !isCompleted) {
    return null;
  }

  return (
    <ProfilePartCard
      title="Langues parlées"
      isCompleted={isCompleted}
      ctaCallback={isEditable ? openEditModal : undefined}
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
        items={userProfileLanguages.map((upLanguage) => {
          const languageLevel = upLanguage.level;
          const completeLevel = LANGUAGES_LEVELS.find(
            (level) => level.value === languageLevel
          );
          let label = upLanguage.language?.name || '';
          if (completeLevel) {
            label += ` (${completeLevel.text})`;
          }
          return {
            id: upLanguage.id,
            name: label,
          };
        })}
      />
    </ProfilePartCard>
  );
};
