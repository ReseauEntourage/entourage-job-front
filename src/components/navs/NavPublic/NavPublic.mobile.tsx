import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { StyledNavContainerMobile } from '@/src/components/headers/Header.styles';
import { Hamburger } from '@/src/components/utils/Hamburger';
import { useOffCanvas } from '@/src/hooks/useOffCanvas';
import {
  Navbar,
  NavbarLogo,
  OffCanvas,
  OffCanvasRef,
} from 'src/components/utils';
import { Button } from 'src/components/utils/Button';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { LINKS } from './NavPublic.utils';
import { NavPublicItem } from './NavPublicItem/NavPublicItem';

export const NavPublicMobile = () => {
  const items = LINKS;

  const offCanvasRef = useRef<OffCanvasRef>(null);
  const { closeOffCanvas } = useOffCanvas(offCanvasRef);

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
                if (offCanvasRef.current) {
                  offCanvasRef.current.open();
                }
              }}
            />
          </div>
        }
      />
      <OffCanvas position="right" ref={offCanvasRef} closeButtonSize={40}>
        <ul className="uk-nav uk-nav-default uk-margin-medium-top">
          <li className="uk-flex uk-flex-center uk-flex-middle">
            <a
              aria-hidden="true"
              className="uk-flex uk-flex-middle"
              style={{ color: 'white' }}
              onClick={() => {
                push('/');
                closeOffCanvas();
              }}
            >
              <div className="uk-flex">Accueil</div>
            </a>
          </li>
          {[
            items.map((item) => {
              return (
                <NavPublicItem
                  item={item}
                  key={item.name}
                  onClick={() => {
                    closeOffCanvas();
                  }}
                />
              );
            }),
          ]}
          <li className="uk-margin-small-top uk-flex uk-flex-center">
            <Button
              href="/login"
              variant="secondary"
              rounded
              onClick={() => {
                gaEvent(GA_TAGS.HEADER_CONNEXION_CLIC);
                closeOffCanvas();
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
                closeOffCanvas();
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
                closeOffCanvas();
              }}
              variant="default"
            >
              Faire un don
              <LucidIcon name="ChevronRight" />
            </Button>
          </li>
        </ul>
      </OffCanvas>
    </StyledNavContainerMobile>
  );
};
