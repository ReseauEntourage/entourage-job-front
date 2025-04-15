import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import { IlluConversation } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import { useSelectSelectedProfile } from 'src/components/backoffice/profile/useSelectedProfile';
import { Button, Text } from 'src/components/utils';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import {
  StyledContactMessage,
  StyledConversationInviteToContact,
  StyledProfileContactForm,
} from './ProfileContactCard.styles';

export interface ProfileContactCardProps {
  userId: string;
}

export const ProfileContactCard = ({ userId }: ProfileContactCardProps) => {
  const currentUserId = useSelector(selectCurrentUserId);
  const isOwnProfile = userId === currentUserId;
  const selectedProfile = useSelectSelectedProfile();
  const router = useRouter();

  const openConversation = () => {
    router.push(`/backoffice/messaging?userId=${selectedProfile.id}`);
  };
  const isCoach = selectedProfile.role === 'Coach';

  if (isOwnProfile) {
    return null;
  }

  return (
    <ProfilePartCard
      title={`Contacter ${selectedProfile?.firstName}`}
      smallCard={false}
    >
      <Text color="darkGray">Temps de réponse moyen : 2 jours</Text>
      {selectedProfile.isAvailable ? (
        <StyledProfileContactForm>
          <StyledConversationInviteToContact>
            <IlluConversation width="75" height="75" />
            {isCoach ? (
              <p>
                Vous souhaitez prendre contact avec {selectedProfile.firstName}{' '}
                pour qu’il vous aide dans votre recherche d’emploi
              </p>
            ) : (
              <p>
                Vous souhaitez prendre contact avec {selectedProfile.firstName}{' '}
                pour l&apos;aider dans sa recherche d&apos;emploi
              </p>
            )}
          </StyledConversationInviteToContact>
          <Button onClick={openConversation}>Envoyer un message</Button>
        </StyledProfileContactForm>
      ) : (
        <StyledProfileContactForm>
          <StyledContactMessage>
            {selectedProfile.firstName} n&apos;est pas disponible pour le moment
            pour recevoir des demandes de contact
          </StyledContactMessage>
        </StyledProfileContactForm>
      )}
    </ProfilePartCard>
  );
};
