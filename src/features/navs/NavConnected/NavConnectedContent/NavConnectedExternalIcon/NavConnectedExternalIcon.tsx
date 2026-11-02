import React from 'react';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import {
  StyledExternalIcon,
  StyledExternalIconGraphic,
  StyledExternalIconHiddenLabel,
} from './NavConnectedExternalIcon.styles';

/**
 * Marks a navigation entry that opens in a new tab. The icon is decorative
 * (hidden from assistive technologies) and a visually hidden label tells
 * screen reader users that the link opens in a new tab.
 */
export const NavConnectedExternalIcon = () => {
  return (
    <StyledExternalIcon data-testid="nav-external-icon">
      <StyledExternalIconGraphic aria-hidden="true">
        <LucidIcon name="ExternalLink" size={14} stroke="thin" />
      </StyledExternalIconGraphic>
      <StyledExternalIconHiddenLabel>
        {"(s'ouvre dans un nouvel onglet)"}
      </StyledExternalIconHiddenLabel>
    </StyledExternalIcon>
  );
};
