import React, { useCallback } from 'react';
import { ProfilePartCard } from '../ProfilePartCards/ProfilePartCard';
import { StyledSkillList } from './KeySkills.styles';
import { SkillItem } from './SkillItem/SkillItem';

export interface KeySkillsProps {
  skills?: {
    id?: string;
    name: string;
    order: number;
  }[];
  isEditable?: boolean;
}

export const KeySkills = ({
  skills = [],
  isEditable = false,
}: KeySkillsProps) => {
  const isCompleted = skills.length > 0;

  const editModal = useCallback(() => {}, []);

  const onRemove = useCallback(() => {
    // console.log('remove skillId', skillId);
  }, []);

  return (
    <ProfilePartCard
      title="Compétences clefs"
      isCompleted={isCompleted}
      isEditable={isEditable}
      editCallback={editModal}
      iaGenerated
    >
      <StyledSkillList>
        {skills.map((item) => (
          <SkillItem
            title={item.name}
            key={item.id}
            onRemove={
              isEditable
                ? () => {
                    onRemove(item.id);
                  }
                : undefined
            }
          />
        ))}
      </StyledSkillList>
    </ProfilePartCard>
  );
};
