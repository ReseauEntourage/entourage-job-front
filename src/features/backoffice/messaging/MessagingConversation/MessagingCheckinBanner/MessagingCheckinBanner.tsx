import React from 'react';
import { Alert, Button, Text } from '@/src/components/ui';
import { AlertType } from '@/src/components/ui/Alert/Alert.types';
import { StyledMessagingCheckinBannerContent } from './MessagingCheckinBanner.styles';

interface MessagingCheckinBannerProps {
  conversationId: string;
  otherFirstName: string;
  // Other participant already completed their checkin with a note of 4-5 and sent a
  // note in this conversation (messaging-core-conversations `CHECKIN_NOTE` service message).
}

export const MessagingCheckinBanner = ({
  conversationId,
  otherFirstName,
}: MessagingCheckinBannerProps) => {
  return (
    <Alert
      type={AlertType.Info}
      variant="outlined"
      rounded={false}
      dataTestId="messaging-checkin-banner"
    >
      <StyledMessagingCheckinBannerContent>
        <Text>
          Un mois d’échanges avec {otherFirstName}, comment ça se passe ?
        </Text>
        <Button
          variant="default"
          size="small"
          rounded
          href={`/backoffice/checkin/${conversationId}`}
        >
          Faire le bilan →
        </Button>
      </StyledMessagingCheckinBannerContent>
    </Alert>
  );
};
