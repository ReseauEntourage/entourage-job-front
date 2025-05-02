import React, { useCallback } from 'react';
import { IlluCoeurSurMainSeule } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import { CardTagList } from '../Card/CardTagList/CardTagList';
import { Text } from 'src/components/utils';

export interface ProfileSkillsProps {
  skills?: {
    id?: string;
    name: string;
    order: number;
  }[];
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileSkills = ({
  skills = [],
  isEditable = false,
  smallCard = false,
}: ProfileSkillsProps) => {
  const isCompleted = skills.length > 0;

  const editModal = useCallback(() => {}, []);

  const onRemove = useCallback(() => {
    // console.log('remove skillId', skillId);
  }, []);

  return (
    <ProfilePartCard
      title="Compétences clefs"
      isCompleted={isCompleted}
      ctaCallback={editModal}
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
        isEditable={isEditable}
        removeCallback={onRemove}
        items={skills}
      />
    </ProfilePartCard>
  );
};
