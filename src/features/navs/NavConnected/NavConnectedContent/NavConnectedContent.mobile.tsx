import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { ButtonIcon, Navbar, NavbarLogo } from '@/src/components/ui';
import { Hamburger } from '@/src/components/ui/Hamburger';
import {
  OffCanvas,
  OffCanvasRef,
} from '@/src/components/ui/OffCanvas/OffCanvas';
import { Tag } from '@/src/components/ui/Tag';
import { useOffCanvas } from '@/src/hooks/useOffCanvas';
import { NavConnectedMainItemDefaultProps } from '../NavConnected.types';
import { UserRoles } from 'src/constants/users';
import {
  StyledMessagingIconContainer,
  StyledNavContainerMobile,
} from 'src/features/headers/Header.styles';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { gaEvent } from 'src/lib/gtag';
import { StyledConnectedItemMobile } from './NavConnectedContent.styles';
import { NavConnectedContentProps } from './NavConnectedContent.types';
import { SubMenu } from './SubMenu';

const uuidValue = uuid();

export const NavConnectedContentMobile = ({
  badges,
  messaging,
  links = {
    [UserRoles.ADMIN]: [NavConnectedMainItemDefaultProps],
    [UserRoles.CANDIDATE]: [NavConnectedMainItemDefaultProps],
    [UserRoles.COACH]: [NavConnectedMainItemDefaultProps],
    [UserRoles.REFERER]: [NavConnectedMainItemDefaultProps],
  },
  dropdown = [NavConnectedMainItemDefaultProps],
}: NavConnectedContentProps) => {
  const offCanvasRef = useRef<OffCanvasRef>(null);
  const { closeOffCanvas } = useOffCanvas(offCanvasRef);
  const user = useAuthenticatedUser();

  const { push, asPath } = useRouter();
  const logoLink = links[user?.role][0] || null;

  return (
    <StyledNavContainerMobile id="nav">
      <Navbar
        backgroundColor="black"
        sticky
        left={
          <NavbarLogo
            href={logoLink ? logoLink.href + (logoLink.queryParams || '') : '#'}
            type="secondary"
          />
        }
        right={
          <div className="uk-padding-small uk-flex uk-flex-middle">
            {/* Messages */}
            <StyledMessagingIconContainer>
              <ButtonIcon
                icon={messaging.icon}
                href={messaging.href}
                color="white"
              />
              {messaging.badge && badges[messaging.badge] > 0 && (
                <div className="pin-notification" />
              )}
            </StyledMessagingIconContainer>
            <Hamburger
              onClick={() => {
                if (offCanvasRef.current) {
                  offCanvasRef.current.open();
                }
              }}
            />
          </div>
        }
      />
      <OffCanvas ref={offCanvasRef} position="right">
        <ul className="uk-nav uk-nav-default uk-margin-medium-top">
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
                        if (tag) {
                          gaEvent(tag);
                        }
                        if (href) {
                          push(href + (queryParams || ''));
                        }
                        closeOffCanvas();
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
                if (messaging.tag) {
                  gaEvent(messaging.tag);
                }
                if (messaging.href) {
                  push(messaging.href);
                }
                if (messaging.onClick) {
                  messaging.onClick();
                }
                closeOffCanvas();
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
                    if (tag) {
                      gaEvent(tag);
                    }
                    if (href) {
                      push(href);
                    }
                    if (onClick) {
                      onClick();
                    }
                    closeOffCanvas();
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
      </OffCanvas>
    </StyledNavContainerMobile>
  );
};
