import React from 'react';
import { StyledHelpCards } from 'src/components/partials/Aider/HelpCards/styles';
import HelpCard from 'src/components/partials/Aider/HelpCards/HelpCard';
import HelpCoach from 'public/static/img/aider-coach.jpg';
import HelpCV from 'public/static/img/aider-cv.jpg';
import HelpProject from 'public/static/img/aider-financement-projet.jpg';
import HelpReseau from 'public/static/img/aider-reseau.jpg';
import TitleSection from 'src/components/partials/Aider/H2';
import { COLORS } from 'src/constants/styles';
import { Container } from 'src/components/utils/containers';
import { GA_TAGS } from 'src/constants/tags';
import uuid from 'uuid/v4';

const cardsContent = [
  {
    title: "Coachez un candidat vers l'emploi",
    img: HelpCoach,
    text: "Vous soutenez un candidat individuellement et dans la durée dans sa recherche d'emploi pour booster la rencontre avec les entreprises et son intégration durable dans un nouveau job.",
    cta: 'Devenir coach LinkedOut',
    href: 'https://airtable.com/shrospLiHWS9OFCD6',
    alt: 'Des candidats LinkedOut et une coach',
    newTab: true,
    tag: GA_TAGS.PAGE_AIDER_INSCRIPTION_COACH_CLIC,
  },
  {
    title: 'Partagez les CV des candidats',
    img: HelpCV,
    text: 'Partager un CV dans vos réseaux donne une visibilité inédite à un candidat auprès de potentiels recruteurs et permet de générer des opportunités d’emploi. Votre partage peut tout changer !',
    cta: 'Partager un CV',
    href: '/candidats?employed=false',
    alt: 'CV de Candidat LinkedOut',
    newTab: false,
    tag: GA_TAGS.PAGE_AIDER_PARTAGER_CV_CLIC,
  },
  {
    title: 'Activez votre réseau pour un candidat',
    img: HelpReseau,
    text: 'Une mission souple et ponctuelle pour apporter un coup de pouce et des mises en relation aux candidats et leurs coachs tout au long de leur parcours LinkedOut ! Mission disponible à Paris et Lyon pour le moment !',
    cta: 'Rejoindre les connecteurs',
    href: 'https://airtable.com/shravv7gRI4c64yzw',
    alt: 'Des connecteurs LinkedOut',
    newTab: true,
    tag: GA_TAGS.PAGE_AIDER_CONNECTEUR_CLIC,
  },
  {
    title: 'Soutenez financièrement le projet',
    img: HelpProject,
    text: 'Pas de temps mais envie de soutenir notre projet ? Faites un don en quelques clics pour participer à la création d’une société plus inclusive et permettre à nos candidats de vivre des expériences transformantes.',
    cta: 'Faire un don',
    href: 'https://entourage.iraiser.eu/linkedout/~mon-don',
    alt: 'Des soutiens du projet LinkedOut rassemblés',
    newTab: true,
    tag: GA_TAGS.PAGE_AIDER_DON_CLIC,
  },
];

const HelpCards = () => {
  return (
    <StyledHelpCards>
      <Container>
        <div>
          <TitleSection
            title="Apportez votre aide selon votre temps et vos envies"
            titleColor="black"
            svgColor={COLORS.primaryOrange}
          />
        </div>
        <div
          className="cards-container"
          uk-scrollspy="cls:uk-animation-slide-bottom-small; target: .aider-card; delay: 200"
        >
          {cardsContent.map((cardContent, key) => {
            return (
              <HelpCard cardContent={cardContent} keyMap={`${key}-${uuid}`} />
            );
          })}
        </div>
      </Container>
    </StyledHelpCards>
  );
};

export default HelpCards;
