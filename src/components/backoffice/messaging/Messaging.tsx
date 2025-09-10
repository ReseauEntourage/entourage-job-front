import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { messagingActions } from 'src/use-cases/messaging';
import { platform } from 'src/utils/Device';
import { MessagingDesktop } from './Messaging.desktop';
import { MessagingMobile } from './Messaging.mobile';
import { MessagingProps } from './Messaging.types';

export const Messaging: React.FC<MessagingProps> = (props) => {
  const dispatch = useDispatch();
  const requiredConvUserId = new URLSearchParams(window.location.search).get(
    'userId'
  );

  /**
   * Fetch the conversations when the component is mounted
   */
  useEffect(() => {
    if (requiredConvUserId) {
      dispatch(
        messagingActions.bindNewConversationRequested(requiredConvUserId)
      );
    }
  }, [dispatch, requiredConvUserId]);

  const Component = platform({
    Desktop: MessagingDesktop,
    Mobile: MessagingMobile,
  });

  return <Component {...props} />;
};
