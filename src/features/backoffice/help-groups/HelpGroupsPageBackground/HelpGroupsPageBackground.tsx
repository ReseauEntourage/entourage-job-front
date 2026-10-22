import React from 'react';
import { StyledHelpGroupsPageBackground } from './HelpGroupsPageBackground.styles';

/**
 * Page background of the help groups pages (list, group, discussion): the
 * white cards stand out on a light grey, as in the validated design.
 */
export function HelpGroupsPageBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StyledHelpGroupsPageBackground data-testid="help-groups-page-background">
      {children}
    </StyledHelpGroupsPageBackground>
  );
}
