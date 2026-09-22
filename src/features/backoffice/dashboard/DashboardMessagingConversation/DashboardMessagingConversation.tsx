import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useSelector, useStore } from 'react-redux';
import { Button, Card } from '@/src/components/ui';
import { ReduxRequestEvents } from '@/src/constants';
import {
  selectConversations,
  selectGetConversationsStatus,
  useGetConversationsQuery,
} from '@/src/use-cases/messaging';
import { ConversationItem } from './ConversationItem/ConversationItem';
import {
  CardContent,
  ConversationList,
} from './DashboardMessagingConversation.styles';

export const DashboardMessagingConversation = () => {
  const router = useRouter();
  const store = useStore();
  const conversations = useSelector(selectConversations);
  const status = useSelector(selectGetConversationsStatus);

  // Subscribing keeps the cache entry alive while this card is mounted; it
  // used to depend on a subscription the listener opened and never released.
  // The hook covers the initial fetch, the effect below keeps the previous
  // retry-after-failure behaviour.
  const { refetch: refetchConversations } = useGetConversationsQuery();

  useEffect(() => {
    const currentStatus = selectGetConversationsStatus(store.getState() as any);
    if (currentStatus === ReduxRequestEvents.FAILED) {
      refetchConversations();
    }
  }, [refetchConversations, store, status]);

  if (!conversations || conversations.length === 0) {
    return null;
  }

  const openMessaging = () => {
    router.push('/backoffice/messaging');
  };

  return (
    <Card
      title="Mes derniers messages"
      centerTitle
      dataTestId="dashboard-messaging-widget"
    >
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
