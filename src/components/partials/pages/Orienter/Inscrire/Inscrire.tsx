import React, { Ref } from 'react';
import CarteSolidaireIcon from 'assets/icons/orienter-carte-solidaire.svg';
import SablierIcon from 'assets/icons/orienter-sablier.svg';
import { openModal } from 'src/components/modals/Modal';
import { CandidateContactModal } from 'src/components/modals/Modal/ModalGeneric/CandidateContactModal';
import { Button, Img, Section } from 'src/components/utils';
import { H3 } from 'src/components/utils/Headings';
import { GA_TAGS } from 'src/constants/tags';
import { useIsDesktop } from 'src/hooks/utils';
import { gaEvent } from 'src/lib/gtag';
import {
  StyledOrienterBackground,
  StyledOrienterInscrireContainer,
} from './Inscrire.styles';

export const Inscrire = ({ innerRef }: { innerRef: Ref<HTMLDivElement> }) => {
  const isDesktop = useIsDesktop();
  return (
    <StyledOrienterBackground>
      <Section>
        {!isDesktop && (
          <H3
            title="Parcours tremplin de 6 mois et publication du CV"
            color="primaryBlue"
          />
        )}
        <StyledOrienterInscrireContainer className={isDesktop ? '' : 'mobile'}>
          <div className="image-container" ref={innerRef}>
            <Img src="/static/img/orientation_who.jpg" alt="" cover />
          </div>
          <div className="text-container">
            {isDesktop && (
              <H3
                title="Parcours tremplin de 6 mois et publication du CV"
                color="primaryBlue"
              />
            )}
            <ul data-uk-scrollspy="cls:uk-animation-slide-bottom; target: > li; delay: 200;">
              <li>
                <SablierIcon />{' '}
                <div>2 heures par semaine pendant 6 mois, en présentiel</div>
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
                L’intégration du candidat au parcours Entourage Pro comprend :
              </p>
              <p>
                <strong>
                  Un accompagnement personnalisé par un coach bénévole
                </strong>{' '}
                (2h/semaine)
              </p>
              <p>
                <strong>
                  L’accès au catalogue d’événements du parcours collectif
                </strong>{' '}
                : théâtre d’improvisation, ateliers pour booster la recherche
                d’emploi, week-ends de la communauté, etc.
              </p>
              <p>
                <strong>La mise en lien avec des professionnels engagés</strong>{' '}
                : rencontres avec des professionnels pour bénéficier d’un coup
                de pouce (conseil, contact, simulation d’entretien)
              </p>
              <p>
                <strong>L’utilisation de la plateforme Entourage Pro</strong>{' '}
                pour créer le CV, le publier, accéder aux offres d’emploi et y
                répondre.
              </p>
            </div>
            <Button
              style="custom-secondary-inverted"
              onClick={() => {
                openModal(<CandidateContactModal />);
                gaEvent(GA_TAGS.PAGE_ORIENTER_CLASSIQUE_ENVOYER_CLIC);
              }}
              dataTestId="button-orienter"
            >
              Inscrire un candidat
            </Button>
          </div>
        </StyledOrienterInscrireContainer>
      </Section>
    </StyledOrienterBackground>
  );
};
