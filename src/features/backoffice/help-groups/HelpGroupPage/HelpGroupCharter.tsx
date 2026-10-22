import React, { useState } from 'react';
import { LucidIcon, Text } from '@/src/components/ui';
import { EthicsCharterSummaries } from '@/src/components/ui/EthicsCharter/EthicsCharterSummaries';
import { H5 } from '@/src/components/ui/Headings';
import {
  HELP_GROUPS_CHARTER_INTRO,
  HELP_GROUPS_CHARTER_TITLE,
} from '../help-groups.charter';
import {
  StyledHelpGroupCharter,
  StyledHelpGroupCharterBody,
  StyledHelpGroupCharterDetails,
  StyledHelpGroupCharterSummary,
  StyledHelpGroupCharterSummaryIcon,
  StyledHelpGroupCharterTitle,
} from './HelpGroupPage.styles';

const formatCharterToggleLabel = (isOpen: boolean) =>
  isOpen ? 'Masquer' : 'Afficher';

interface HelpGroupCharterProps {
  // Mobile: collapsed under the description, expandable in full
  collapsible?: boolean;
}

/**
 * The frame common to every group (the messaging charter summary), readable in full by anyone, member or not.
 */
export function HelpGroupCharter({
  collapsible = false,
}: HelpGroupCharterProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (collapsible) {
    return (
      <StyledHelpGroupCharterDetails
        data-testid="help-group-charter"
        onToggle={(event) => setIsOpen(event.currentTarget.open)}
      >
        <StyledHelpGroupCharterSummary>
          <StyledHelpGroupCharterSummaryIcon>
            <LucidIcon name="ShieldCheck" size={18} />
          </StyledHelpGroupCharterSummaryIcon>
          <Text weight="semibold">{HELP_GROUPS_CHARTER_TITLE}</Text>
          <Text size="small" color="darkGray">
            {formatCharterToggleLabel(isOpen)}
          </Text>
        </StyledHelpGroupCharterSummary>
        <StyledHelpGroupCharterBody>
          <Text color="darkGray">{HELP_GROUPS_CHARTER_INTRO}</Text>
          <EthicsCharterSummaries />
        </StyledHelpGroupCharterBody>
      </StyledHelpGroupCharterDetails>
    );
  }

  return (
    <StyledHelpGroupCharter
      id="cadre"
      aria-label={HELP_GROUPS_CHARTER_TITLE}
      data-testid="help-group-charter"
    >
      <StyledHelpGroupCharterTitle>
        <LucidIcon name="ShieldCheck" size={20} />
        <H5
          title={HELP_GROUPS_CHARTER_TITLE}
          weight="semibold"
          noMarginBottom
        />
      </StyledHelpGroupCharterTitle>
      <Text size="small" color="darkGray">
        {HELP_GROUPS_CHARTER_INTRO}
      </Text>
      <EthicsCharterSummaries />
    </StyledHelpGroupCharter>
  );
}
