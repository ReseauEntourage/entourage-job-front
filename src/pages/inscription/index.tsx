import React from 'react';
import { WizardInscription } from '@/src/features/wizard/WizardInscription';
import { useUtm } from '@/src/hooks/queryParams/useUTM';

const Inscription = () => {
  useUtm();

  return <WizardInscription />;
};

export default Inscription;
