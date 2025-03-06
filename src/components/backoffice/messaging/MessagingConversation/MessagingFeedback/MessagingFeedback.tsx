import React from 'react';
import { IlluBulleQuestion } from 'assets/icons/icons';
import { Alert } from 'src/components/utils/Alert/Alert';
import { useIsDesktop } from 'src/hooks/utils';
import {
  StyledAlertFeedbackContainer,
  StyledAlertFeedbackDescription,
  StyledAlertFeedbackTitle,
} from './MessagingFeedback.style';

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
      <StyledAlertFeedbackContainer>
        <StyledAlertFeedbackTitle>
          Votre avis nous intéresse !
        </StyledAlertFeedbackTitle>
        <StyledAlertFeedbackDescription>
          A quel point pensez vous avoir aidé XXXX dans sa recherche
          d&apos;emploi ? (1 étoile = Pas du tout, 5 étoiles = Beaucoup)
        </StyledAlertFeedbackDescription>
      </StyledAlertFeedbackContainer>
    </Alert>
  );
};
