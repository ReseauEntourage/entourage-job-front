import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavbarLogo } from '@/src/components/ui';
import { Hamburger } from '@/src/components/ui/Hamburger';
import {
  StyledMobileMenuActions,
  StyledMobileMenuDivider,
  StyledMobileMenuList,
  StyledMobileMenuPanel,
} from './NavPublic.mobile.styles';
import { StyledPublicNavCard } from './NavPublic.styles';
import { LINKS } from './NavPublic.utils';
import { NavPublicAuthActions } from './NavPublicAuthActions';
import { NavPublicItem } from './NavPublicItem/NavPublicItem';
import { StyledNavPublicItemMobileLinkContainer } from './NavPublicItem/NavPublicItem.styles';

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
        <StyledMobileMenuPanel ref={panelRef}>
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
