import React from 'react';
import { StyledCoachContainer } from 'src/components/partials/Aider/CoachContainer/styles';
import TitleSection from 'src/components/partials/Aider/H2';
import AiderAccompagnerCoachImg from 'public/static/img/aider-accompagner-coach.jpg';
import AiderAccompagnerCoachImgMobile from 'public/static/img/aider-accompagner-coach-mobile.jpg';
import BackgroundImage from 'src/components/utils/BackgroundImage';
import { COLORS } from 'src/constants/styles';
import Button from 'src/components/utils/Button';
import { IconNoSSR } from 'src/components/utils/Icon';
import CoachTestimony from 'src/components/partials/Aider/CoachContainer/CoachTestimony';
import WelcomeIcon from 'public/static/img/icons/aider-welcome.svg';
import ReseauIcon from 'public/static/img/icons/aider-reseau.svg';
import InterviewIcon from 'public/static/img/icons/aider-interview.svg';
import BoiteOutilsIcon from 'public/static/img/icons/aider-boite-outils.svg';
import { Container } from 'src/components/utils/containers';
import uuid from 'uuid/v4';

const pictoContent = [
  {
    picto: WelcomeIcon,
    subtitle: 'Webinaire d’information',
    text: 'sur la mission  et un parcours de formation.',
  },
  {
    picto: ReseauIcon,
    subtitle: 'Une communauté de coachs ',
    text: 'pour partager son réseau, des bonnes pratiques et des temps conviviaux',
  },
  {
    picto: InterviewIcon,
    subtitle: 'Un suivi individualisé',
    text: 'par l’equipe pour répondre à toutes vos questions ',
  },
  {
    picto: BoiteOutilsIcon,
    subtitle: 'Une boîte à outils',
    text: 'pour favoriser l’accompagnement à chaque étape du parcours ',
  },
];

const CoachContainer = () => {
  return (
    <StyledCoachContainer>
      <BackgroundImage
        img={AiderAccompagnerCoachImg}
        alt="Un coach et un candidat LinkedOut qui rient ensemble"
        imgMobile={AiderAccompagnerCoachImgMobile}
        mobileHeight={1200}
      >
        <Container>
          <TitleSection
            title="LinkedOut accompagne les coachs à chaque étape"
            titleColor="white"
            svgColor="white"
            svgStroke={COLORS.gray}
          />
          <div className="picto-text-container">
            {pictoContent.map((content, key) => {
              return (
                <div className="picto-text-content" key={`${key}-${uuid}`}>
                  <div className="svg-container">
                    <content.picto />
                  </div>
                  <p>
                    <strong>{content.subtitle}</strong>
                  </p>
                  <p>{content.text}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </BackgroundImage>
      <Container>
        <div className="coach-cta-container">
          <h4>La mission de coach vous intéresse ?</h4>
          <p>
            Inscrivez-vous au prochain webinaire d’information pour valider
            votre entrée dans le parcours
          </p>
          <Button
            href={process.env.AIRTABLE_LINK_BECOME_COACH}
            newTab
            isExternal
            style="primary"
          >
            Devenir Coach LinkedOut&nbsp;
            <IconNoSSR name="chevron-right" />
          </Button>
        </div>
      </Container>

      <CoachTestimony />
    </StyledCoachContainer>
  );
};

export default CoachContainer;
