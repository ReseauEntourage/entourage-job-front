import React from 'react';
import { v4 as uuid } from 'uuid';
import {
  PictoRechercheCv,
  PictoCreationOpportunite,
  PictoFaciliterIntegration,
} from 'assets/icons/icons';
import { TitleSection } from 'src/components/partials/pages/Aider/TitleSection';
import { Container, Img } from 'src/components/utils';
import { COLORS } from 'src/constants/styles';
import { StyledInfoContainer } from './InfoContainer.styles';

const uuidValue = uuid();

const infoContent = [
  {
    picto: <PictoRechercheCv color={COLORS.primaryBlue} />,
    alt: 'recherche emploi',
    title: 'Préparation à la recherche d’emploi',
    ul: [
      'Réalisation du CV façon Entourage Pro',
      'Relecture du parcours du candidat et formalisation des envies professionnelles',
    ],
  },
  {
    picto: <PictoCreationOpportunite color={COLORS.primaryBlue} />,
    alt: 'creation opportunités professionnelles',
    title: "Création d'opportunités professionnelles",
    ul: [
      'Activer son réseau avec le candidat ',
      'Rechercher et suivre des opportunités d’emploi (via Entourage Pro et en dehors)',
      "Préparation aux entretiens d'embauche et soutien des candidatures",
    ],
  },
  {
    picto: <PictoFaciliterIntegration color={COLORS.primaryBlue} />,
    alt: 'faciliter intégration entreprise',
    title: "Facilitation de l'intégration en entreprise ",
    ul: [
      'Soutenir le candidat dans sa prise de poste',
      "Faciliter les échanges avec le recruteurs dans la phase d'intégration",
    ],
  },
];

export const InfoContainer = () => {
  return (
    <StyledInfoContainer>
      <div className="img-full-width-container">
        <div>
          <Img
            src="/static/img/aider-img-full-width.jpg"
            cover
            alt="Coaches qui accompagnent des candidats vers la réinsertion"
          />
        </div>
      </div>
      <Container>
        <TitleSection
          title="Toutes les informations sur la mission"
          titleColor="black"
          svgColor={COLORS.primaryBlue}
        />
        <div className="text-content">
          <p>
            Accompagnez une personne précaire vers l&apos;emploi en devenant
            Coach Entourage Pro. <br />
            <span className="orange">
              Le coach soutient et accompagne un candidat sur une durée de 6 à 9
              mois, à raison de 2h par semaine, en présentiel.
            </span>
          </p>
          <p className="strong">
            Vous êtes motivé, disponible, et avez envie de rencontrer une
            nouvelle personne : transmettez au candidat votre expérience de
            l&apos;entreprise, de la recherche d&apos;emploi et participez à lui
            redonner confiance !
          </p>
        </div>
        <div className="informer-cards-container">
          <div className="informer-illustration">
            <div className="informer-illustration-container">
              <Img
                cover
                src="/static/img/aider-informations-mission.jpg"
                alt="Un coach et un candidat Entourage Pro"
              />
            </div>
          </div>
          {infoContent.map((content, key) => {
            return (
              <div className="informer-card" key={`${key}-parent-${uuidValue}`}>
                <div className="picto-h4">
                  {content.picto}
                  <h4>{content.title}</h4>
                </div>
                <ul data-uk-scrollspy="cls:uk-animation-slide-bottom; target: > li; delay: 200;">
                  {content.ul.map((li, k) => {
                    return <li key={`${k}-child-${uuidValue}`}>{li}</li>;
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </Container>
    </StyledInfoContainer>
  );
};
