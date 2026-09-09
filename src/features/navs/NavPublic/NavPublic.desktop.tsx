import React from 'react';
import { NavbarLogo } from '@/src/components/ui';
import { Button } from '@/src/components/ui/Button';
import { COLORS } from '@/src/constants/styles';
import { GA_TAGS } from '@/src/constants/tags';
import { gaEvent } from '@/src/lib/gtag';
import {
  StyledPublicNavActionsRow,
  StyledPublicNavCard,
  StyledPublicNavItemsRow,
} from './NavPublic.styles';
import { LINKS } from './NavPublic.utils';
import { NavPublicItem } from './NavPublicItem/NavPublicItem';

export const NavPublicDesktop = () => {
  const items = LINKS;

  return (
    <StyledPublicNavCard id="nav">
      <NavbarLogo href="/" type="primary" />
      <StyledPublicNavItemsRow>
        {items.map((item, i) => (
          <li key={i}>
            <NavPublicItem item={item} />
          </li>
        ))}
      </StyledPublicNavItemsRow>
      <StyledPublicNavActionsRow>
        <Button
          href="/login"
          variant="secondary"
          rounded
          onClick={() => {
            gaEvent(GA_TAGS.HEADER_CONNEXION_CLIC);
          }}
        >
          Connexion
        </Button>
        <Button
          href="/wizard"
          variant="primary"
          rounded
          style={{
            backgroundColor: COLORS.darkTeal,
            borderColor: COLORS.darkTeal,
          }}
          onClick={() => {
            gaEvent(GA_TAGS.HEADER_INSCRIPTION_CLIC);
          }}
        >
          Inscription
        </Button>
      </StyledPublicNavActionsRow>
    </StyledPublicNavCard>
  );
};
