import React from 'react';
import { Text } from '@/src/components/ui';
import { ImgProfileStack } from '@/src/components/ui/Images/ImgProfileStack/ImgProfileStack';
import { NavbarLogo } from '@/src/components/ui/Navbar/NavbarLogo';
import { SidePanel } from '@/src/components/ui/SidePanel';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import {
  StyledBottomSection,
  StyledContainer,
  StyledLogoRow,
  StyledPersonAvatar,
  StyledPersonDescription,
  StyledPersonName,
  StyledPersonRow,
  StyledStackAvatar,
  StyledTopSection,
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
    quote:
      "C'est le premier réseau où je trouve autant de qualité d'échange, je me sens tellement moins seule dans ma recherche",
    name: 'Valérie',
    description: 'soutenue par 11 coachs',
    imageSrc: '/static/img/temoignage-candidat-valerie.jpg',
  },
  [RegistrationFlow.COACH]: {
    quote:
      "Le simple fait d'avoir quelqu'un qui les écoute permet aux candidats de rallumer une flamme qui s'était éteinte.",
    name: 'Murielle',
    description: 'a soutenu 39 candidats',
    imageSrc: '/static/img/temoignage-coach-murielle.jpg',
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
    <SidePanel variant="blue-gradient">
      <StyledLogoRow>
        <NavbarLogo href="/" type="secondary" />
      </StyledLogoRow>
      <StyledContainer>
        <StyledTopSection>
          <Text color="white" size={34}>
            Un monde où chacun a des gens sur qui compter.
          </Text>
          <Text color="white">
            Entourage Pro relie celles et ceux qui cherchent un emploi à des
            personnes prêtes à leur donner un coup de pouce. Quelle que soit
            votre place, vous avez un rôle à jouer.
          </Text>
        </StyledTopSection>

        <StyledBottomSection>
          {verbatim && (
            <StyledVerbatimCard>
              <Text color="white" size="xlarge">
                «&nbsp;{verbatim.quote}&nbsp;»
              </Text>
              <StyledPersonRow>
                <StyledPersonAvatar
                  src={verbatim.imageSrc}
                  alt={verbatim.name}
                />
                <div>
                  <StyledPersonName>{verbatim.name}</StyledPersonName>
                  <StyledPersonDescription>
                    {verbatim.description}
                  </StyledPersonDescription>
                </div>
              </StyledPersonRow>
            </StyledVerbatimCard>
          )}
          <ImgProfileStack>
            {STACK_IMAGES.map((src, i) => (
              <StyledStackAvatar key={i} src={src} alt="" />
            ))}
          </ImgProfileStack>
          <Text color="white">
            <strong>1 700 candidats</strong> et <strong>1 300 coachs</strong> se
            soutiennent déjà ici.
          </Text>
        </StyledBottomSection>
      </StyledContainer>
    </SidePanel>
  );
};
