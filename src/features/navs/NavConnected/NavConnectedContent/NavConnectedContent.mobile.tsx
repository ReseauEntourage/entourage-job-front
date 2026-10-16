import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ButtonIcon, Navbar, NavbarLogo } from '@/src/components/ui';
import { Hamburger } from '@/src/components/ui/Hamburger';
import { ImgUserProfile } from '@/src/components/ui/Images/ImgProfile';
import { COLORS, HEIGHTS, SHADOWS } from '@/src/constants/styles';
import { UserRoles } from '@/src/constants/users';
import {
  StyledMessagingIconContainer,
  StyledNavContainerMobile,
} from '@/src/features/headers/Header.styles';
import { NotificationsBell } from '@/src/features/notifications-center';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserProfile } from '@/src/hooks/current-user/useCurrentUserProfile';
import {
  MOBILE_MENU_GAP,
  StyledMobileMenuDivider,
  StyledMobileMenuList,
} from '../../NavMobileMenu';
import { NavConnectedMainItemDefaultProps } from '../NavConnected.types';
import { NavConnectedCollapsible } from './NavConnectedCollapsible';
import {
  isNavGroupActive,
  isNavItemActive,
} from './NavConnectedContent.active';
import {
  StyledConnectedMobilePanel,
  StyledMobileAccountName,
  StyledMobileBarActions,
} from './NavConnectedContent.mobile.styles';
import { NavConnectedContentProps } from './NavConnectedContent.types';
import { NavConnectedMobileEntry } from './NavConnectedMobileEntry';
import { StyledMobileEntryBadge } from './NavConnectedMobileEntry/NavConnectedMobileEntry.styles';

// The card drops right under the bar, with a small gap
const PANEL_TOP = HEIGHTS.HEADER_MOBILE + MOBILE_MENU_GAP;

export const NavConnectedContentMobile = ({
  badges,
  messaging,
  links = {
    [UserRoles.ADMIN]: [NavConnectedMainItemDefaultProps],
    [UserRoles.CANDIDATE]: [NavConnectedMainItemDefaultProps],
    [UserRoles.COACH]: [NavConnectedMainItemDefaultProps],
    [UserRoles.REFERER]: [NavConnectedMainItemDefaultProps],
  },
  administration = null,
  dropdown = [NavConnectedMainItemDefaultProps],
}: NavConnectedContentProps) => {
  const user = useAuthenticatedUser();
  const profile = useCurrentUserProfile();
  const { asPath } = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  // Wraps the bar and the card: a press on the hamburger is not "outside"
  const navRef = useRef<HTMLElement>(null);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const handlePointerDown = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeMenu]);

  // Reaching another page, by any link, closes the card
  useEffect(() => {
    closeMenu();
  }, [asPath, closeMenu]);

  // The admin home is the first administration page, no longer in the main nav
  const logoLink = administration?.subMenu?.[0] || links[user?.role][0] || null;
  const entries = links[user.role].filter(({ href }) => href !== '#');
  const menuEntries = administration?.subMenu
    ? [...entries, administration]
    : entries;
  const messagingCount = messaging.badge ? badges[messaging.badge] : 0;

  return (
    <StyledNavContainerMobile id="nav" ref={navRef}>
      <Navbar
        backgroundColor="white"
        sticky
        style={{ boxShadow: SHADOWS.card }}
        left={
          <NavbarLogo
            href={logoLink ? logoLink.href + (logoLink.queryParams || '') : '#'}
            type="primary"
            width={108}
            height={36}
          />
        }
        right={
          <StyledMobileBarActions>
            {/* Notifications: only where the menu is shown (onboarding done) */}
            {links[user.role]?.length > 0 && (
              <NotificationsBell
                variant="mobile"
                color={COLORS.black}
                size="large"
                unseenCount={badges.notifications}
              />
            )}
            {/* Messages */}
            <StyledMessagingIconContainer $compact>
              <ButtonIcon
                icon={messaging.icon}
                href={messaging.href}
                color={COLORS.black}
                variant="text"
                size="large"
                ariaLabel={messaging.name}
              />
              {messagingCount > 0 && (
                <div className="pin-notification">{messagingCount}</div>
              )}
            </StyledMessagingIconContainer>
            <Hamburger
              color="black"
              size="large"
              isOpen={isOpen}
              ariaLabel={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              dataTestId="nav-hamburger"
              onClick={() => setIsOpen((open) => !open)}
            />
          </StyledMobileBarActions>
        }
      />
      {isOpen && (
        <StyledConnectedMobilePanel $top={PANEL_TOP} $gap={12}>
          <StyledMobileMenuList>
            {menuEntries.map((item, index) => {
              const key = `${index}-${item.name}`;
              if (item.subMenu && item.subMenu.length > 0) {
                const count = item.badge ? badges[item.badge] : 0;
                return (
                  <NavConnectedCollapsible
                    key={key}
                    header={item.name}
                    badge={
                      count > 0 ? (
                        <StyledMobileEntryBadge>{count}</StyledMobileEntryBadge>
                      ) : undefined
                    }
                    isActive={isNavGroupActive(asPath, item)}
                  >
                    {item.subMenu.map((subItem, subIndex) => (
                      <NavConnectedMobileEntry
                        key={`${subIndex}-${subItem.name}`}
                        item={subItem}
                        badges={badges}
                        isSelected={isNavItemActive(asPath, subItem)}
                        isChild
                        onNavigate={closeMenu}
                      />
                    ))}
                  </NavConnectedCollapsible>
                );
              }
              return (
                <NavConnectedMobileEntry
                  key={key}
                  item={item}
                  badges={badges}
                  isSelected={isNavItemActive(asPath, item)}
                  onNavigate={closeMenu}
                />
              );
            })}
          </StyledMobileMenuList>

          <StyledMobileMenuDivider $color={COLORS.gray} />

          {/* Account menu: folded, like the groups above */}
          <StyledMobileMenuList>
            <NavConnectedCollapsible
              minHeight={56}
              dataTestId="nav-account"
              header={
                <>
                  <ImgUserProfile
                    user={user}
                    size={36}
                    hasPicture={profile?.hasPicture || false}
                  />
                  <StyledMobileAccountName>
                    {user.firstName} {user.lastName}
                  </StyledMobileAccountName>
                </>
              }
            >
              {dropdown.map((item, index) => (
                <NavConnectedMobileEntry
                  key={`${index}-${item.name}`}
                  item={item}
                  badges={badges}
                  onNavigate={closeMenu}
                />
              ))}
            </NavConnectedCollapsible>
          </StyledMobileMenuList>
        </StyledConnectedMobilePanel>
      )}
    </StyledNavContainerMobile>
  );
};
