import React from 'react';
import { Text } from '@/src/components/ui';
import { H3 } from '@/src/components/ui/Headings';
import { ImgProfileStack } from '@/src/components/ui/Images/ImgProfileStack/ImgProfileStack';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import {
  StyledBottomSection,
  StyledContainer,
  StyledPersonAvatar,
  StyledPersonDescription,
  StyledPersonName,
  StyledPersonRow,
  StyledQuote,
  StyledStackAvatar,
  StyledVerbatimCard,
} from './WizardRoleSelectionSidePanel.styles';

interface Verbatim {
  quote: string;
  name: string;
  description: string;
  imageSrc: string;
}

const VERBATIMS: Partial<Record<RegistrationFlow, Verbatim>> = {
  [RegistrationFlow.CANDIDATE]: {
    quote: "Ici, j'ai retrouvé confiance avant même de retrouver un emploi.",
    name: 'Mariam',
    description: 'soutenue par 2 coachs',
    imageSrc: '/static/img/temoignage-candidat-miah.jpg',
  },
  [RegistrationFlow.COACH]: {
    quote:
      'Ici, j’ai pu aider quelqu’un à retrouver confiance et à se sentir soutenu.',
    name: 'Guillaume',
    description: 'a soutenu 2 candidats',
    imageSrc: '/static/img/temoignage-candidat-miah.jpg',
  },
};

const STACK_IMAGES = [
  '/static/img/temoignage-candidat-amelie.jpg',
  '/static/img/temoignage-candidat-anais.jpg',
  '/static/img/temoignage-candidat-cornelia.jpg',
  '/static/img/temoignage-candidat-danny.jpg',
];

interface WizardRoleSelectionSidePanelProps {
  flow: RegistrationFlow | null;
}

export const WizardRoleSelectionSidePanel = ({
  flow,
}: WizardRoleSelectionSidePanelProps) => {
  const verbatim = flow ? VERBATIMS[flow] ?? null : null;

  return (
    <StyledContainer>
      <H3 title="Un monde où chacun a des gens sur qui compter." />
      <Text>
        Entourage Pro relie celles et ceux qui cherchent un emploi à des
        personnes prêtes à leur donner un coup de pouce. Quelle que soit votre
        place, vous avez un rôle à jouer.
      </Text>
      {verbatim && (
        <StyledVerbatimCard>
          <StyledQuote>«&nbsp;{verbatim.quote}&nbsp;»</StyledQuote>
          <StyledPersonRow>
            <StyledPersonAvatar src={verbatim.imageSrc} alt={verbatim.name} />
            <div>
              <StyledPersonName>{verbatim.name}</StyledPersonName>
              <StyledPersonDescription>
                {verbatim.description}
              </StyledPersonDescription>
            </div>
          </StyledPersonRow>
        </StyledVerbatimCard>
      )}
      <StyledBottomSection>
        <ImgProfileStack>
          {STACK_IMAGES.map((src, i) => (
            <StyledStackAvatar key={i} src={src} alt="" />
          ))}
        </ImgProfileStack>
        <Text>
          <strong>1 700 candidats</strong> et <strong>1 300 coachs</strong> se
          soutiennent déjà ici.
        </Text>
      </StyledBottomSection>
    </StyledContainer>
  );
};
