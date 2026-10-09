import React, { useState } from 'react';
import { LucidIcon, Text } from '@/src/components/ui';
import { H5 } from '@/src/components/ui/Headings';
import {
  HELP_GROUPS_CHARTER_INTRO,
  HELP_GROUPS_CHARTER_RULES,
  HELP_GROUPS_CHARTER_TITLE,
} from '../help-groups.charter';
import {
  StyledHelpGroupCharter,
  StyledHelpGroupCharterCheck,
  StyledHelpGroupCharterDetails,
  StyledHelpGroupCharterRules,
  StyledHelpGroupCharterSummary,
  StyledHelpGroupCharterSummaryIcon,
  StyledHelpGroupCharterTitle,
} from './HelpGroupPage.styles';

const formatCharterToggleLabel = (isOpen: boolean) =>
  `${HELP_GROUPS_CHARTER_RULES.length} règles · ${
    isOpen ? 'Masquer' : 'Afficher'
  }`;

interface HelpGroupCharterProps {
  // Mobile: collapsed under the description, expandable in full
  collapsible?: boolean;
}

/**
 * The frame common to every group, readable in full by anyone, member or not.
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
        <StyledHelpGroupCharterRules>
          {HELP_GROUPS_CHARTER_RULES.map((rule) => (
            <li key={rule}>
              <Text>{rule}</Text>
            </li>
          ))}
        </StyledHelpGroupCharterRules>
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
      <StyledHelpGroupCharterRules>
        {HELP_GROUPS_CHARTER_RULES.map((rule) => (
          <li key={rule}>
            <StyledHelpGroupCharterCheck>
              <LucidIcon name="Check" size={16} stroke="bold" />
            </StyledHelpGroupCharterCheck>
            <Text>{rule}</Text>
          </li>
        ))}
      </StyledHelpGroupCharterRules>
    </StyledHelpGroupCharter>
  );
}
