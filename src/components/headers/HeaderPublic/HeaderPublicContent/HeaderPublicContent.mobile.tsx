import { useRouter } from 'next/router';
import React from 'react';
import { StyledHeaderMobile } from 'src/components/headers/Header.styles';
import { Hamburger, Navbar, NavbarLogo } from 'src/components/utils';
import { Button } from 'src/components/utils/Button';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { Offcanvas } from 'src/components/utils/Offcanvas';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { OFFCANVAS_GUEST } from 'src/constants/utils';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { HeaderPublicContentProps } from './HeaderPublicContent.types';

export const HeaderPublicContentMobile = ({
  links,
}: HeaderPublicContentProps) => {
  const { asPath, push } = useRouter();

  return (
    <StyledHeaderMobile id="header">
      <Navbar
        backgroundColor="darkerBlack"
        sticky
        left={
          <div className="uk-flex uk-flex-middle uk-position-relative">
            <NavbarLogo href="/" type="secondary" />
          </div>
        }
        right={
          <div className="uk-padding-small uk-flex uk-flex-middle">
            <Hamburger targetId={OFFCANVAS_GUEST} />
          </div>
        }
      />
      <Offcanvas id={OFFCANVAS_GUEST}>
        <ul className="uk-nav uk-nav-default uk-margin-medium-top">
          <li className="uk-flex uk-flex-center uk-flex-middle">
            <a
              aria-hidden="true"
              className="uk-flex uk-flex-middle"
              style={{ color: 'white' }}
              onClick={() => {
                push('/');
              }}
            >
              <div className="uk-flex">Accueil</div>
            </a>
          </li>
          {[
            links
              .filter(({ href }) => {
                return href !== '#';
              })
              .map(({ href, name, tag }, index) => {
                if (asPath.includes(href)) {
                  return (
                    <li key={index} className="uk-flex-center">
                      <a
                        style={{
                          borderBottom: 'white solid 1px',
                          color: 'white',
                        }}
                        aria-hidden="true"
                        className="uk-text-center"
                        onClick={() => {
                          gaEvent(tag);
                          push(href);
                        }}
                      >
                        {name}
                      </a>
                    </li>
                  );
                }

                return (
                  <li key={index} className="uk-flex-center">
                    {/* Hack so that the links don't move when changing current page */}
                    <a
                      style={{
                        borderBottom: '1px solid transparent',
                        color: 'white',
                      }}
                      aria-hidden="true"
                      className="uk-text-center"
                      onClick={() => {
                        gaEvent(tag);
                        push(href);
                      }}
                    >
                      {name}
                    </a>
                  </li>
                );
              }),
          ]}
          <li className="uk-margin-small-top uk-flex uk-flex-center">
            <Button
              href="/login"
              style="custom-secondary"
              onClick={() => {
                gaEvent(GA_TAGS.HEADER_CONNEXION_CLIC);
              }}
              size="small"
            >
              Connexion
            </Button>
          </li>
          <li className="uk-margin-small-top uk-flex uk-flex-center">
            <Button
              href="/inscription"
              style="custom-secondary-inverted"
              size="small"
              onClick={() => {
                gaEvent(GA_TAGS.HEADER_INSCRIPTION_CLIC);
              }}
            >
              Inscription
            </Button>
          </li>
          <li className="uk-margin-small-top uk-flex uk-flex-center uk-padding-small">
            <Button
              href={process.env.DONATION_LINK}
              isExternal
              newTab
              onClick={() => {
                gaEvent(GA_TAGS.HEADER_DON_CLIC);
                fbEvent(FB_TAGS.DONATION);
              }}
              style="default"
            >
              Faire un don
              <LucidIcon name="ChevronRight" />
            </Button>
          </li>
        </ul>
      </Offcanvas>
    </StyledHeaderMobile>
  );
};
