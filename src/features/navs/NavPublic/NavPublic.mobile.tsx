import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { NavbarLogo, OffCanvas, OffCanvasRef } from '@/src/components/ui';
import { Button } from '@/src/components/ui/Button';
import { Hamburger } from '@/src/components/ui/Hamburger';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { COLORS } from '@/src/constants/styles';
import { FB_TAGS, GA_TAGS } from '@/src/constants/tags';
import { useOffCanvas } from '@/src/hooks/useOffCanvas';
import { fbEvent } from '@/src/lib/fb';
import { gaEvent } from '@/src/lib/gtag';
import { StyledPublicNavCard } from './NavPublic.styles';
import { LINKS } from './NavPublic.utils';
import { NavPublicItem } from './NavPublicItem/NavPublicItem';

export const NavPublicMobile = () => {
  const items = LINKS;

  const offCanvasRef = useRef<OffCanvasRef>(null);
  const { closeOffCanvas } = useOffCanvas(offCanvasRef);

  const { push } = useRouter();

  return (
    <>
      <StyledPublicNavCard id="nav">
        <NavbarLogo href="/" type="primary" />
        <Hamburger
          color="extraDarkGray"
          onClick={() => {
            if (offCanvasRef.current) {
              offCanvasRef.current.open();
            }
          }}
        />
      </StyledPublicNavCard>
      <OffCanvas
        position="right"
        ref={offCanvasRef}
        closeButtonSize={40}
        backgroundColor="white"
        closeButtonColor="extraDarkGray"
      >
        <ul className="uk-nav uk-nav-default uk-margin-medium-top">
          <li className="uk-flex uk-flex-center uk-flex-middle">
            <a
              aria-hidden="true"
              className="uk-flex uk-flex-middle"
              style={{ color: COLORS.extraDarkGray }}
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
              href="/wizard"
              variant="primary"
              rounded
              size="small"
              style={{
                backgroundColor: COLORS.darkTeal,
                borderColor: COLORS.darkTeal,
              }}
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
              variant="secondary"
            >
              Faire un don
              <LucidIcon name="ChevronRight" />
            </Button>
          </li>
        </ul>
      </OffCanvas>
    </>
  );
};
