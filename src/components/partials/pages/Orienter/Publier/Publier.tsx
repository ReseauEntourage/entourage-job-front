import React, { Ref } from 'react';
import CarteSolidaireIcon from 'assets/icons/orienter-carte-solidaire.svg';
import SablierIcon from 'assets/icons/orienter-sablier.svg';
import { Button, Img, Section } from 'src/components/utils';
import { H3 } from 'src/components/utils/Headings';
import { GA_TAGS } from 'src/constants/tags';
import { useIsDesktop } from 'src/hooks/utils';
import { gaEvent } from 'src/lib/gtag';
import { StyledOrienterPublierContainer } from './Publier.styles';

export const Publier = ({innerRef}: {innerRef: Ref<HTMLDivElement>}) => {
  const isDesktop = useIsDesktop();
  return (
    <Section>
      {!isDesktop && (
        <H3
          color="primaryOrange"
          title="Publication du CV sans parcours d’accompagnement"
        />
      )}
      <StyledOrienterPublierContainer
        className={`${isDesktop ? '' : 'mobile'}`}
      >
        <div className="text-container" ref={innerRef}>
          {isDesktop && (
            <H3
              color="primaryOrange"
              title="Publication du CV sans parcours d’accompagnement"
            />
          )}
          <ul data-uk-scrollspy="cls:uk-animation-slide-bottom; target: > li; delay: 200;">
            <li>
              <SablierIcon /> <div>Accompagnement à distance</div>
            </li>
            <li>
              <CarteSolidaireIcon />{' '}
              <div>
                Programme disponible en Ile de France, Lille, Lorient, Lyon,
                Rennes
              </div>
            </li>
          </ul>
          <div data-uk-scrollspy="cls:uk-animation-slide-bottom; target: > p; delay: 200;">
            <p>
              <strong>
                Ce format inclut donc essentiellement l’accès à la plateforme
              </strong>{' '}
              LinkedOut pour créer le CV du candidat, le publier sur la
              plateforme, accéder aux offres d’emploi de nos entreprises
              partenaires et y répondre en toute autonomie.
            </p>
          </div>
          <Button
            style="custom-secondary-inverted"
            href={process.env.EXTERNAL_CANDIDATE_FORM_SF_URL}
            onClick={() => {
              gaEvent(GA_TAGS.PAGE_ORIENTER_CLASSIQUE_ENVOYER_CLIC);
            }}
            isExternal
            newTab
          >
            Publier le CV d&lsquo;un candidat
          </Button>
        </div>
        <div className="image-container">
          <Img cover src="/static/img/orienter-publier.jpg" alt="" />
        </div>
      </StyledOrienterPublierContainer>
    </Section>
  );
};
