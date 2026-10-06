import React, { useEffect, useRef, useState } from 'react';
import { ButtonIcon, Text } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { NotificationsList } from '../NotificationsList';
import {
  formatUnseenBadge,
  getBellLabel,
  NOTIFICATIONS_LABELS,
  NOTIFICATIONS_PAGE_HREF,
} from '../notifications-center.utils';
import {
  StyledNotificationsBadge,
  StyledNotificationsBell,
  StyledNotificationsPanel,
  StyledNotificationsPanelHeader,
} from './NotificationsBell.styles';

interface NotificationsBellProps {
  // Number of unseen notifications (rows, not events)
  unseenCount: number;
  // Desktop: a dropdown panel; mobile: a link to the full screen page
  variant: 'desktop' | 'mobile';
  color: string;
}

/**
 * The bell of the connected header, with the number of unseen
 * notifications, capped at "9+".
 */
export const NotificationsBell = ({
  unseenCount,
  variant,
  color,
}: NotificationsBellProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const badge = formatUnseenBadge(unseenCount);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  return (
    <StyledNotificationsBell
      ref={containerRef}
      data-testid="notifications-bell"
    >
      <ButtonIcon
        icon={<LucidIcon name="Bell" stroke="thin" />}
        color={color}
        variant="text"
        size="xxlarge"
        dataTestId="notifications-bell-button"
        ariaLabel={getBellLabel(unseenCount)}
        {...(variant === 'mobile'
          ? { href: NOTIFICATIONS_PAGE_HREF }
          : { onClick: () => setIsOpen((open) => !open) })}
      />
      {badge && (
        <StyledNotificationsBadge
          aria-hidden="true"
          data-testid="notifications-badge"
        >
          {badge}
        </StyledNotificationsBadge>
      )}
      {variant === 'desktop' && isOpen && (
        <StyledNotificationsPanel
          role="dialog"
          aria-label={NOTIFICATIONS_LABELS.TITLE}
          data-testid="notifications-panel"
        >
          <StyledNotificationsPanelHeader>
            <Text size="large" weight="semibold">
              {NOTIFICATIONS_LABELS.TITLE}
            </Text>
          </StyledNotificationsPanelHeader>
          <NotificationsList onSelect={() => setIsOpen(false)} />
        </StyledNotificationsPanel>
      )}
    </StyledNotificationsBell>
  );
};
