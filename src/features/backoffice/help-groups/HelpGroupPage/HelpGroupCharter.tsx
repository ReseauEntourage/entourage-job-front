import React from 'react';
import { Text } from '@/src/components/ui';
import { H5 } from '@/src/components/ui/Headings';
import {
  HELP_GROUPS_CHARTER_INTRO,
  HELP_GROUPS_CHARTER_RULES,
  HELP_GROUPS_CHARTER_TITLE,
} from '../help-groups.charter';
import {
  StyledHelpGroupCharter,
  StyledHelpGroupCharterRules,
} from './HelpGroupPage.styles';

/**
 * The frame common to every group, readable in full by anyone, member or not.
 */
export function HelpGroupCharter() {
  return (
    <StyledHelpGroupCharter
      aria-label={HELP_GROUPS_CHARTER_TITLE}
      data-testid="help-group-charter"
    >
      <H5 title={HELP_GROUPS_CHARTER_TITLE} noMarginBottom />
      <Text>{HELP_GROUPS_CHARTER_INTRO}</Text>
      <StyledHelpGroupCharterRules>
        {HELP_GROUPS_CHARTER_RULES.map((rule) => (
          <li key={rule}>
            <Text>{rule}</Text>
          </li>
        ))}
      </StyledHelpGroupCharterRules>
    </StyledHelpGroupCharter>
  );
}
