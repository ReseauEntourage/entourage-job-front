import React from 'react';
import { CompanyGoal } from '@/src/constants/company';
import { SimpleVideoSection } from '@/src/features/partials/utils/SimpleVideoSection';

interface EntreprisesVideoProps {
  context: CompanyGoal;
}

export const EntreprisesVideo = ({ context }: EntreprisesVideoProps) => {
  const videoByContext = {
    [CompanyGoal.SENSIBILIZE]: 'pDmHDeRxYec',
    [CompanyGoal.RECRUIT]: 'dByylMZ7MNg',
  };

  return (
    <SimpleVideoSection
      videoId={videoByContext[context || CompanyGoal.SENSIBILIZE]}
      videoTitle="Témoignages Entourage Pro"
      borderRadius={20}
    />
  );
};
