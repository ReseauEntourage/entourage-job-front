import React, { useCallback } from 'react';
import { ProfilePartCard } from '../ProfilePartCards/ProfilePartCard';

export interface GeneratedDescriptionProps {
  isEditable?: boolean;
}

export const GeneratedDescription = ({
  isEditable = false,
}: GeneratedDescriptionProps) => {
  const isCompleted = false; // TODO : Bind on the real value

  const editModal = useCallback(() => {}, []);

  return (
    <ProfilePartCard
      title="Présentation"
      isCompleted={isCompleted}
      isEditable={isEditable}
      editCallback={editModal}
      iaGenerated
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec nisl
      nec nisl ultricies lacinia. Nullam nec nisl nec nisl ultricies lacinia.
      Nullam nec nisl nec nisl ultricies lacinia. Nullam nec nisl nec nisl
      ultricies lacinia. Nullam nec nisl nec nisl ultricies lacinia. Nullam nec
      nisl nec nisl ultricies lacinia. Nullam nec nisl nec nisl ultricies
      lacinia. Nullam nec nisl nec nisl ultricies lacinia. Nullam nec nisl nec
      nisl ultricies lacinia. Nullam nec nisl nec nisl ultricies lacinia.
    </ProfilePartCard>
  );
};
