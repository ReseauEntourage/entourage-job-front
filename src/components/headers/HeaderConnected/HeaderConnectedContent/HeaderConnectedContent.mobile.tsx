import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { v4 as uuid } from 'uuid';
import {
  Offcanvas,
  OffcanvasRef,
} from '@/src/components/utils/OffCanvas/Offcanvas';
import { HeaderConnectedMainItemDefaultProps } from '../HeaderConnected.types';
import {
  StyledHeaderMobile,
  StyledMessagingIconContainer,
} from 'src/components/headers/Header.styles';
import {
  ButtonIcon,
  Navbar,
  NavbarLogo,
  SimpleLink,
} from 'src/components/utils';
import { Hamburger } from 'src/components/utils/Hamburger';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { Tag } from 'src/components/utils/Tag';
import { USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { gaEvent } from 'src/lib/gtag';
import { StyledConnectedItemMobile } from './HeaderConnectedContent.styles';
import { HeaderConnectedContentProps } from './HeaderConnectedContent.types';
import { SubMenu } from './SubMenu';

const uuidValue = uuid();

export const HeaderConnectedContentMobile = ({
  badges,
  messaging,
  links = {
    [USER_ROLES.ADMIN]: [HeaderConnectedMainItemDefaultProps],
    [USER_ROLES.CANDIDATE]: [HeaderConnectedMainItemDefaultProps],
    [USER_ROLES.COACH]: [HeaderConnectedMainItemDefaultProps],
    [USER_ROLES.REFERER]: [HeaderConnectedMainItemDefaultProps],
  },
  dropdown = [HeaderConnectedMainItemDefaultProps],
}: HeaderConnectedContentProps) => {
  const offcanvasRef = useRef<OffcanvasRef>(null);
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
            type="secondary"
          />
        }
        right={
          <div className="uk-padding-small uk-flex uk-flex-middle">
            {/* Messages */}
            <StyledMessagingIconContainer>
              <ButtonIcon icon={messaging.icon} href={messaging.href} />
              {messaging.badge && badges[messaging.badge] > 0 && (
                <div className="pin-notification" />
              )}
            </StyledMessagingIconContainer>
            <Hamburger
              onClick={() => {
                if (offcanvasRef.current) {
                  offcanvasRef.current.open();
                }
              }}
            />
          </div>
        }
      />
      <Offcanvas ref={offcanvasRef} position="right">
        <ul className="uk-nav uk-nav-default uk-margin-medium-top">
          <li>
            <SimpleLink href="/">
              <LucidIcon name="House" />
              &nbsp; Accueil
            </SimpleLink>
          </li>
          {links[user.role]
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
                        {icon && (
                          <span className="uk-margin-small-right">{icon}</span>
                        )}
                        {name}
                      </span>
                    </a>
                    {badge && badges[badge] > 0 && (
                      <div>
                        &nbsp;
                        <Tag
                          size="small"
                          style="secondary"
                          content={badges[badge]}
                        />
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
          <StyledConnectedItemMobile>
            <a
              aria-hidden="true"
              onClick={() => {
                if (messaging.tag) gaEvent(messaging.tag);
                if (messaging.href) {
                  push(messaging.href);
                }
                if (messaging.onClick) {
                  messaging.onClick();
                }
              }}
            >
              <span>
                <span className="uk-margin-small-right">{messaging.icon}</span>
                {messaging.name}
              </span>
            </a>
          </StyledConnectedItemMobile>
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
