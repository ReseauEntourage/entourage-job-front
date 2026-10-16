import React from 'react';
import { LucidIcon, SimpleLink } from '@/src/components/ui';
import { HELP_GROUP_BACK_LINK_LABEL } from '../help-groups.labels';
import {
  StyledHelpGroupBackLink,
  StyledHelpGroupBackLinkLabel,
} from './HelpGroupBackLink.styles';

interface HelpGroupBackLinkProps {
  href: string;
  label: string;
}

/**
 * A single back link to the level above, instead of a full breadcrumb:
 * « ‹ Groupes » on a group page, « ‹ Group name » on a discussion.
 */
export function HelpGroupBackLink({ href, label }: HelpGroupBackLinkProps) {
  return (
    <StyledHelpGroupBackLink
      aria-label={HELP_GROUP_BACK_LINK_LABEL}
      data-testid="help-group-back-link"
    >
      <SimpleLink href={href}>
        <LucidIcon name="ChevronLeft" size={16} />
        <StyledHelpGroupBackLinkLabel title={label}>
          {label}
        </StyledHelpGroupBackLinkLabel>
      </SimpleLink>
    </StyledHelpGroupBackLink>
  );
}
