import { useRouter } from 'next/router';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { HeaderConnectedMainItemDefaultProps } from '../HeaderConnected.types';
import {
  StyledHeaderDesktop,
  StyledMessagingIconContainer,
} from 'src/components/headers/Header.styles';
import {
  ButtonIcon,
  Nav,
  Navbar,
  NavbarLogo,
  SimpleLink,
} from 'src/components/utils';
import { Dropdown } from 'src/components/utils/Dropdown/Dropdown';
import { DropdownToggle } from 'src/components/utils/Dropdown/DropdownToggle';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { ImgProfile } from 'src/components/utils/ImgProfile';
import { StyledNav } from 'src/components/utils/Navbar/Nav/Nav.styles';
import { Tag } from 'src/components/utils/Tag';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { gaEvent } from 'src/lib/gtag';
import { StyledConnectedItem } from './HeaderConnectedContent.styles';
import { HeaderConnectedContentProps } from './HeaderConnectedContent.types';
import { SubMenu } from './SubMenu';

const uuidValue = uuid();

export const HeaderConnectedContentDesktop = ({
  badges,
  links = {
    [UserRoles.ADMIN]: [HeaderConnectedMainItemDefaultProps],
    [UserRoles.CANDIDATE]: [HeaderConnectedMainItemDefaultProps],
    [UserRoles.COACH]: [HeaderConnectedMainItemDefaultProps],
    [UserRoles.REFERER]: [HeaderConnectedMainItemDefaultProps],
  },
  dropdown = [HeaderConnectedMainItemDefaultProps],
  messaging = HeaderConnectedMainItemDefaultProps,
}: HeaderConnectedContentProps) => {
  const user = useAuthenticatedUser();

  const { push, asPath } = useRouter();
  const logoLink = links[user?.role][0];

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
            <ImgProfile
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
                  if (tag) gaEvent(tag);
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
    <StyledHeaderDesktop id="header">
      <Navbar
        backgroundColor="white"
        sticky
        left={
          <>
            <NavbarLogo
              href={logoLink.href + (logoLink.queryParams || '')}
              type="primary"
            />
            <StyledNav
              className="uk-navbar-nav"
              style={{ borderLeft: '1px solid lightGray' }}
            >
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
                  if (disabled) return;
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
                          if (tag) gaEvent(tag);
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
      />
    </StyledHeaderDesktop>
  );
};
