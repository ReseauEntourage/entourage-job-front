import React from 'react';
import { Alert, Button, ButtonIcon, Text } from '@/src/components/ui';
import { AlertType } from '@/src/components/ui/Alert/Alert.types';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { COLORS } from '@/src/constants/styles';
import { RELATED_ROLES, UserRoles } from '@/src/constants/users';
import {
  StyledMessagingWaitingReplyBannerActions,
  StyledMessagingWaitingReplyBannerContent,
} from './MessagingWaitingReplyBanner.styles';

interface MessagingWaitingReplyBannerProps {
  recipientFirstName: string;
  currentUserRole: UserRoles;
}

export const MessagingWaitingReplyBanner = ({
  recipientFirstName,
  currentUserRole,
}: MessagingWaitingReplyBannerProps) => {
  const oppositeRole = RELATED_ROLES[currentUserRole] || null;
  const discoverOthersLabel =
    oppositeRole === UserRoles.COACH
      ? "Voir d'autres coachs"
      : "Voir d'autres candidats";

  return (
    <Alert
      type={AlertType.Info}
      variant="outlined"
      rounded={false}
      title={`Message envoyé à ${recipientFirstName}`}
      icon={
        <ButtonIcon
          icon={<LucidIcon name="Check" />}
          color={COLORS.primaryBlue}
        />
      }
    >
      <StyledMessagingWaitingReplyBannerContent>
        <Text>
          Il recevra une notification et vous répondra ici même. En attendant,
          vous pouvez :
        </Text>
        <StyledMessagingWaitingReplyBannerActions>
          <Button
            variant="default"
            size="small"
            rounded
            href={`/backoffice/annuaire?entity=user&sort=relevance&role=${oppositeRole}`}
          >
            {discoverOthersLabel}
          </Button>
          <Button
            variant="default"
            size="small"
            rounded
            href="/backoffice/dashboard"
          >
            Voir mon tableau de bord
          </Button>
        </StyledMessagingWaitingReplyBannerActions>
      </StyledMessagingWaitingReplyBannerContent>
    </Alert>
  );
};
