import UIkit from 'uikit';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Navbar, SimpleLink } from 'src/components/utils';
import { v4 as uuid } from 'uuid';
import { IconNoSSR } from 'src/components/utils/Icon';
import Hamburger from 'src/components/utils/Hamburger';
import { OffcanvasNoSSR } from 'src/components/utils/Offcanvas';
import { OFFCANVAS_LOGGED } from 'src/constants/utils';
import { gaEvent } from 'src/lib/gtag';
import { StyledConnectedItemMobile } from 'src/components/headers/HeaderConnected/HeaderConnectedContent/HeaderConnectedContent.styles';
import SubMenu from 'src/components/headers/HeaderConnected/HeaderConnectedContent/SubMenu';
import { UserContext } from 'src/store/UserProvider';
import { useRouter } from 'next/router';
import NavbarLogo from 'src/components/utils/Navbar/NavbarLogo';
import { HeaderConnectedItemShape } from '../HeaderConnected.shapes';
import { StyledHeaderMobile } from '../../Header.styles';

const uuidValue = uuid();

const HeaderConnectedContentMobile = ({ badges, links }) => {
  const { user } = useContext(UserContext);

  const { push, asPath } = useRouter();
  const logoLink = links[user?.role?.toLowerCase()][0];

  return (
    <StyledHeaderMobile id="header">
      <Navbar
        backgroundColor="black"
        sticky
        left={
          <NavbarLogo
            href={logoLink.href + (logoLink.queryParams || '')}
            src="/static/img/linkedout_logo_white.png"
            alt="Linkedout"
          />
        }
        right={
          <div className="uk-padding-small uk-flex uk-flex-middle">
            <Hamburger targetId={OFFCANVAS_LOGGED} hidden="m" light={false} />
          </div>
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
          {links[user?.role?.toLowerCase()]
            .filter(({ href }) => {
              return href !== '#';
            })
            .map(({ href, icon, name, badge, tag, subMenu }, index) => {
              const isActiveOrChildActive =
                asPath.includes(href) ||
                (subMenu &&
                  subMenu.some(({ href: subMenuHref }) => {
                    return asPath.includes(subMenuHref);
                  }));
              return (
                <>
                  <StyledConnectedItemMobile
                    key={`${index}-items-${uuidValue}`}
                    className={`${subMenu ? 'hasSubMenu ' : ''} ${
                      isActiveOrChildActive ? 'active' : ''
                    }`}
                  >
                    <a
                      aria-hidden="true"
                      onClick={() => {
                        if (tag) gaEvent(tag);
                        UIkit.offcanvas(`#${OFFCANVAS_LOGGED}`).hide();
                        push(href);
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
          {links.dropdown.map(({ href, icon, name, onClick, tag }, index) => {
            return (
              <StyledConnectedItemMobile key={`${index}-children-${uuidValue}`}>
                <a
                  aria-hidden="true"
                  onClick={() => {
                    if (tag) gaEvent(tag);
                    UIkit.offcanvas(`#${OFFCANVAS_LOGGED}`).hide();
                    if (href) {
                      push(href);
                    }
                    if (onClick) {
                      onClick();
                    }
                  }}
                >
                  <span>
                    <IconNoSSR name={icon} className="uk-margin-small-right" />
                    {name}
                  </span>
                </a>
              </StyledConnectedItemMobile>
            );
          })}
        </ul>
      </OffcanvasNoSSR>
    </StyledHeaderMobile>
  );
};

HeaderConnectedContentMobile.propTypes = {
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

HeaderConnectedContentMobile.defaultProps = {
  badges: {
    offers: 0,
    note: 0,
    cv: 0,
    members: 0,
  },
};

export default HeaderConnectedContentMobile;
