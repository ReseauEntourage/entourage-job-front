import React, { useCallback } from 'react';
import { Skill } from '@/src/api/types';
import { openModal } from '@/src/components/modals/Modal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { IlluCoeurSurMainSeule } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import { CardTagList } from '../Card/CardTagList/CardTagList';
import { Text } from 'src/components/utils';
import { ProfileSkillsModalEdit } from './ProfileSkillsModalEdit';

export interface ProfileSkillsProps {
  skills?: Skill[];
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileSkills = ({
  skills = [],
  isEditable = false,
  smallCard = false,
}: ProfileSkillsProps) => {
  const isCompleted = skills.length > 0;
  const user = useAuthenticatedUser();
  const { updateUserProfile } = useUpdateProfile(user);

  const openEditModal = useCallback(() => {
    openModal(
      <ProfileSkillsModalEdit
        dispatchOnSubmit={(fields) => {
          updateUserProfile({
            skills: fields.skills.map((skill) => {
              return {
                name: skill.value,
              };
            }),
          });
        }}
        skills={skills}
      />
    );
  }, [skills, updateUserProfile]);

  return (
    <ProfilePartCard
      title="Compétences clés"
      isCompleted={isCompleted}
      ctaCallback={openEditModal}
      // iaGenerated
      isEditable={isEditable}
      smallCard={smallCard}
      fallback={{
        content: (
          <Text>Vous n&apos;avez pas encore renseigné vos compétences</Text>
        ),
        icon: <IlluCoeurSurMainSeule />,
      }}
    >
      <CardTagList
        items={skills.map((upSkill) => {
          return {
            id: upSkill.id,
            name: upSkill.name ?? '',
          };
        })}
      />
    </ProfilePartCard>
  );
};
