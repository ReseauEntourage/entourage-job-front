import React from 'react';
import { useDispatch } from 'react-redux';
import { IlluBulleQuestion } from 'assets/icons/icons';
import { ConversationParticipant } from 'src/api/types';
import { Alert } from 'src/components/utils/Alert/Alert';
import { StarRating } from 'src/components/utils/StarRating/StarRating';
import { USER_ROLES } from 'src/constants/users';
import { useIsDesktop } from 'src/hooks/utils';
import { notificationsActions } from 'src/use-cases/notifications';
import {
  StyledAlertFeedbackContainer,
  StyledAlertFeedbackDescription,
  StyledAlertFeedbackTitle,
} from './MessagingFeedback.style';

interface MessagingFeedbackProps {
  onRatingOrClose: (rating: number | null) => void;
  adressee?: ConversationParticipant;
}

export const MessagingFeedback = ({
  onRatingOrClose,
  adressee,
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

  const getFeedbackDescriptionText = (): string => {
    switch (adressee?.role) {
      case USER_ROLES.CANDIDATE:
        return `A quel point pensez vous avoir aidé ${adressee.firstName} dans sa recherche d'emploi ? (1 étoile = Pas du tout, 5 étoiles = Beaucoup)`;
      case USER_ROLES.COACH:
        return `A quel point ${adressee.firstName} vous a aidé dans sa recherche d'emploi ? (1 étoile = Pas du tout, 5 étoiles = Beaucoup)`;
      default:
        return `Comment évaluez-vous votre conversation ? (1 étoile = Pas du tout, 5 étoiles = Beaucoup)`;
    }
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
          {getFeedbackDescriptionText()}
        </StyledAlertFeedbackDescription>
        <StarRating onClick={(ratingValue) => onRating(ratingValue)} />
      </StyledAlertFeedbackContainer>
    </Alert>
  );
};
