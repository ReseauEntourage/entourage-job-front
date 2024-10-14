import { useRouter } from 'next/router';
import React from 'react';
import { IlluConversation } from 'assets/icons/icons';
import { useSelectSelectedProfile } from '../useSelectedProfile';
import { Button, Card } from 'src/components/utils';
import {
  StyledContactMessage,
  StyledConversationInviteToContact,
  StyledProfileContactForm,
} from './ProfileContactCard.styles';

export const ProfileContactCard = () => {
  const selectedProfile = useSelectSelectedProfile();
  const router = useRouter();
  const isCoach = selectedProfile.role === 'Coach';

  const openConversation = () => {
    router.push(`/backoffice/messaging?userId=${selectedProfile.id}`);
  };

  return (
    <Card title={`Contacter ${selectedProfile?.firstName}`}>
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
    </Card>
  );
};
