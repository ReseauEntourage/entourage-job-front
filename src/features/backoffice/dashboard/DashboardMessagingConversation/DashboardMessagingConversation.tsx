import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { Button, Card } from '@/src/components/ui';
import { ReduxRequestEvents } from 'src/constants';
import {
  messagingActions,
  selectConversations,
  selectGetConversationsStatus,
} from 'src/use-cases/messaging';
import { ConversationItem } from './ConversationItem/ConversationItem';
import {
  CardContent,
  ConversationList,
} from './DashboardMessagingConversation.styles';

export const DashboardMessagingConversation = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const store = useStore();
  const conversations = useSelector(selectConversations);
  const status = useSelector(selectGetConversationsStatus);

  useEffect(() => {
    const currentStatus = selectGetConversationsStatus(store.getState() as any);
    if (
      currentStatus === ReduxRequestEvents.IDLE ||
      currentStatus === ReduxRequestEvents.FAILED
    ) {
      dispatch(messagingActions.getConversationsRequested());
    }
  }, [dispatch, store, status]);

  if (!conversations || conversations.length === 0) {
    return null;
  }

  const openMessaging = () => {
    router.push('/backoffice/messaging');
  };

  return (
    <Card title="Mes derniers messages" centerTitle>
      <CardContent>
        <ConversationList>
          {conversations &&
            conversations.slice(0, 3).map((conversation) => {
              return (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                />
              );
            })}
        </ConversationList>
        <Button onClick={openMessaging}>Accéder à la messagerie</Button>
      </CardContent>
    </Card>
  );
};
