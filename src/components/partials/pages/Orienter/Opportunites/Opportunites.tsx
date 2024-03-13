import React from 'react';
import { StyledOrienterBackground } from '../Inscrire/Inscrire.styles';
import { Section } from 'src/components/utils';
import { H2, H5 } from 'src/components/utils/Headings';
import { Opportunite } from './Opportunite';
import { StyledOrienterOpportunitesContainer } from './Opportunites.styles';

const content = [
  {
    title: 'Un CV humain et convaincant',
    paragraph:
      "Un CV qui casse les codes et valorise le parcours du candidat quel qu'il soit et incite à la rencontre",
    src: '/static/img/orienter-cv.png',
  },
  {
    title: 'Une diffusion élargie du CV',
    paragraph:
      'Grâce aux partages du grand public sur les réseaux sociaux via la plateforme',
    src: '/static/img/orienter-diffuser.png',
  },
  {
    title: 'Des opportunités d’emplois supplémentaires',
    paragraph:
      "Des offres d'emplois des entreprises partenaires et des coups de pouce de citoyens engagés",
    src: '/static/img/orienter-emploi.png',
  },
  {
    title: 'Des temps forts collectifs',
    paragraph:
      'Des expériences humaines formatrices, fédératrices et positives',
    src: '/static/img/orienter-calendrier.png',
  },
];

export const Opportunites = () => {
  return (
    <StyledOrienterBackground>
      <Section>
        <H2
          title="Ce qu'Entourage Pro apporte à vos bénéficiaires"
          color="black"
          center
        />
        <H5 title="Des réseaux activés = plus d'opportunités" center />
        <StyledOrienterOpportunitesContainer data-uk-scrollspy="cls:uk-animation-slide-bottom; target: h6, p; delay: 200;">
          {content.map(({ title, paragraph, src }, index) => {
            return (
              <Opportunite
                title={title}
                paragraph={paragraph}
                src={src}
                key={index}
              />
            );
          })}
        </StyledOrienterOpportunitesContainer>
      </Section>
    </StyledOrienterBackground>
  );
};
