import React from 'react';
import { MessagingMessageSuspiciousModal } from '@/src/features/backoffice/messaging/MessagingConversation/MessagingMessage/MessagingMessageSuspiciousModal/MessagingMessageSuspiciousModal';
import { openModal } from '@/src/features/modals/Modal';
import { linkifyToNodes } from '@/src/utils/Formatting';
import { isVerifiedLinkDomain } from '@/src/utils/SuspiciousContent';
import { StyledHelpGroupContent } from './HelpGroupContent.styles';

interface HelpGroupContentProps {
  content: string;
  /**
   * Message of a member: a link to a non verified domain opens only after
   * the same confirmation as the messaging, unless the author is an
   * Entourage admin.
   */
  guardLinks?: boolean;
  authorIsAdmin?: boolean;
}

/**
 * Plain text with line breaks kept and web addresses as links. No markup
 * (HTML, Markdown) is ever interpreted.
 */
export function HelpGroupContent({
  content,
  guardLinks = false,
  authorIsAdmin = false,
}: HelpGroupContentProps) {
  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const link = (event.target as HTMLElement).closest?.('a');
    if (
      !guardLinks ||
      authorIsAdmin ||
      !link ||
      isVerifiedLinkDomain(link.href)
    ) {
      return;
    }
    event.preventDefault();
    openModal(<MessagingMessageSuspiciousModal href={link.href} />);
  };

  return (
    <StyledHelpGroupContent onClick={onClick}>
      {linkifyToNodes(content)}
    </StyledHelpGroupContent>
  );
}
