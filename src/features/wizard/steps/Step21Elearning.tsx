import React, { useEffect, useState } from 'react';
import { Alert, Button, Text } from 'src/components/ui';
import { AlertType } from 'src/components/ui/Alert/Alert.types';
import { H2 } from 'src/components/ui/Headings';
import {
  StyledOnboardingActions,
  StyledOnboardingStepContainer,
} from 'src/features/backoffice/onboarding/onboarding.styles';
import { Content } from 'src/features/backoffice/onboarding/steps/step-elearning/Content/Content';
import { PanelState } from 'src/use-cases/wizard/wizard.types';

interface Step21ElearningProps {
  panelState: PanelState;
  onNext: () => void;
}

export const Step21Elearning = ({
  panelState,
  onNext,
}: Step21ElearningProps) => {
  const [suggestionsReady, setSuggestionsReady] = useState(
    panelState === 'results'
  );

  useEffect(() => {
    if (panelState === 'results') {
      setSuggestionsReady(true);
    }
  }, [panelState]);

  return (
    <StyledOnboardingStepContainer>
      <H2 title="Modules e-learning" />
      <Text>
        Complétez des modules pour renforcer vos compétences et améliorer votre
        profil.
      </Text>

      {panelState === 'loading' && !suggestionsReady && (
        <Alert type={AlertType.Info}>
          ⚙️ Calcul des profils compatibles en cours…
        </Alert>
      )}

      {suggestionsReady && (
        <Alert type={AlertType.Success}>
          ✅ Des profils compatibles avec votre profil ont été trouvés.
          Consultez le panel à droite pour les découvrir.
        </Alert>
      )}

      <Content />

      <StyledOnboardingActions>
        <Button onClick={onNext} size="large">
          Étape suivante
        </Button>
      </StyledOnboardingActions>
    </StyledOnboardingStepContainer>
  );
};
