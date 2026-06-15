import React, { useState } from 'react';
import { Button, Text } from 'src/components/ui';
import { H2 } from 'src/components/ui/Headings';
import { UserRoles } from 'src/constants/users';
import {
  StyledOnboardingActions,
  StyledOnboardingStepContainer,
} from 'src/features/backoffice/onboarding/onboarding.styles';
import { Content } from 'src/features/backoffice/onboarding/steps/step-nudges/Content/Content';

interface Step11NudgesProps {
  role: UserRoles;
  initialNudgeIds?: string[];
  onNext: (nudgeIds: string[]) => void;
}

export const Step11Nudges = ({
  role,
  initialNudgeIds = [],
  onNext,
}: Step11NudgesProps) => {
  const [nudgeIds, setNudgeIds] = useState<string[]>(initialNudgeIds);

  const title =
    role === UserRoles.CANDIDATE
      ? "Partagez vos besoins d'aide"
      : 'Précisez les coups de pouce que vous souhaitez apporter';

  const description =
    role === UserRoles.CANDIDATE
      ? 'Indiquez vos besoins auprès des coachs de la communauté'
      : "Indiquez les types d'aide que vous souhaitez proposer aux candidats";

  return (
    <StyledOnboardingStepContainer>
      <H2 title={title} />
      <Text>{description}</Text>
      <Content userRole={role} nudgeIds={nudgeIds} onChange={setNudgeIds} />
      <StyledOnboardingActions>
        <Button
          onClick={() => onNext(nudgeIds)}
          disabled={nudgeIds.length === 0}
          size="large"
        >
          Étape suivante
        </Button>
      </StyledOnboardingActions>
    </StyledOnboardingStepContainer>
  );
};
