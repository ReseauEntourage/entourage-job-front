import React from 'react';
import { v4 as uuid } from 'uuid';
import { HelpCard } from 'src/components/partials/pages/Aider/HelpCards/HelpCard';
import { StyledHelpCards } from 'src/components/partials/pages/Aider/HelpCards/HelpCards.styles';
import { TitleSection } from 'src/components/partials/pages/Aider/TitleSection';
import { Container } from 'src/components/utils';
import { COLORS } from 'src/constants/styles';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';

const uuidValue = uuid();

const cardsContent = [
  {
    title: "Coachez un candidat vers l'emploi",
    img: '/static/img/aider-coach.jpg',
    text: "Vous soutenez un candidat individuellement et dans la durée dans sa recherche d'emploi pour booster la rencontre avec les entreprises et son intégration durable dans un nouveau job.",
    cta: 'Devenir coach LinkedOut',
    href: process.env.AIRTABLE_LINK_BECOME_COACH,
    alt: 'Des candidats LinkedOut et une coach',
    newTab: true,
    gaTag: GA_TAGS.PAGE_AIDER_INSCRIPTION_COACH_CLIC,
    fbTag: FB_TAGS.COACH_REGISTRATION_OPEN,
  },
  {
    title: 'Partagez les CV des candidats',
    img: '/static/img/aider-cv.jpg',
    text: 'Partager un CV dans vos réseaux donne une visibilité inédite à un candidat auprès de potentiels recruteurs et permet de générer des opportunités d’emploi. Votre partage peut tout changer !',
    cta: 'Partager un CV',
    href: '/candidats?employed=false',
    alt: 'CV de Candidat LinkedOut',
    newTab: false,
    gaTag: GA_TAGS.PAGE_AIDER_PARTAGER_CV_CLIC,
  },
  {
    title: 'Activez votre réseau pour un candidat',
    img: '/static/img/aider-reseau.jpg',
    text: 'Une mission souple et ponctuelle pour apporter un coup de pouce et des mises en relation aux candidats et leurs coachs tout au long de leur parcours LinkedOut !',
    cta: 'Rejoindre les connecteurs',
    href: process.env.CONNECTEUR_INSCRIPTION_URL,
    alt: 'Des connecteurs LinkedOut',
    newTab: true,
    gaTag: GA_TAGS.PAGE_AIDER_CONNECTEUR_CLIC,
  },
  {
    title: 'Soutenez financièrement le projet',
    img: '/static/img/aider-financement-projet.jpg',
    text: 'Pas de temps mais envie de soutenir notre projet ? Faites un don en quelques clics pour participer à la création d’une société plus inclusive et permettre à nos candidats de vivre des expériences transformantes.',
    cta: 'Faire un don',
    href: process.env.DONATION_LINK,
    alt: 'Des soutiens du projet LinkedOut rassemblés',
    newTab: true,
    gaTag: GA_TAGS.PAGE_AIDER_DON_CLIC,
  },
];

export const HelpCards = () => {
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
          data-uk-scrollspy="cls:uk-animation-slide-bottom-small; target: .aider-card; delay: 200"
        >
          {cardsContent.map((cardContent, key) => {
            return (
              <HelpCard
                cardContent={cardContent}
                keyMap={`${key}-${uuidValue}`}
              />
            );
          })}
        </div>
      </Container>
    </StyledHelpCards>
  );
};
