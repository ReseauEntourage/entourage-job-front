import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavbarLogo } from '@/src/components/ui';
import { Button } from '@/src/components/ui/Button';
import { Hamburger } from '@/src/components/ui/Hamburger';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { COLORS } from '@/src/constants/styles';
import { FB_TAGS, GA_TAGS } from '@/src/constants/tags';
import { fbEvent } from '@/src/lib/fb';
import { gaEvent } from '@/src/lib/gtag';
import {
  StyledMobileMenuActions,
  StyledMobileMenuDivider,
  StyledMobileMenuList,
  StyledMobileMenuPanel,
} from './NavPublic.mobile.styles';
import { StyledPublicNavCard } from './NavPublic.styles';
import { LINKS } from './NavPublic.utils';
import { NavPublicItem } from './NavPublicItem/NavPublicItem';
import { StyledNavPublicItemMobileLinkContainer } from './NavPublicItem/NavPublicItem.styles';

export const NavPublicMobile = () => {
  const items = LINKS;

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
              <StyledNavPublicItemMobileLinkContainer selected={false}>
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
            <Button
              href="/login"
              variant="secondary"
              rounded
              onClick={() => {
                gaEvent(GA_TAGS.HEADER_CONNEXION_CLIC);
                closeMenu();
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
                closeMenu();
              }}
            >
              Inscription
            </Button>
            <Button
              href={process.env.NEXT_PUBLIC_DONATION_LINK}
              isExternal
              newTab
              onClick={() => {
                gaEvent(GA_TAGS.HEADER_DON_CLIC);
                fbEvent(FB_TAGS.DONATION);
                closeMenu();
              }}
              variant="secondary"
            >
              Faire un don
              <LucidIcon name="ChevronRight" />
            </Button>
          </StyledMobileMenuActions>
        </StyledMobileMenuPanel>
      )}
    </>
  );
};
