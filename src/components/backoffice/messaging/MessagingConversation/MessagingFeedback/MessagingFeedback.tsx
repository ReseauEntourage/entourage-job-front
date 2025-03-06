import React from 'react';
import { IlluBulleQuestion } from 'assets/icons/icons';
import { Alert } from 'src/components/utils/Alert/Alert';
import { H4 } from 'src/components/utils/Headings';
import { useIsDesktop } from 'src/hooks/utils';

// export interface MessagingFeedbackProps {
//   pinnedInfo: string;
// }

// const pinnedInfosText = {
//   ADDRESSEE_UNAVAILABLE:
//     'Cet utilisateur n’est plus disponible, le temps de réponse peut être plus long ',
//   ADDRESSEE_DELETED:
//     'Ce profil n’est plus disponible, vous ne pouvez plus lui envoyer de message',
// };

export const MessagingFeedback = () => {
  const [visible, setVisible] = React.useState(true);
  const isDesktop = useIsDesktop();

  return (
    <Alert
      visible={visible}
      variant="feedback"
      rounded={false}
      icon={
        isDesktop ? (
          <IlluBulleQuestion className="icon" width={35} height={30} />
        ) : null
      }
      onClose={() => setVisible(false)}
      closable
    >
      <H4 title="Votre avis nous interesse !" />
      <p color="white">
        A quel point pensez vous avoir aidé XXXX dans sa recherche d&apos;emploi
        ? (1 etoile = Pas du tout, 5 étoile = Beaucoup)
      </p>
      Stars rating
    </Alert>
  );
};
