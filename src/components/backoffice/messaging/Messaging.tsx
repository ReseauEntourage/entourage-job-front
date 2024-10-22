import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Api } from 'src/api';
import { DELAY_REFRESH_CONVERSATIONS } from 'src/constants';
import {
  messagingActions,
  selectSelectedConversationId,
} from 'src/use-cases/messaging';
import { plateform } from 'src/utils/Device';
import { MessagingDesktop } from './Messaging.desktop';
import { MessagingMobile } from './Messaging.mobile';
import { MessagingProps } from './Messaging.types';

export const Messaging: React.FC<MessagingProps> = (props) => {
  const dispatch = useDispatch();
  const selectedConversationId = useSelector(selectSelectedConversationId);
  const requiredConvUserId = new URLSearchParams(window.location.search).get(
    'userId'
  );

  /**
   * Fetch the conversations when the component is mounted
   */
  useEffect(() => {
    if (requiredConvUserId) {
      Api.getPublicUserProfile(requiredConvUserId).then((response) => {
        const profile = response.data;
        const user = {
          id: profile.id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          role: profile.role,
          userProfile: profile,
        };
        dispatch(messagingActions.selectConversationByParticipants([user]));
      });
    }
  }, [dispatch, requiredConvUserId]);

  /**
   * Fetch the selected Conversation when a conversation is selected
   */
  useEffect(() => {
    if (selectedConversationId && selectedConversationId !== 'new') {
      dispatch(messagingActions.getSelectedConversationRequested());
    }
  }, [dispatch, selectedConversationId]);

  /**
   * Refresh the selected conversation every DELAY_REFRESH_CONVERSATIONS ms
   */
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedConversationId && selectedConversationId !== 'new') {
        dispatch(messagingActions.getSelectedConversationRequested());
      }
      dispatch(messagingActions.getConversationsRequested());
    }, DELAY_REFRESH_CONVERSATIONS);

    return () => clearInterval(interval);
  }, [dispatch, selectedConversationId]);

  const Component = plateform({
    Desktop: MessagingDesktop,
    Mobile: MessagingMobile,
  });

  return <Component {...props} />;
};
