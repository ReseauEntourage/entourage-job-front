import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { StyledNavContainerMobile } from '@/src/components/headers/Header.styles';
import { Hamburger } from '@/src/components/utils/Hamburger';
import {
  Offcanvas,
  OffcanvasRef,
} from '@/src/components/utils/OffCanvas/Offcanvas';
import { Navbar, NavbarLogo } from 'src/components/utils';
import { Button } from 'src/components/utils/Button';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { LINKS } from './NavPublic.utils';
import { NavPublicItem } from './NavPublicItem/NavPublicItem';

export const NavPublicMobile = () => {
  const items = LINKS;

  const offcanvasRef = useRef<OffcanvasRef>(null);

  const { push } = useRouter();

  return (
    <StyledNavContainerMobile id="nav">
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
      <Offcanvas position="right" ref={offcanvasRef} closeButtonSize={40}>
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
            items.map((item) => {
              return <NavPublicItem item={item} key={item.name} />;
            }),
          ]}
          <li className="uk-margin-small-top uk-flex uk-flex-center">
            <Button
              href="/login"
              variant="secondary"
              rounded
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
              variant="primary"
              rounded
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
              href={process.env.NEXT_PUBLIC_DONATION_LINK}
              isExternal
              newTab
              onClick={() => {
                gaEvent(GA_TAGS.HEADER_DON_CLIC);
                fbEvent(FB_TAGS.DONATION);
              }}
              variant="default"
            >
              Faire un don
              <LucidIcon name="ChevronRight" />
            </Button>
          </li>
        </ul>
      </Offcanvas>
    </StyledNavContainerMobile>
  );
};
