import React from 'react';
import { StyledCoachTestimony } from 'src/components/partials/Aider/CoachContainer/CoachTestimony/styles';
import TitleSection from 'src/components/partials/Aider/H2';
import { COLORS } from 'src/constants/styles';
import { Container } from 'src/components/utils/containers';
import uuid from 'uuid/v4';

const testimonyContent = [
  {
    text: '“ LinkedOut m’apporte une ouverture d’esprit encore plus grande,<span> l’envie d’aider les autres se concrétise vraiment avec ce projet !</span> ”',
    coach: 'Chloé',
    candidat: 'Soraya',
    pic: '',
  },
  {
    text: '“ Je me suis retrouvé confronté à un tout autre univers,<span> ça m’a fait évoluer</span>... Zabiullah m’appelle « mon ami » maintenant ! ”',
    coach: 'Damien',
    candidat: 'Zabiullah',
    pic: '',
  },
  {
    text: '“ C’est hyper enrichissant humainement. <span>Chaque minute que tu passes est utile au candidat</span>, à sa progression,à la manière dont il voit les choses. ”',
    coach: 'Marie',
    candidat: 'Léo',
    pic: '',
  },
];

const CoachTestimony = () => {
  return (
    <StyledCoachTestimony>
      <Container>
        <TitleSection
          title="Les témoignages des coachs"
          titleColor="black"
          svgColor={COLORS.primaryOrange}
        />
        <div className="testimony-container">
          {testimonyContent.map(({ text, coach, candidat }, key) => {
            return (
              <div className="testimony-content" key={`${key}-${uuid}`}>
                <div
                  className="quote"
                  dangerouslySetInnerHTML={{ __html: text }}
                />
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

export default CoachTestimony;