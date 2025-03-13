import React, { useCallback } from 'react';
import { IlluCV } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import { Text } from 'src/components/utils';

export interface ProfileGeneratedDescriptionProps {
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileGeneratedDescription = ({
  isEditable = false,
  smallCard = false,
}: ProfileGeneratedDescriptionProps) => {
  const isCompleted = false; // TODO : Bind on the real value
  const description =
    // 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec nisl nec nisl ultricies lacinia. Nullam nec nisl nec nisl ultricies lacinia. Nullam nec nisl nec nisl ultricies lacinia. Nullam nec nisl nec nisl ultricies lacinia. Nullam nec nisl nec nisl ultricies lacinia. Nullam nec nisl nec nisl ultricies lacinia. Nullam nec nisl nec nisl ultricies lacinia. Nullam nec nisl nec nisl ultricies lacinia. Nullam nec nisl nec nisl ultricies lacinia. Nullam nec nisl nec nisl ultricies lacinia.';
    null;

  const editModal = useCallback(() => {}, []);

  return (
    <ProfilePartCard
      title="Présentation"
      isCompleted={isCompleted}
      isEditable={isEditable}
      editCallback={editModal}
      iaGenerated
      isEmpty={!description}
      fallback={{
        content: <Text>Vous n’avez pas encore rédigé de présentation</Text>,
        icon: <IlluCV />,
      }}
      smallCard={smallCard}
    >
      {description}
    </ProfilePartCard>
  );
};
