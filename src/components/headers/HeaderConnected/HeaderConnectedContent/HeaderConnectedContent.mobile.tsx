import { useRouter } from 'next/router';
import React from 'react';
import { v4 as uuid } from 'uuid';
import HomeIcon from 'assets/icons/home.svg';
import { HeaderConnectedMainItemDefaultProps } from '../HeaderConnected.types';
import { StyledHeaderMobile } from 'src/components/headers/Header.styles';
import {
  Hamburger,
  Navbar,
  NavbarLogo,
  SimpleLink,
} from 'src/components/utils';
import { Offcanvas } from 'src/components/utils/Offcanvas';
import { USER_ROLES } from 'src/constants/users';
import { OFFCANVAS_LOGGED } from 'src/constants/utils';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { gaEvent } from 'src/lib/gtag';
import { StyledConnectedItemMobile } from './HeaderConnectedContent.styles';
import { HeaderConnectedContentProps } from './HeaderConnectedContent.types';
import { SubMenu } from './SubMenu';

const uuidValue = uuid();

export const HeaderConnectedContentMobile = ({
  badges,
  links = {
    [USER_ROLES.ADMIN]: [HeaderConnectedMainItemDefaultProps],
    [USER_ROLES.CANDIDATE]: [HeaderConnectedMainItemDefaultProps],
    [USER_ROLES.CANDIDATE_EXTERNAL]: [HeaderConnectedMainItemDefaultProps],
    [USER_ROLES.COACH]: [HeaderConnectedMainItemDefaultProps],
    [USER_ROLES.COACH_EXTERNAL]: [HeaderConnectedMainItemDefaultProps],
  },
  dropdown = [HeaderConnectedMainItemDefaultProps],
  isEmpty = false,
}: HeaderConnectedContentProps) => {
  const user = useAuthenticatedUser();

  const { push, asPath } = useRouter();
  const logoLink = links[user?.role][0];

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
            links[user?.role]
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
                      {badge && badges[badge] > 0 && (
                        <div>
                          &nbsp;
                          <div className="uk-badge">{badges[badge]}</div>
                        </div>
                      )}
                      {subMenu && subMenu.length > 0 && (
                        <SubMenu items={subMenu} badges={badges} />
                      )}
                    </StyledConnectedItemMobile>
                  );
                }
              )}
          <hr style={{ opacity: '.5' }} />
          {dropdown.map(({ href, icon, name, onClick, tag }, index) => {
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
