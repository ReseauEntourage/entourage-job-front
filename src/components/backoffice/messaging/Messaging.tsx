import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { DELAY_REFRESH_CONVERSATIONS } from 'src/constants';
import {
  messagingActions,
  selectQuery,
  selectSelectedConversationId,
} from 'src/use-cases/messaging';
import { plateform } from 'src/utils/Device';
import { MessagingDesktop } from './Messaging.desktop';
import { MessagingMobile } from './Messaging.mobile';
import { MessagingProps } from './Messaging.types';

export const Messaging: React.FC<MessagingProps> = (props) => {
  const dispatch = useDispatch();
  const query = useSelector(selectQuery);
  const selectedConversationId = useSelector(selectSelectedConversationId);

  /**
   * Fetch the conversations every time the query changes
   */
  useEffect(() => {
    dispatch(messagingActions.getConversationsRequested());
  }, [dispatch, query]);

  /**
   * Fetch the selected Conversation when a conversation is selected
   * and refresh it every DELAY_REFRESH_CONVERSATIONS ms
   */
  useEffect(() => {
    dispatch(messagingActions.getSelectedConversationRequested());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversationId]);

  /**
   * Refresh the selected conversation every DELAY_REFRESH_CONVERSATIONS ms
   */
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(messagingActions.getSelectedConversationRequested());
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
