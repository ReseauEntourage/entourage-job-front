import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { v4 as uuid } from 'uuid';
import { HeaderConnectedMainItemDefaultProps } from '../HeaderConnected.types';
import { StyledHeaderMobile } from 'src/components/headers/Header.styles';
import {
  Navbar,
  SimpleLink,
  Hamburger,
  NavbarLogo,
  Icon,
} from 'src/components/utils';
import { Offcanvas } from 'src/components/utils/Offcanvas';
import { OFFCANVAS_LOGGED } from 'src/constants/utils';
import { gaEvent } from 'src/lib/gtag';
import { UserContext } from 'src/store/UserProvider';
import { StyledConnectedItemMobile } from './HeaderConnectedContent.styles';
import { HeaderConnectedContentProps } from './HeaderConnectedContent.types';
import { SubMenu } from './SubMenu';

const uuidValue = uuid();

export const HeaderConnectedContentMobile = ({
  badges,
  links = {
    admin: [HeaderConnectedMainItemDefaultProps],
    dropdown: [HeaderConnectedMainItemDefaultProps],
    candidat: [HeaderConnectedMainItemDefaultProps],
    coach: [HeaderConnectedMainItemDefaultProps],
    coach_externe: [HeaderConnectedMainItemDefaultProps],
  },
  isEmpty = false,
}: HeaderConnectedContentProps) => {
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
      <Offcanvas id={OFFCANVAS_LOGGED}>
        <ul className="uk-nav uk-nav-default uk-margin-medium-top">
          <li>
            <SimpleLink href="/">
              <Icon name="home" className="uk-margin-small-right" />
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
                          <Icon name={icon} className="uk-margin-small-right" />
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
                    <Icon name={icon} className="uk-margin-small-right" />
                    {name}
                  </span>
                </a>
              </StyledConnectedItemMobile>
            );
          })}
        </ul>
      </Offcanvas>
    </StyledHeaderMobile>
  );
};
