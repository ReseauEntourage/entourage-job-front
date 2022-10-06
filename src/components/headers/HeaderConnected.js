import UIkit from 'uikit';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Navbar, Nav, NavbarLogo, SimpleLink } from 'src/components/utils';
import uuid from 'uuid/v4';

import { UserContext } from 'src/components/store/UserProvider';
import ImgProfile from 'src/components/headers/ImgProfile';
import Dropdown from 'src/components/utils/Dropdown';
import { useNotifBadges } from 'src/hooks';
import { IconNoSSR } from 'src/components/utils/Icon';
import Hamburger from 'src/components/utils/Hamburger';
import { OffcanvasNoSSR } from 'src/components/utils/Offcanvas';
import { getCandidateIdFromCoachOrCandidate } from 'src/utils';
import { OFFCANVAS_LOGGED } from 'src/constants/utils';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { StyledConnectedItem, StyledConnectedItemMobile } from './styles';
import SubMenu from './SubMenu';

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
        badge: '',
        tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_MEMBERS_CLIC,
        subMenu: [
          {
            href: '/backoffice/admin/membres?role=Candidat',
            name: 'Les candidats',
            icon: 'users',
            badge: 'members',
            tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_CANDIDATS_CLIC,
          },
          {
            href: '/backoffice/admin/membres?role=Coach',
            name: 'Les coachs',
            icon: 'users',
            badge: '',
            tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_COACHS_CLIC,
          },
        ],
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
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_OFFRES_CLIC,
      },
      {
        href: '/backoffice/candidat/suivi',
        name: 'Mon suivi',
        icon: 'file-text',
        badge: 'note',
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_SUIVI_CLIC,
      },
      {
        href: '/backoffice/candidat/cv',
        name: 'Mon CV',
        icon: 'user',
        badge: 'cv',
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_CV_CLIC,
      },
    ],
    coach: [
      {
        href: '/backoffice/candidat/offres',
        name: 'Offres',
        icon: 'list',
        badge: 'offers',
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_OFFRES_CLIC,
      },
      {
        href: '/backoffice/candidat/suivi',
        name: 'Suivi',
        icon: 'file-text',
        badge: 'note',
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_SUIVI_CLIC,
      },
      {
        href: '/backoffice/candidat/cv',
        name: 'CV',
        icon: 'user',
        badge: 'cv',
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_CV_CLIC,
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
        {LINKS_CONNECTED.dropdown.map(({ href, name, onClick, tag }, index) => {
          return (
            <a
              key={`${index}-${uuid}`}
              aria-hidden="true"
              onClick={() => {
                if (tag) gaEvent(tag);
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
                (
                  { href, badge, icon, name, external, tag, subMenu },
                  index
                ) => {
                  return (
                    <StyledConnectedItem
                      key={`${index}-${uuid}`}
                      className={`${subMenu ? 'hasSubMenu ' : ''} ${
                        router.asPath.includes(href) ? 'active' : ''
                      }`}
                    >
                      <SimpleLink
                        href={href}
                        onClick={() => {
                          if (tag) gaEvent(tag);
                        }}
                        isExternal={external}
                        target={external ? '_blank' : '_self'}
                        className="uk-visible@m uk-flex uk-flex-middle"
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
            </ul>
          </>
        }
        right={
          <>
            <div className="uk-visible@m">
              <Nav navbar items={rightItems} />
            </div>
            <div className="uk-hidden@m uk-padding-small uk-flex uk-flex-middle">
              <Hamburger targetId={OFFCANVAS_LOGGED} hidden="m" light />
            </div>
          </>
        }
      />
      <OffcanvasNoSSR id={OFFCANVAS_LOGGED}>
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
            .map(({ href, icon, name, badge, tag, subMenu }, index) => {
              return (
                <>
                  <StyledConnectedItemMobile
                    key={`${index}-${uuid}`}
                    className={`${subMenu ? 'hasSubMenu ' : ''} ${
                      router.asPath.includes(href) ? 'active' : ''
                    }`}
                  >
                    <a
                      aria-hidden="true"
                      onClick={() => {
                        if (tag) gaEvent(tag);
                        UIkit.offcanvas(`#${OFFCANVAS_LOGGED}`).hide();
                        router.push(href);
                      }}
                    >
                      <span>
                        <IconNoSSR
                          name={icon}
                          className="uk-margin-small-right"
                        />
                        {name}
                      </span>
                    </a>
                    {badges[badge] > 0 && (
                      <div>
                        &nbsp;
                        <div className="uk-badge">{badges[badge]}</div>
                      </div>
                    )}
                    {subMenu?.length > 0 && (
                      <SubMenu items={subMenu} badges={badges} />
                    )}
                  </StyledConnectedItemMobile>
                </>
              );
            })}
          <hr style={{ opacity: '.5' }} />
          {LINKS_CONNECTED.dropdown.map(
            ({ href, icon, name, onClick, tag }, index) => {
              return (
                <StyledConnectedItemMobile key={`${index}-${uuid}`}>
                  <a
                    aria-hidden="true"
                    onClick={() => {
                      if (tag) gaEvent(tag);
                      UIkit.offcanvas(`#${OFFCANVAS_LOGGED}`).hide();
                      if (href) {
                        router.push(href);
                      }
                      if (onClick) {
                        onClick();
                      }
                    }}
                  >
                    <span>
                      <IconNoSSR
                        name={icon}
                        className="uk-margin-small-right"
                      />
                      {name}
                    </span>
                  </a>
                </StyledConnectedItemMobile>
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
