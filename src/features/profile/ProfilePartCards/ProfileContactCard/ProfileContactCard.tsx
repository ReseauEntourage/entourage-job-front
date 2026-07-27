import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/src/components/ui';
import { Text } from '@/src/components/ui';
import { UserRoles } from '@/src/constants/users';
import { ProfilePartCard } from '@/src/features/profile/ProfilePartCards/Card/Card/Card';
import { useContactEligibility } from '@/src/hooks/useContactEligibility';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import {
  StyledContactMessage,
  StyledProfileContactForm,
} from './ProfileContactCard.styles';

interface ProfileContactCardProps {
  userId: string;
  isAvailable: boolean;
  role: UserRoles;
  firstName: string;
}

export const ProfileContactCard = ({
  userId,
  isAvailable,
  role,
  firstName,
}: ProfileContactCardProps) => {
  const currentUserId = useSelector(selectCurrentUserId);
  const isOwnProfile = userId === currentUserId;
  const { openConversationOrGate } = useContactEligibility();

  const openConversation = () => openConversationOrGate(userId);
  const isCoach = role === 'Coach';

  if (isOwnProfile) {
    return null;
  }

  return (
    <ProfilePartCard title={`Contacter ${firstName}`} isCompleted>
      {isAvailable ? (
        <>
          <StyledProfileContactForm>
            {isCoach ? (
              <Text>
                Vous souhaitez prendre contact avec {firstName} pour qu'il/elle
                vous aide dans votre recherche d'emploi
              </Text>
            ) : (
              <Text>
                Vous souhaitez prendre contact avec {firstName} pour l'aider
                dans sa recherche d'emploi
              </Text>
            )}
            <Button onClick={openConversation}>Envoyer un message</Button>
          </StyledProfileContactForm>
        </>
      ) : (
        <StyledProfileContactForm>
          <StyledContactMessage>
            {firstName} n&apos;est pas disponible pour le moment pour recevoir
            des demandes de contact
          </StyledContactMessage>
        </StyledProfileContactForm>
      )}
    </ProfilePartCard>
  );
};
