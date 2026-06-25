import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { selectAuthenticatedUser } from 'src/use-cases/current-user';
import { messagingActions } from 'src/use-cases/messaging';
import { platform } from 'src/utils/Device';
import { MessagingDesktop } from './Messaging.desktop';
import { MessagingMobile } from './Messaging.mobile';
import { MessagingProps } from './Messaging.types';

export const Messaging: React.FC<MessagingProps> = (props) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectAuthenticatedUser);
  const requiredConvUserId = new URLSearchParams(window.location.search).get(
    'userId'
  );

  /**
   * Fetch the conversations when the component is mounted.
   * The userId param is ignored if the current user has not completed elearning.
   */
  useEffect(() => {
    if (requiredConvUserId && currentUser.elearningCompletedAt) {
      dispatch(
        messagingActions.bindNewConversationRequested(requiredConvUserId)
      );
    }
  }, [dispatch, requiredConvUserId, currentUser.elearningCompletedAt]);

  const Component = platform({
    Desktop: MessagingDesktop,
    Mobile: MessagingMobile,
  });

  return <Component {...props} />;
};
