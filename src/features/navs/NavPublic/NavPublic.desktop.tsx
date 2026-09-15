import React from 'react';
import { NavbarLogo } from '@/src/components/ui';
import {
  StyledPublicNavActionsRow,
  StyledPublicNavCard,
  StyledPublicNavItemsRow,
} from './NavPublic.styles';
import { LINKS } from './NavPublic.utils';
import { NavPublicAuthActions } from './NavPublicAuthActions';
import { NavPublicItem } from './NavPublicItem/NavPublicItem';

export const NavPublicDesktop = () => {
  const items = LINKS;

  return (
    <StyledPublicNavCard id="nav">
      <NavbarLogo href="/" type="primary" />

      <StyledPublicNavActionsRow>
        <StyledPublicNavItemsRow>
          {items.map((item, i) => (
            <li key={i}>
              <NavPublicItem item={item} />
            </li>
          ))}
        </StyledPublicNavItemsRow>
        <NavPublicAuthActions />
      </StyledPublicNavActionsRow>
    </StyledPublicNavCard>
  );
};
