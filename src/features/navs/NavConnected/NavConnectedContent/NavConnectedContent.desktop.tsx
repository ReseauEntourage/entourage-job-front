import { useRouter } from 'next/router';
import React from 'react';
import { v4 as uuid } from 'uuid';
import {
  ButtonIcon,
  Nav,
  Navbar,
  NavbarLogo,
  SimpleLink,
} from '@/src/components/ui';
import { Dropdown } from '@/src/components/ui/Dropdown/Dropdown';
import { DropdownToggle } from '@/src/components/ui/Dropdown/DropdownToggle';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { ImgUserProfile } from '@/src/components/ui/Images/ImgProfile';
import { StyledNav } from '@/src/components/ui/Navbar/Nav/Nav.styles';
import { Tag } from '@/src/components/ui/Tag';
import { COLORS } from '@/src/constants/styles';
import { NavConnectedMainItemDefaultProps } from '../NavConnected.types';
import { UserRoles } from 'src/constants/users';
import {
  StyledMessagingIconContainer,
  StyledNavContainerDesktop,
} from 'src/features/headers/Header.styles';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { gaEvent } from 'src/lib/gtag';
import { StyledConnectedItem } from './NavConnectedContent.styles';
import { NavConnectedContentProps } from './NavConnectedContent.types';
import { SubMenu } from './SubMenu';

const uuidValue = uuid();

export const NavConnectedContentDesktop = ({
  badges,
  links = {
    [UserRoles.ADMIN]: [NavConnectedMainItemDefaultProps],
    [UserRoles.CANDIDATE]: [NavConnectedMainItemDefaultProps],
    [UserRoles.COACH]: [NavConnectedMainItemDefaultProps],
    [UserRoles.REFERER]: [NavConnectedMainItemDefaultProps],
  },
  dropdown = [NavConnectedMainItemDefaultProps],
  messaging = NavConnectedMainItemDefaultProps,
}: NavConnectedContentProps) => {
  const user = useAuthenticatedUser();

  const { push, asPath } = useRouter();
  const logoLink = links[user?.role][0] || null;

  const rightItems = [
    <div className="uk-flex uk-flex-middle">
      {/* Messages */}
      <StyledMessagingIconContainer>
        <ButtonIcon icon={messaging.icon} href={messaging.href} />
        {messaging.badge && badges[messaging.badge] > 0 && (
          <div className="pin-notification" />
        )}
      </StyledMessagingIconContainer>

      {/* Profile */}
      <Dropdown>
        <DropdownToggle>
          <a
            id="nav-profile"
            className="uk-padding-small uk-padding-remove-vertical"
            style={{
              height: 80,
              fontSize: '1rem',
              textTransform: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ImgUserProfile
              user={user}
              size={40}
              hasPicture={user.userProfile?.hasPicture || false}
            />
            <span className="uk-margin-small-left uk-margin-small-right">
              Bonjour {user.firstName}
            </span>
            <LucidIcon name="ChevronDown" />
          </a>
        </DropdownToggle>
        <Dropdown.Menu openDirection="left">
          {dropdown.map(({ href, name, onClick, tag }, index) => {
            return (
              <Dropdown.Item
                key={`${index}-right-${uuidValue}`}
                onClick={() => {
                  if (tag) {
                    gaEvent(tag);
                  }
                  if (href) {
                    push(href);
                  }
                  if (onClick) {
                    onClick();
                  }
                }}
              >
                {name}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </div>,
  ];

  return (
    <StyledNavContainerDesktop id="nav">
      <Navbar
        backgroundColor="white"
        sticky
        left={
          <>
            <NavbarLogo
              href={
                logoLink ? logoLink.href + (logoLink.queryParams || '') : '#'
              }
              type="primary"
            />
            <StyledNav className="uk-navbar-nav">
              {links[user.role].map(
                (
                  {
                    href,
                    badge,
                    icon,
                    name,
                    external,
                    tag,
                    subMenu,
                    queryParams,
                    disabled,
                  },
                  index
                ) => {
                  if (disabled) {
                    return;
                  }
                  const isActiveOrChildActive =
                    asPath.includes(href) ||
                    (subMenu &&
                      subMenu.some(({ href: subMenuHref }) => {
                        return asPath.includes(subMenuHref);
                      }));
                  return (
                    <StyledConnectedItem
                      color="black"
                      key={`${index}-left-${uuidValue}`}
                      className={`${subMenu ? 'hasSubMenu ' : ''} ${
                        isActiveOrChildActive ? 'active' : ''
                      }`}
                    >
                      <SimpleLink
                        href={href + (queryParams || '')}
                        onClick={() => {
                          if (tag) {
                            gaEvent(tag);
                          }
                        }}
                        isExternal={external}
                        target={external ? '_blank' : '_self'}
                        className="uk-flex uk-flex-middle menu-link"
                      >
                        {icon && (
                          <span className="uk-margin-small-right icon-span">
                            {icon}
                          </span>
                        )}
                        <span className="name-span">{name}</span>
                        {badge && badges[badge] > 0 && (
                          <div>
                            &nbsp;
                            <Tag
                              size="small"
                              style="secondary"
                              content={badges[badge]}
                            />
                          </div>
                        )}
                      </SimpleLink>
                      {subMenu && subMenu.length > 0 && (
                        <SubMenu items={subMenu} badges={badges} />
                      )}
                    </StyledConnectedItem>
                  );
                }
              )}
            </StyledNav>
          </>
        }
        right={<Nav items={rightItems} color="black" />}
        style={{ borderBottom: `1px solid ${COLORS.gray}` }}
      />
    </StyledNavContainerDesktop>
  );
};
