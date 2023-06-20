import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import AiderImgFullWidth from 'public/static/img/aider-img-full-width.jpg';
import AiderInformationsMissions from 'public/static/img/aider-informations-mission.jpg';
import PictoCreationOpp from 'public/static/img/icons/picto-creation-opportunite.svg';
import PictoFaciliterInte from 'public/static/img/icons/picto-faciliter-integration.svg';
import PictoRechercheCV from 'public/static/img/icons/picto-recherche-cv.svg';
import TitleSection from 'src/components/partials/Aider/H2';
import { StyledInfoContainer } from 'src/components/partials/Aider/InfoContainer/styles';
import { Container } from 'src/components/utils';
import { COLORS, BREAKPOINTS } from 'src/constants/styles';
import { isSSR } from 'src/utils/isSSR';

const uuidValue = uuid();

const infoContent = [
  {
    picto: PictoRechercheCV,
    alt: 'recherche emploi',
    title: 'Préparation à la recherche d’emploi',
    ul: [
      'Réalisation du CV façon LinkedOut',
      'Relecture du parcours du candidat et formalisation des envies professionnelles',
    ],
  },
  {
    picto: PictoCreationOpp,
    alt: 'creation opportunités professionnelles',
    title: "Création d'opportunités professionnelles",
    ul: [
      'Activer son réseau avec le candidat ',
      'Rechercher et suivre des opportunités d’emploi (via LinkedOut et en dehors)',
      "Préparation aux entretiens d'embauche et soutien des candidatures",
    ],
  },
  {
    picto: PictoFaciliterInte,
    alt: 'faciliter intégration entreprise',
    title: "Facilitation de l'intégration en entreprise ",
    ul: [
      'Soutenir le candidat dans sa prise de poste',
      "Faciliter les échanges avec le recruteurs dans la phase d'intégration",
    ],
  },
];

export const InfoContainer = () => {
  const [imagePosition, setImagePosition] = useState('top');
  useEffect(() => {
    if (!isSSR) {
      setImagePosition(
        window.innerWidth >= BREAKPOINTS.desktop ? 'top' : 'right'
      );
    }
  }, []);
  return (
    <StyledInfoContainer>
      <div className="img-full-width-container">
        <div>
          <Image
            src={AiderImgFullWidth}
            layout="fill"
            objectFit="cover"
            objectPosition={imagePosition}
            alt="Coaches qui accompagnent des candidats vers la réinsertion"
          />
        </div>
      </div>
      <Container>
        <TitleSection
          title="Toutes les informations sur la mission"
          titleColor="black"
          svgColor={COLORS.primaryOrange}
        />
        <div className="text-content">
          <p>
            Accompagnez une personne précaire vers l&apos;emploi en devenant
            Coach LinkedOut. <br />
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
              <Image
                src={AiderInformationsMissions}
                alt="Un coach et un candidat LinkedOut"
              />
            </div>
          </div>
          {infoContent.map((content, key) => {
            return (
              <div className="informer-card" key={`${key}-parent-${uuidValue}`}>
                <div className="picto-h4">
                  <content.picto />
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
