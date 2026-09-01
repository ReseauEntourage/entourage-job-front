import React, { useState } from 'react';
import { Button, Card, LucidIcon, Text } from '@/src/components/ui';
import { RoundBadge } from '@/src/components/ui/Badge/RoundBadge/RoundBadge';
import { UserRoles, RELATED_ROLES } from '@/src/constants/users';
import { StaffContactCard } from '@/src/features/backoffice/StaffContactCard';
import { useCurrentUserStaffContact } from '@/src/hooks/useCurrentUserStaffContact';
import { useRequestCheckinContactMutation } from '@/src/use-cases/checkin';
import {
  StyledCheckinFinalScreenLow,
  StyledCheckinFinalScreenLowActions,
} from './CheckinFinalScreenLow.styles';

interface CheckinFinalScreenLowProps {
  conversationId: string;
  currentUserRole: UserRoles;
  otherFirstName: string;
}

export const CheckinFinalScreenLow = ({
  conversationId,
  currentUserRole,
  otherFirstName,
}: CheckinFinalScreenLowProps) => {
  const [step, setStep] = useState<'ask' | 'done'>('ask');
  const [error, setError] = useState<string | null>(null);
  const [requestContact, { isLoading }] = useRequestCheckinContactMutation();
  const staffContact = useCurrentUserStaffContact();

  const oppositeRole = RELATED_ROLES[currentUserRole] || null;
  const discoverOthersNoun =
    oppositeRole === UserRoles.COACH ? 'coachs' : 'candidats';
  const discoverOthersLabel = `Voir d'autres ${discoverOthersNoun}`;

  if (step === 'ask') {
    return (
      <StyledCheckinFinalScreenLow>
        <RoundBadge bgColor="primaryBlue" size={64} borderSize={0}>
          <LucidIcon name="Heart" color="white" size={24} />
        </RoundBadge>
        <Text size="xxlarge" weight="semibold">
          Merci pour vos retours
        </Text>
        <Card>
          <Text>
            {staffContact
              ? `${staffContact.name} est votre contact chez Entourage, qui connaît votre situation et peut vous recontacter pour voir ce qu'on peut changer.`
              : "Votre contact Entourage connaît votre situation et peut vous recontacter pour voir ce qu'on peut changer."}
          </Text>
          <br />
          <StaffContactCard variant="compact" />
        </Card>
        <Text>{otherFirstName} ne saura rien de ce que vous avez répondu.</Text>
        <Text size="large" weight="semibold">
          Voulez-vous qu&apos;on en parle ?
        </Text>
        {error && <Text color="lightRed">{error}</Text>}
        <StyledCheckinFinalScreenLowActions>
          <Button
            size="large"
            disabled={isLoading}
            onClick={async () => {
              setError(null);
              try {
                await requestContact(conversationId).unwrap();
                setStep('done');
              } catch {
                setError('Une erreur est survenue, veuillez réessayer.');
              }
            }}
          >
            Oui, j&apos;aimerais en parler
          </Button>
          <Button variant="text" onClick={() => setStep('done')}>
            Non merci
          </Button>
        </StyledCheckinFinalScreenLowActions>
      </StyledCheckinFinalScreenLow>
    );
  }

  return (
    <StyledCheckinFinalScreenLow>
      <RoundBadge bgColor="green" size={64} borderSize={0}>
        <LucidIcon name="Check" color="white" size={24} />
      </RoundBadge>
      <Text size="xxlarge" weight="semibold">
        Merci pour vos retours
      </Text>
      <Text>
        D&apos;autres {discoverOthersNoun} sont disponibles, et certains
        correspondent peut-être mieux à ce que vous cherchez en ce moment.
      </Text>
      <StyledCheckinFinalScreenLowActions>
        <Button
          size="large"
          href={`/backoffice/annuaire?entity=user&sort=relevance&role=${oppositeRole}`}
        >
          {discoverOthersLabel}
        </Button>
        <Button
          variant="text"
          href={`/backoffice/messaging?conversationId=${conversationId}`}
        >
          Retour à la conversation
        </Button>
      </StyledCheckinFinalScreenLowActions>
    </StyledCheckinFinalScreenLow>
  );
};
