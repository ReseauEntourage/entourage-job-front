import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import CaretDownIcon from 'assets/icons/caret-down.svg';
import {
  HeaderConnectedMainItemProps,
  HeaderConnectedMainItemDefaultProps,
} from '../HeaderConnected.types';
import { StyledHeaderDesktop } from 'src/components/headers/Header.styles';
import {
  Navbar,
  SimpleLink,
  Nav,
  Dropdown,
  NavbarLogo,
} from 'src/components/utils';
import { ImgProfile } from 'src/components/utils/ImgProfile';
import { StyledNav } from 'src/components/utils/Navbar/Nav/Nav.styles';
import {
  CANDIDATE_USER_ROLES,
  COACH_USER_ROLES,
  USER_ROLES,
} from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { gaEvent } from 'src/lib/gtag';
import { isRoleIncluded } from 'src/utils/Finding';
import { StyledConnectedItem } from './HeaderConnectedContent.styles';
import { HeaderConnectedContentProps } from './HeaderConnectedContent.types';
import { SubMenu } from './SubMenu';

const uuidValue = uuid();

export const HeaderConnectedContentDesktop = ({
  badges,
  links = {
    admin: [
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      HeaderConnectedMainItemDefaultProps,
    ],
    dropdown: [
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      HeaderConnectedMainItemDefaultProps,
    ],
    candidat: [
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      HeaderConnectedMainItemDefaultProps,
    ],
    coach: [
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      HeaderConnectedMainItemDefaultProps,
    ],
    coach_externe: [
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      HeaderConnectedMainItemDefaultProps,
    ],
  },
  isEmpty = false,
}: HeaderConnectedContentProps) => {
  const user = useAuthenticatedUser();

  const { push, asPath } = useRouter();

  const [logoLink, setLogoLink] = useState<HeaderConnectedMainItemProps>({
    href: '/',
  });

  const [actualLinks, setActualLinks] = useState<
    HeaderConnectedMainItemProps[] | []
  >([]);

  const rightItems = [
    <div
      className="uk-flex uk-flex-middle"
      style={{ borderLeft: '1px solid lightgray' }}
    >
      <a
        id="nav-profile"
        className="uk-padding-small uk-padding-remove-vertical"
        style={{
          height: 80,
          fontWeight: 500,
          fontSize: '1rem',
          textTransform: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ImgProfile user={user} size={40} />
        <span className="uk-margin-small-left uk-margin-small-right">
          Bonjour {user.firstName}
        </span>
        <CaretDownIcon />
      </a>
      <Dropdown
        dividers={[2]}
        id="dropdown-nav-profile"
        boundaryId="nav-profile"
      >
        {links.dropdown.map(({ href, name, onClick, tag }, index) => {
          return (
            <a
              key={`${index}-right-${uuidValue}`}
              aria-hidden="true"
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
            </a>
          );
        })}
      </Dropdown>
    </div>,
  ];

  useEffect(() => {
    if (user.role) {
      if (isEmpty) {
        setActualLinks([]);
      } else if (isRoleIncluded(CANDIDATE_USER_ROLES, user.role)) {
        setActualLinks(links.candidat);
      } else if (user.role === USER_ROLES.COACH_EXTERNAL) {
        setActualLinks(links.coach_externe);
      } else if (isRoleIncluded(COACH_USER_ROLES, user.role)) {
        setActualLinks(links.coach);
      } else {
        setActualLinks(links.admin);
      }
    }
  }, [
    links.admin,
    links.candidat,
    links.coach_externe,
    links.coach,
    user.role,
    isEmpty,
  ]);

  useEffect(() => {
    setLogoLink(actualLinks?.length > 0 ? actualLinks[0] : { href: '/' });
  }, [actualLinks]);

  return (
    <StyledHeaderDesktop id="header">
      <Navbar
        backgroundColor="white"
        sticky
        left={
          <>
            <NavbarLogo
              href={logoLink?.href + (logoLink.queryParams || '')}
              src="/static/img/linkedout_logo_orange.png"
              alt="Linkedout"
            />
            <StyledNav
              className="uk-navbar-nav"
              style={{ borderLeft: '1px solid lightgray' }}
            >
              {actualLinks?.length > 0 &&
                actualLinks.map(
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
                          <span className="uk-margin-small-right icon-span">
                            {icon}
                          </span>
                          <span className="name-span">{name}</span>
                          {
                            // @ts-expect-error after enable TS strict mode. Please, try to fix it
                            badges[badge] > 0 && (
                              <div>
                                &nbsp;
                                <div className="uk-badge uk-margin-small-left">
                                  {
                                    // @ts-expect-error after enable TS strict mode. Please, try to fix it
                                    badges[badge]
                                  }
                                </div>
                              </div>
                            )
                          }
                        </SimpleLink>
                        {
                          // @ts-expect-error after enable TS strict mode. Please, try to fix it
                          subMenu?.length > 0 && (
                            <SubMenu
                              // @ts-expect-error after enable TS strict mode. Please, try to fix it
                              items={subMenu}
                              // @ts-expect-error after enable TS strict mode. Please, try to fix it
                              badges={badges}
                            />
                          )
                        }
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
