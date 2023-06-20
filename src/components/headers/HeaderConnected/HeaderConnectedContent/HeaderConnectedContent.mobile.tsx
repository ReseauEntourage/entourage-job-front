import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { v4 as uuid } from 'uuid';
import { StyledHeaderMobile } from '../../Header.styles';
import {
  HeaderConnectedMainItemProps,
  HeaderConnectedMainItemDefaultProps,
} from 'src/components/headers/HeaderConnected/HeaderConnected.shapes';
import { StyledConnectedItemMobile } from 'src/components/headers/HeaderConnected/HeaderConnectedContent/HeaderConnectedContent.styles';
import { SubMenu } from './SubMenu';
import {
  Navbar,
  SimpleLink,
  Hamburger,
  NavbarLogo,
  IconNoSSR,
} from 'src/components/utils';
import { OffcanvasNoSSR } from 'src/components/utils/Offcanvas';
import { OFFCANVAS_LOGGED } from 'src/constants/utils';
import { gaEvent } from 'src/lib/gtag';
import { UserContext } from 'src/store/UserProvider';

const uuidValue = uuid();

interface HeaderConnectedContentMobileProps {
  links?: {
    admin: HeaderConnectedMainItemProps[];
    dropdown: HeaderConnectedMainItemProps[];
    candidat: HeaderConnectedMainItemProps[];
    coach: HeaderConnectedMainItemProps[];
    coach_externe: HeaderConnectedMainItemProps[];
  };
  badges?: {
    offers: number;
    note: number;
    cv: number;
    members: number;
  };
  isEmpty?: boolean;
}

const HeaderConnectedContentMobile = ({
  badges,
  links,
  isEmpty,
}: HeaderConnectedContentMobileProps) => {
  const { user } = useContext(UserContext);

  const { push, asPath } = useRouter();
  const logoLink = links[user?.role?.replace(' ', '_').toLowerCase()][0];

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
          {!isEmpty &&
            links[user?.role?.replace(' ', '_').toLowerCase()]
              .filter(({ href }) => {
                return href !== '#';
              })
              .map(
                (
                  { href, icon, name, badge, tag, subMenu, queryParams },
                  index
                ) => {
                  const isActiveOrChildActive =
                    asPath.includes(href) ||
                    (subMenu &&
                      subMenu.some(({ href: subMenuHref }) => {
                        return asPath.includes(subMenuHref);
                      }));
                  return (
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
                          if (href) {
                            push(href + (queryParams || ''));
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
                  );
                }
              )}
          <hr style={{ opacity: '.5' }} />
          {links.dropdown.map(({ href, icon, name, onClick, tag }, index) => {
            return (
              <StyledConnectedItemMobile key={`${index}-children-${uuidValue}`}>
                <a
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

HeaderConnectedContentMobile.defaultProps = {
  links: {
    admin: HeaderConnectedMainItemDefaultProps,
    dropdown: HeaderConnectedMainItemDefaultProps,
    candidat: HeaderConnectedMainItemDefaultProps,
    coach: HeaderConnectedMainItemDefaultProps,
    coach_externe: HeaderConnectedMainItemDefaultProps,
  },
  badges: null,
  isEmpty: false,
};

export default HeaderConnectedContentMobile;
