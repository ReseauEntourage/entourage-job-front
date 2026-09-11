import { Text, Button } from '@/src/components/ui';
import { SvgIcon } from '@/src/components/ui/SvgIcon/SvgIcon';
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
const iconSize = { width: 28, height: 28 };

export const CoachReassurance = () => {
  const criterias = [
    {
      illu: (
        <SvgIcon
          name="IlluReseau"
          width={iconSize.width}
          height={iconSize.height}
        />
      ),
      text: (
        <>
          <span style={highlightCriteriaStyle}>Coachs :</span> soyez juste vous,
          votre expérience terrain et votre réseau sont vos meilleurs outils.
        </>
      ),
    },
    {
      illu: (
        <SvgIcon
          name="IlluPoigneeDeMain"
          width={iconSize.width}
          height={iconSize.height}
        />
      ),
      text: (
        <>
          <span style={highlightCriteriaStyle}>Référents Entourage Pro :</span>{' '}
          disponibles toute la semaine pour échanger, vous conseiller sur des
          cas complexes et orienter les candidats vers les dispositifs de droits
          communs (suivi social, hébergement etc.).
        </>
      ),
    },
  ];

  return (
    <SimpleImageText
      title="Pas besoin d'être un expert du coaching pour soutenir les candidats."
      subtitle="Votre expérience du monde du travail suffit."
      img="/static/img/front-office/aider/coach-reassurance.png"
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
          href="/wizard"
          weight="bold"
        >
          Je deviens coach
        </Button>
      </StyledCTAsContainer>
    </SimpleImageText>
  );
};
