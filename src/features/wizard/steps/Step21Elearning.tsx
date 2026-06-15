import React, { useEffect, useState } from 'react';
import { Alert, Button } from 'src/components/ui';
import { AlertType } from 'src/components/ui/Alert/Alert.types';
import { Content } from 'src/features/backoffice/onboarding/steps/step-elearning/Content/Content';
import { PanelState } from 'src/use-cases/wizard/wizard.types';

interface Step21ElearningProps {
  panelState: PanelState;
  onNext: () => void;
}

export const Step21Elearning = ({ panelState, onNext }: Step21ElearningProps) => {
  const [suggestionsReady, setSuggestionsReady] = useState(panelState === 'results');

  useEffect(() => {
    if (panelState === 'results') {
      setSuggestionsReady(true);
    }
  }, [panelState]);

  return (
    <div>
      <h2>Modules e-learning</h2>
      <p>
        Complétez des modules pour renforcer vos compétences et améliorer votre
        profil.
      </p>

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

      <div style={{ marginTop: 24 }}>
        <Button onClick={onNext}>Continuer</Button>
      </div>
    </div>
  );
};
