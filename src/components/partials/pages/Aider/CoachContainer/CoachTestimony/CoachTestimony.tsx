import React from 'react';
import { v4 as uuid } from 'uuid';
import { TitleSection } from 'src/components/partials/pages/Aider/TitleSection';
import { Container } from 'src/components/utils';
import { COLORS } from 'src/constants/styles';
import { StyledCoachTestimony } from './CoachTestimony.styles';

const uuidValue = uuid();

const testimonyContent = [
  {
    text: (
      <>
        “ LinkedOut m’apporte une ouverture d’esprit encore plus grande,
        <span>
          {' '}
          l’envie d’aider les autres se concrétise vraiment avec ce projet !
        </span>{' '}
        ”
      </>
    ),
    coach: 'Chloé',
    candidat: 'Soraya',
    pic: '',
  },
  {
    text: (
      <>
        “ Je me suis retrouvé confronté à un tout autre univers,
        <span> ça m’a fait évoluer</span>... Zabiullah m’appelle « mon ami »
        maintenant ! ”
      </>
    ),
    coach: 'Damien',
    candidat: 'Zabiullah',
    pic: '',
  },
  {
    text: (
      <>
        “ C’est hyper enrichissant humainement.{' '}
        <span>Chaque minute que tu passes est utile au candidat</span>, à sa
        progression,à la manière dont il voit les choses. ”
      </>
    ),
    coach: 'Marie',
    candidat: 'Léo',
    pic: '',
  },
];

export const CoachTestimony = () => {
  return (
    <StyledCoachTestimony>
      <Container>
        <TitleSection
          title="Les témoignages des coachs"
          titleColor="black"
          svgColor={COLORS.primaryOrange}
        />
        <div
          className="testimony-container"
          data-uk-scrollspy="cls:uk-animation-slide-bottom; target: > .testimony-content; delay: 200;"
        >
          {testimonyContent.map(({ text, coach, candidat }, key) => {
            return (
              <div className="testimony-content" key={`${key}-${uuidValue}`}>
                <div className="quote">{text}</div>
                <div>
                  <p className="names">
                    {coach}
                    <br />
                    <span>Coach de {candidat}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </StyledCoachTestimony>
  );
};
