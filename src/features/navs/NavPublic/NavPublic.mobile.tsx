import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavbarLogo } from '@/src/components/ui';
import { Hamburger } from '@/src/components/ui/Hamburger';
import { HEIGHTS } from '@/src/constants/styles';
import {
  MOBILE_MENU_GAP,
  StyledMobileMenuDivider,
  StyledMobileMenuList,
  StyledMobileMenuPanel,
} from '../NavMobileMenu';
import { StyledMobileMenuActions } from './NavPublic.mobile.styles';
import { StyledPublicNavCard } from './NavPublic.styles';
import { LINKS } from './NavPublic.utils';
import { NavPublicAuthActions } from './NavPublicAuthActions';
import { NavPublicItem } from './NavPublicItem/NavPublicItem';
import { StyledNavPublicItemMobileLinkContainer } from './NavPublicItem/NavPublicItem.styles';

// Under the floating card: its offset from the top, its height, then the gap
const PANEL_TOP =
  HEIGHTS.PUBLIC_NAV_OFFSET_TOP_MOBILE +
  HEIGHTS.PUBLIC_NAV_CARD_MOBILE +
  MOBILE_MENU_GAP;

export const NavPublicMobile = () => {
  const items = LINKS;
  const { asPath } = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, closeMenu]);

  return (
    <>
      <StyledPublicNavCard id="nav">
        <NavbarLogo href="/" type="primary" width={108} height={36} />
        <Hamburger
          color="extraDarkGray"
          isOpen={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        />
      </StyledPublicNavCard>
      {isOpen && (
        <StyledMobileMenuPanel ref={panelRef} $top={PANEL_TOP}>
          <StyledMobileMenuList>
            <li>
              <StyledNavPublicItemMobileLinkContainer selected={asPath === '/'}>
                <Link href="/" onClick={closeMenu}>
                  Accueil
                </Link>
              </StyledNavPublicItemMobileLinkContainer>
            </li>
            {items.map((item) => (
              <NavPublicItem item={item} key={item.name} onClick={closeMenu} />
            ))}
          </StyledMobileMenuList>

          <StyledMobileMenuDivider />

          <StyledMobileMenuActions>
            <NavPublicAuthActions onNavigate={closeMenu} />
          </StyledMobileMenuActions>
        </StyledMobileMenuPanel>
      )}
    </>
  );
};
