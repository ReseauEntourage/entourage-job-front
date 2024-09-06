import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { messagingActions, selectQuery } from 'src/use-cases/messaging';
import { plateform } from 'src/utils/Device';
import { MessagingDesktop } from './Messaging.desktop';
import { MessagingMobile } from './Messaging.mobile';
import { MessagingProps } from './Messaging.types';

export const Messaging: React.FC<MessagingProps> = (props) => {
  const dispatch = useDispatch();
  const query = useSelector(selectQuery);

  useEffect(() => {
    dispatch(messagingActions.getConversationsRequested());
  }, [dispatch, query]);

  const Component = plateform({
    Desktop: MessagingDesktop,
    Mobile: MessagingMobile,
  });

  return <Component {...props} />;
};
