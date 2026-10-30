import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Card, Text } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { ReduxRequestEvents } from '@/src/constants';
import { COLORS } from '@/src/constants/styles';
import {
  selectConversations,
  selectGetConversationsStatus,
} from '@/src/use-cases/messaging';
import { DashboardMessagingConversation } from '../../DashboardMessagingConversation';
import { StyledAdminDashboardEmptyContent } from './AdminDashboardMessages.styles';

/**
 * The messages preview of the admin dashboard. The shared preview renders
 * nothing when there is no conversation; for an admin it is replaced by a
 * short welcome message, so the right column is never empty. Nothing is shown
 * while the conversations are loading, to avoid a flash of the empty state.
 */
export const AdminDashboardMessages = () => {
  const conversations = useSelector(selectConversations);
  const status = useSelector(selectGetConversationsStatus);

  const hasNoConversation =
    status === ReduxRequestEvents.SUCCEEDED && conversations?.length === 0;

  return (
    <>
      <DashboardMessagingConversation />
      {hasNoConversation && (
        <Card dataTestId="admin-dashboard-no-messages">
          <StyledAdminDashboardEmptyContent>
            <LucidIcon
              name="MessageCircleMore"
              size={32}
              color={COLORS.primaryBlue}
              stroke="thin"
            />
            <Text weight="semibold" size="large">
              Vous n&apos;avez pas encore de messages
            </Text>
            <Button variant="primary" rounded href="/backoffice/messaging">
              Accéder à la messagerie
            </Button>
          </StyledAdminDashboardEmptyContent>
        </Card>
      )}
    </>
  );
};
