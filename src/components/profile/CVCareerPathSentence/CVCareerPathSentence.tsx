/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { BusinessSector, Occupation } from 'src/api/types';

interface CVCareerPathSentenceProps {
  occupations: Occupation[];
  businessSectors: BusinessSector[];
}

export const CVCareerPathSentence = ({
  businessSectors,
  occupations,
}: CVCareerPathSentenceProps) => {
  // Deprecated
  return null;
};
