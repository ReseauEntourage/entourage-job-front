import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import { SvgIcon } from '@/assets/icons/icons';
import { UserRoles } from '@/src/constants/users';
import { ProfilePartCard } from '../Card/Card/Card';
import { Button, Text } from 'src/components/utils';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import {
  StyledContactMessage,
  StyledConversationInviteToContact,
  StyledProfileContactForm,
} from './ProfileContactCard.styles';

export interface ProfileContactCardProps {
  userId: string;
  averageDelayResponse?: number | null;
  isAvailable: boolean;
  role: UserRoles;
  firstName: string;
}

export const ProfileContactCard = ({
  userId,
  averageDelayResponse,
  isAvailable,
  role,
  firstName,
}: ProfileContactCardProps) => {
  const currentUserId = useSelector(selectCurrentUserId);
  const isOwnProfile = userId === currentUserId;
  const router = useRouter();

  const openConversation = () => {
    router.push(`/backoffice/messaging?userId=${userId}`);
  };
  const isCoach = role === 'Coach';

  if (isOwnProfile) {
    return null;
  }

  return (
    <ProfilePartCard
      title={`Contacter ${firstName}`}
      smallCard={false}
      isCompleted
    >
      {isAvailable ? (
        <>
          {averageDelayResponse && (
            <Text color="darkGray">
              Temps de réponse moyen : {averageDelayResponse} jour
              {averageDelayResponse > 1 && 's'}
            </Text>
          )}
          <StyledProfileContactForm>
            <StyledConversationInviteToContact>
              <SvgIcon name="IlluConversation" width={75} height={75} />
              {isCoach ? (
                <p>
                  Vous souhaitez prendre contact avec {firstName} pour qu’il
                  vous aide dans votre recherche d’emploi
                </p>
              ) : (
                <p>
                  Vous souhaitez prendre contact avec {firstName} pour
                  l&apos;aider dans sa recherche d&apos;emploi
                </p>
              )}
            </StyledConversationInviteToContact>
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
