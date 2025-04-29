import React, { useCallback } from 'react';
import { IlluCV } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import { Text } from 'src/components/utils';

export interface ProfileGeneratedDescriptionProps {
  description: string | null;
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileGeneratedDescription = ({
  description,
  isEditable = false,
  smallCard = false,
}: ProfileGeneratedDescriptionProps) => {
  const isCompleted = !!description;

  const editModal = useCallback(() => {}, []);

  return (
    <ProfilePartCard
      title="Présentation"
      isCompleted={isCompleted}
      isEditable={isEditable}
      ctaCallback={editModal}
      iaGenerated
      fallback={{
        content: <Text>Vous n’avez pas encore rédigé de présentation</Text>,
        icon: <IlluCV />,
      }}
      smallCard={smallCard}
    >
      {description && <Text>{description}</Text>}
    </ProfilePartCard>
  );
};
