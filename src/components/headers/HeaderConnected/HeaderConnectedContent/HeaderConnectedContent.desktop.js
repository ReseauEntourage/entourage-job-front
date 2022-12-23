import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Navbar, SimpleLink } from 'src/components/utils';
import uuid from 'uuid/v4';
import ImgProfile from 'src/components/headers/HeaderConnected/HeaderConnectedContent/ImgProfile';
import Dropdown from 'src/components/utils/Dropdown';
import { IconNoSSR } from 'src/components/utils/Icon';
import { gaEvent } from 'src/lib/gtag';
import { StyledConnectedItem } from 'src/components/headers/HeaderConnected/HeaderConnectedContent/HeaderConnectedContent.styles';
import SubMenu from 'src/components/headers/HeaderConnected/HeaderConnectedContent/SubMenu';
import { UserContext } from 'src/components/store/UserProvider';
import { useRouter } from 'next/router';
import Nav from 'src/components/utils/Navbar/Nav';
import NavbarLogo from 'src/components/utils/Navbar/NavbarLogo';
import { StyledNav } from 'src/components/utils/Navbar/Nav/Nav.styles';
import { HeaderConnectedItemShape } from '../HeaderConnected.shapes';
import { StyledHeaderDesktop } from '../../Header.styles';

const HeaderConnectedContentDesktop = ({ badges, links }) => {
  const { user } = useContext(UserContext);

  const { push, asPath } = useRouter();

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
              key={`${index}-${uuid}`}
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

  return (
    <StyledHeaderDesktop id="header">
      <Navbar
        backgroundColor="white"
        sticky
        left={
          <>
            <NavbarLogo
              href={links[user?.role?.toLowerCase()][0].href}
              src="/static/img/linkedout_logo_orange.png"
              alt="Linkedout"
            />
            <StyledNav
              className="uk-navbar-nav"
              style={{ borderLeft: '1px solid lightgray' }}
            >
              {links[user?.role?.toLowerCase()].map(
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
                  },
                  index
                ) => {
                  const isActiveOrChildActive =
                    asPath.includes(href) ||
                    (subMenu &&
                      subMenu.some(({ href: subMenuHref }) => {
                        return asPath.includes(subMenuHref);
                      }));
                  return (
                    <StyledConnectedItem
                      color="black"
                      key={`${index}-${uuid}`}
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

HeaderConnectedContentDesktop.propTypes = {
  links: PropTypes.shape({
    admin: PropTypes.arrayOf(HeaderConnectedItemShape).isRequired,
    dropdown: PropTypes.arrayOf(HeaderConnectedItemShape).isRequired,
    candidat: PropTypes.arrayOf(HeaderConnectedItemShape).isRequired,
    coach: PropTypes.arrayOf(HeaderConnectedItemShape).isRequired,
  }).isRequired,
  badges: PropTypes.shape({
    offers: PropTypes.number,
    note: PropTypes.number,
    cv: PropTypes.number,
    members: PropTypes.number,
  }),
};

HeaderConnectedContentDesktop.defaultProps = {
  badges: {
    offers: 0,
    note: 0,
    cv: 0,
    members: 0,
  },
};

export default HeaderConnectedContentDesktop;
