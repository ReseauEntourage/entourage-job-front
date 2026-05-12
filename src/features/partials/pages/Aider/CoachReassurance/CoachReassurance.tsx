import { SvgIcon } from '@/assets/icons/icons';
import { Text, Button } from '@/src/components/ui';
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
          <span style={highlightCriteriaStyle}>
            Pas besoin d’être certifié.
          </span>{' '}
          Votre expérience du monde du travail et votre réseau sont vos
          meilleurs outils.
        </>
      ),
    },
    {
      illu: (
        <SvgIcon
          name="OrienterSablier"
          width={iconSize.width}
          height={iconSize.height}
          color={COLORS.orangeSocial}
        />
      ),
      text: (
        <>
          <span style={highlightCriteriaStyle}>
            Pas besoin de 15h par semaine.
          </span>{' '}
          Vous donnez un coup de pouce selon vos disponibilités, en toute
          liberté.
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
          <span style={highlightCriteriaStyle}>
            L'objectif n'est pas de promettre un emploi,
          </span>{' '}
          mais de donner les clés pour que le candidat puisse se sentir soutenu
          et remobilisé dans sa recherche.
        </>
      ),
    },
    {
      illu: (
        <SvgIcon
          name="IlluPouce"
          width={iconSize.width}
          height={iconSize.height}
        />
      ),
      text: (
        <>
          <span style={highlightCriteriaStyle}>
            Vous ne remplacez pas les institutions
          </span>{' '}
          mais êtes un véritable coup de pouce pour les candidats du programme.
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
          href="/inscription"
          weight="bold"
        >
          Je deviens coach
        </Button>
      </StyledCTAsContainer>
    </SimpleImageText>
  );
};
