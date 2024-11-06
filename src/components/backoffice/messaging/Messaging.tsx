import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { Api } from 'src/api';
import { messagingActions } from 'src/use-cases/messaging';
import { plateform } from 'src/utils/Device';
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

  const Component = plateform({
    Desktop: MessagingDesktop,
    Mobile: MessagingMobile,
  });

  return <Component {...props} />;
};
