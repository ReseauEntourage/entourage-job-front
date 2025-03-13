import React from 'react';
import { useDispatch } from 'react-redux';
import { IlluBulleQuestion } from 'assets/icons/icons';
import { Alert } from 'src/components/utils/Alert/Alert';
import { StarRating } from 'src/components/utils/StarRating/StarRating';
import { useIsDesktop } from 'src/hooks/utils';
import { notificationsActions } from 'src/use-cases/notifications';
import {
  StyledAlertFeedbackContainer,
  StyledAlertFeedbackDescription,
  StyledAlertFeedbackTitle,
} from './MessagingFeedback.style';

interface MessagingFeedbackProps {
  onRatingOrClose: (rating: number | null) => void;
}

export const MessagingFeedback = ({
  onRatingOrClose,
}: MessagingFeedbackProps) => {
  const [visible, setVisible] = React.useState(true);
  const isDesktop = useIsDesktop();
  const dispatch = useDispatch();

  const onClose = () => {
    setVisible(false);
    onRatingOrClose(null);
  };

  const onRating = (rating: number) => {
    setVisible(false);
    onRatingOrClose(rating);
    dispatch(
      notificationsActions.addNotification({
        type: 'success',
        message:
          'Merci pour votre retour ! Cela nous aide à améliorer notre service.',
      })
    );
  };

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
      onClose={() => onClose()}
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
        <StarRating onClick={(ratingValue) => onRating(ratingValue)} />
      </StyledAlertFeedbackContainer>
    </Alert>
  );
};
