import React from 'react';
import { StyledNavContainerDesktop } from '@/src/components/headers/Header.styles';
import { Nav, Navbar, NavbarLogo } from 'src/components/utils';
import { Button } from 'src/components/utils/Button';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { LINKS } from './NavPublic.utils';
import { NavPublicItem } from './NavPublicItem/NavPublicItem';

export const NavPublicDesktop = () => {
  const items = LINKS;

  const rightItems = [
    ...items.map((item, i) => <NavPublicItem item={item} key={i} />),
    <div>
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
    </div>,
    <div>
      <Button
        href="/inscription"
        variant="primary"
        rounded
        onClick={() => {
          gaEvent(GA_TAGS.HEADER_INSCRIPTION_CLIC);
        }}
      >
        Inscription
      </Button>
    </div>,
  ];
  return (
    <StyledNavContainerDesktop id="nav">
      <Navbar
        backgroundColor="darkerBlack"
        sticky
        left={
          <div className="uk-flex uk-flex-middle">
            <NavbarLogo href="/" type="secondary" />
          </div>
        }
        right={<Nav items={rightItems} color="white" />}
      />
    </StyledNavContainerDesktop>
  );
};
