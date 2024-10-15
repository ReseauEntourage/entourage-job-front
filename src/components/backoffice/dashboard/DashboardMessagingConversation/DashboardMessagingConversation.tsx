import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card } from 'src/components/utils';
import { messagingActions, selectConversations } from 'src/use-cases/messaging';
import { ConversationItem } from './ConversationItem/ConversationItem';
import {
  CardContent,
  ConversationList,
} from './DashboardMessagingConversation.styles';

export const DashboardMessagingConversation = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const conversations = useSelector(selectConversations);

  useEffect(() => {
    dispatch(messagingActions.getConversationsRequested());
  }, [dispatch]);

  if (!conversations || conversations.length === 0) {
    return null;
  }

  const openMessaging = () => {
    router.push('/backoffice/messaging');
  };

  return (
    <Card title="Mes derniers messages">
      <CardContent>
        <ConversationList>
          {conversations &&
            conversations.slice(0, 3).map((conversation) => {
              return <ConversationItem conversation={conversation} />;
            })}
        </ConversationList>
        <Button onClick={openMessaging}>Accéder à la messagerie</Button>
      </CardContent>
    </Card>
  );
};
