import { Text, Button } from '@/src/components/ui';
import { GA_TAGS } from '@/src/constants/tags';
import { SimpleImageText } from '@/src/features/partials/utils/SimpleImageText';
import { gaEvent } from '@/src/lib/gtag';
import { StyledCTAsContainer } from '../../../utils/SimpleImageText/SimpleImageText.styles';

export const WhoAreCandidates = () => {
  return (
    <SimpleImageText
      title="Qui sont les candidats ?"
      subtitle="Le problème n'est pas le manque de compétences, mais l'isolement."
      img="/static/img/front-office/aider/who-are-candidates.png"
      imgCover={false}
      reverse
    >
      <Text size="large">
        Les candidats que vous allez rencontrer cherchent avant tout un coup de
        pouce : être écoutés, conseillés et soutenus dans leurs démarches. Ils
        participent aussi à des ateliers pour élargir leur réseau, reprendre
        confiance et avancer à leur rythme. Vous les encouragez à se rapprocher
        de l’emploi en leur offrant un cadre bienveillant et des outils concrets
        pour construire la suite.
      </Text>
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
