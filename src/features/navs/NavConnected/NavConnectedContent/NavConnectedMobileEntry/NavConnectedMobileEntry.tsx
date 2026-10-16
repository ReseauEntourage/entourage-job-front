import React from 'react';
import { COLORS } from '@/src/constants/styles';
import { gaEvent } from '@/src/lib/gtag';
import { NavConnectedMainItem, NotifBadges } from '../../NavConnected.types';
import {
  StyledMobileEntryBadge,
  StyledMobileEntryButton,
  StyledMobileEntryContent,
  StyledMobileEntryLink,
} from './NavConnectedMobileEntry.styles';

interface NavConnectedMobileEntryProps {
  item: NavConnectedMainItem;
  badges: NotifBadges;
  /** The entry is the current page: it gets the filled pill */
  isSelected?: boolean;
  /** The entry sits inside a folded group */
  isChild?: boolean;
  /** Called after the entry was chosen, to close the menu */
  onNavigate: () => void;
}

/**
 * One entry of the mobile menu card: a real link when it leads to a page, a
 * button when it only runs an action (logout).
 */
export const NavConnectedMobileEntry = ({
  item,
  badges,
  isSelected = false,
  isChild = false,
  onNavigate,
}: NavConnectedMobileEntryProps) => {
  const { href, name, icon, badge, tag, queryParams, external, onClick } = item;
  const count = badge ? badges[badge] : 0;

  const content = (
    <>
      <StyledMobileEntryContent>
        {icon}
        {name}
      </StyledMobileEntryContent>
      {count > 0 && <StyledMobileEntryBadge>{count}</StyledMobileEntryBadge>}
    </>
  );

  const handleChoose = () => {
    if (tag) {
      gaEvent(tag);
    }
    if (onClick) {
      onClick();
    }
    onNavigate();
  };

  return (
    <li>
      {href ? (
        <StyledMobileEntryLink
          href={href + (queryParams || '')}
          isExternal={external}
          target={external ? '_blank' : undefined}
          onClick={handleChoose}
          $selected={isSelected}
          $isChild={isChild}
        >
          {content}
        </StyledMobileEntryLink>
      ) : (
        <StyledMobileEntryButton
          type="button"
          onClick={handleChoose}
          $selected={isSelected}
          $isChild={isChild}
          $color={item.color ? COLORS[item.color] : undefined}
        >
          {content}
        </StyledMobileEntryButton>
      )}
    </li>
  );
};
