import React from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { Button } from 'src/components/utils';
import { H3 } from 'src/components/utils/Headings';
import { MessagingEmptyStateContainer } from './Messaging.styles';

export interface MessagingEmptyStateProps {
  title: string;
  subtitle?: string;
  action?: string;
  actionHref?: string;
}

export const MessagingEmptyState = ({
  title,
  subtitle,
  action,
  actionHref,
}: MessagingEmptyStateProps) => {
  return (
    <MessagingEmptyStateContainer>
      <SvgIcon name="IlluConversation" width={226} height={226} />
      <H3 title={title} />
      {subtitle && <p>{subtitle}</p>}
      {action && <Button href={actionHref}>{action}</Button>}
    </MessagingEmptyStateContainer>
  );
};
