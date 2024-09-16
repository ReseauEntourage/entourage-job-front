import { useRouter } from 'next/router';
import React from 'react';
import { useSelectSelectedProfile } from '../useSelectedProfile';
import { Button, Card } from 'src/components/utils';
import {
  StyledContactMessage,
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
    <Card title={`Prenez contact avec ${selectedProfile?.firstName}`}>
      <StyledProfileContactForm>
        {selectedProfile.isAvailable ? (
          <>
            {isCoach ? (
              <>
                Vous souhaitez prendre contact avec {selectedProfile.firstName}{' '}
                pour qu’il vous aide dans votre recherche d’emploi, n’hésitez
                pas à lui envoyer un message
              </>
            ) : (
              <>
                Vous souhaitez prendre contact avec {selectedProfile.firstName},
                n’hésitez pas à lui envoyer un message
              </>
            )}
            <Button onClick={openConversation}>Contacter</Button>
          </>
        ) : (
          <StyledContactMessage>
            {selectedProfile.firstName} n&apos;est pas disponible pour le moment
            pour recevoir des demandes de contact
          </StyledContactMessage>
        )}
      </StyledProfileContactForm>
    </Card>
  );
};
