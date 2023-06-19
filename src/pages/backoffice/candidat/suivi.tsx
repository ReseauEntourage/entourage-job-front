// only for redirection purpose, to be deleted in 2024

import React from 'react';
import LoadingScreen from 'src/components/backoffice/cv/LoadingScreen';
import { useCandidateAndCoachRedirections } from 'src/hooks/useRedirections';

const Suivi = () => {
  useCandidateAndCoachRedirections();

  return <LoadingScreen />;
};

export default Suivi;
