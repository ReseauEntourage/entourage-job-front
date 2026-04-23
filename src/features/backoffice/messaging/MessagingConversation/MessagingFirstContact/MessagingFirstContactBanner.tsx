import React from 'react';
import { Button, Text, Alert } from '@/src/components/ui';
import { AlertVariant } from '@/src/components/ui/Alert/Alert.types';
import { UserRoles } from '@/src/constants/users';
import { openModal } from '@/src/features/modals/Modal';
import { StyledMessagingFirstContactBannerContent } from './MessagingFirstContactBanner.styles';
import { MessagingFirstContactModal } from './MessagingFirstContactModal';

interface MessagingFirstContactBannerProps {
  role: UserRoles;
}

export const MessagingFirstContactBanner = ({
  role,
}: MessagingFirstContactBannerProps) => {
  const [visible, setVisible] = React.useState(true);

  return (
    <Alert
      visible={visible}
      variant={AlertVariant.Info}
      rounded={false}
      onClose={() => setVisible(false)}
      closable
    >
      <StyledMessagingFirstContactBannerContent>
        <div>
          <Text weight="semibold">Nouveau contact</Text>
          <Text>Quelques conseils pour organiser le premier contact.</Text>
        </div>
        <Button
          variant="default"
          size="small"
          rounded
          onClick={() => openModal(<MessagingFirstContactModal role={role} />)}
        >
          Voir les conseils
        </Button>
      </StyledMessagingFirstContactBannerContent>
    </Alert>
  );
};
