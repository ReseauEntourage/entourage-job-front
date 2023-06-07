import React from 'react';
import { useRouter } from 'next/router';
import { Button } from 'src/components/utils/Button';
import { Hamburger, Navbar, NavbarLogo, IconNoSSR } from 'src/components/utils';
import { gaEvent } from 'src/lib/gtag.ts';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { OffcanvasNoSSR } from 'src/components/utils/Offcanvas.tsx';
import { fbEvent } from 'src/lib/fb.ts';
import { OFFCANVAS_GUEST } from 'src/constants/utils.ts';
import PropTypes from 'prop-types';
import { StyledHeaderMobile } from '../../Header.styles';
import { HeaderPublicItemShape } from '../HeaderPublic.shapes';

const HeaderPublicMobile = ({ links }) => {
  const { asPath, push } = useRouter();

  return (
    <StyledHeaderMobile id="header">
      <Navbar
        backgroundColor="darkerBlack"
        sticky
        left={
          <div className="uk-flex uk-flex-middle">
            <NavbarLogo
              href="/"
              src="/static/img/linkedout_logo_white.png"
              alt="LinkedOut"
            />
          </div>
        }
        right={
          <div className="uk-padding-small uk-flex uk-flex-middle">
            <Hamburger targetId={OFFCANVAS_GUEST} hidden="m" />
          </div>
        }
      />
      <OffcanvasNoSSR id={OFFCANVAS_GUEST}>
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
              <div className="uk-flex">
                <IconNoSSR
                  name="home"
                  ratio={1}
                  className="uk-margin-small-right"
                />
                <span>Accueil</span>
              </div>
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
          <li className="uk-margin-small-top uk-flex uk-flex-center uk-padding-small">
            <Button
              href={{ pathname: '/candidats', query: { employed: false } }}
              style="primary"
            >
              Découvrir les CV&nbsp;
              <IconNoSSR name="chevron-right" />
            </Button>
          </li>
          <li className="uk-flex uk-flex-center uk-padding-small">
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
              Faire un don&nbsp;
              <IconNoSSR name="chevron-right" />
            </Button>
          </li>
        </ul>
      </OffcanvasNoSSR>
    </StyledHeaderMobile>
  );
};

HeaderPublicMobile.propTypes = {
  links: PropTypes.arrayOf(HeaderPublicItemShape).isRequired,
};

export default HeaderPublicMobile;
