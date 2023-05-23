import { useRouter } from 'next/router';
import React, { useContext, useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { StyledHeaderDesktop } from 'src/components/headers/Header.styles';
import {
  HeaderConnectedMainItemType,
  HeaderConnectedMainItemDefaultProps,
} from 'src/components/headers/HeaderConnected/HeaderConnected.shapes';
import { StyledConnectedItem } from 'src/components/headers/HeaderConnected/HeaderConnectedContent/HeaderConnectedContent.styles';
import ImgProfile from 'src/components/headers/HeaderConnected/HeaderConnectedContent/ImgProfile';
import SubMenu from 'src/components/headers/HeaderConnected/HeaderConnectedContent/SubMenu';
import { Navbar, SimpleLink } from 'src/components/utils';
import Dropdown from 'src/components/utils/Dropdown';
import { IconNoSSR } from 'src/components/utils/Icon';
import Nav from 'src/components/utils/Navbar/Nav';
import { StyledNav } from 'src/components/utils/Navbar/Nav/Nav.styles';
import NavbarLogo from 'src/components/utils/Navbar/NavbarLogo';
import {
  CANDIDATE_USER_ROLES,
  COACH_USER_ROLES,
  USER_ROLES,
} from 'src/constants/users';
import { gaEvent } from 'src/lib/gtag';
import { UserContext } from 'src/store/UserProvider';
import { isRoleIncluded } from 'src/utils/Finding';

const uuidValue = uuid();

interface HeaderConnectedContentDesktopType {
  links?: {
    admin: HeaderConnectedMainItemType[];
    dropdown: HeaderConnectedMainItemType[];
    candidat: HeaderConnectedMainItemType[];
    coach: HeaderConnectedMainItemType[];
    coach_externe: HeaderConnectedMainItemType[];
  };
  badges?: {
    offers: number;
    note: number;
    cv: number;
    members: number;
  };
  isEmpty?: boolean;
}

const HeaderConnectedContentDesktop = ({
  badges,
  links,
  isEmpty,
}: HeaderConnectedContentDesktopType) => {
  const { user } = useContext(UserContext);

  const { push, asPath } = useRouter();

  const [logoLink, setLogoLink] = useState<HeaderConnectedMainItemType>({
    href: '/',
  });

  const [actualLinks, setActualLinks] = useState<
    HeaderConnectedMainItemType[] | []
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
        <ImgProfile />
        <span className="uk-margin-small-left">Bonjour {user.firstName}</span>
        <IconNoSSR name="triangle-down" />
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
                            <IconNoSSR name={icon} />
                          </span>
                          <span className="name-span">{name}</span>
                          {badges[badge] > 0 && (
                            <div>
                              &nbsp;
                              <div className="uk-badge uk-margin-small-left">
                                {badges[badge]}
                              </div>
                            </div>
                          )}
                        </SimpleLink>
                        {subMenu?.length > 0 && (
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

HeaderConnectedContentDesktop.defaultProps = {
  links: {
    admin: HeaderConnectedMainItemDefaultProps,
    dropdown: HeaderConnectedMainItemDefaultProps,
    candidat: HeaderConnectedMainItemDefaultProps,
    coach: HeaderConnectedMainItemDefaultProps,
  },
  badges: null,
  isEmpty: false,
};

export default HeaderConnectedContentDesktop;
