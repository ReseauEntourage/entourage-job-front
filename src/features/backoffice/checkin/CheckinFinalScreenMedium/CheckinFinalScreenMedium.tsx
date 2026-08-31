import React from 'react';
import { Button, LucidIcon, Text } from '@/src/components/ui';
import { RoundBadge } from '@/src/components/ui/Badge/RoundBadge/RoundBadge';
import { UserRoles, RELATED_ROLES } from '@/src/constants/users';
import { StyledCheckinFinalScreenMedium } from './CheckinFinalScreenMedium.styles';

interface CheckinFinalScreenMediumProps {
  conversationId: string;
  currentUserRole: UserRoles;
}

export const CheckinFinalScreenMedium = ({
  conversationId,
  currentUserRole,
}: CheckinFinalScreenMediumProps) => {
  const oppositeRole = RELATED_ROLES[currentUserRole] || null;
  const discoverOthersNoun =
    oppositeRole === UserRoles.COACH ? 'coachs' : 'candidats';
  const discoverOthersLabel = `Voir d'autres ${discoverOthersNoun}`;

  return (
    <StyledCheckinFinalScreenMedium>
      <RoundBadge bgColor="green" size={64} borderSize={0}>
        <LucidIcon name="Check" color="white" size={24} />
      </RoundBadge>
      <Text size="xxlarge" weight="semibold">
        Merci pour vos retours
      </Text>
      <Text>
        D&apos;autres {discoverOthersNoun} sont disponibles, n&apos;hésitez pas
        à explorer d&apos;autres profils.
      </Text>
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
    </StyledCheckinFinalScreenMedium>
  );
};
