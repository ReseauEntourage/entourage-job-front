import React from 'react';
import { IlluBulleQuestion } from 'assets/icons/icons';
import { Alert } from 'src/components/utils/Alert/Alert';

export interface MessagingPinnedInfoProps {
  pinnedInfo: string;
}

const pinnedInfosText = {
  ADDRESSEE_UNAVAILABLE:
    'Cet utilisateur n’est plus disponible, le temps de réponse peut être plus long ',
  ADDRESSEE_DELETED:
    'Ce profil n’est plus disponible, vous ne pouvez plus lui envoyer de message',
};

export const MessagingPinnedInfo = ({
  pinnedInfo,
}: MessagingPinnedInfoProps) => {
  const [visible, setVisible] = React.useState(true);

  return (
    <Alert
      visible={visible}
      variant="lightGray"
      rounded={false}
      icon={<IlluBulleQuestion className="icon" />}
      onClose={() => setVisible(false)}
      closable
    >
      {pinnedInfosText[pinnedInfo]}
    </Alert>
  );
};
