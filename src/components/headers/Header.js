import UIkit from 'uikit';
import React from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Hamburger, Nav, Navbar, NavbarLogo } from 'src/components/utils';

import Button from 'src/components/utils/Button';
import { EXTERNAL_LINKS } from 'src/constants';
import { gaEvent } from 'src/lib/gtag';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { IconNoSSR } from 'src/components/utils/Icon';
import { OffcanvasNoSSR } from 'src/components/utils/Offcanvas';
import { fbEvent } from 'src/lib/fb';
import { OFFCANVAS_GUEST } from 'src/constants/utils';

const LINKS = [
  {
    href: '/travailler',
    name: 'Je cherche un emploi',
    tag: GA_TAGS.HEADER_TRAVAILLER_CLIC,
  },
  {
    href: '/entreprises',
    name: 'Je recrute',
    tag: GA_TAGS.HEADER_RECRUTER_CLIC,
  },
  { href: '/aider', name: 'Je veux aider', tag: GA_TAGS.HEADER_AIDER_CLIC },
  {
    href: '/orienter',
    name: "J'oriente un candidat",
    tag: GA_TAGS.HEADER_ORIENTER_CLIC,
  },
];

const Header = ({ isHome }) => {
  const router = useRouter();

  const rightItems = [
    ...LINKS.map((link, i) => {
      if (router.asPath.includes(link.href)) {
        return (
          <div className="uk-navbar-item uk-padding-remove-horizontal uk-visible@m">
            <a
              href={link.href}
              className="uk-text-center"
              style={{
                borderBottom: 'white solid 1px',
                marginLeft: 15,
                marginRight: 15,
                color: 'white',
              }}
              onClick={() => {
                gaEvent(link.tag);
              }}
            >
              {link.name}
            </a>
          </div>
        );
      }
      return (
        <Link href={link.href} key={i}>
          {/* Hack so that the links don't move when changing current page */}
          <a
            style={{ borderBottom: '1px solid transparent' }}
            className={`uk-visible@m ${
              router.asPath === link.href && 'uk-text-bold uk-text-primary'
            } uk-text-center`}
          >
            {link.name}
          </a>
        </Link>
      );
    }),
    // separateurs en css .ent-nav
    <div className="uk-navbar-item uk-visible@m">
      <Button
        href={{
          pathname: '/candidats',
          query: { employed: false },
        }}
        style="primary"
      >
        Découvrir les CV&nbsp;
        <IconNoSSR name="chevron-right" />
      </Button>
    </div>,
  ];
  return (
    <header id="header">
      <Navbar
        sticky=""
        className="uk-background-secondary uk-navbar-transparent ent-home"
        left={
          <div className="uk-flex uk-flex-middle">
            <NavbarLogo
              href="/"
              src="/static/img/linkedout_logo_white.png"
              alt="Linkedout"
              alwaysVisible={!isHome}
            />
            <div
              className={`uk-visible@m uk-margin-small-left uk-flex uk-flex-center uk-light ${
                isHome && 'uk-logo uk-animation-fade'
              }`}
            >
              <Button
                href={EXTERNAL_LINKS.DONATION}
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
            </div>
          </div>
        }
        right={
          <>
            <div className="uk-visible@m">
              <Nav navbar items={rightItems} />
            </div>
            <div className="uk-hidden@m uk-padding-small uk-flex uk-flex-middle">
              <Hamburger targetId={OFFCANVAS_GUEST} hidden="m" />
            </div>
          </>
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
                UIkit.offcanvas(`#${OFFCANVAS_GUEST}`).hide();
                router.push('/');
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
            LINKS.filter(({ href }) => {
              return href !== '#';
            }).map(({ href, name, tag }, index) => {
              if (router.asPath.includes(href)) {
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
                        UIkit.offcanvas(`#${OFFCANVAS_GUEST}`).hide();
                        gaEvent(tag);
                        router.push(href);
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
                      UIkit.offcanvas(`#${OFFCANVAS_GUEST}`).hide();
                      gaEvent(tag);
                      router.push(href);
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
              onClick={() => {
                UIkit.offcanvas(`#${OFFCANVAS_GUEST}`).hide();
              }}
              style="primary"
            >
              Découvrir les CV&nbsp;
              <IconNoSSR name="chevron-right" />
            </Button>
          </li>
          <li className="uk-flex uk-flex-center uk-padding-small">
            <Button
              href={EXTERNAL_LINKS.DONATION}
              isExternal
              newTab
              onClick={() => {
                UIkit.offcanvas(`#${OFFCANVAS_GUEST}`).hide();
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
    </header>
  );
};

Header.propTypes = {
  isHome: PropTypes.bool,
};

Header.defaultProps = {
  isHome: false,
};

export default Header;
