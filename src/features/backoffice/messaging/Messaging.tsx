import { useRouter } from 'next/router';
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
  const router = useRouter();
  const currentUser = useSelector(selectAuthenticatedUser);
  const requiredConvUserId =
    typeof router.query.userId === 'string' ? router.query.userId : null;
  const requiredConversationId =
    typeof router.query.conversationId === 'string'
      ? router.query.conversationId
      : null;

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

  // Directly selects a conversation already known (e.g. just created
  // elsewhere, like the wizard's inline compose), without going through the
  // "find or create a conversation with this user" resolution flow.
  useEffect(() => {
    if (requiredConversationId) {
      dispatch(messagingActions.selectConversation(requiredConversationId));
    }
  }, [dispatch, requiredConversationId]);

  const Component = platform({
    Desktop: MessagingDesktop,
    Mobile: MessagingMobile,
  });

  return <Component {...props} />;
};
