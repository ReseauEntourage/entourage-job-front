import UIkit from 'uikit';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Navbar, Nav, NavbarLogo, SimpleLink } from 'src/components/utils';

import { UserContext } from 'src/components/store/UserProvider';
import ImgProfile from 'src/components/headers/ImgProfile';
import Dropdown from 'src/components/utils/Dropdown';
import { useNotifBadges } from 'src/hooks';
import { IconNoSSR } from 'src/components/utils/Icon';
import Hamburger from 'src/components/utils/Hamburger';
import { OffcanvasNoSSR } from 'src/components/utils/Offcanvas';
import { getCandidateIdFromCoachOrCandidate } from 'src/utils';

const offcanvasId = 'offcanvas-logged';

const HeaderConnected = ({ isHome }) => {
  const { user, logout } = useContext(UserContext);
  const router = useRouter();

  const badges = useNotifBadges(user, router.asPath);

  const LINKS_CONNECTED = {
    admin: [
      {
        href: '/backoffice/admin/membres',
        name: 'Les membres',
        icon: 'users',
        badge: 'members',
      },
      {
        href: '/backoffice/admin/offres',
        name: 'Les opportunités',
        icon: 'list',
        badge: 'offers',
      },
    ],
    dropdown: [
      {
        href: '/backoffice/parametres',
        icon: 'settings',
        name: 'Paramètres',
      },
      {
        onClick: logout,
        icon: 'sign-out',
        name: 'Se déconnecter',
      },
    ],
    candidat: [
      {
        href: '/backoffice/candidat/offres',
        name: 'Mes offres',
        icon: 'list',
        badge: 'offers',
      },
      {
        href: '/backoffice/candidat/suivi',
        name: 'Mon suivi',
        icon: 'file-text',
        badge: 'note',
      },
      {
        href: '/backoffice/candidat/cv',
        name: 'Mon CV',
        icon: 'user',
        badge: 'cv',
      },
    ],
    coach: [
      {
        href: '/backoffice/candidat/offres',
        name: 'Offres',
        icon: 'list',
        badge: 'offers',
      },
      {
        href: '/backoffice/candidat/suivi',
        name: 'Suivi',
        icon: 'file-text',
        badge: 'note',
      },
      {
        href: '/backoffice/candidat/cv',
        name: 'CV',
        icon: 'user',
        badge: 'cv',
      },
      {
        href: `${
          process.env.TOOLBOX_URL
        }?id=${getCandidateIdFromCoachOrCandidate(user)}`,
        name: 'Boîte à outils',
        icon: 'question',
        external: true,
      },
    ],
  };

  if (!user) return null;

  const rightItems = [
    <li
      className="uk-visible@m uk-flex uk-flex-middle"
      style={{ borderLeft: '1px solid lightgray' }}
    >
      <a
        id="nav-profile"
        className="uk-padding-small uk-padding-remove-vertical"
        style={{
          height: 80,
          fontWeight: 500,
          fontSize: '1rem',
          color: 'black',
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
        {LINKS_CONNECTED.dropdown.map(({ href, name, onClick }, index) => {
          return (
            <a
              key={index}
              aria-hidden="true"
              onClick={() => {
                if (href) {
                  router.push(href);
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
    </li>,
  ];

  return (
    <header id="header">
      <Navbar
        sticky=""
        mode="click"
        className={`uk-background-default uk-navbar-transparent ${
          isHome ? 'ent-home' : 'ent-header-shadow'
        }`}
        left={
          <>
            <NavbarLogo
              href={LINKS_CONNECTED[user.role.toLowerCase()][0].href}
              src="/static/img/linkedout_logo_orange.png"
              alt="Linkedout"
            />
            <ul
              className="uk-navbar-nav"
              style={{ borderLeft: '1px solid lightgray' }}
            >
              {LINKS_CONNECTED[user.role.toLowerCase()].map(
                ({ href, badge, icon, name, external }, index) => {
                  return (
                    <li
                      key={index}
                      style={{ borderRight: '1px solid lightgray' }}
                    >
                      <SimpleLink
                        href={href}
                        isExternal={external}
                        target={external ? '_blank' : '_self'}
                        className="uk-visible@m uk-flex uk-flex-middle"
                      >
                        <span
                          className="uk-margin-small-right"
                          style={{
                            ...(router.asPath.includes(href)
                              ? { color: 'black' }
                              : {}),
                          }}
                        >
                          <IconNoSSR name={icon} />
                        </span>
                        <span
                          style={{
                            textTransform: 'none',
                            fontSize: '1rem',
                            ...(router.asPath.includes(href)
                              ? { color: 'black', fontWeight: 500 }
                              : {}),
                          }}
                        >
                          {name}
                        </span>
                        {badges[badge] > 0 && (
                          <div>
                            &nbsp;
                            <div className="uk-badge uk-margin-small-left">
                              {badges[badge]}
                            </div>
                          </div>
                        )}
                      </SimpleLink>
                    </li>
                  );
                }
              )}
            </ul>
          </>
        }
        right={
          <>
            <div className="uk-visible@m">
              <Nav navbar items={rightItems} />
            </div>
            <div className="uk-hidden@m uk-padding-small uk-flex uk-flex-middle">
              <Hamburger targetId={offcanvasId} hidden="m" light />
            </div>
          </>
        }
      />
      <OffcanvasNoSSR id={offcanvasId}>
        <ul className="uk-nav uk-nav-default uk-margin-medium-top">
          <li>
            <SimpleLink href="/">
              <IconNoSSR name="home" className="uk-margin-small-right" />
              Accueil
            </SimpleLink>
          </li>
          {LINKS_CONNECTED[user.role.toLowerCase()]
            .filter(({ href }) => {
              return href !== '#';
            })
            .map(({ href, icon, name, badge }, index) => {
              return (
                <li key={index}>
                  <a
                    aria-hidden="true"
                    onClick={() => {
                      router.push(href);
                      UIkit.offcanvas(`#${offcanvasId}`).hide();
                    }}
                  >
                    <IconNoSSR name={icon} className="uk-margin-small-right" />
                    {name}
                  </a>
                  {badges[badge] > 0 && (
                    <div>
                      &nbsp;
                      <div className="uk-badge">{badges[badge]}</div>
                    </div>
                  )}
                </li>
              );
            })}
          <li className="uk-nav-header uk-flex uk-flex-middle">
            <ImgProfile />
            <span className="uk-margin-small-left">
              Bonjour {user.firstName}
            </span>
          </li>
          {LINKS_CONNECTED.dropdown.map(
            ({ href, icon, name, onClick }, index) => {
              return (
                <li key={index}>
                  <a
                    aria-hidden="true"
                    onClick={() => {
                      if (href) {
                        router.push(href);
                      }
                      if (onClick) {
                        onClick();
                      }
                      UIkit.offcanvas(`#${offcanvasId}`).hide();
                    }}
                  >
                    <IconNoSSR name={icon} className="uk-margin-small-right" />
                    {name}
                  </a>
                </li>
              );
            }
          )}
        </ul>
      </OffcanvasNoSSR>
    </header>
  );
};

HeaderConnected.propTypes = {
  isHome: PropTypes.bool,
};

HeaderConnected.defaultProps = {
  isHome: false,
};

export default HeaderConnected;
