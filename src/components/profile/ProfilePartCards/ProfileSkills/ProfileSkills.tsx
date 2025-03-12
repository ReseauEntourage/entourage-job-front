import React, { useCallback } from 'react';
import { CardTagList } from '../Card/CardTagList/CardTagList';

export interface ProfileSkillsProps {
  skills?: {
    id?: string;
    name: string;
    order: number;
  }[];
  isEditable?: boolean;
}

export const ProfileSkills = ({
  skills = [],
  isEditable = false,
}: ProfileSkillsProps) => {
  const isCompleted = skills.length > 0;

  const editModal = useCallback(() => {}, []);

  const onRemove = useCallback(() => {
    // console.log('remove skillId', skillId);
  }, []);

  return (
    <CardTagList
      title="Compétences clefs"
      isCompleted={isCompleted}
      isEditable={isEditable}
      editCallback={editModal}
      removeCallback={onRemove}
      items={skills}
      iaGenerated
    />
  );
};
