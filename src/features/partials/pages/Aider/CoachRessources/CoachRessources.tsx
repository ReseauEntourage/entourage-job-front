import { SvgIcon } from '@/assets/icons/icons';
import { Button } from '@/src/components/ui';
import { Text } from '@/src/components/ui';
import { COLORS } from '@/src/constants/styles';
import { GA_TAGS } from '@/src/constants/tags';
import {
  StyledCriteria,
  StyledCriteriaIllu,
  StyledCriteriasContainer,
} from '@/src/features/partials/utils/SimpleCardsImageCTA/SimpleCardsImageCTA.styles';
import { SimpleImageText } from '@/src/features/partials/utils/SimpleImageText';
import { StyledCTAsContainer } from '@/src/features/partials/utils/SimpleImageText/SimpleImageText.styles';
import { gaEvent } from '@/src/lib/gtag';

const highlightCriteriaStyle = { color: COLORS.primaryBlue, fontWeight: '600' };

const iconSize = { width: 30, height: 30 };

export const CoachRessources = () => {
  const criterias = [
    {
      illu: <SvgIcon name="IlluCarton" {...iconSize} />,
      text: (
        <>
          <span style={highlightCriteriaStyle}>Un parcours de bienvenue</span>{' '}
          et une boîte à outils afin de démarrer au mieux l’aventure Entourage
          Pro.
        </>
      ),
    },
    {
      illu: <SvgIcon name="IlluConversation" {...iconSize} />,
      text: (
        <>
          Un membre de l'équipe est{' '}
          <span style={highlightCriteriaStyle}>
            présent pour répondre à vos questions,
          </span>{' '}
          vos doutes ou vos idées d’atelier.
        </>
      ),
    },
    {
      illu: <SvgIcon name="IlluPoigneeDeMain" {...iconSize} />,
      text: (
        <>
          <span style={highlightCriteriaStyle}>Une communauté vivante :</span>{' '}
          des échanges réguliers, en ligne ou en présentiel, et un groupe WA
          pour partager vos expériences avec les autres coachs.
        </>
      ),
    },
    {
      illu: <SvgIcon name="IlluPouce" {...iconSize} />,
      text: (
        <>
          <span style={highlightCriteriaStyle}>On avance grâce à vous :</span>{' '}
          on améliore nos outils et nos échanges en fonction de vos retours et
          réalité de coach.
        </>
      ),
    },
  ];

  return (
    <SimpleImageText
      title="Vous n'êtes pas seul dans l’aventure"
      subtitle="L’équipe Entourage est à vos côtés dès le premier jour"
      img="/static/img/front-office/aider/coach-ressources.jpg"
      reverse
    >
      <StyledCriteriasContainer>
        {criterias?.map((criteria, index) => (
          <StyledCriteria key={index}>
            <StyledCriteriaIllu>{criteria.illu}</StyledCriteriaIllu>
            <Text size="large" color="darkGray">
              {criteria.text}
            </Text>
          </StyledCriteria>
        ))}
      </StyledCriteriasContainer>
      <StyledCTAsContainer>
        <Button
          variant="primary"
          rounded
          size="medium"
          onClick={() => gaEvent(GA_TAGS.PAGE_AIDER_INSCRIPTION_COACH_CLIC)}
          href="/inscription"
          weight="bold"
        >
          Je deviens coach
        </Button>
      </StyledCTAsContainer>
    </SimpleImageText>
  );
};
