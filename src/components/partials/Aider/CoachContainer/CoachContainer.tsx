import React from 'react';
import { v4 as uuid } from 'uuid';
import BoiteOutilsIcon from 'assets/icons/aider-boite-outils.svg';
import InterviewIcon from 'assets/icons/aider-interview.svg';
import ReseauIcon from 'assets/icons/aider-reseau.svg';
import WelcomeIcon from 'assets/icons/aider-welcome.svg';
import ChevronRightIcon from 'assets/icons/chevron-right.svg';
import { StyledCoachContainer } from 'src/components/partials/Aider/CoachContainer/CoachContainer.styles';
import { CoachTestimony } from 'src/components/partials/Aider/CoachContainer/CoachTestimony/CoachTestimony';
import { TitleSection } from 'src/components/partials/Aider/H2/H2';
import { BackgroundImage, Button, Container } from 'src/components/utils';
import { COLORS } from 'src/constants/styles';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';

const uuidValue = uuid();

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

export const CoachContainer = () => {
  return (
    <StyledCoachContainer>
      <BackgroundImage
        img="/static/img/aider-accompagner-coach.jpg"
        alt="Un coach et un candidat LinkedOut qui rient ensemble"
        imgMobile="/static/img/aider-accompagner-coach-mobile.jpg"
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
                <div className="picto-text-content" key={`${key}-${uuidValue}`}>
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
            onClick={() => {
              gaEvent(GA_TAGS.PAGE_AIDER_INSCRIPTION_COACH_CLIC);
              fbEvent(FB_TAGS.COACH_REGISTRATION_OPEN);
            }}
            style="primary"
          >
            Devenir Coach LinkedOut&nbsp;
            <ChevronRightIcon />
          </Button>
        </div>
      </Container>

      <CoachTestimony />
    </StyledCoachContainer>
  );
};
