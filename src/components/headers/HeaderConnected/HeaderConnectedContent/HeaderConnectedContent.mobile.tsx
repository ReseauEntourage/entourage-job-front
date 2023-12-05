import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { v4 as uuid } from 'uuid';
import HomeIcon from 'assets/icons/home.svg';
import { HeaderConnectedMainItemDefaultProps } from '../HeaderConnected.types';
import { StyledHeaderMobile } from 'src/components/headers/Header.styles';
import {
  Navbar,
  SimpleLink,
  Hamburger,
  NavbarLogo,
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
            <Hamburger targetId={OFFCANVAS_LOGGED} />
          </div>
        }
      />
      <Offcanvas id={OFFCANVAS_LOGGED}>
        <ul className="uk-nav uk-nav-default uk-margin-medium-top">
          <li>
            <SimpleLink href="/">
              <HomeIcon width={16} height={16} />
              &nbsp; Accueil
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
                          <span className="uk-margin-small-right">{icon}</span>
                          {name}
                        </span>
                      </a>
                      {
                        // @ts-expect-error after enable TS strict mode. Please, try to fix it
                        badges[badge] > 0 && (
                          <div>
                            &nbsp;
                            <div className="uk-badge">
                              {
                                // @ts-expect-error after enable TS strict mode. Please, try to fix it
                                badges[badge]
                              }
                            </div>
                          </div>
                        )
                      }
                      {subMenu?.length > 0 && (
                        <SubMenu
                          items={subMenu}
                          // @ts-expect-error after enable TS strict mode. Please, try to fix it
                          badges={badges}
                        />
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
                    <span className="uk-margin-small-right">{icon}</span>
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
