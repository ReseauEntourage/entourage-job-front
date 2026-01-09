import React from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { Alert } from '@/src/components/ui/Alert/Alert';
import { useIsDesktop } from 'src/hooks/utils';

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
  const isDesktop = useIsDesktop();

  return (
    <Alert
      visible={visible}
      variant="lightGray"
      rounded={false}
      icon={
        isDesktop ? (
          <SvgIcon name="IlluBulleQuestion" width={35} height={30} />
        ) : null
      }
      onClose={() => setVisible(false)}
      closable
    >
      {pinnedInfosText[pinnedInfo]}
    </Alert>
  );
};
