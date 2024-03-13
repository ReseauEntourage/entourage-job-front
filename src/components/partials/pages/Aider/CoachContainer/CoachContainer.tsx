import React from 'react';
import { v4 as uuid } from 'uuid';
import ChevronRightIcon from 'assets/icons/chevron-right.svg';
import { Reviews } from 'src/components/partials/Reviews';
import { TitleSection } from 'src/components/partials/pages/Aider/TitleSection';
import { BackgroundImage, Button, Container, Img } from 'src/components/utils';
import { COLORS } from 'src/constants/styles';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { StyledCoachContainer } from './CoachContainer.styles';

const uuidValue = uuid();

const pictoContent = [
  {
    picto: '/static/img/illustrations/aider-welcome.png',
    subtitle: 'Webinaire d’information',
    text: 'sur la mission  et un parcours de formation.',
  },
  {
    picto: '/static/img/illustrations/aider-reseau.png',
    subtitle: 'Une communauté de coachs ',
    text: 'pour partager son réseau, des bonnes pratiques et des temps conviviaux',
  },
  {
    picto: '/static/img/illustrations/aider-interview.png',
    subtitle: 'Un suivi individualisé',
    text: 'par l’equipe pour répondre à toutes vos questions ',
  },
  {
    picto: '/static/img/illustrations/aider-boite-outils.png',
    subtitle: 'Une boîte à outils',
    text: 'pour favoriser l’accompagnement à chaque étape du parcours ',
  },
];

const reviewContent = [
  {
    review: (
      <>
        “ Entourage Pro m’apporte une ouverture d’esprit encore plus grande,{' '}
        l’envie d’aider les autres se concrétise vraiment avec ce projet ! ”
      </>
    ),
    author: 'Chloé',
    industry: 'coach de Soraya',
    image: '',
  },
  {
    review: (
      <>
        “ Je me suis retrouvé confronté à un tout autre univers, ça m’a fait
        évoluer... Zabiullah m’appelle « mon ami » maintenant ! ”
      </>
    ),
    author: 'Damien',
    industry: 'coach de Zabiullah',
    image: '',
  },
  {
    review: (
      <>
        “ C’est hyper enrichissant humainement. Chaque minute que tu passes est
        utile au candidat, à sa progression,à la manière dont il voit les
        choses. ”
      </>
    ),
    author: 'Marie',
    industry: 'coach de Léo',
    image: '',
  },
];

export const CoachContainer = () => {
  return (
    <StyledCoachContainer>
      <BackgroundImage
        img="/static/img/aider-accompagner-coach.jpg"
        alt="Un coach et un candidat Entourage Pro qui rient ensemble"
        imgMobile="/static/img/aider-accompagner-coach-mobile.jpg"
        mobileHeight={1200}
      >
        <Container>
          <TitleSection
            title="Entourage Pro accompagne les coachs à chaque étape"
            titleColor="white"
            svgColor="white"
            svgStroke={COLORS.gray}
          />
          <div className="picto-text-container">
            {pictoContent.map((content, key) => {
              return (
                <div className="picto-text-content" key={`${key}-${uuidValue}`}>
                  <div className="img-container">
                    <Img
                      alt={content.subtitle}
                      src={content.picto}
                      height={116}
                      width={340}
                    />
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
            Devenir Coach Entourage Pro
            <ChevronRightIcon />
          </Button>
        </div>
      </Container>
      <Reviews title="Les témoignages des coachs" reviews={reviewContent} />
    </StyledCoachContainer>
  );
};
